const socket = io();
tippy('#microphone-btn', {
    content: "Turn off microphone",
    arrow: false,
});
tippy('#camera-btn', {
    content: "Turn off video",
    arrow: false,
});
tippy('#message-btn', {
    content: "Message",
    arrow: false,
});
tippy('#screen-btn', {
    content: "Share screen",
    arrow: false

});
tippy('#record-btn', {
    content: "Record",
    arrow: false

});
tippy('#call-btn', {
    content: "Leave call",
    arrow: false
});

let mesgflag = true;
const mesgICon = document.getElementById('Mesg');
const video_div = document.getElementById('video-div');
const video_container = document.getElementById('video-container');
const video_container2 = document.getElementById('video-container2');

document.getElementById('message-btn').addEventListener('click', () => {
    if (mesgflag) {
        mesgICon.classList.remove('bi-chat-left-text');
        mesgICon.classList.add('bi-chat-left-text-fill');
        mesgflag = false;
    } else {
        mesgICon.classList.remove('bi-chat-left-text-fill');
        mesgICon.classList.add('bi-chat-left-text');
        mesgflag = true;
    };
});

document.querySelector('.btn-close').addEventListener('click', () => {
    mesgICon.classList.remove('bi-chat-left-text-fill');
    mesgICon.classList.add('bi-chat-left-text');
    mesgflag = true;
});

let recordflag = true;
const recordICon = document.getElementById('Record');

document.getElementById('record-btn').addEventListener('click', () => {
    if (recordflag) {
        recordICon.classList.remove('bi-record-btn');
        recordICon.classList.add('bi-record-btn-fill');
        recordflag = false;
    }
    else {
        recordICon.classList.remove('bi-record-btn-fill');
        recordICon.classList.add('bi-record-btn');
        recordflag = true;
    };
});

const localVideo = document.getElementById('video-container2');
const remoteVideo = document.getElementById('video-container');
let userStream;
let rtcPeerConnection;

navigator.mediaDevices.getUserMedia({
    video: {
        width: 1280,
        height: 720,
    },
    audio: true,
}).then(stream => {
    userStream = stream;
    localVideo.srcObject = stream;
    localVideo.play();

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: "stun:stun.services.mozilla.com" }
        ],
    };
    const peerConnection = new RTCPeerConnection(iceServers);
    rtcPeerConnection = peerConnection;
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    socket.on('offer', offer => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        peerConnection.createAnswer()
            .then(answer => peerConnection.setLocalDescription(answer))
            .then(() => {
                socket.emit('answer', peerConnection.localDescription);
            });
    });
    socket.on('answer', answer => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', iceCandidate => {
        peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
    });

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit('new-ice-candidate', event.candidate);
        }
    };

    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.play();
    };

    peerConnection.createOffer()
        .then(offer => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit('offer', peerConnection.localDescription);
        });

}).catch(error => {
    console.error('Error accessing media devices:', error);
});

let micFlag = true;
const micIcon = document.getElementById('Mic');

document.getElementById('microphone-btn').addEventListener('click', () => {
    const tippyTooltip = document.querySelector('.tippy-content');

    if (micFlag) {
        userStream.getTracks()[0].enabled = false;
        micIcon.classList.remove('bi-mic-fill');
        micIcon.classList.add('bi-mic-mute-fill');
        document.getElementById('microphone-btn').classList.add('bg-danger');
        if (tippyTooltip) {
            tippyTooltip.innerHTML = "Turn on microphone";
        }
        micFlag = false;
    } else {
        userStream.getTracks()[0].enabled = true;
        micIcon.classList.remove('bi-mic-mute-fill');
        document.getElementById('microphone-btn').classList.remove('bg-danger');
        micIcon.classList.add('bi-mic-fill');
        if (tippyTooltip) {
            tippyTooltip.innerHTML = "Turn off microphone";
        }
        micFlag = true;
    }
});

let videoFlag = true;
const videoIcon = document.getElementById('Video');

document.getElementById('camera-btn').addEventListener('click', () => {
    const tippyTooltip = document.querySelector('.tippy-content');

    if (videoFlag) {
        userStream.getTracks()[1].enabled = false;
        videoIcon.classList.remove('bi-camera-video');
        videoIcon.classList.add('bi-camera-video-off');
        document.getElementById('camera-btn').classList.add('bg-danger');
        if (tippyTooltip) {
            tippyTooltip.innerHTML = "Turn on video";
        }
        videoFlag = false;
    } else {
        userStream.getTracks()[1].enabled = true;
        videoIcon.classList.remove('bi-camera-video-off');
        document.getElementById('camera-btn').classList.remove('bg-danger')
        videoIcon.classList.add('bi-camera-video');
        if (tippyTooltip) {
            tippyTooltip.innerHTML = "Turn off video";
        }
        videoFlag = true;
    }
});

let screenflag = true;
const screenICon = document.getElementById('Screen');

document.getElementById('screen-btn').addEventListener('click', async() => {
    if (screenflag) {
        screenICon.classList.remove('bi-display');
        screenICon.classList.add('bi-display-fill');
        screenflag = false;

        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        remoteVideo.srcObject = stream;

        stream.getVideoTracks()[0].onended = async() => {
            remoteVideo.srcObject = userStream;

            rtcPeerConnection.getSenders().forEach(sender => {
                const track = sender.track;
                if (track && track.kind === 'video') {
                    rtcPeerConnection.removeTrack(sender);
                }
            });
            userStream.getVideoTracks().forEach(videoTrack => {
                rtcPeerConnection.addTrack(videoTrack, userStream);
            });
            const offer = await rtcPeerConnection.createOffer();
            await rtcPeerConnection.setLocalDescription(offer);

            socket.emit('screenOffer', offer);
        };
        const offer = await createOffer(stream);
        socket.emit('screenOffer', offer);
    }
    else {
        screenICon.classList.remove('bi-display-fill');
        screenICon.classList.add('bi-display');
        screenflag = true;
    };
});

async function createOffer(stream) {
    stream.getTracks().forEach(track => rtcPeerConnection.addTrack(track, stream));

    const offer = await rtcPeerConnection.createOffer();
    await rtcPeerConnection.setLocalDescription(offer);

    return offer;
};

socket.on('screenOffer', async(offer)=>{
    rtcPeerConnection.setRemoteDescription(offer);

    const answer = await rtcPeerConnection.createAnswer();
    await rtcPeerConnection.setLocalDescription(answer);

    socket.emit('answer', answer);

    rtcPeerConnection.ontrack = OnTrackFunction;
    rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
});