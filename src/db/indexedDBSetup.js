// create class to handle database creation
class IndexedDB {
    constructor() {
        this.db = null;
    }

    // create method to create indexedDB
    create() {
        return new Promise((resolve, reject) => {
            // open connection to the database
            const request = window.indexedDB.open('tasks', 1);

            // this code runs only once and is used to structure the database
            request.onupgradeneeded = () => {
                this.db = request.result;

                // defining the keyPath, which in this case is the id
                const store = this.db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

                // structure where tasks will be stored
                store.createIndex('task', 'task', { unique: false });
            };

            // if created successfully, return the database
            request.onsuccess = () => resolve(request.result);

            // if database creation fails, return false
            request.onerror = () => reject(false);
        });
    }
}

// instantiate class
export const DBManager = new IndexedDB();
