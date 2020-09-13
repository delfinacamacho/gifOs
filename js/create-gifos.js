/*--------------------LOAD THEME--------------------*/

const theme = document.getElementById("theme");
let setTheme = localStorage.getItem("setTheme");

if (setTheme === "enabledDayTheme") {
  day();
  } else {
    night();
  }

function day() {
  theme.className = "day";
  localStorage.setItem("setTheme", "enabledDayTheme");
}

function night() {
  theme.className = "night";
  localStorage.setItem("setTheme", "enabledNightTheme");
}

/*--------------------CAPTURE RECORDING--------------------*/

const introWindow = document.getElementById("create-1-intro");
const recordingWindow = document.getElementById("create-2-recording");
const successWindow = document.getElementById("create-3-success");

const captureButton = document.getElementById("capture-split-btn");
const readyButton = document.getElementById("ready-btn");

const recordedGif = document.getElementById("recorded-gif");
const recordedGifThumb = document.getElementById("recorded-gif-thumb");

const redoCapture = document.getElementById("redo-btn");
const uploadCapture = document.getElementById("upload-btn");
const cancelUpload = document.getElementById("cancel-btn");

const navBar = document.getElementById("create-recording-nav");

const downloadGifButton = document.getElementById("download-gif");
const copyLinkButton = document.getElementById("copy-gif-link");


//Step 1: Asks for permission to get the camera streaming

let cameraStream;

document.getElementById("create-start-btn").addEventListener('click', () => {
  introWindow.classList.add("display-none");
  recordingWindow.classList.remove("display-none");
  getStream();
})

let video = document.getElementById("video-stream");

function getStream() {
  navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        height: { max: 360 },
        width: { max: 480 },
        facingMode: "user"
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      cameraStream = stream;
    })
    .catch((error) => {
      console.error(error);
      alert("Uy! Parece que algo salió mal.");
    });
}


captureButton.addEventListener('click', () => {
  captureButton.classList.add("display-none");
  readyButton.classList.remove("display-none");
  startGifRecording();
});

//Step 2: Starts the recording of camera streaming

let recorder;

function startGifRecording() {
  recorder = RecordRTC(cameraStream, {
    type: "gif",
    frameRate: 1,
    quality: 10,
    onGifRecordingStarted: function () {
      console.log("Gif recording: started");
    },
  });
  recorder.startRecording();
  return recorder;
}

//Step 3: Stops the recording of camera streaming and display of the gif preview

readyButton.addEventListener('click', () => {
  readyButton.classList.add("display-none");
  document.getElementById("upload-redo-btn").classList.remove("display-none");
  document.getElementById("create-2-header").innerHTML = "Vista previa";
  stopGifRecording()

  video.classList.add("display-none");
  recordedGif.classList.remove("display-none");
});

function stopGifRecording() {
  recorder.stopRecording(processGifRecording);
  cameraStream.getTracks().forEach(function(track) {
    track.stop(); // Calling stop() tells the user agent that the track's source is no longer needed by the MediaStreamTrack. 
    });
}

function processGifRecording() {
  let form = new FormData();
  let blob = recorder.getBlob();
  form.append('file', blob, 'miGif.gif');
  console.log(form.get('file'));
  console.log(blob);
  recordedGif.src = URL.createObjectURL(blob); //Gif preview
}

//Redo Capture: Takes user back to Step 1

redoCapture.addEventListener('click', () => {
  recordedGif.classList.add("display-none");
  video.classList.remove("display-none");
  document.getElementById("create-2-header").innerHTML = "Un chequeo antes de empezar";
  captureButton.classList.remove("display-none");
  document.getElementById("upload-redo-btn").classList.add("display-none");
  getStream();
});

// Step 4: Uploading the gif to Giphy

uploadCapture.addEventListener('click', uploadGif);
uploadCapture.addEventListener('click', showUploadingWindow);

const apiKey = "Tikochocgg7Xu1KtXHIGkPgqAlmLFJt4";
//const apiKey = "jDaKg80vX8irA6U1c4799UZ8xqevueG3"; //For when you overuse first api key
//const apiKey = "fwTM3sGeFg0NT2kUyP0yWb9ffRre5g4n"; //For when you overuse second api key

let giphyUrl;

function uploadGif() {
    let form = new FormData();
    form.append('file', recorder.getBlob(), 'Newgif.gif');

    fetch('https://upload.giphy.com/v1/gifs?&api_key='+ apiKey, {
        method: 'POST',
        body: form,
    })

    .then(response => {
        return response.json()
    })

    .then(responseJson => {
      let gifId = responseJson.data.id;
      fetch('https://api.giphy.com/v1/gifs/' + gifId + '?&api_key=' + apiKey)
      .then(response => {
        return response.json()
      })
      .then(response => {
        let id = `id-${response.data.id}`;
        giphyUrl = response.data.images.original.url;
        localStorage.setItem(id, giphyUrl);
        recordedGifThumb.src = giphyUrl;
      });
    })

    .catch((error) => {
        console.error(error);
    });
    return giphyUrl; 

};

function showUploadingWindow() {
  document.getElementById("create-2-header").innerHTML = "Subiendo gifo";
  cancelUpload.classList.remove("display-none");
  document.getElementById("upload-redo-btn").classList.add("display-none");
  video.classList.add("display-none");
  recordedGif.classList.add("display-none");
  navBar.classList.add("display-none");
  document.getElementById("uploading-screen").classList.remove("display-none");

  showSuccessWindow();
}

cancelUpload.addEventListener('click', () => {
  window.location.href = "index.html"; //TODO: delete last item from localStorage
})


function showSuccessWindow() {
  setTimeout(function() {
    recordingWindow.classList.add("display-none");
    successWindow.classList.remove("display-none");
  }, 5000);
}

copyLinkButton.addEventListener('click', copyGifLink);

downloadGifButton.addEventListener('click', downloadGif);

async function downloadGif() {
  try {
    let a = document.createElement('a'); // creates a new anchor element
    let response = await fetch(giphyUrl);
    let file = await response.blob(); // gets Gif as blob
    a.download = 'myGif.gif'; // JS download attribute Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes
    a.href = window.URL.createObjectURL(file); //stores the download url in JS Reference: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':'); // determines click on anchor element to start the download
    a.click(); // mimics the "click" on the anchor element
  } catch (error) {
    console.log("Something went wrong", error);
  }
}

function copyGifLink() {
  let copyText = document.createElement('textarea');
  copyText.value = giphyUrl;
  document.body.appendChild(copyText);
  copyText.select();
  document.execCommand('copy');
  alert("Enlace copiado en el portapapeles.");
  document.body.removeChild(copyText);
}

