/**
 * called by the HTML onloadS
 * Makes IndexDB database if it is no present
 */
function initUserChat() {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * Takes Annotation points and stores the data in the database
 * @param room
 * @param canvasWidth
 * @param canvasHeight
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param color
 * @param thickness
 * @returns {Promise<void>}
 */
async function canvasData(room, canvasWidth, canvasHeight, x1, y1, x2, y2, color, thickness) {
    var annotationsData = {
        room_id: room,
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        x1: x1,
        y1: y2,
        x2: x2,
        y2: y2,
        color: color,
        thickness: thickness
    }
    await storeCachedAnnotationsData(annotationsData).then();

}


/**
 * it sends an Ajax query using JQuery and handing the Chat History and Canvas Drawings
 * @param url the url to send to
 * @param data the data to send (e.g. a Javascript structure)
 */
function AjaxQueryRecieveData(url, data) {
    $.ajax({
        url: url ,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            let room_id = dataR.roomNo + dataR.image_url;
            var loadData = getCachedData(room_id).then(function (result){
                if (result){
                    //Get the Result from IndexDB and adds history to Chat History
                    loadData = result[0].chat;
                    var parser = new DOMParser();
                    //Parsing String into HTML CODE
                    var doc = parser.parseFromString(loadData, 'text/html');
                    let history = document.getElementById('chat_history');
                    history.append(doc.body);

                }
            });
            var canvasArray = getCachedCanvasData(room_id).then(function (result){
                if (result) {
                    //Gets every element from the room id and iteratively draws on the canvas
                    let cvx = document.getElementById('canvas');
                    let ctx = cvx.getContext('2d');
                    for (var i = 0; i < result.length; i++) {
                        var obj = result[i];
                        drawOnCanvas(ctx, obj.canvasWidth,
                            obj.canvasHeight,
                            obj.x1,
                            obj.y1,
                            obj.x2,
                            obj.y2,
                            obj.color,
                            obj.thickness);
                    }
                }
            });

        },
        error: function (response) {
            alert (response.responseText);
        }
    });
}


/**
 * called when the submit button is pressed in the user form
 * @param event the submission event
 */
function onSubmit() {
    // The .serializeArray() method creates a JavaScript array of objects
    const formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    AjaxQueryRecieveData('/getdata', data);
    event.preventDefault()
}

