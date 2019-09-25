import supertest from 'supertest';
import http from 'http';
import { LoggerService } from '../services/loggerService';
import MainApplication from '../app';
import { SettingsService } from '../services/settingsService';
import { TaskStorage, ITask } from '../mongo/TaskStorage';
import { ITaskRouteReply } from '../controllers/TaskController';

describe('Task Routes Test', () => {
	let mainApplication: MainApplication;
	let loggerService: PartialMock<LoggerService>;
	let settingsService: PartialMock<SettingsService>;
	let taskStorage: PartialMock<TaskStorage>;

	let server: http.Server;
	let request: supertest.SuperTest<supertest.Test>;
	
	beforeEach(() => {
		taskStorage = {
			findTaskByKey: jest.fn()
		};

		settingsService = {
			isTestEnvironment: jest.fn()
		};

		mainApplication = new MainApplication(
			settingsService as any,
			taskStorage as any,
			loggerService as any,
		);

		server = http.createServer(mainApplication.app);
		server.listen();
		request = supertest(mainApplication.app);
	});
	
	afterEach(() => {
		server.close();
	});

	afterAll(async () => {
		await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
	});

	it('should get task successfully', async () => {
		const params = '1';
		const testTask: ITask = {
			key: '1',
			description: 'test1',
			name: 'test1'
		};
		
		taskStorage.findTaskByKey = jest.fn().mockReturnValue(testTask);

		const r = await request.get(`/tasks/${params}`);

		expect(taskStorage.findTaskByKey).toBeCalledWith('1');
		expect(r.status).toEqual(200);
		expect(r.body).toEqual({ task: testTask } as ITaskRouteReply);
	});

	it('should get all tasks successfully', async () => {
		const params = '1';
		const testTask: ITask = {
			key: '1',
			description: 'test1',
			name: 'test1'
		};
		
		taskStorage.findTaskByKey = jest.fn().mockReturnValue(testTask);

		const r = await request.get(`/tasks/${params}`);

		expect(taskStorage.findTaskByKey).toBeCalledWith('1');
		expect(r.status).toEqual(200);
		expect(r.body).toEqual({ task: testTask } as ITaskRouteReply);
	});
});
