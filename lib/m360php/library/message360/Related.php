<?php
 namespace Message360API\Lib;
/**
 * @author Afzal Patel <afzal@ytel.co.in>
 * @version V2
 */
abstract class Message360_Related {

    /** Wrapper to return Message360 response as JSON */
    CONST WRAPPER_JSON = 'json';

    /** Wrapper to return Message360 response as XML */
    CONST WRAPPER_XML = 'xml';

    /** BASE Message360 URI */
    CONST API_URL = 'https://webrtc-api.message360.com/api/v2/';

    /** BASE Message360 API VERSION */
    CONST API_VERSION = 'v2';
    CONST API_START_COMPONENT = 'Accounts';

    protected $_availableVersions = array('2016-07-01', 'v2');
    protected static $_options = array(
        'account_sid' => null,
        'auth_token' => null,
        'wrapper_type' => self::WRAPPER_JSON,
        'response_to_array' => false,
        'api_version' => self::API_VERSION
    );

    /**
     * All existing and available Message360 components that can be accessed by
     * this wrapper
     *
     * @var array
     */
    private $_components = array(
        /*Account Module*/
        'viewaccount' => 'viewaccount',
        /*Usages Module*/
        'listUsage' => 'listUsage',
        /*Email v1b Module*/
        'sendEmails' => 'sendEmails',
        'listBlockEmail' => 'listBlockEmail',
        'listBounceEmail' => 'listBounceEmail',
        'listSpamEmail' => 'listSpamEmail',
        'listInvalidEmail' => 'listInvalidEmail',
        'listUnsubscribedEmail' => 'listUnsubscribedEmail',
        'deleteBlocksEmail' => 'deleteBlocksEmail',
        'deleteBouncesEmail' => 'deleteBouncesEmail',
        'deleteSpamEmail' => 'deleteSpamEmail',
        'deleteInvalidEmail' => 'deleteInvalidEmail',
        'deleteUnsubscribedEmail' => 'deleteUnsubscribedEmail',
        'addUnsubscribesEmail' => 'addUnsubscribesEmail',
         /*SMS v1b Module*/
          'sendsms' => 'sendsms',
         'listsms' => 'listsms',
         'viewsms' => 'viewsms',
         'getinboundsms' => 'getinboundsms',
         'numberoptin' => 'numberoptin',

    	/*Incoming Phone Number v1b Module*/
    	'viewNumber'=>'viewNumber',
    	'updateNumber'=>'updateNumber',
    	'listNumber' => 'listNumber',
    	'buyNumber' => 'buyNumber',
    	'releaseNumber' => 'releaseNumber',
	/*Conference v1b Module*/
       'viewConference'=>'viewConference',
       'viewParticipant'=>'viewParticipant',
       'addParticipant'=>'addParticipant',
       'listParticipant'=>'listParticipant',
       'listConference'=>'listConference',
       'hangupParticipant'=>'hangupParticipant',
       'deafMuteParticipant'=>'deafMuteParticipant',
       'playAudio'=>'playAudio',

		/*Recording v1b Module*/
		'viewRecording' => 'viewRecording',
        'listRecording' => 'listRecording',
        'deleteRecording' => 'deleteRecording',

        'TranscribeAudioUrlAPI' => 'TranscribeAudioUrlAPI',
        'ListAvailableNumbersAPI' => 'ListAvailableNumbersAPI',
        'createIncomingPhoneNumberAPI' => 'createIncomingPhoneNumberAPI',
        'makeCall' => 'makeCall',
        'listCalls' => 'listcalls',
        'viewCalls' => 'viewcalls',
        'interruptCalls' => 'interruptcalls',
        'sendDigits' => 'sendDigits',
        'playAudios' => 'playAudios',
        'voiceEffect' => 'voiceEffect',
        'recordCalls' => 'recordCalls',
        'viewApplicationAPI' => 'viewApplicationAPI',
        'createApplicationAPI' => 'createApplicationAPI',
        'listApplicationAPI' => 'listApplicationAPI',
        'updateApplicationAPI' => 'updateApplicationAPI',
        'deleteApplicationAPI' => 'deleteApplicationAPI',
        'ViewRecordingAPI' => 'ViewRecordingAPI',
        'DeleteRecordingAPI' => 'DeleteRecordingAPI',
        'ListRecordingAPI' => 'ListRecordingAPI',
        'ListAvailableNumbersAPI' => 'ListAvailableNumbersAPI',
        'ViewIncomingPhoneNumbersAPI' => 'ViewIncomingPhoneNumbersAPI',
        'deleteIncomingPhoneNumberAPI' => 'deleteIncomingPhoneNumberAPI',
        'ListIncomingPhoneNumbersAPI' => 'ListIncomingPhoneNumbersAPI',
        'updateIncomingPhoneNumberAPI'=>'updateIncomingPhoneNumberAPI',

        /*Email v1 Module*/
        'sendemailapi' => 'sendemailapi',
        'listbounceemailapi' => 'listbounceemailapi',
        'listspamemailapi' => 'listspamemailapi',
        'listblockemailapi' => 'listblockemailapi',
        'listinvalidemailapi' => 'listinvalidemailapi',
        'listunsubscribeemailapi' => 'listunsubscribeemailapi',
        'deleteblockemailapi' => 'deleteblockemailapi',
        'deletebouncedemailapi' => 'deletebouncedemailapi',
        'deletespamemailapi' => 'deletespamemailapi',
        'deleteinvalideemailapi' => 'deleteinvalideemailapi',
        'deleteunsubscribeemailapi' => 'deleteunsubscribeemailapi',
        'addunsubscribeapi' => 'addunsubscribeapi',

		/*SMS v1 Module*/
        'sendSMSMsg' => 'sendSMSMsg',
        'viewSMS' => 'viewSMS',
        'listSMS' => 'listSMS',
        'getInboundSMS' => 'getInboundSMS',

/*Incoming Phone Number*/
	'viewNumber'=>'viewNumber',
	'updateNumber'=>'updateNumber',

        'viewCampaign' => 'viewCampaign',
        'listCampaign' => 'listCampaign',
        'createCampaign' => 'createCampaign',
        'updateCampaign' => 'updateCampaign',
        'deleteCampaign' => 'deleteCampaign',
        'viewTranscriptionAPI' => 'viewTranscriptionAPI',
        'listTranscriptionAPI' => 'listTranscriptionAPI',
        'TranscribeAudioUrlAPI' => 'TranscribeAudioUrlAPI',
        'TranscribeRecordingAPI' => 'TranscribeRecordingAPI',
        'viewConferenceAPI' => 'viewConferenceAPI',
        'listConferenceAPI' => 'listConferenceAPI',
        'ViewParticipantAPI' => 'ViewParticipantAPI',
        'listParticipantAPI' => 'listParticipantAPI',
        'DeafMuteParticipantAPI' => 'DeafMuteParticipantAPI',
        'hangupParticipantAPI' => 'hangupParticipantAPI',
        'playAudioAPI' => 'playAudioAPI',
        'viewNotificationAPI' => 'viewNotificationAPI',
        'listNotificationAPI' => 'listNotificationAPI',
        /* Direct Mail */
        'Create' => 'Create',
        'View' => 'View',
        'Lists' => 'Lists',
        'Delete' => 'Delete',
        'Verify' => 'Verify',
        'create' => 'create',
        'view' => 'view',
        'lists' => 'lists',
        'delete' => 'delete',
        'verify' => 'verify',
        'listDestinationsAPIS' => 'listDestinationsAPIS',
        'authorizeDestinationAPIS' => 'authorizeDestinationAPIS',
        'whiteListDestinationAPIS' => 'whiteListDestinationAPIS',
        'blockAPIS' => 'blockAPIS',
        'extentAuthorizeAPIS' => 'extentAuthorizeAPIS',

		/*Carrier*/
		'lookup'=>'lookup',
		'lookuplist'=>'lookuplist',
		 /*Transcription*/
        'viewTranscription' => 'viewTranscription',
        'listTranscription' => 'listTranscription',
        'audioUrlTranscription' => 'audioUrlTranscription',
        'recordingTranscription' => 'recordingTranscription',

        /*numbers*/
        'availableNumber' => 'availableNumber',
        'viewNumber' => 'viewNumber',
        'buyNumber' => 'buyNumber',
        'updateNumber' => 'updateNumber',
        'ajaxPurchaseNumber' => 'ajaxPurchaseNumber',
        'checkSmsNumber' => 'checkSmsNumber',

        /*Freeswitch Module*/
        'createToken' => 'createToken',
        'authenticateNumber' => 'authenticateNumber'
    );

