const $ = require('jquery');
function playVideo(stream, control, peerId) {

    if (peerId != undefined) {
        $('#videoLine').append(`<video id="${peerId}" width="300" class="animated bounceInUp" controls></video>&nbsp;`);
    }

    var video = document.getElementById(peerId == undefined ? control : peerId);
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
        video.play();
    };
}

module.exports = playVideo;
