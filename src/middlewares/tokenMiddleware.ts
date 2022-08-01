import {FileCertCache, JwtMiddleware, useCache} from 'mharj-jwt-middleware';
import {logger} from '../logger';

// (optional) if need cert cache support for restarts
useCache(new FileCertCache());

export const jwt = new JwtMiddleware(
	{audience: '52003e80-b011-42ba-951d-09665b00a719', issuer: ['https://login.microsoftonline.com/6b366179-8a3e-4f1b-a30f-272097b5aa57/v2.0']},
	logger,
);
