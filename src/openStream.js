/**
 * Created by Clearpath on 5/29/2017.
 */
function openStream(callback) {
    // Prefer camera resolution nearest to 1280x720.
    var constraints = {audio: true, video: {width: 1280, height: 720}};

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            callback(mediaStream);
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        }); //
}

module.exports = openStream;