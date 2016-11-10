<?php
/* This custom header may or may not be necessary based on where you are hosting these scripts. */
header("Access-Control-Allow-Origin: *");
require_once "m360php/library/message360.php";
$Message360 = Message360API\Lib\Message360::getInstance();
$Message360 -> setOptions(array(
    "account_sid" => 'cbc6a0b5-c113-a6e4-4f96-53366a7c9966',
    "auth_token" => "5964d5de074084894ff57f7771b296c3",
    "response_to_array" => true
));

try {
    $checkFunds = $Message360->createToken("webrtc", "checkFunds");
    echo json_encode($checkFunds->getResponse());
} catch (Message360_Exception $e) {
    echo "Error occurred: " . $e->getMessage() . "\n";
}