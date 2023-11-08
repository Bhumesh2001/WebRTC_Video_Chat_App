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

let micFlag = true;
const micIcon = document.getElementById('Mic');

document.getElementById('microphone-btn').addEventListener('click', () => {
    const tippyTooltip = document.querySelector('.tippy-content');

    if (micFlag) {
        micIcon.classList.remove('bi-mic-fill');
        micIcon.classList.add('bi-mic-mute-fill');
        document.getElementById('microphone-btn').classList.add('bg-danger');
        if (tippyTooltip) {
            tippyTooltip.innerHTML = "Turn on microphone";
        }
        micFlag = false;
    } else {
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
        videoIcon.classList.remove('bi-camera-video');
        videoIcon.classList.add('bi-camera-video-off');
        document.getElementById('camera-btn').classList.add('bg-danger');
        if (tippyTooltip) {
            tippyTooltip.innerHTML = "Turn on video";
        }

        videoFlag = false;
    } else {
        videoIcon.classList.remove('bi-camera-video-off');
        document.getElementById('camera-btn').classList.remove('bg-danger')
        videoIcon.classList.add('bi-camera-video');
        if (tippyTooltip) {
            tippyTooltip.innerHTML = "Turn off video";
        }

        videoFlag = true;
    }
});


let mesgflag = true;
const mesgICon = document.getElementById('Mesg');
const video_div = document.getElementById('video-div');
const video_container = document.getElementById('video-container');
const video_container2 = document.getElementById('video-container2');

document.getElementById('message-btn').addEventListener('click',()=>{
    if(mesgflag){
        mesgICon.classList.remove('bi-chat-left-text');
        mesgICon.classList.add('bi-chat-left-text-fill');
        mesgflag = false;
    }else{
        mesgICon.classList.remove('bi-chat-left-text-fill');
        mesgICon.classList.add('bi-chat-left-text');
        mesgflag = true;
    };
});

document.querySelector('.btn-close').addEventListener('click',()=>{
    mesgICon.classList.remove('bi-chat-left-text-fill');
    mesgICon.classList.add('bi-chat-left-text');
    mesgflag = true;
});


let screenflag = true;
const screenICon = document.getElementById('Screen');

document.getElementById('screen-btn').addEventListener('click',()=>{
    if(screenflag){
        screenICon.classList.remove('bi-display');
        screenICon.classList.add('bi-display-fill');
        screenflag = false;
    }
    else{
        screenICon.classList.remove('bi-display-fill');
        screenICon.classList.add('bi-display');
        screenflag = true;
    };
});


let recordflag = true;
const recordICon = document.getElementById('Record');

document.getElementById('record-btn').addEventListener('click',()=>{
    if(recordflag){
        recordICon.classList.remove('bi-record-btn');
        recordICon.classList.add('bi-record-btn-fill');
        recordflag = false;
    }
    else{
        recordICon.classList.remove('bi-record-btn-fill');
        recordICon.classList.add('bi-record-btn');
        recordflag = true;
    };
});
