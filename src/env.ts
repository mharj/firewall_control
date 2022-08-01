import {getConfigVariable, setLogger} from 'mharj-node-variable-util';
import {logger} from './logger';
// logger for variable util
setLogger(logger);

// do similar setups for all configuration items
let getHttpPortPromise: Promise<string> | undefined;
export const getHttpPort = (): Promise<string> => {
	if (!getHttpPortPromise) {
		getHttpPortPromise = getConfigVariable('PORT', '9347', {showValue: true});
	}
	return getHttpPortPromise;
};
