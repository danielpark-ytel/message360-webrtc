'use strict';
/* Controllers */
var videoQuality = [];
var videoQualitySource = [
    {id: 'qvga', label: 'QVGA 320x240', width: 320, height: 240},
    {id: 'vga', label: 'VGA 640x480', width: 640, height: 480},
    {id: 'qvga_wide', label: 'QVGA WIDE 320x180', width: 320, height: 180},
    {id: 'vga_wide', label: 'VGA WIDE 640x360', width: 640, height: 360},
    {id: 'hd', label: 'HD 1280x720', width: 1280, height: 720},
    {id: 'hhd', label: 'HHD 1920x1080', width: 1920, height: 1080}
];
var videoResolution = {
    qvga: {width: 320, height: 240},
    vga: {width: 640, height: 480},
    qvga_wide: {width: 320, height: 180},
    vga_wide: {width: 640, height: 360},
    hd: {width: 1280, height: 720},
    hhd: {width: 1920, height: 1080}
};
var bandwidth = [
    {id: '250', label: '250kb'},
    {id: '500', label: '500kb'},
    {id: '1024', label: '1mb'},
    {id: '1536', label: '1.5mb'},
    {id: '2048', label: '2mb'},
    {id: '3196', label: '3mb'},
    {id: '4192', label: '4mb'},
    {id: '5120', label: '5mb'},
    {id: '0', label: 'No Limit'},
    {id: 'default', label: 'Server Default'}
];
var framerate = [
    {id: '15', label: '15 FPS'},
    {id: '20', label: '20 FPS'},
    {id: '30', label: '30 FPS'}
];

var vertoService = angular.module('vertoService', []);

