<?php
// First we must import the actual Message360 library
require_once "m360php/library/message360.php";
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360->setOptions(array(
    'account_sid'       => '6ad7e139-080c-49ab-bbe4-7c9f686dc64b',
    'auth_token'        => '53ee61684ef2a3805fb4721dfdf9672f',
    'response_to_array' =>true,
));
$post_data = file_get_contents("php://input");
$request = json_decode($post_data);
try {
    $checkNumber = $Message360->authenticateNumber('webrtc', 'authenticateNumber', array(
        'phone_number' => $request->phone_number
    ));
    echo json_encode($checkNumber->getResponse());
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
