const DUR = 5000;
var filename = 'greet.mp3';
var audio = new Audio(filename);
function notify() {
  audio.play();
}

function getUserMedia(options, successCallback, failureCallback) {
  var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
}

function getStream (type) {
  document.getElementById('rec-btn').classList.add('disabled');
  document.getElementById('rec-btn').classList.remove('pulse');
  if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('User Media API not supported.');
    return;
  }

  var constraints = {};
  constraints[type] = true;
  getUserMedia(constraints, function (stream) {
    var mediaControl = document.querySelector(type);
    var mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'audio/wav'; // audio/webm or audio/ogg or audio/wav
    mediaRecorder.ondataavailable = function (blob) {
      // POST/PUT "Blob" using FormData/XHR2
      var blobURL = URL.createObjectURL(blob);
      var audios = document.getElementById('audios');
      audios.innerHTML += '<p><a href="' + blobURL + '">' + blobURL + '</a></p>\n';
      //mediaRecorder.stop();
      //stream.getTracks().forEach(track => track.stop());
      //document.getElementById('rec-btn').classList.remove('disabled');
      //document.getElementById('rec-btn').classList.add('pulse');
    };
    mediaRecorder.start(DUR);

    var options = {};
    var speechEvents = hark(stream, options);
    speechEvents.on('stopped_speaking', function() {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      document.getElementById('rec-btn').classList.remove('disabled');
      document.getElementById('rec-btn').classList.add('pulse');
    });

    if ('srcObject' in mediaControl) {
      mediaControl.srcObject = stream;
      mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
    } else if (navigator.mozGetUserMedia) {
      mediaControl.mozSrcObject = stream;
    }
  }, function (err) {
    alert('Error: ' + err);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.getElementById('modal1');
  var instance = M.Modal.init(elems, { 
   opacity: 0.5,
   onCloseEnd(){
     notify();
  }
  });
  instance.open();
});
