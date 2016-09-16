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
    $unsubscribes = $Message360->listAll('Email','listUnsubscribedEmail',array(
     'offset'=>0, 
     'limit'=>10,
    )); 		     
    // Print content of the list unsubscribes email address object
 	foreach($unsubscribes->getResponse() as $unsubscribe) 
 	{
 	    echo "<pre>";  
        print_r($unsubscribe);
    }    
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
}
?>