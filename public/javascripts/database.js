////////////////// DATABASE //////////////////
// the database receives from the server the following structure
import * as idb from './idb/index.js';

let db;

const USERCHAT_DB_NAME= 'db_UserChat_1';
const USERCHAT_STORE_NAME= 'store_userchats';
const USERCHAT_STORE_NAME_2 = 'store_chatannotations';

/**
 * it inits the database
 * Creates 2 databases one fore Chat History
 * Another for Past Annotations
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

/**
 * This stores Chat History in IndexDB
 * @param userChat
 * @returns {Promise<void>}
 */
async function storeCachedChatData(userChat) {
    console.log(JSON.stringify(userChat))
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(USERCHAT_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(USERCHAT_STORE_NAME);
            let index = await store.index('room_id');
            let request = await index.getAll(IDBKeyRange.only(userChat.room_id));
            //If Record is present it is updated
            if (request.length > 0){
                console.log("PATH HOPEFULLY: "+JSON.stringify(request))
                store.put(userChat, request.room_id);
            } else {
            //New Record is made
                store.put(userChat);
            }
            await  tx.done;
        } catch(error) {
            console.log(error)
        };
    }
}
window.storeCachedChatData= storeCachedChatData;

/**
 * It stores the canvas annotation data.
 * Multiple records are stored in the indexDB
 * @param annotationsData
 * @returns {Promise<void>}
 */
async function storeCachedAnnotationsData(annotationsData) {
    if (!db)
        await initDatabase();
    if (db) {
        try{
            let tx = await db.transaction(USERCHAT_STORE_NAME_2, 'readwrite');
            let store = await tx.objectStore(USERCHAT_STORE_NAME_2);
            store.put(annotationsData);
            await  tx.done;
        } catch(error) {
            console.log(error)
        };
    }
}

window.storeCachedAnnotationsData= storeCachedAnnotationsData;

/**
 * it retrieves the Chat data for a room_id from the database
 * @param room_id
 * @param date
 * @returns {Promise<*>}
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
            //Gets only the specific room_id chat history
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


/**
 * it retrieves the Canvas Annotations data for a room_id from the database
 * @param room_id
 * @returns {Promise<*>}
 */
async function getCachedCanvasData(room_id) {
    if (!db)
        await initDatabase();
    if (db) try {
        console.log('fetching Chat History: ' + room_id);
        let tx = await db.transaction(USERCHAT_STORE_NAME_2, 'readonly');
        let store = await tx.objectStore(USERCHAT_STORE_NAME_2);
        let index = await store.index('room_id');
        let readingsList = await index.getAll(IDBKeyRange.only(room_id));
        await tx.done;
        if (readingsList && readingsList.length > 0) {
            return readingsList;
        } else {
            console.log("Error Getting Data");
        }
    } catch (error) {
        console.log(error);
    }
}
window.getCachedCanvasData= getCachedCanvasData;


