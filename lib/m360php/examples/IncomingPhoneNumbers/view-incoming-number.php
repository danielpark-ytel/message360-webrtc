<?php
// First we must import the actual Message360 library
require_once '../../library/message360.php';
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array( 
            'account_sid'       => 'xxxxxxxxxxxxxxxxx', 
        'auth_token'        => 'xxxxxxxxxxxxxxxxx',
        'response_to_array' => true,      
));
try 
{
    //View incoming phone number details
    $listPhoneNumbers = $Message360->listAll('incomingphone', 'viewNumber', array(
        'phonenumber' => "xxxxxxxxxx"
    ));

    // Print content of the phone number
    $response = $listPhoneNumbers->getResponse();
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
}
?>

