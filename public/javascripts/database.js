////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

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
            upgrade(upgradeDb, oldVersion, newVersion) {

                if (!upgradeDb.objectStoreNames.contains(USERCHAT_STORE_NAME)) {
                    let userdataDB = upgradeDb.createObjectStore(USERCHAT_STORE_NAME, {
                        keyPath: 'room_id'
                    });
                }

                if (!upgradeDb.objectStoreNames.contains(USERCHAT_STORE_NAME_2)) {
                    let userdataDB = upgradeDb.createObjectStore(USERCHAT_STORE_NAME_2, {
                        keyPath: 'room_id'
                    });
                }

            }
        });
        console.log('db created');
    }
}
window.initDatabase= initDatabase;


async function storeCachedChatData(room_id, chatHistory) {
    console.log('inserting: '+JSON.stringify(chatHistory));
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(USERCHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(USERCHAT_STORE_NAME);
            await store.put(chatHistory);
            await  tx.done;
            console.log('added item to the store! '+ JSON.stringify(chatHistory));
        } catch(error) {
            console.log(error)
        };
    }
}
window.storeCachedChatData= storeCachedChatData;


/**
 * it retrieves the Chat data for a room_id from the database
 * @param room_id
 * @param date
 * @returns {*}
 */
async function getCachedData(room_id) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching Chat History: ' + room_id);
            let tx = await db.transaction(USERCHAT_STORE_NAME, 'readonly');
            let store = await tx.objectStore(USERCHAT_STORE_NAME);
            let index = await store.index('room_id');
            let readingsList = await index.getAll(IDBKeyRange.only(room_id));
            await tx.done;
            let finalResults=[];
            if (readingsList && readingsList.length > 0) {
                return readingsList;
            } else {
                console.log("Error Getting Data");
            }
        } catch (error) {
            console.log(error);
        }
    }
}
window.getCachedData= getCachedData;
