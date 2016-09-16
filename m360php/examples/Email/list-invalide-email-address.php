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
        $invalidemails = $Message360->listAll('Email','listInvalidEmail',array(
        'offset'=>0, 
        'limit'=>10,
    )); 	      
    // Print content of the invalid emails  object
        foreach($invalidemails->getResponse() as $invalidemail) 
        { 
        print_r($invalidemail);
    }    
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
}
?>