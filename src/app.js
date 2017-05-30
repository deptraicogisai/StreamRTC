/**
 * Created by Clearpath on 5/29/2017.
 */
const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');

const config = ({host: 'streaming-rtc.herokuapp.com', secure: true, port: 443, key: 'peerjs', debug: 3});

const openStream = require('./openStream');
const playVideo = require('./playVideo');

function getUid() {
    var myUid = uid(10);
    $('#myId').val(myUid);
    return myUid;
}

const peer = new Peer(getUid(), config);

$('#btnConnect').click(function () {
    const friendId = $('#friendId').val();
    openStream(function (stream) {
        playVideo(stream, 'localStream');

        var call = peer.call(friendId, stream);
        call.on('stream', function (remoteStream) {
            console.log(remoteStream);
            playVideo(remoteStream, 'friendStream');
        });
    });
})

peer.on('call', function (call) {

    openStream(function (stream) {
        playVideo(stream, 'localStream');

        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function (remoteStream) {
            console.log(remoteStream);
            playVideo(remoteStream, 'friendStream');
        });
    });
});