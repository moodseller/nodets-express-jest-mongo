export class SettingsService {
	private readonly _isTestEnvironment = process.env.NODE_ENV === 'test';

	get isTestEnvironment() {
		return this._isTestEnvironment;
	}
}
