import express, { Router } from 'express';
import config from 'config';
import { SettingsService } from './services/settingsService';
import { LoggerService } from './services/loggerService';
import { TaskRoutes } from './routes/TaskRoutes';
import { TaskStorage } from './mongo/TaskStorage';
import { MongoService } from './mongo/MongoService';
import { getTaskDatabase } from './mongo/database';
import bodyParser from 'body-parser';

class MainApplication {
	app: express.Application;
	router: Router = express.Router();
	
	constructor(
		private readonly _settingsService: SettingsService,
		private readonly _taskStorage: TaskStorage,
		private readonly _loggerService: LoggerService
	) {
		this.app = express();
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use('/ping', (req, res) => res.status(200).end('pong'));

		// Routes declaration
		const taskRoutes = new TaskRoutes(this._taskStorage);
		this.app.use(taskRoutes.initTaskRoutes());

		if (!this._settingsService.isTestEnvironment) { // Prevent server from starting on test env.
			this.app.listen(config.get('http.port'), () => {
				this._loggerService.info({ port: config.get('http.port') }, 'server started');
			});
		}
	}
}

const settingsService = new SettingsService();
const mongoService = new MongoService(new LoggerService('MongoService'));
const loggerService = new LoggerService('app');
if (!settingsService.isTestEnvironment) {
	(async () => {
		try {
			await mongoService._initDb();

			if (!mongoService.isMongoConnected) {
				throw 'Failed to initiate mongo db, make sure the service is started.';
			}
			const taskDatabase = getTaskDatabase(mongoService.db);

			const taskStorage = new TaskStorage(taskDatabase, new LoggerService('taskStorage'));
			new MainApplication(
				settingsService,
				taskStorage,
				loggerService
			);
		} catch (e) {
			loggerService.error('Failed to start application, reason: ', e);
		}
	})(); // IIFE
}

export default MainApplication;
