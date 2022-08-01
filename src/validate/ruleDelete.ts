import {ValidatedRequestSchema} from 'express-joi-validation';
import Joi from 'joi';

export interface RuleDeleteRequest extends ValidatedRequestSchema {
	params: {
		table: string;
		chain: string;
		rulenum: string;
	};
}
export const ruleDeleteValidate = {
	params: Joi.object<RuleDeleteRequest['params']>({
		table: Joi.string().required(),
		chain: Joi.string().required(),
		rulenum: Joi.string().required(),
	}),
};
