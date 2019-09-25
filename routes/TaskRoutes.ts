import express, { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { mergeRouteName, tryRoute } from '../utils/utils';
import parser from 'body-parser';
import { TaskStorage } from '../mongo/TaskStorage';

export class TaskRoutes {
	constructor(private readonly _taskStorage: TaskStorage) { }
	
	initTaskRoutes(): Router {
		const routePrefix = '/tasks';
		const routeController = new TaskController(this._taskStorage);

		const router = express.Router();
		router.use(parser.json());

		router.get(mergeRouteName(routePrefix, '/'), tryRoute(routeController.allTasksRoute));
		router.get(mergeRouteName(routePrefix, '/:id'), tryRoute(routeController.taskRoute));
		router.post(mergeRouteName(routePrefix, '/'), tryRoute(routeController.createTaskRoute));

		return router;
	}
}
