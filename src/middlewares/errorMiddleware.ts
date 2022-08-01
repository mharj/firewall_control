import {ErrorRequestHandler, NextFunction} from 'express';
import {HttpError, IApiError} from '../lib/HttpError';
import {logger} from '../logger';

export const errorMiddleWare: ErrorRequestHandler = async (err: HttpError, req, res, next: NextFunction) => {
	/* istanbul ignore next */
	if (res.headersSent) {
		return next(err);
	}
	let jsonResponse = true;
	let code = 500;
	let message: IApiError = {error: err.name, description: err.message};
	if (err instanceof HttpError) {
		code = err.getCode();
		message = err.getObject();
		jsonResponse = err.isJsonResponse();
	}
	if (process.env.NODE_ENV !== 'production' && err.stack) {
		message.trace = err.stack.split('\n');
	}
	// logging setup
	const fromIp = `From: "${req.ip}"`;
	const origin = req.headers?.origin ? `Origin: "${req.headers.origin}"` : '';
	if (code >= 500) {
		logger.error(err.name, code, err, fromIp, origin);
	} else if (code >= 400 && code < 500) {
		if (code === 404) {
			// soft error
			logger.info(err.name, code, message.error, message.description, fromIp, origin);
		} else {
			logger.info(err.name, code, err, fromIp, origin);
		}
	}
	if (jsonResponse) {
		res.status(code).json(message);
	} else {
		res.status(code).end();
	}
};
