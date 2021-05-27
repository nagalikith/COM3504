/**
 * called by the HTML onloadS
 */
function initUserChat() {
    //check for support
    if ('indexedDB' in window) {
        initDatabase().then();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

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
 * it sends an Ajax query using JQuery
 * @param url the url to send to
 * @param data the data to send (e.g. a Javascript structure)
 */
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            // in order to have the object printed by alert
            // we need to JSON.stringify the object
            let room_id = dataR.roomNo + dataR.image_url;
            var loadData = getCachedData(room_id).then(function (result){
                if (result){
                    loadData = result[0].chat;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(loadData, 'text/html');
                    let history = document.getElementById('chat_history');
                    history.append(doc.body);

                }
            });
            var canvasArray = getCachedCanvasData(room_id).then(function (result){
                if (result) {
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
            // the error structure we passed is in the field responseText
            // it is a string, even if we returned as JSON
            // if you want o unpack it you must do:
            // const dataR= JSON.parse(response.responseText)
            alert (response.responseText);
        }
    });
}


/**
 * called when the submit button is pressed
 * @param event the submission event
 */
function onSubmit() {
    // The .serializeArray() method creates a JavaScript array of objects
    // https://api.jquery.com/serializearray/
    const formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery('/', data);
    // prevent the form from reloading the page (normal behaviour for forms)
    event.preventDefault()
}

