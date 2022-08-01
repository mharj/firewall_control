type JumpTarget = 'RETURN' | 'ACCEPT' | 'DNAT' | 'SNAT' | 'DROP' | 'REJECT' | 'LOG' | 'ULOG' | 'MARK' | 'MASQUERADE' | 'REDIRECT' | 'AUDIT';

declare module 'netfilter' {
	namespace iptables {
		export interface Rule extends Record<string, unknown> {
			protocol?: string;
			jump?: JumpTarget;
			goto?: string;
			source?: string;
			destination?: string;
			'in-interface'?: string;
			'out-interface'?: string;
			fragment?: string;
			matches?: Record<string, Record<string, string | number>>;
			target_options?: Record<string, string>;
		}

		interface Chain {
			policy: string;
			rules: Rule[];
		}

		type ChainRecords = Record<string, Chain>;
		type ChainListRecords = Record<string, ChainRecords>;
		export type TableRecords = Record<string, ChainListRecords>;
		export interface NetfilterDumpOptions {
			ipv6?: boolean;
			table?: string;
		}
		export interface NetFilterNewOptions {
			table?: string;
			chain: string;
		}
		export function dump(options: NetfilterDumpOptions, callback: (error: Error, tables: TableRecords) => void): void;
		function _new(options: NetFilterNewOptions, callback: (error: Error | null) => void): void;
		export {_new as new};
		export interface NetFilterDeleteChainOptions {
			table?: string;
			chain?: string;
			rulenum: number | string;
		}
		export function deleteChain(options: NetFilterDeleteChainOptions, callback: (error: Error | null) => void): void;
		export interface NetFilterDeleteChainRuleOptions {
			table?: string;
			chain: string;
			rulenum: number;
		}
		function _delete(options: NetFilterDeleteChainRuleOptions, callback: (error: Error | null) => void): void;
		export {_delete as delete};
		export interface NetFilterReplaceChainOptions {
			table?: string;
			chain?: string;
			rulenum: number;
		}
		export function replace(options: NetFilterReplaceChainOptions & Rule, callback: (error: Error | null) => void): void;
		export interface NetFilterInsertChainOptions {
			table?: string;
			chain?: string;
			rulenum?: number;
		}
		export function insert(options: NetFilterInsertChainOptions & Rule, callback: (error: Error | null) => void): void;
	}
}
