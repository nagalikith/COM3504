const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';

let KG_annotationText = null;

/**
 * it inits the widget by selecting the type from the field myType
 * and it displays the Google Graph widget
 * it also hides the form to get the type
 */
function KGInit(){
    let config = {
        'limit': 10,
        'languages': ['en'],
        'types': [],
        'maxDescChars': 100,
        'selectHandler': selectItem,
        }
        KGSearchWidget(apiKey, document.getElementById("myInput"), config);

    let KGButton = document.getElementById("KGDisplay");
    KGButton.addEventListener(
        "click",
        () => {
            displayKG();
        },
        false
    );
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function selectItem(event){
    KG_annotationText= event.row;
    // document.getElementById('resultImage').src= row.json.image.url;
    document.getElementById("KGButton").style.display = "inline-block";
}

/**
 * Checks if ID is present in the list to remove duplicates
 * @param annotationsFinal
 * @param id
 * @returns {boolean}
 */
function idAbsent(annotationsFinal, id) {
    for (const data of annotationsFinal){
        if (data.KG.id == id){
            return false;
        }
    }
    return true;
}

/**
 * Displays Knowledge Graph in the table
 */
function displayKG() {
    let room_id = document.getElementById('roomNo').value + document.getElementById('image_url').value;
    getCachedCanvasData(room_id).then((annotations) => {
        let id;
        let annotationsFinal = [];
        if (annotations && annotations.length > 0) {
            let annLen = annotations.length;
            // remove duplicate annotations from KG
            for (let i = 0; i < annLen - 1; i++) {
                if (annotations[i].KG){
                    id = annotations[i].KG.id;
                    if (idAbsent(annotationsFinal,id)){
                        annotationsFinal.push(annotations[i]);
                    }
                }
            }
            //creates the table
            let tableData = `
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Reference concept</th>
                    <th>Link</th>
                </tr>
            `;
            console.log("FINAL LENGTH " +annotationsFinal.length);
            for (const canvasdata of annotationsFinal) {
                tableData += `
                    <tr>
                        <td>${canvasdata.KG.name + "-"}</td>
                        <td>${canvasdata.KG.description + "-"}</td>
                        <td>${canvasdata.KG.rc + "-"}</td>
                        <td><a href="${canvasdata.KG.qc + "-"}">Direct link</a></td>
                    </tr>
                `;
            }
            document.getElementById("KG_table").innerHTML = tableData;
        }
    });
}


