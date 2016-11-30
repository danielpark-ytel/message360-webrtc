<?php
header("Access-Control-Allow-Origin: *");
require_once "m360php/library/message360.php";
$Message360 = Message360API\Lib\Message360::getInstance();
$Message360 -> setOptions(array(
    'account_sid'       => 'cbc6a0b5-c113-a6e4-4f96-53366a7c9966',
    'auth_token'        => '5964d5de074084894ff57f7771b296c3',
    'response_to_array' => true,
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