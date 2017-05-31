const $ = require('jquery');
function playVideo(stream, control, peerId) {

    if (peerId != undefined) {
        $('#videoLine').append(`<video id="${peerId}" width="300" controls></video>`);
    }

    var video = document.getElementById(peerId == undefined ? control : peerId);
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
        video.play();
    };
}

function removeVideo(peerId){
    $('#videoline').find(`#${peerId}`).remove();
}

module.exports = playVideo;
