<?php
// First we must import the actual Message360 library
require_once "m360php/library/message360.php";
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array(
    'account_sid'       => '6aed4f68-91f4-9223-22a0-ded8583c62f9',
    'auth_token'        => '936eb51aff11375ccf07616e2b73ecee',
    'response_to_array' =>true,
));
$post_data = file_get_contents("php://input");
$request = json_decode($post_data);
$request->phone_number = "2133750729";
if($request->phone_number != "") {
    $number = $request->phone_number;
    try {
        $checkNumber = $Message360->authenticateNumber('freeswitch', 'authenticateNumber', array(
            "account_sid" => $this->options("account_sid"),
            "phone_number" => $number
        ));
        $response = $checkNumber->getResponse();
        echo json_encode($response);
    } catch (Message360_Exception $e)
    {
        echo "Error occurred: " . $e->getMessage() . "\n";
    }
} else {
    $response = array(
        "Status" => "400",
        "Message" => "Invalid phone number formatting."
    );
    return json_encode($response);
}
