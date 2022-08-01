import {iptables} from 'netfilter';
import deepEqual from 'deep-equal';

export const jumpTargets = ['RETURN', 'ACCEPT', 'DNAT', 'SNAT', 'DROP', 'REJECT', 'LOG', 'ULOG', 'MARK', 'MASQUERADE', 'REDIRECT', 'AUDIT'] as const;

export function iptablesDump(options: iptables.NetfilterDumpOptions = {}): Promise<iptables.TableRecords> {
	return new Promise((resolve, reject) => {
		iptables.dump(options, (error, output) => {
			if (error) {
				reject(error);
			} else {
				resolve(output);
			}
		});
	});
}

export function iptablesNew(options: iptables.NetFilterNewOptions): Promise<void> {
	return new Promise((resolve, reject) => {
		iptables.new(options, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

export function iptablesDeleteChain(options: iptables.NetFilterDeleteChainOptions): Promise<void> {
	return new Promise((resolve, reject) => {
		iptables.deleteChain(options, function (error) {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

export function iptablesReplaceChainRule(options: iptables.NetFilterReplaceChainOptions & iptables.Rule): Promise<void> {
	return new Promise((resolve, reject) => {
		iptables.replace(options, function (error) {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

function fixComment(data: iptables.Rule) {
	if (data.matches?.comment?.comment) {
		data.matches.comment.comment = `'${data.matches.comment.comment}'`;
	}
	return data;
}
export function iptablesInsertChainRule(options: iptables.NetFilterInsertChainOptions & iptables.Rule): Promise<void> {
	return new Promise((resolve, reject) => {
		iptables.insert(fixComment(options), function (error) {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

export function iptablesDeleteChainRule(options: iptables.NetFilterDeleteChainRuleOptions): Promise<void> {
	return new Promise((resolve, reject) => {
		iptables.delete(options, function (error) {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

export async function haveChain(name: string): Promise<boolean> {
	const data = await iptablesDump();
	return data?.filter?.chains?.[name] ? true : false;
}

function sameKeys(source: iptables.Rule, dest: iptables.Rule) {
	const out: iptables.Rule = {};
	for (const key of Object.keys(source)) {
		if (dest[key]) {
			out[key] = dest[key];
		}
	}
	return out;
}

export async function getRuleNumber(chain: string, ruleSet: iptables.Rule): Promise<number | undefined> {
	const data = await iptablesDump();
	const chainList = data?.filter?.chains?.[chain];
	if (!chainList) {
		return;
	}
	const index = chainList.rules.findIndex((rule) => deepEqual(sameKeys(ruleSet, rule), ruleSet));
	return index !== -1 ? index + 1 : undefined;
}
