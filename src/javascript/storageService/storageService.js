'use strict';

 angular.module("storageService").service('storage', ['$rootScope', '$localStorage',
 function($rootScope, $localStorage) {
     //Declare the storage data and then the default settings we're going to use in the application.
     var data = $localStorage, defaultSettings = {
         ui_connected : false,
         ws_connected : false,
         cur_call : 0,
         called_number : '',
         useVideo : true,
         call_history : {},
         history_control : [],
         call_start : false,
         name : null,
         email : null,
         login : "",
         accessToken : "",
         cid_number : null,
         userStatus : 'disconnected',
         mutedVideo : true,
         mutedMic : false,
         preview : true,
         selectedVideo : null,
         selectedAudio : null,
         selectedShare : null,
         selectedSpeaker : null,
         useStereo : true,
         useSTUN : true,
         useDedenc : false,
         mirrorInput : false,
         outgoingBandwidth : 'default',
         incomingBandwidth : 'default',
         vidQual : undefined,
         askRecoverCall : false,
         googNoiseSuppression : true,
         googHighpassFilter : true,
         googEchoCancellation : true,
         autoBand : true,
         testSpeedJoin : true,
         bestFrameRate : "30",
         language : undefined,
         wsURL : "wss://id953la.ytel.com:8082",
         numOfCalls : 0
     };

     data.$default(defaultSettings);

     function changeData(verto_data) {
         jQuery.extend(true, data, verto_data);
     }

     return {
         data : data,
         changeData : changeData,
         reset : function () {
             data.ui_connected = false;
             data.ws_connected = false;
             data.cur_call = 0;
             data.userStatus = 'disconnected';
         },
         factoryReset : function () {
             $localStorage.clear();
             //Reset back to default settings
             data.$reset(defaultSettings);
         }
     }
 }]);