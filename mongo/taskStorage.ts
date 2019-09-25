import { TaskDatabase } from './database';
import { LoggerService } from '../services/LoggerService';

export interface ITask {
	key: string;
	name: string;
	description: string;
}


export class TaskStorage {
	constructor(
		private readonly _db: TaskDatabase,
		private readonly _loggerService: LoggerService
	) { }

	async findTaskByKey(key: string): Promise<ITask | null> {
		return this._db.tasks.findOne({key});
	}

	async findAllTasks(): Promise<ITask[]> {
		return this._db.tasks.find().toArray();
	}

	async findTaskByName(name: string): Promise<ITask | null> {
		return this._db.tasks.findOne({name});
	}

	async deleteTask(key: string): Promise<boolean> {
		const task = await this.findTaskByKey(key);
		if (!task) {
			this._loggerService.error(`Task with key ${key} does not exist`);
			throw new Error('Task doesnt exist');
		}

		const taskResult = await this._db.tasks.deleteOne({key});

		return Boolean(taskResult.deletedCount);
	}

	async createTask(insert: ITask) {
		const task = await this.findTaskByKey(insert.key);
		if (task) {
			this._loggerService.error(`Task already exists ${insert.key}`);
			throw new Error('Task already exists');
		}

		const taskResult = await this._db.tasks.insertOne({
			key: insert.key,
			name: insert.name,
			description: insert.description
		});
		return Boolean(taskResult.insertedCount);
	}

	async updateTask(key: string, update: ITask) {
		const task = await this.findTaskByKey(key);
		if (!task) {
			this._loggerService.error(`Task does not exist ${key}`);
			throw new Error('Task doesnt exist');
		}

		const updateArgs: ITask = {
			key,
			name: update.name || task.name,
			description: update.description || task.description
		};

		const taskResult = await this._db.tasks.updateOne({key}, updateArgs);
		return Boolean(taskResult.modifiedCount);
	}
}