vertoService.service('verto', ['$rootScope', '$state', 'storage', '$location', function ($rootScope, $state, storage, $location) {
    var data = {
        // Connection data.
        instance: null,
        connected: false, // Call data.
        call: null,
        shareCall: null,
        callState: null,
        conf: null,
        confLayouts: [],
        confRole: null,
        chattingWith: null,
        liveArray: null, // Settings data.
        videoDevices: [],
        audioDevices: [],
        shareDevices: [],
        speakerDevices: [],
        videoQuality: [],
        extension: null,
        name: storage.data.name || null,
        cid: storage.data.cid || null,
        textTo: null,
        login: null,
        passwd: null,
        hostname: "message360.com",
        wsURL: "wss://id953la.message360.com:8082"
    };

    function cleanCall() {
        data.call = null;
        data.callState = null;
        data.conf = null;
        data.confLayouts = [];
        data.confRole = null;
        data.chattingWith = null;
        $rootScope.$emit('call.hangup', 'hangup');
    }

    function inCall() {
        $rootScope.$emit('page.incall', 'call');
    }

    function callActive(last_state, params) {
        $rootScope.$emit('call.active', last_state, params);
    }

    function calling() {
        $rootScope.$emit('call.calling', 'calling');
    }

    function incomingCall(number) {
        $rootScope.$emit('call.incoming', number);
    }

    function updateResolutions(supportedResolutions) {
        console.debug('Attempting to sync supported and available resolutions');
        //var removed = 0;
        console.debug("VQ length: " + videoQualitySource.length);
        console.debug(supportedResolutions);
        angular.forEach(videoQualitySource, function (resolution, id) {
            angular.forEach(supportedResolutions, function (res) {
                var width = res[0];
                var height = res[1];
                if (resolution.width == width && resolution.height == height) {
                    videoQuality.push(resolution);
                }
            });
        });
        // videoQuality.length = videoQuality.length - removed;
        console.debug("VQ length 2: " + videoQuality.length);
        data.videoQuality = videoQuality;
        console.debug(videoQuality);
        data.vidQual = (videoQuality.length > 0) ? videoQuality[videoQuality.length - 1].id : null;
        console.debug(data.vidQual);
        return videoQuality;
    }

    var callState = {
        muteMic: false,
        muteVideo: false
    };
    return {
        data: data,
        callState: callState, // Options to compose the interface.
        videoQuality: videoQuality,
        videoResolution: videoResolution,
        bandwidth: bandwidth,
        framerate: framerate,
        refreshDevicesCallback: function refreshDevicesCallback(callback) {
            data.videoDevices = [
                {id: 'none', label: 'No Camera'}
            ];
            data.shareDevices = [
                {id: 'screen', label: 'Screen'}
            ];
            data.audioDevices = [];
            data.speakerDevices = [];
            if (!storage.data.selectedShare) {
                storage.data.selectedShare = data.shareDevices[0]['id'];
            }
            for (var i in jQuery.verto.videoDevices) {
                var device = jQuery.verto.videoDevices[i];
                if (!device.label) {
                    data.videoDevices.push({id: 'Camera ' + i, label: 'Camera ' + i});
                }
                else {
                    data.videoDevices.push({id: device.id, label: device.label || device.id});
                }
                // Selecting the first source.
                if (i == 0 && !storage.data.selectedVideo) {
                    storage.data.selectedVideo = device.id;
                    storage.data.selectedVideoLabel = device.label;
                }
                if (!device.label) {
                    data.shareDevices.push(
                        {id: 'Share Device ' + i, label: 'Share Device ' + i});
                    continue;
                }
                data.shareDevices.push({id: device.id, label: device.label || device.id});
            }
            for (var i in jQuery.verto.audioInDevices) {
                var device = jQuery.verto.audioInDevices[i];
                // Selecting the first source.
                if (i == 0 && !storage.data.selectedAudio) {
                    storage.data.selectedAudio = device.id;
                    storage.data.selectedAudioLabel = device.label;
                }
                if (!device.label) {
                    data.audioDevices.push({id: 'Microphone ' + i, label: 'Microphone ' + i});
                    continue;
                }
                data.audioDevices.push({id: device.id, label: device.label || device.id});
            }
            for (var i in jQuery.verto.audioOutDevices) {
                var device = jQuery.verto.audioOutDevices[i];
                // Selecting the first source.
                if (i == 0 && !storage.data.selectedSpeaker) {
                    storage.data.selectedSpeaker = device.id;
                    storage.data.selectedSpeakerLabel = device.label;
                }
                if (!device.label) {
                    data.speakerDevices.push({id: 'Speaker ' + i, label: 'Speaker ' + i});
                    continue;
                }
                data.speakerDevices.push({id: device.id, label: device.label || device.id});
            }
            console.debug('Devices were refreshed, checking that we have cameras.');
            // Verify if selected devices are valid
            var videoFlag = data.videoDevices.some(function (device) {
                return device.id == storage.data.selectedVideo;
            });
            var shareFlag = data.shareDevices.some(function (device) {
                return device.id == storage.data.selectedShare;
            });
            var audioFlag = data.audioDevices.some(function (device) {
                return device.id == storage.data.selectedAudio;
            });
            var speakerFlag = data.speakerDevices.some(function (device) {
                return device.id == storage.data.selectedSpeaker;
            });
            if (!videoFlag) storage.data.selectedVideo = data.videoDevices[0].id;
            if (!shareFlag) storage.data.selectedShare = data.shareDevices[0].id;
            if (!audioFlag) storage.data.selectedAudio = data.audioDevices[0].id;
            if (!speakerFlag && data.speakerDevices.length > 0) storage.data.selectedSpeaker = data.speakerDevices[0].id;
            // This means that we cannot use video!
            if (data.videoDevices.length === 0) {
                console.log('No camera, disabling video.');
                data.canVideo = false;
                data.videoDevices.push({id: 'none', label: 'No camera'});
            }
            else {
                data.canVideo = true;
            }
            if (angular.isFunction(callback)) {
                callback();
            }
        },

        refreshDevices: function (callback) {
            console.debug('Attempting to refresh the devices.');
            if (callback) {
                jQuery.verto.refreshDevices(callback);
            }
            else {
                jQuery.verto.refreshDevices(this.refreshDevicesCallback);
            }
        },

        /**
         * Updates the video resolutions based on settings.
         */
        refreshVideoResolution: function (resolutions) {
            console.debug('Attempting to refresh video resolutions.');
            if (data.instance) {
                var w = resolutions['bestResSupported'][0];
                var h = resolutions['bestResSupported'][1];
                if (h === 1080) {
                    w = 1280;
                    h = 720;
                }
                updateResolutions(resolutions['validRes']);
                data.instance.videoParams({
                    minWidth: w
                    , minHeight: h
                    , maxWidth: w
                    , maxHeight: h
                    , minFrameRate: 15
                    , vertoBestFrameRate: storage.data.bestFrameRate
                });
                videoQuality.forEach(function (qual) {
                    if (w === qual.width && h === qual.height) {
                        if (storage.data.vidQual !== qual.id || storage.data.vidQual === undefined) {
                            storage.data.vidQual = qual.id;
                        }
                    }
                });
            }
            else {
                console.debug('There is no instance of verto.');
            }
        },

        /**
         * Connects to the verto server. Automatically calls `onWSLogin`
         * callback set in the verto object.
         *
         * @param callback
         */
        connect: function (callback) {
            console.debug('Attempting to connect to verto.');
            var that = this;
            var callbacks = {
                onWSLogin: function (v, success) {
                    data.connected = success;
                    $rootScope.$emit('ws.login', success);
                    console.debug('Connected to verto server:', success);
                    if (angular.isFunction(callback)) {
                        callback(v, success);
                    }
                },
                onDialogState: function (d) {
                    if (!data.call) {
                        data.call = d;
                    }
                    console.debug('onDialogState:', d);
                    console.debug(storage.data.calling);
                    console.log(data.callState);
                    switch (d.state.name) {
                        case "ringing":
                            incomingCall(d.params.caller_id_number);
                            break;
                        case "trying":
                            console.debug('Calling:', d.cidString());
                            data.callState = 'trying';
                            break;
                        case "early":
                            calling();
                            console.debug('Talking to:', d.cidString());
                            data.callState = 'early';
                            break;
                        case "active":
                            console.debug('Talking to:', d.cidString());
                            data.callState = 'active';
                            callActive(d.lastState.name, d.params);
                            break;
                        case "hangup":
                            console.debug('Call ended with cause: ' + d.cause);
                            data.callState = 'hangup';
                            break;
                        case "destroy":
                            console.debug('Destroying: ' + d.cause);
                            cleanCall();
                            break;
                        default:
                            console.warn('Got a not implemented state:', d.state);
                            break;
                        case "requesting":
                            console.log(d);
                            data.callState = "requesting";
                            console.debug("Requesting: ");
                            break;
                    }
                },
                onWSClose: function (v, success) {
                    console.debug('onWSClose:', success);
                    $rootScope.$emit('ws.close', success);
                },
                onEvent: function (v, e) {
                    console.log(data.instance.handleMessage);
                }
            };

            var that = this;

            function ourBootstrap() {
                //Generating sessid
                var sessid = $location.search().sessid;
                if (sessid === 'random') {
                    sessid = $.verto.genUUID();
                    $location.search().sessid = sessid;
                }
                // Checking if we have a failed connection attempt before
                // connecting again.
                if (data.instance && !data.instance.rpcClient.socketReady()) {
                    clearTimeout(data.instance.rpcClient.to);
                    data.instance.logout();
                    data.instance.login();
                    return;
                }
                data.instance = new jQuery.verto({
                    login: data.login + '@' + data.hostname,
                    passwd: data.passwd,
                    socketUrl: data.wsURL,
                    tag: "webcam",
                    ringFile: "sounds/bellring.wav",
                    userVariables: {name: data.name},
                    audioParams: {
                        googEchoCancellation: storage.data.googEchoCancellation || true,
                        googNoiseSuppression: storage.data.googNoiseSuppression || true,
                        googHighpassFilter: storage.data.googHighpassFilter || true
                    },
                    sessid: sessid,
                    iceServers: storage.data.useSTUN
                }, callbacks);
                // We need to know when user reloaded page and not react to
                // verto events in order to not stop the reload and redirect user back
                // to the dialpad.
                that.reloaded = false;
                jQuery.verto.unloadJobs.push(function () {
                    that.reloaded = true;
                });
                data.instance.deviceParams({
                    useCamera: storage.data.selectedVideo,
                    useSpeak: storage.data.selectedSpeaker,
                    useMic: storage.data.selectedAudio,
                    onResCheck: that.refreshVideoResolution
                });
            }

            if (data.mediaPerm) {
                ourBootstrap();
            } else {
                $.FSRTC.checkPerms(ourBootstrap, true, true);
            }
        },

        mediaPerm: function (callback) {
            $.FSRTC.checkPerms(callback, true, true);
        },

        /**
         * Login the client.
         *
         * @param callback
         */
        login: function (callback) {
            data.instance.loginData({
                login: data.login + '@' + data.hostname,
                passwd: data.password
            });
            data.instance.login();
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Disconnects from the verto server. Automatically calls `onWSClose`
         * callback set in the verto object.
         *
         * @param callback
         */
        disconnect: function (callback) {
            console.debug('Attempting to disconnect to verto.');
            data.instance.logout();
            data.connected = false;
            console.debug('Disconnected from verto server.');
            if (angular.isFunction(callback)) {
                callback(data.instance, data.connected);
            }
        },

        /**
         * Make a call.
         *
         * @param callback
         */
        call: function (destination, callback, custom) {
            console.debug('Attempting to call destination ' + destination + '.');
            var call = data.instance.newCall(angular.extend({
                destination_number: destination,
                caller_id_name: storage.data.cid_number,
                caller_id_number: storage.data.cid_number,
                outgoingBandwidth: storage.data.outgoingBandwidth,
                incomingBandwidth: storage.data.incomingBandwidth,
                useVideo: storage.data.useVideo,
                useStereo: storage.data.useStereo,
                useCamera: storage.data.selectedVideo,
                useSpeak: storage.data.selectedSpeaker,
                useMic: storage.data.selectedAudio,
                dedEnc: storage.data.useDedenc,
                mirrorInput: storage.data.mirrorInput,
                userVariables: {name: storage.data.name}
            }, custom));
            data.call = call;
            data.mutedMic = false;
            data.mutedVideo = false;
            this.refreshDevices();
            if (angular.isFunction(callback)) {
                callback(data.instance, call);
            }
        },

        /**
         * Hangup the current call.
         *
         * @param callback
         */
        hangup: function (callback) {
            console.debug('Attempting to hangup the current call.');
            if (!data.call) {
                console.debug('There is no call to hangup.');
                return false;
            }
            data.call.hangup();
            if (data.conf) {
                data.conf.destroy();
                data.conf = null;
            }
            console.debug('Message: Call was hung up.');
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Send a DTMF to the current call.
         *
         * @param {string|integer} number
         * @param callback
         */
        makeCall: function (number, callback) {
            console.debug('Attempting to make a call to "' + number + '".');
            if (!data.call) {
                console.debug('There is no number to send.');
                return false;
            }
            data.call.makeCall(number);
            console.debug('The request was sent for the call.');
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Send a DTMF to the current call
         *
         * @param{string|integer} number
         * @param callback
         */
        dtmf: function (number, callback) {
            console.debug("DTMF: " + number);
            if (!data.call) {
                console.debug("No call to send the number to");
                return false;
            }
            data.call.dtmf(number);
            console.debug("The DTMF was sent for the call");
            if (angular.isFunction(callback)) {
                callback(data, instance);
            }
        },

        /**
         * Mute the microphone for the current call.
         *
         * @param callback
         */
        muteMic: function (callback) {
            if (!data.call) {
                return false;
            }
            console.debug("Toggling mute for the call.");
            data.call.setMute('toggle');
            data.mutedMic = !data.mutedMic;
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        },

        /**
         * Mute the video for the current call.
         *
         * @param callback
         */
        muteVideo: function (callback) {
            console.debug('Attempting to mute video for the current call.');
            if (!data.call) {
                console.debug('There is no call to mute.');
                return false;
            }
            data.call.dtmf('*0');
            data.mutedVideo = !data.mutedVideo;
            console.debug('The video was muted for the call.');
            if (angular.isFunction(callback)) {
                callback(data.instance, true);
            }
        }

    }
}]);