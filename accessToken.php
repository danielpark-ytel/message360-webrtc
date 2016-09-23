<?php
// First we must import the actual Message360 library
require_once "m360php/library/message360.php";
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array(
    'account_sid'       => '6ad7e139-080c-49ab-bbe4-7c9f686dc64b',
    'auth_token'        => '53ee61684ef2a3805fb4721dfdf9672f',
    'response_to_array' =>true,
));
try
{
    $accessToken = $Message360->createToken('webrtc', 'createToken');
    echo json_encode($accessToken->getResponse());
}
catch (Message360_Exception $e)
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
