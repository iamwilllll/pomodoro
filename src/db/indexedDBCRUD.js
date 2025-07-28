import { DataBaseError } from '../scripts/error_handling.js';
import { DBManager } from './indexedDBSetup.js';

// Class to manage CRUD operations (Create, Read, Update, Delete) for the IndexedDB
class IndexedDBCRUD {
    /* Create */
    async createTask(newTask) {
        // Wait for the object store to be available
        const objectStore = await getTaskStore();

        // Create a promise to insert the new task
        await new Promise((resolve, reject) => {
            // Create a request to add the new task
            const addRequest = objectStore.add(newTask);

            // Resolve if the task is successfully added
            addRequest.onsuccess = () => resolve();

            // Reject if an error occurs
            addRequest.onerror = () => reject(new DataBaseError('The task could not be created'));
        }).catch(err => {
            console.error(err);
        });
    }

    /* Read */
    async readTasks() {
        // Wait for the object store to be available
        const objectStore = await getTaskStore();

        // Create a promise to iterate through all tasks
        await new Promise((resolve, reject) => {
            // Create a cursor to iterate over the records
            const cursorRequest = objectStore.openCursor();

            // If successful, process each task
            cursorRequest.onsuccess = () => {
                const cursor = cursorRequest.result;

                /* -------- Logic to display all tasks from IndexedDB -------- */
                if (cursor) console.log(cursor.value);
                /* ---------------------------------------------------------- */

                // Continue to the next record
                if (cursor) cursor.continue();
            };

            // Reject if an error occurs
            cursorRequest.onerror = () => reject(new DataBaseError('Tasks could not be read'));
        }).catch(err => console.error(err));
    }

    /* Update */
    async editTask(updatedTask) {
        // Wait for the object store to be available
        const objectStore = await getTaskStore();

        // Create a promise to update the task
        await new Promise((resolve, reject) => {
            // Attempt to update the task using .put()
            const editRequest = objectStore.put(updatedTask);

            // Resolve if successful
            editRequest.onsuccess = () => resolve();

            // Reject if an error occurs
            editRequest.onerror = () => reject(new DataBaseError('The task could not be updated'));
        }).catch(err => console.error(err));
    }

    /* Delete */
    async deleteTask(id) {
        // Wait for the object store to be available
        const objectStore = await getTaskStore();

        // Create a promise to delete the task
        await new Promise((resolve, reject) => {
            // Attempt to delete the task using the given ID
            const deleteRequest = objectStore.delete(id);

            // Resolve if successful
            deleteRequest.onsuccess = () => resolve();

            // Reject if an error occurs
            deleteRequest.onerror = () => reject(new DataBaseError('The task could not be deleted'));
        }).catch(err => console.error(err));
    }
}

/* Helper function */
async function getTaskStore(mode = 'readwrite') {
    let database;

    // Try to create or access the IndexedDB
    try {
        database = await DBManager.create();
        if (!database) throw new DataBaseError('The database could not be created');
    } catch (err) {
        console.error(err);
        return;
    }

    // Try to get a writable transaction and access the object store
    try {
        const transaction = database.transaction(['taskList'], mode);
        const store = transaction.objectStore('taskList');
        if (!store) throw new DataBaseError('Failed to access the object store');
        return store;
    } catch (err) {
        console.error(err);
        return;
    }
}

// Instantiate and export the class
export const IndexedDBCRUDManager = new IndexedDBCRUD();
