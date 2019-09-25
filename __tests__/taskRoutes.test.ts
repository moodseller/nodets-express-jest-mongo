import supertest from 'supertest';
import http from 'http';
import { LoggerService } from '../services/loggerService';
import MainApplication from '../app';
import { SettingsService } from '../services/settingsService';
import { TaskStorage, ITask } from '../mongo/TaskStorage';
import { ITaskRouteReply, IAllTasksRouteReply } from '../controllers/TaskController';

describe('Task Routes Test', () => {
	let mainApplication: MainApplication;
	let loggerService: PartialMock<LoggerService>;
	let settingsService: PartialMock<SettingsService>;
	let taskStorage: PartialMock<TaskStorage>;

	let server: http.Server;
	let request: supertest.SuperTest<supertest.Test>;
	
	beforeEach(() => {
		taskStorage = {
			findTaskByKey: jest.fn(),
			findAllTasks: jest.fn(),
			createTask: jest.fn()
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

		expect(taskStorage.findTaskByKey).toBeCalledWith(params);
		expect(r.status).toEqual(200);
		expect(r.body).toEqual({ task: testTask } as ITaskRouteReply);
	});

	it('should get all tasks successfully', async () => {
		const testTasks: ITask[] = [{
			key: '1',
			description: 'test1',
			name: 'test1'
		},
		{
			key: '2',
			description: 'test2',
			name: 'test2'
		}];
		
		taskStorage.findAllTasks = jest.fn().mockReturnValue(testTasks);

		const r = await request.get(`/tasks/`);

		expect(taskStorage.findAllTasks).toBeCalledTimes(1);
		expect(r.status).toEqual(200);
		expect(r.body).toEqual({ tasks: testTasks } as IAllTasksRouteReply);
	});

	it('should create task successfully', async () => {
		const taskBody: ITask = {
			key: '1',
			description: 'test1',
			name: 'test1'
		};
		
		taskStorage.createTask = jest.fn().mockReturnValue(true);

		const r = await request.post(`/tasks/`).send(taskBody);

		expect(taskStorage.createTask).toBeCalledWith(taskBody);
		expect(r.status).toEqual(200);
		expect(r.body).toEqual({ task: taskBody } as ITaskRouteReply);
	});

	it('should not pass validation', async () => {
		const failedTaskBody: any = {
			key: 1,
			description: 'test1',
			name: 'test1'
		};

		const missingParamsTaskBody: any = {
			key: '1',
			description: 'test1'
		};

		const createTaskSpy = jest.spyOn(taskStorage, 'createTask');
		

		let r = await request.post(`/tasks/`).send(failedTaskBody);
		expect(createTaskSpy).toBeCalledTimes(0);
		expect(r.status).toEqual(400);
		expect(r.body).toMatchObject({
			message: 'Available task keys are: key,name,description, only string values.'
		});

		r = await request.post(`/tasks/`).send(missingParamsTaskBody);
		expect(createTaskSpy).toBeCalledTimes(0);
		expect(r.status).toEqual(400);
		expect(r.body).toMatchObject({
			message: 'Available task keys are: key,name,description, only string values.'
		});
	});
});
