import  etag from 'etag';
import {Request, Response} from 'express';
export const etagBuilder = (data: unknown, options?: etag.Options): string | undefined => {
	let etagData = null;
	if (data === null || data === undefined) {
		return undefined;
	}
	if (data instanceof Buffer) {
		return etag(data, options);
	}
	switch (typeof data) {
		case 'number':
			etagData = etag('' + data, options);
			break;
		case 'bigint':
			etagData = etag('' + data, options);
			break;
		case 'boolean':
			etagData = etag(data ? 'true' : 'false', options);
			break;
		case 'string':
			etagData = etag(data, options);
			break;
		case 'object':
			etagData = etag(JSON.stringify(data), options);
			break;
	}
	if (etagData) {
		return etagData;
	}
	/* istanbul ignore next */
	return undefined;
};

export const ifNoneMatch = (req: Request, etagHash: string, isNotSet = false): boolean => {
	if ('if-none-match' in req.headers) {
		return isValueMatch(req.headers['if-none-match'], etagHash);
	} else {
		return isNotSet;
	}
};

export const isValueMatch = (input: string[] | string | undefined, value: string | undefined): boolean => {
	if (input === undefined || value === undefined) {
		return false;
	}
	if (Array.isArray(input)) {
		let found = false;
		input.forEach((i) => {
			if (i === value) {
				found = true;
			}
		});
		return found;
	} else {
		return value === input;
	}
};
export const ifMatch = (req: Request, etagHash: string | undefined, isNotSet = true): boolean => {
	if ('if-match' in req.headers) {
		return isValueMatch(req.headers['if-match'], etagHash);
	} else {
		return isNotSet;
	}
};

/**
 * Compares current body object etag and check against if-match header
 * @param body data object
 * @param req Express Request
 * @param isNotSet return value if header is not set (default: true)
 * @return {boolean}
 */
export const ifMatchCheck = (body: unknown, req: Request, isNotSet = true): boolean => {
	return ifMatch(req, etagBuilder(body), isNotSet);
};

export const handleEtagResponse = (data: unknown, res: Response): void => {
	const etagHash = etagBuilder(data);
	if (etagHash) {
		res.setHeader('ETag', etagHash);
	}
	res.json(data);
	res.end();
};

export const handleIfNoneMatch = (data: unknown, req: Request, res: Response): void => {
	const etagHash = etagBuilder(data);
	if (etagHash && ifNoneMatch(req, etagHash) === true) {
		res.status(304).send('Not Modified');
		return;
	}
	if (etagHash) {
		res.setHeader('ETag', etagHash);
	}
	res.json(data);
	return res.end();
};
