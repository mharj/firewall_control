import {getLogger} from 'log4js';

export const logger = getLogger('console');

/* istanbul ignore next */
const getLoggerLevel = (): string => {
	switch (process.env.NODE_ENV) {
		case 'test':
			return 'fatal';
		case 'development':
			return 'debug';
		default:
			return 'info';
	}
};

logger.level = getLoggerLevel();
logger.debug('logger loaded');
