
import express from 'express';
import {Server} from 'http';
import {getHttpPort} from './env';
import {setupExpress} from './middleware';
import {logger} from './logger';

const app = express();

let server: undefined | Server;
export const startExpress = (port: string | number): Promise<express.Express> => {
	setupExpress(app);
	return new Promise((resolve, reject) => {
		/* istanbul ignore if */
		if (!app) {
			reject(new Error('no express instance found'));
		} else {
			server = app.listen(port, () => {
				resolve(app);
			});
		}
	});
};

export const stopExpress = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (server) {
			server.close((error) => {
				/* istanbul ignore if */
				if (error) {
					reject(error);
				} else {
					server = undefined;
					resolve();
				}
			});
		} else {
			resolve();
		}
	});
};

/* istanbul ignore next */
export const startAll = async (): Promise<void> => {
	const httpPort = await getHttpPort();
	await startExpress(httpPort);
	logger.info(`backend listening on port ${httpPort} [${process.env.NODE_ENV}]`);
	// start mongo etc here if mongo is not required to be up before express
};

/* istanbul ignore next */
// tslint:disable: no-floating-promises
if (process.env.NODE_ENV !== 'test') {
	startAll();
}
