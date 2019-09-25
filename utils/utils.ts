import { NextFunction } from 'express';

/**
 * Function which merges a route's base url with its destination
 * 
 * @param {string} prefix - base url 
 * @param {string} routeName - destination route name
 * @returns {string} - merged name
 */
export function mergeRouteName(prefix: string, routeName: string): string {
	return `${prefix}${routeName}`;
}

/**
 * A simple function to validate the field's value and given type
 * 
 * @param {any} value - key value 
 * @param {string} type - a type of which value will be checked against
 * @returns {boolean} - true if the field is valid - false otherwise 
 */
export function validateField(value: any, type: string): boolean {
	if (!value) {
		return false;
	}

	if (typeof value !== type) {
		return false;
	}

	return true;
}

/**
 * Wrap request handling function to try-catch
 *
 * @param {function(req, res, next): Promise} routeHandler - route handler to wrap
 * @param {function(e)} [catchError] - custom error handling callback
 * @returns {function(req, res, next)} wrapped route handler (async)
 */
export function tryRoute(
	routeHandler: (req: any, res: any, next: NextFunction) => Promise<any>,
	catchError?: any
): any {
	return async (req: any, res: any, next: NextFunction) => {
		try {
			await routeHandler(req, res, next);
		} catch (e) {
			if (catchError) {
				return catchError(e);
			}
			const err = e.error || e;
			if (!err.code) {
				err.code = 500;
			}
			return res.status(err.code).json({ error: { code: err.code, message: err.message }});
		}
	};
}
