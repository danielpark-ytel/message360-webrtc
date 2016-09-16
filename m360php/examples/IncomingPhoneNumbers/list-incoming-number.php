<?php
require_once '../../library/message360.php';
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array( 
        'account_sid'       => 'xxxxxxxxxxxxxxxx', 
    'auth_token'        => 'xxxxxxxxxxxxxxxx',
    'response_to_array' => true,      
));
try 
{
        // Fetch phone number details
    $incomingNumbers = $Message360->listAll('Incomingphone','listNumber',array(
                    'Page'=>'1',//optional
                    'PageSize'=>'10',//optional
                    'NumberType'=>'voice', //voice or all  This is optional parameter.  
                    'FriendlyName'=>'', //optional
                    ));      
        // Print content of the phone number  objects
        foreach($incomingNumbers->getResponse() as $incomingNumber) 
        { 
        print_r($incomingNumber);
    }
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
}
?>