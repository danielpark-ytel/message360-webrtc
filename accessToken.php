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

try
{
    $accessToken = $Message360->getAccessToken('freeswitch', 'createToken');
    $response = $accessToken->getResponse();
    echo $response;
}
catch (Message360_Exception $e)
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
