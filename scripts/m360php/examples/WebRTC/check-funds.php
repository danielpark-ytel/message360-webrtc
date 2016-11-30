<?php
/* This custom header may or may not be necessary based on where you are hosting these scripts. */
header("Access-Control-Allow-Origin: *");
require_once '../../library/message360.php';
$Message360 = Message360API\Lib\Message360::getInstance();
$Message360 -> setOptions(array(
    "account_sid" => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    "auth_token" => "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "response_to_array" => true
));

try {
    $checkFunds = $Message360->createToken("webrtc", "checkFunds");
    echo json_encode($checkFunds->getResponse());
} catch (Message360_Exception $e) {
    echo "Error occurred: " . $e->getMessage() . "\n";
}