import { Response, Request } from 'express';

export type TypedResponse<T> = 
	Omit<Response, 'json' | 'status'>
	& { json(data: T): TypedResponse<T> } & { status(code: number): TypedResponse<T> };


export interface TypedRequest<B, P> extends Request {
	body: B;
	params: P;
}
