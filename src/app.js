/**
 * Created by Clearpath on 5/29/2017.
 */
const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');

const config = ({host: 'streaming-rtc.herokuapp.com', secure: true, port: 443, key: 'peerjs', debug: 3});

const openStream = require('./openStream');
const playVideo = require('./playVideo');
// var socket = io('http://localhost:3000');
var socket = io('https://stream-with-jim.herokuapp.com/');

var app = angular.module('app', []);


$('#chat').hide();

function getUid() {
    var myUid = uid(10);
    $('#myId').val(myUid);
    return myUid;
}

app.controller('AppController', function ($scope) {

    const peer = new Peer(getUid(), config);

    $scope.userList = [];

    peer.on('open', (id) => {

        $('#btnLogin').click(function () {

            const username = $('#txtUsername').val();

            $scope.myId = id;

            socket.emit('user_register', {name: username, peerId: id});
        });
    })

    socket.on('error_register', () => alert('Dang nhap that bai cmm roi !'))

    socket.on('new_user', (user) => {
        $scope.$apply(() => $scope.userList.push(user))
    });

    socket.on('user_disconnect', (users) => {
        $scope.$apply(() => $scope.userList = users)
    });

    socket.on('online_list', (users) => {
        $('#chat').show();
        $('#login').hide();

        $scope.$apply(function () {
                $scope.userList = users;
            }
        )
    })

    $scope.callFriend = function (item) {
        openStream(function (stream) {

            item.canCall = false;

            playVideo(stream, 'localStream');

            var call = peer.call(item.peerId, stream);
            call.on('stream', function (remoteStream) {
                console.log('Call : ' + remoteStream);
                playVideo(remoteStream, 'friendStream', item.peerId);
            });

            call.on('close', function () {
                $('#videoline ' + '#' + call.peer).remove();
            });
        });
    }

    peer.on('call', function (call) {

        openStream(function (stream) {

            _.forEach($scope.userList, (user) => {
                if (user.peerId == call.peer) {
                    user.canCall = false;
                }
            });

            playVideo(stream, 'localStream');

            call.answer(stream); // Answer the call with an A/V stream.

            call.on('stream', function (remoteStream) {
                console.log('Answer : ' + remoteStream);
                playVideo(remoteStream, 'friendStream', call.peer);
            });

            call.on('close', function () {
                console.log(call.peer);
                $('#videoline ' + '#' + call.peer).remove();
            });
        });
    });

});


