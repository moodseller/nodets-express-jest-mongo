import bunyan, { LogLevel, Stream } from 'bunyan';
import config from 'config';
import bformat, { Options } from 'bunyan-format';

interface ConfigStreamOptions {
	level: LogLevel;
	path: string;
	stream: NodeJS.WritableStream | Stream | undefined | 'short' | 'long' | 'simple' | 'json' | 'bunyan';
}

export class LoggerService {
	private _logger: bunyan;

	constructor(loggerName: string) {
		const configStream: ConfigStreamOptions = { ...config.get('log') };
		if (configStream.stream === 'process.stdout') {
			configStream.stream = process.stdout;
		} else {
			configStream.stream = new bformat({ outputMode: configStream.stream } as Options);
		}
		this._logger = bunyan.createLogger({
			name: loggerName,
			stream: configStream.stream,
		});
	}

	error(format: any | object, ...params: any[]) {
		this._logger.error(format, params);
	}

	warn(format: any| object, ...params: any[]) {
		this._logger.warn(format, params);
	}

	info(format: any| object, ...params: any[]) {
		this._logger.info(format, params);
	}
}
