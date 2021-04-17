////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

let db;

const USERCHAT_DB_NAME= 'db_UserChat_1';
const USERCHAT_STORE_NAME= 'store_userchats';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(USERCHAT_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(USERCHAT_STORE_NAME)) {
                    let userdataDB = upgradeDb.createObjectStore(USERCHAT_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    userdataDB.createIndex('room_id', 'room_id', {unique: false, multiEntry: true});
                    userdataDB.createIndex('image_url', 'image_url', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;
