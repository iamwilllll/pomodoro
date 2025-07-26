import { DataBaseError } from '../scripts/error_handling.js';
import { DBManager } from './indexedDBSetup.js';

//clase para administrar el CRUD (Crear, leer, actualizar y borrar datos) de la base de datos
class IndexedDBCRUD {
    //crear tareas de la base de datos
    async createTask(newTask) {
        const objecStore = await getTaskStore();

        // se intenta agregar la tarea
        new Promise((resolve, reject) => {
            const addRequest = objecStore.add(newTask);

            addRequest.onsuccess = () => resolve();

            // si hay algun error se ejcuta este codigo
            addRequest.onerror = () => reject(new DataBaseError('The task could not be created'));
        }).catch(err => {
            console.log(err);
        });
    }

    //leer tareas de la base de datos
    async readTask() {
        const objecStore = await getTaskStore();

        // se intentan leer todas las tareas
        new Promise((resolve, reject) => {
            //crear un cursor para iterar en los datos obtenidos
            const cursorRequest = objecStore.openCursor();
            const cursorTask = [];

            // si todo sale bien se ejecuta este codigo
            cursorRequest.onsuccess = () => {
                const cursor = cursorRequest.result;

                if (cursor) {
                    cursorTask.push(cursor.value);
                    // Continúa al siguiente registro
                    cursor.continue();
                } else {
                    resolve(cursorTask);
                }
            };

            // si hay algun error se ejcuta este codigo
            cursorRequest.onerror = () => {
                reject(new DataBaseError('The task could not be found'));
            };
        })
            .then(cursorTask => console.log(cursorTask))

            .catch(err => console.error(err));
    }

    //editar tareas de la base de datos
    async editTask(editedTask) {
        const objecStore = await getTaskStore();

        try {
            // se edita la tarea
            const editRequest = objecStore.put(editedTask);
            // si hay algun error se ejcuta este codigo
            editRequest.onerror = () => {
                throw new DataBaseError('The task could not be edited');
            };
        } catch (err) {
            // el catch lo captura y muestra en la consola
            console.error(err);
        }
    }
    //eliminar tareas de la base de datos
    async deleteTask(id) {
        const objecStore = await getTaskStore();

        try {
            // se borra la tarea
            const deleteRequest = objecStore.delete(id);

            // si hay algun error se ejcuta este codigo
            deleteRequest.onerror = () => {
                throw new DataBaseError('The task could not be delete');
            };
        } catch (err) {
            // el catch lo captura y muestra en la consola
            console.error(err);
        }
    }
}

/* funciones */
async function getTaskStore() {
    // definir la variable para la database en este scope
    let db;

    // intentar crear la base de datos
    try {
        // definir la variable 'db' cuando en 'DBManager' se devuelve la base de datos creada correctamente
        db = await DBManager.create();

        //si algo sale mal se lanza este error
        if (!db) throw new DataBaseError('The database could not be created');
    } catch (err) {
        // el catch lo captura y se hace un return
        console.error(err);
        return;
    }

    try {
        // crear transaccion global y el objecStore para hacer .add(), put() etc...
        const transaction = db.transaction(['tasks'], 'readwrite');
        const store = transaction.objectStore('tasks');

        // si no se crea se manda este error
        if (!store) {
            throw new DataBaseError('Failed to create object store transaction:');
        }
        // en caso de que si se cree se retorna el objectstore completamente creado
        return store;
    } catch (err) {
        // captura el error y lo imprime en la consola
        console.error(err);
        return;
    }
}

//instanciar clase
export const IndexedDBCRUDManager = new IndexedDBCRUD();

const newTask = {
    id: Date.now(),
    task_decription: 'learnig indexedDB'
};

const editedTask = {
    id: 1753501956460,
    task_decription: 'Edited task2',
    new_id: Date.now()
};

// IndexedDBCRUDManager.createTask(newTask);
// IndexedDBCRUDManager.readTask();
// IndexedDBCRUDManager.editTask(editedTask);
// IndexedDBCRUDManager.deleteTask(1753501956460);
