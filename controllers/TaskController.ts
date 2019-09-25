import { NextFunction } from 'express';
import { TypedResponse, TypedRequest } from '../utils/typed';
import { ITask, TaskStorage } from '../mongo/TaskStorage';
import { validateField } from '../utils/utils';

interface ErrorMessage {
	message: string;
}

export interface ITaskRouteReply {
	task: ITask | null;
}
export interface IAllTasksRouteReply {
	tasks: ITask[];
}

interface ITaskRequestParams {
	id: string;
}


export class TaskController {
	constructor(private readonly _taskStorage: TaskStorage) { }

	allTasksRoute = async (
		req: TypedRequest<{}, {}>, 
		res: TypedResponse<IAllTasksRouteReply>,
		next: NextFunction
	) => {
		const tasks = await this._taskStorage.findAllTasks();
		return res.status(200).json({ tasks });
	};

	taskRoute = async (
		req: TypedRequest<{}, ITaskRequestParams>, 
		res: TypedResponse<ITaskRouteReply | ErrorMessage>,
		next: NextFunction
	) => {
		const key = req.params.id;

		const task = await this._taskStorage.findTaskByKey(key);
		return res.status(200).json({ task });
	};

	createTaskRoute = async (
		req: TypedRequest<ITask, {}>, 
		res: TypedResponse<ITaskRouteReply | ErrorMessage>,
		next: NextFunction
	) => {
		const taskValues = req.body;
		const taskKeys = ['key', 'name', 'description'];

		// const { key, name, description } = taskValues;
		const validKeys = Object.keys(taskValues).every((k) => {
			return taskKeys.includes(k) && validateField(taskValues[k], 'string');
		});

		if (!validKeys || Object.keys(taskValues).length !== taskKeys.length) {
			return res.status(400).json({ message: `Available task keys are: ${taskKeys}, only string values.`});
		}

		const task = await this._taskStorage.createTask(taskValues);
		if (task) {
			return res.status(200).json({ task: taskValues });
		} else {
			return res.status(500).json({ message: 'Failed to create task.' });
		}
	};
}
