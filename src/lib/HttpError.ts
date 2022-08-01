export interface IApiError {
	error: string;
	description?: string;
	trace?: string[];
}

export class HttpError extends Error {
	private code: number;
	private description: string | undefined;
	private jsonResponse: boolean;
	constructor(code: number, message: string, description?: string, jsonResponse = true) {
		super(message);
		this.name = 'HttpError';
		this.code = code;
		this.jsonResponse = jsonResponse;
		this.description = description;
		Error.captureStackTrace(this, this.constructor);
	}

	public getCode(): number {
		return this.code;
	}

	public getObject(): IApiError {
		return {error: this.message, description: this.description};
	}

	public isJsonResponse(): boolean {
		return this.jsonResponse;
	}
}

export const isHttpError = (error: Error): error is HttpError => {
	return error.name === 'HttpError';
};
