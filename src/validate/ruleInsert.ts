import {ValidatedRequestSchema} from 'express-joi-validation';
import Joi from 'joi';
import {jumpTargets} from '../helper';

export interface RuleInsertRequest extends ValidatedRequestSchema {
	params: {
		table: string;
		chain: string;
	};
	body: {
		jump: JumpTarget;
		source?: string;
		destination?: string;
		matches?: {
			comment?: {
				comment: string;
			};
		};
	};
}

export const ruleInsertValidate = {
	params: Joi.object<RuleInsertRequest['params']>({
		table: Joi.string().required(),
		chain: Joi.string().required(),
	}),
	body: Joi.object<RuleInsertRequest['body']>({
		jump: Joi.string()
			.valid(...jumpTargets)
			.required(),
		source: Joi.string(),
		destination: Joi.string(),
		matches: Joi.object({
			comment: Joi.object({
				comment: Joi.string().required(),
			}),
		}),
	}),
};
