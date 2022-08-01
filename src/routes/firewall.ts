import {NextFunction, Request, Response, Router} from 'express';
import {ValidatedRequest} from 'express-joi-validation';
import {validate} from 'express-validation';
import {iptables} from 'netfilter';
import {iptablesDeleteChainRule, iptablesDump, iptablesInsertChainRule} from '../helper';
import {handleIfNoneMatch} from '../lib/HttpUtils';
import {Roles} from '../lib/roles';
import {jwt} from '../middlewares/tokenMiddleware';
import {RuleDeleteRequest, ruleDeleteValidate} from '../validate/ruleDelete';
import {RuleInsertRequest, ruleInsertValidate} from '../validate/ruleInsert';

const router = Router();

const readAccess: string[] = [Roles.PortalAdmin, Roles.FirewallReader];
const writeAccess: string[] = [Roles.PortalAdmin];

function buildRuleList(iptables: iptables.TableRecords, filter: string, ruleName: string): iptables.Rule[] {
	return iptables?.[filter]?.chains?.[ruleName]?.rules || [];
}

/**
 * GET /api/firewall
 */
router.get('/', jwt.verify({roles: readAccess}), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const options = req.query?.ipv6 ? {ipv6: true} : undefined;
		handleIfNoneMatch(Object.keys(await iptablesDump(options)), req, res);
	} catch (err) {
		/* istanbul ignore next */
		next(err);
	}
});

router.get('/:filter', jwt.verify({roles: readAccess}), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const options = req.query?.ipv6 ? {ipv6: true} : undefined;
		handleIfNoneMatch(Object.keys((await iptablesDump(options))?.[req.params.filter]?.chains || []), req, res);
	} catch (err) {
		/* istanbul ignore next */
		next(err);
	}
});

router.post('/:filter', jwt.verify({roles: writeAccess}), async (req: Request, res: Response, next: NextFunction) => {
	try {
		// TODO: create chain
		handleIfNoneMatch(Object.keys((await iptablesDump())?.[req.params.filter]?.chains || []), req, res);
	} catch (err) {
		/* istanbul ignore next */
		next(err);
	}
});

router.get('/:filter/:chainName', jwt.verify({roles: readAccess}), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const options = req.query?.ipv6 ? {ipv6: true} : undefined;
		handleIfNoneMatch(buildRuleList(await iptablesDump(options), req.params.filter, req.params.chainName), req, res);
	} catch (err) {
		/* istanbul ignore next */
		next(err);
	}
});

router.post(
	'/:table/:chain',
	jwt.verify({roles: writeAccess}),
	validate(ruleInsertValidate),
	async (req: ValidatedRequest<RuleInsertRequest>, res: Response, next: NextFunction) => {
		try {
			const {table, chain} = req.params;
			// TODO: add rule to chain
			console.log(table, chain, req.body);
			await iptablesInsertChainRule({table, chain, ...req.body});
			handleIfNoneMatch(buildRuleList(await iptablesDump(), req.params.table, req.params.chain), req, res);
		} catch (err) {
			/* istanbul ignore next */
			next(err);
		}
	},
);

router.delete(
	'/:table/:chain/:rulenum',
	jwt.verify({roles: writeAccess}),
	validate(ruleDeleteValidate),
	async (req: ValidatedRequest<RuleDeleteRequest>, res: Response, next: NextFunction) => {
		try {
			const {table, chain, rulenum} = req.params;
			await iptablesDeleteChainRule({
				table,
				chain,
				rulenum: parseInt(rulenum, 10),
			});
			handleIfNoneMatch(buildRuleList(await iptablesDump(), req.params.table, req.params.chain), req, res);
		} catch (err) {
			/* istanbul ignore next */
			next(err);
		}
	},
);

export const route = router;

/*

import {getRuleNumber, haveChain, iptablesDump, iptablesInsertChainRule, iptablesReplaceChainRule} from './helper';

async function test() {
	if (!(await haveChain('chain-incoming-ssh'))) {
		console.log('create chaing');
	}
	const homeIndex = await getRuleNumber('chain-incoming-ssh', {jump: 'ACCEPT', source: '10.10.10.0/24'});
	// console.log(await getRuleNumber('chain-incoming-ssh', {jump: 'DROP'}));

	// console.log(await getRuleNumber('chain-incoming-ssh', {jump: 'LOG'}));
	const output = await iptablesDump();
	console.log(output?.filter?.chains?.['chain-incoming-ssh']?.rules);

	if (homeIndex) {
		console.log('update rule')
		await iptablesReplaceChainRule({
			chain: 'chain-incoming-ssh',
			rulenum: homeIndex,
			jump: 'ACCEPT',
			source: '10.10.10.0/24',
			matches: {
				comment: {
					comment: '"Home network"',
				},
			},
		});
	} else {
		console.log('insert rule')
		await iptablesInsertChainRule({
			chain: 'chain-incoming-ssh',
			jump: 'ACCEPT',
			source: '10.10.10.0/24',
			matches: {
				comment: {
					comment: '"Home network"',
				},
			},
		});
	}
}
test();
*/
