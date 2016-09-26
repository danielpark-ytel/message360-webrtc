<?php
// First we must import the actual Message360 library
require_once '../../library/message360.php';
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array(
'account_sid' => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
'auth_token' => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
'response_to_array' =>true,
));
try {
//Opt-In a Number Parameters
$optInNumber = $Message360->listAll('sms', 'numberoptin', array(
'From' => 'XXXXXXXXXX', //required
'To' => 'XXXXXXXXXX', //required
'Expires'=> 0, //required
'AuthorizedBy'=> 'Self', //required
'AuthorizedHow'=> 'Self Added' //required
));

// Print content of the $getInboundSMS objects
print_r($optInNumber->getResponse()); exit;
} catch (Message360_Exception $e) {
echo "Error occured: " . $e->getMessage() . "\n";
}
?>