    /**
     * Current component key which will be passed out to the Connector class
     * when the time comes
     *
     * @var string|null
     */
    private $_component = null;

    /**
     * Client token. When generated, it will be "saved" here
     *
     * @var array
     */
    protected $_clientToken = array();

    /**
     * Generated headers (credentials) which came from successful authorisation
     *
     * @var array
     */
    protected static $_connectHeaders = array();

    /**     * ********** OPTION RELATED METHODS ************** * */

    /**
     * Set a list of options all at once.
     *
     * @param  array $options
     * @return void
     */
    function setOptions(Array $options) {
        foreach ($options as $key => $value)
            $this->setOption($key, $value);
    }

    /**
     * Set a single option for the Message360 wrapper. If option key doesn't exist it will
     * throw that the key itself is not available and therefore cannot be found.
     *
     * @param  string $key
     * @param  mixed  $value
     * @throws \Message360_Exception
     * @return void
     */
    function setOption($key, $value) {
        if (!array_key_exists(strtolower($key), self::$_options)) {
            throw new \Message360_Exception("Provided option '{$key}' cannot be found");
        }
        self::$_options[strtolower($key)] = $value;
    }

     /**
     * Once the the account_sid and auth_token are set using the setOption method.
     * This will fire a request to Message360 in order to validate the account and return
     * an access token for WebRTC usage.
      * @param String $component
      * @param String $action
     * @return String $token
     */
    function createToken($component, $action) {
        $data = array(
            "account_sid" => $this->option('account_sid'),
            "auth_token" => $this->option('auth_token')
        );
        $creation_url = rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $data), '/') . '.' . self::WRAPPER_JSON;
        $post_params = $this->_buildPostParameters($action,$data);
        return new Message360_Connector($this->_execute($creation_url, 'POST', $post_params), $this->option('response_to_array'), $this->_component);
    }

    /**
     * Authenticate phone number for WebRTC usage.
     *
     * @param String $component
     * @param String $action
     * @param Array $data
     * @return String $status_code
     */
    function authenticateNumber($component, $action, Array $data) {
        $phone_number = $data['phone_number'];
        $account_sid = $this->option('account_sid');
        $data = array(
            "account_sid" => $account_sid,
            "phone_number" => $phone_number
        );
        $creation_url = rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $data), '/') . '.' . self::WRAPPER_JSON;
        $post_params = $this->_buildPostParameters($action,$data);
        return new Message360_Connector($this->_execute($creation_url, 'POST', $post_params), $this->option('response_to_array'), $this->_component);
    }

    /**
     * Get singular option value. If value is not set, null will be returned
     *
     * @param  string $key
     * @return mixed
     */
    function option($key) {
        return isset(self::$_options[strtolower($key)]) ? self::$_options[strtolower($key)] : null;
    }

    /**     * ********** QUERY RELATED METHODS ************** * */

    /**
     * Get resource by component and component SID
     *
     * @param  string|array $component
     * @param  array        $parameters
     * @return Message360_Connector
     */
    function get($component, $action, Array $parameters = array()) {
        return new Message360_Connector($this->_execute(
                        rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $parameters), '/')
                        .
                        $this->_buildParameters($parameters)
                ), $this->option('response_to_array'), $this->_component);
    }

    /**
     * POSTING (Creating) new documents for desired resources, such as sending new
     * SMS messages
     *
     * @param  string[] $component
     * @param  array        $data
     * @return Message360_Connector
     */
    function create($component, $action, Array $data) {
        $creation_url = rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $data), '/') . '.' . self::WRAPPER_JSON;
        $post_params = $this->_buildPostParameters($action,$data);
        return new Message360_Connector($this->_execute($creation_url, 'POST', $post_params), $this->option('response_to_array'), $this->_component);
    }

    /**
     * POSTING (Updating) documents for desired resources, such as sending new
     * SMS messages
     *
     * @param  string|array $component
     * @param  array        $data
     * @return Message360_Connector
     */
    function listAll($component, $action, Array $data = array()) {
        $creation_url = rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $data), '/') . '.' . self::WRAPPER_JSON;
        $post_params = $this->_buildPostParameters($action,$data);
        return new Message360_Connector($this->_execute($creation_url, 'POST', $post_params), $this->option('response_to_array'), $this->_component);
    }

    function update($component, $action, Array $data) {
        $creation_url = rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $data), '/') . '.' . self::WRAPPER_JSON;
        $post_params = $this->_buildPostParameters($action,$data);
        return new Message360_Connector($this->_execute($creation_url, 'POST', $post_params), $this->option('response_to_array'), $this->_component);
    }

    function post($component, $action, Array $data = array()) {
        $creation_url = rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $data), '/') . '.' . self::WRAPPER_JSON;

        return new Message360_Connector($this->_execute($creation_url, 'POST', $data), $this->option('response_to_array'), $this->_component);
    }

    /**
     * DELETING resources such as recordings.
     * You cannot add query parameters to this resource and it is very limited (deleting)
     * so please consult REST documentation on the Message360 site.
     *
     * @param  string|array $component
     * @return Message360_Connector
     */
    function delete($component, $action, Array $parameters = array()) {
        return new Message360_Connector($this->_execute(
                        rtrim($this->_buildBaseUrl() . $component . '/' . $this->_buildUrl($action, $parameters), '/')
                        .
                        $this->_buildParameters($parameters)
                ), $this->option('response_to_array'), $this->_component);
    }

    /**     * ********** CLIENT RELATED METHODS ************** * */

    /**
     * Return an instance of the Message360 Client class
     *
     * @return Message360_Client <Message360_Client, self, NULL>
     */
    function getClient()
    {
        return Message360_Client::getInstance();
    }

    /**
     * Return an instance of the Message360 Connect class
     *
     * @return Class <Message360_Connect, self, NULL>
     */
    function getConnect()
    {
        return Message360_Connect::getInstance();
    }

    /**     * ********** INTERNAL METHODS ************** * */

    /**
     * Building base URL of Message360 wrapper. This will set
     * https://{url}/{version}/accounts/account_sid
     * as main and base url.
     *
     * @return string
     * @throws Message360_Exception
     */
    private function _buildBaseUrl()
    {
        //$return_url = self::API_URL . $this->_getBaseVersion() . '/';
        $return_url = self::API_URL;
        if (is_null($this->option('account_sid'))) {
            throw new \Message360_Exception(
                "Please set account_sid option. You need to pass account_sid option as
                auth_token in order to authenticate and/or use Message360 wrapper"
            );
        }
        // $return_url .= self::API_START_COMPONENT . '/' . $this->option('account_sid') . '/';
        return $return_url;
    }

    /**
     * Get base version of the Message360 REST API endpoint.
     *
     * @return string
     * @throws Message360_Exception  If invalid api_version applied
     */
    private function _getBaseVersion() {
        $base_version = strtolower($this->option('api_version'));

        if (!in_array($base_version, $this->_availableVersions)) {
            $base_versions = implode(', ', $this->_availableVersions);
            throw new \Message360_Exception("Defined version '{$base_version}' does not exist. Please use one of following versions: '{$base_versions}'");
        }

        $this->setOption('api_version', $base_version);
        return $this->option('api_version');
    }

    /**
     * This will build URL of Message360 wrapper after the AccountSid with or without
     * possible GET parameters like ?PageSize=20
     *
     * @param  array|string $component
     * @param  array $parameters
     * @return string
     * @throws Message360_Exception
     */
    private function _buildUrl($component, Array $parameters = array()) {
        $return_url = '';

        $this->_component = $component;
        if (!is_null($this->_components[$component]))
            $return_url .= $this->_components[$component] . '/';
        return $return_url;
    }

    /**
     * Building GET query parameters will return blank if there are no parameters
     *
     * @param  array  $parameters
     * @return string
     */
    private function _buildParameters(Array $parameters = array()) {
        $return_params = '';

        if (count($parameters) > 0) {
            $return_params = '/';

            foreach ($parameters as $parameter => $value) {
                if (is_array($value)) {
                    foreach ($value as $subvalue) {
                        $return_params .= $subvalue . '/';
                    }
                } else {
                    $return_params .=$value . '/';
                }
            }

            $return_params = rtrim($return_params, '/');
        }
        // echo $return_params. '.' . self::WRAPPER_JSON
        return $return_params . '.' . self::WRAPPER_JSON;
    }

    /**
     * Building GET query parameters will return blank if there are no parameters
     *
     * @param  array  $parameters
     * @return string
     */
    private function _buildPostParameters($action,Array $parameters = array()) {
        $return_params = '';
       if($action =='sendsms' or $action=='sendEmails')
        {
            return $parameters;
        }
       else
        {
        if (count($parameters) > 0) {

            foreach ($parameters as $parameter => $value) {
                if (is_array($value)) {

                    foreach ($value as $subvalue) {
                        $return_params .= $parameter . '=' . urlencode($subvalue) . '&';
                    }
                } else {
                    $retrun = $this->_startsWith($value, "@");
                    $retrun1 = $this->_startsWith($value, "http");
                    $retrun2 = $this->_findWith($value, "@");
                    if ($retrun || $retrun1 || $retrun2) {
                        $return_params .= $parameter . '=' . $value . '&';
                    } else {
                        $return_params .= $parameter . '=' . $value . '&';
                        //$return_params .= $parameter.'='.urlencode($value).'&';
                    }
                }
            }
            $return_params = rtrim($return_params, '&');
        }

        return $return_params;
       }
    }

    /**
     * @param string $needle
     */
    private function _startsWith($haystack, $needle) {
        // search backwards starting from haystack length characters from the end
        return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
    }

    /**
     * @param string $needle
     */
    private function _findWith($haystack, $needle) {
        // search backwards starting from haystack length characters from the end
        return $needle === "" || strrpos($haystack, $needle) !== FALSE;
    }

    /**
     * Do the actual curl request
     *
     * @param  string  $url
     * @param  string  $type
     * @param  string  $params
     * @return array
     */
    private function _execute($url, $type = 'GET', $params = null) {
        $type = strtoupper($type);
        $account_sid = $this->option('account_sid');
        $auth_token = $this->option('auth_token');
        $response = array();
        $curl_port = 80;
        if (substr($url, 0, 4) == 'http')
            $curl_port = 80;
        if (substr($url, 0, 5) == 'https')
            $curl_port = 443;

        if ($resource = curl_init()) {
            $curl_opts = array(
                CURLOPT_URL => $url,
                CURLOPT_PORT => $curl_port,
                CURLOPT_HEADER => FALSE,
                CURLOPT_RETURNTRANSFER => TRUE,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_SSL_VERIFYPEER => FALSE,
                CURLOPT_USERPWD => "{$account_sid}:{$auth_token}",
            );

            if ($type == 'DELETE') {
                $curl_opts[CURLOPT_CUSTOMREQUEST] = 'DELETE';
            }

            if ($type == 'POST') {
              if(is_array($params))
                {
                 $curl_opts[CURLOPT_POST] = 1;
                $curl_opts[CURLOPT_POSTFIELDS] = $params;

                  }
                else
                {

                $params = explode('&', $params);
                $params12=array();
                foreach ($params as $key => $value) {
                    $params = explode("=", $value);
                    $params1 = $params[0];
                    $params2 = $params[1];
                    $params12[$params1] = $params2;
                }
                $params = $params12;

                $curl_opts[CURLOPT_POST] = 1;
                $curl_opts[CURLOPT_POSTFIELDS] = $params;
            }
           }
            if ($this->getConnect()->getStatus() === true) {
                if (count(self::$_connectHeaders) > 0) {
                    $curl_opts[CURLOPT_HTTPHEADER] = self::$_connectHeaders;
                }
            }


            if (curl_setopt_array($resource, $curl_opts)) {
                $response['exec'] = curl_exec($resource);
                $response['error'] = curl_error($resource);
                $response['errno'] = curl_errno($resource);
                $response['info'] = curl_getinfo($resource);
            }
        }
        return $response;
    }

}
