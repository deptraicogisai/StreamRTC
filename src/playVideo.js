const $ = require('jquery');
function playVideo(stream, control) {
    var video = document.getElementById(control);
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
        video.play();
    };
}
module.exports = playVideo;
