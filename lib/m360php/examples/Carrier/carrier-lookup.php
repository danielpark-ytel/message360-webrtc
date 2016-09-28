<?php
// First we must import the actual Message360 library
require_once '../../library/message360.php';
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array( 
    'account_sid'       => 'XXXXXXXXXXXXXXXXXX', 
    'auth_token'        => 'XXXXXXXXXXXXXXXXXX',
));
try 
{
    //Send Request
    $carrierLookup = $Message360->post('carrier','lookup', array(
            'phonenumber'   => 'XXXXXXXXXX', //required
    ));
    // Print content of the $carrierLookup objects
    print_r($carrierLookup->getResponse());
}
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
?>