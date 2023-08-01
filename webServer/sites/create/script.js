var created_model = {}

function generate() {
    document.getElementById("generationComplete").innerHTML = "";
    created_model = generateModel(
        document.getElementById("textarea_train_data").value,
        document.getElementById("useToLowerCase").checked,
        document.getElementById("removePunctuation").checked,
        (count) => {
            document.getElementById("wordcount").innerText = count;
        },
        (progress) => {
            document.getElementById("progressbar").style.width = `${progress}%`;
            if (progress == 100) {
                document.getElementById("generationComplete").innerHTML = '<div class="alert alert-dismissible alert-success mt-2"><button type="button" class="btn-close" data-bs-dismiss="alert"></button>generation complete!.</div>'
            }
        }
    )
}

var tryInput = document.getElementById("tryinput");
var tryOutput = document.getElementById("tryoutput");

tryInput.oninput = () => {
    tryOutput.value = getPromise(created_model, tryInput.value);
}

document.getElementById("download_model_button").onclick = () => {
    if (created_model) {
        downloadObjectAsJson(created_model);
    }
}

document.getElementById("upload_model_button").onclick = () => {
    openJSONFile((uploadedmodel) => {
        if (uploadedmodel) {
            created_model = uploadedmodel;
            document.getElementById("generationComplete").innerHTML = "";
        }
    })
}

function uploadtextfile() {
    openTextFile((content)=>{
        document.getElementById("textarea_train_data").value = content;
    })
}

function downloadObjectAsJson(exportObj) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "model.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function openJSONFile(cb) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            try {
                var content = readerEvent.target.result;
                cb(JSON.parse(content));
            } catch (err) {
                console.log(err);
                alert("File not in JSON format!");
            }
        }
    }

    input.click();
}

function openTextFile(cb) {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            cb(readerEvent.target.result);
        }
    }
    input.click();
}
