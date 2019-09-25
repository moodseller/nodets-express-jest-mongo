import { MongoClient, Collection, Db } from 'mongodb';
import config from 'config';
import { ITask } from './TaskStorage';

export interface TaskDatabase {
	tasks: Collection<ITask>;
}

/**
 * Ensures that the collections and database is instantiated
 * 
 * @param {MongoClient} client - instance of mongo
 */
export async function newTaskDatabase(client: MongoClient): Promise<TaskDatabase> {
	const db = client.db(config.get('mongodb.mongoDB'));
	return {
		tasks: await db.createCollection('tasks')
	};
}

/**
 * Returns typed collections
 * 
 * @param {Db} db - mongo database emitter 
 */
export function getTaskDatabase(db: Db): TaskDatabase {
	return {
		tasks: db.collection('tasks')
	};
}
