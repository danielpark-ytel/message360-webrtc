<?php
// First we must import the actual Message360 library
require_once '../../library/message360.php';

// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();

// Message360 REST API credentials are required
$Message360 -> setOptions(array( 
    'account_sid'       => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 
    'auth_token'        => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    'response_to_array' =>true,
));
try 
{
    // Fetch Send SMS
    $sendSMS = $Message360->create('sms','sendsms', array(
            'FromCountryCode'   => 1, //required
            'From' => 'XXXXXXXXXX', //required             
            'ToCountryCode'  => 1, //required
            'To' => 'XXXXXXXXXX', //required
            'Body' => 'Sms Text', //required
            'Method' => 'POST',//Ex.POST or GET  //optional 
            'MessageStatusCallback' => 'Message Status callback URL' //optional
    ));
    // Print content of the $sendSMS objects
    print_r($sendSMS->getResponse());
}
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
?>
