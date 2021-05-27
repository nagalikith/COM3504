////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb';

let db;

const USERCHAT_DB_NAME= 'db_UserChat_1';
const USERCHAT_STORE_NAME= 'store_userchats';
const USERCHAT_STORE_NAME_2 = 'store_chatannotations';

/**
 * it inits the database
 */
async function initDatabase(){
    if (!db) {
        db = await idb.openDB(USERCHAT_DB_NAME, 2, {
            upgrade: function (upgradeDb, oldVersion, newVersion) {

                if (!upgradeDb.objectStoreNames.contains(USERCHAT_STORE_NAME)) {
                    let userdataDB = upgradeDb.createObjectStore(USERCHAT_STORE_NAME,{
                        keyPath:'room_id'
                    });
                    userdataDB.createIndex('room_id', 'room_id', {unique:true,multiEntry:true})
                }

                if (!upgradeDb.objectStoreNames.contains(USERCHAT_STORE_NAME_2)) {
                    let userdataDB = upgradeDb.createObjectStore(USERCHAT_STORE_NAME_2, {
                        keyPath:'id', autoIncrement:true
                    });
                    userdataDB.createIndex('room_id', 'room_id',{unique:false,multiEntry:true})
                }

            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;
