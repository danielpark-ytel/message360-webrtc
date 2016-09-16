<?php
# First we must import the actual Message360 library
require_once '../../library/message360.php';
# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
# Message360 REST API credentials are required
$Message360 -> setOptions(array(
'account_sid' => 'xxxxxxx',
'auth_token' => 'xxxxxxx',
'response_to_array' => true,
));
try {
# Make Call
$call = $Message360->create('Calls', 'makeCall', array(
'ToCountryCode' => 1, //required
'To' => 'XXXXXXXXXX', //required
'FromCountryCode' => 1, //required
'From' => 'XXXXXXXXXX', //required
'Url' => 'XXXXXX', //required
'Method' => 'XXXXXX', //optional
'StatusCallback' => 'XXXXXX', //optional
'StatusCallbackMethod' => 'XXXXXX', //optional
'FallbackUrl' => 'XXXXXX', //optional
'FallbackMethod' => 'XXXXXX', //optional
'HeartbeatUrl' => 'XXXXXX', //optional
'HeartbeatMethod' => 'XXXXXX', //optional
'Timeout' => 'XXXXXX', //optional
'PlayDtmf' => 'XXXXXX', //optional
'HideCallerId' => 'XXXXXX', //optional
'Record' => 'XXXXXX', //optional
'RecordCallback' => 'XXXXXX', //optional
'RecordCallbackMethod' => 'XXXXXX', //optional
'Transcribe' => 'XXXXXX', //optional
'TranscribeCallback' => 'XXXXXX', //optional
));
print_r($call->getResponse());
} catch (Message360_Exception $e) {
echo "Error occured: " . $e->getMessage() . "\n";
}
