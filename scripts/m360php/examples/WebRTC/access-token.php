<?php
/* This custom header may or may not be necessary based on where you are hosting these scripts. */
header("Access-Control-Allow-Origin: *");

/* Requiring the PHP library */
require_once '../../library/message360.php';

/* Instantiate an instance of the helper class */
$Message360 = Message360API\Lib\Message360::getInstance();

/* Set your Message360 account SID and authentication token */
$Message360 -> setOptions(array(
    "account_sid" => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    "auth_token" => "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "response_to_array" => true
));

/* Get an access token for WebRTC use */
try {
    $accessToken = $Message360->createToken("webrtc", "createToken");
    echo json_encode($accessToken->getResponse());
} catch (Message360_Exception $e) {
    echo "Error occurred: " . $e->getMessage() . "\n";
}
