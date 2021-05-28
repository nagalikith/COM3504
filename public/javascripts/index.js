let name = null;
let roomNo = null;
let online = null;
let chat = null;

window.addEventListener(
    "load",
    function (e) {
        if (navigator.onLine) {
            online = true;
        } else {
            online = false;
        }
    },
    false
);


/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    if (online){
        chat = io.connect('/chat');
    }
    if (chat) {
        initChatSocket();
    }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js").then(
            function () {
                console.log("Service Worker Registered");
            },
            function (err) {
                console.log("ServiceWorker registration failed", err);
            }
        );
    }
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

function initChatSocket() {
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    chat.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnChatHistory('<b>' + userId + '</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    chat.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnChatHistory('<b>' + who + ':</b> ' + chatText);


    });

}



/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    if (chat){
        chat.emit('chat', roomNo, name, chatText);
    }
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    let imageUrl = document.getElementById('image_url').value;
    if (!name) name = 'Unknown-' + Math.random();
    // only if online
    if (chat)
        chat.emit('create or join', roomNo, name);
    initCanvas('chat', imageUrl);
    hideLoginInterface(roomNo, name);
}


/**
 * it appends the given html text to the history div
 * this is to be called when the socket receives the chat message (socket.on ('message'...)
 * @param text: the text to append
 */
function writeOnChatHistory(text) {
    let history = document.getElementById('chat_history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    history.scrollTop = history.scrollHeight;
    document.getElementById('chat_input').value = '';
    document.getElementById('chat_input').value = '';
    let userChat = {room_id: document.getElementById('roomNo').value +
            document.getElementById('image_url').value,
        chat: document.getElementById('chat_history').innerHTML
    };
    storeCachedChatData(userChat);
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

