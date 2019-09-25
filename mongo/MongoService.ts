import { MongoClient, Db } from 'mongodb';
import config from 'config';
import { newTaskDatabase } from './database';
import { LoggerService } from '../services/LoggerService';

export class MongoService {
	private readonly _mongoClient = new MongoClient(
		`${config.get('mongodb.mongoURL')}/${config.get('mongodb.mongoDB')}`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	);
	isMongoConnected = false;

	constructor(private readonly _loggerService: LoggerService) { }

	get db(): Db {
		return this._mongoClient.db(config.get('mongodb.mongoDB'));
	}

	async _initDb() {
		try {
			await this._mongoClient.connect();
			this.isMongoConnected = true;
			this._loggerService.info('MongoDB Connected');
			await newTaskDatabase(this._mongoClient);
		} catch (e) {
			this._loggerService.error('MongoDB Connection Failed: ', e);
		}
	}
}
