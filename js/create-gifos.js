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

const captureButton = document.getElementById("capture-split-btn");
const readyButton = document.getElementById("ready-btn");
const recordedGif = document.getElementById('recorded-gif');
const redoCapture = document.getElementById('redo-btn');
const uploadCapture = document.getElementById('upload-btn');

//Step 1: Asks for permission to get the camera streaming

let cameraStream;

document.getElementById("create-start-btn").addEventListener('click', () => {
  document.querySelector("#create-1-intro").classList.add("display-none");
  document.querySelector("#create-2-recording").classList.remove("display-none");
  getStream();
})

let video = document.getElementById("video-stream");

function getStream() {
  navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        height: { max: 720 },
      },
    })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
      cameraStream = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}


captureButton.addEventListener('click', () => {
  captureButton.classList.add("display-none");
  readyButton.classList.remove("display-none");
  document.getElementById("create-2-header").innerHTML = "Capturando tu gifo";
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