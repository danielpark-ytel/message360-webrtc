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

/* Get the data that's being sent from the browser to use in PHP */
$post_data = file_get_contents("php://input");
$request = json_decode($post_data);

try {
    $checkNumber = $Message360->authenticateNumber("webrtc", "authenticateNumber", array(
        "phone_number" => $request->phone_number
    ));
    echo json_encode($checkNumber->getResponse());
} catch (Exception $e) {
    echo "Error occurred: " . $e->getMessage() . "\n";
}