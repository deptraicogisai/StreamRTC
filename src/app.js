/**
 * Created by Clearpath on 5/29/2017.
 */
const Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');

const config = ({host: 'streaming-rtc.herokuapp.com', secure: true, port: 443, key: 'peerjs', debug: 3});

const openStream = require('./openStream');
const playVideo = require('./playVideo');
var socket = io('http://localhost:3000');

var app = angular.module('app', []);


$('#chat').hide();

function getUid() {
    var myUid = uid(10);
    $('#myId').val(myUid);
    return myUid;
}


function CallFriend(id) {

    openStream(function (stream) {
        playVideo(stream, 'localStream');

        var call = peer.call(friendId, stream);
        call.on('stream', function (remoteStream) {
            console.log(remoteStream);
            playVideo(remoteStream, 'friendStream');
        });

        call.on('close', function () {
            alert('disconnect');
        });
    });
}

app.controller('AppController', function ($scope) {

    $scope.userList = [{name: 'sds', peerId: 1}];
    const peer = new Peer(getUid(), config);

    peer.on('open', function (id) {
        $('#btnLogin').click(function () {

            const username = $('#txtUsername').val();
            $scope.myId = id;
            socket.emit('user_register', {name: username, peerId: id});
        });
    })

    socket.on('error_register', function () {
        alert('Dang nhap that bai cmm roi !')
    })

    socket.on('new_user', function (user) {
        $scope.$apply(function () {
            $scope.userList.push(user);
        })
    });

    socket.on('online_list', function (users) {
        $('#chat').show();
        $('#login').hide();

        alert('online list');

        $scope.$apply(function () {
            $scope.userList = users;
        })
    })

    $scope.callFriend = function (peerId) {
        openStream(function (stream) {
            playVideo(stream, 'localStream');

            var call = peer.call(peerId, stream);
            call.on('stream', function (remoteStream) {
                console.log(remoteStream);
                playVideo(remoteStream, 'friendStream');
            });

            call.on('close', function () {
                alert('disconnect');
            });
        });
    }

    peer.on('call', function (call) {

        openStream(function (stream) {
            playVideo(stream, 'localStream');

            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function (remoteStream) {
                console.log(remoteStream);
                playVideo(remoteStream, 'friendStream');
            });

            call.on('close', function () {
                alert('disconnect');
            });
        });
    });

});


