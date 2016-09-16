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
    $carrierLookupList = $Message360->listAll('carrier','lookuplist', array(
                'page'=> 1, //optional
                'page'=> 10, //optional  
    ));
    // Print content of the $carrierLookupList objects
    print_r($carrierLookupList->getResponse());
}
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
?>