// importar errores personalizados
import { DataBaseError } from '../scripts/error_handling.js';

// crear clase para la base de datos
class DB {
    // crear variables globales en este scope con el uso del .this
    constructor() {
        this.DB_NAME = 'taskList';
        this.DB_VERSION = 1;
    }

    // método para crear la base de datos indexedDB
    create() {
        return new Promise((resolve, reject) => {
            const db = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

            // Estructura la base de datos
            db.onupgradeneeded = event => {
                // Nota: este código se ejecuta una sola vez, por eso es buena práctica definir la estructura aquí
                const dbResult = event.target.result;

                dbResult.createObjectStore(this.DB_NAME, { keyPath: 'id', autoIncrement: true });
            };

            // Si todo sale bien, se resuelve la promesa
            db.onsuccess = event => resolve(event.target.result);

            // Si hay un error, se rechaza la promesa
            db.onerror = () => reject(new DataBaseError('Error al abrir la base de datos'));
        });
    }
}

// Instanciar y exportar clase
export const DBManager = new DB();
