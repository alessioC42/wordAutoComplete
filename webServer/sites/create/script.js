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