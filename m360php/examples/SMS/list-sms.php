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
try {
    // Fetch listSMS
    $listSMS = $Message360->listAll('sms','listsms',array(
        'Page'=> 1 , //optional
        'PageSize'=>10, //optional
        'DateSent'=>'XXXX-XX-XX', //optional
        'From'=>'XXXXXXXXXX', //optional
        'To'=>'XXXXXXXXXX', //optional
    ));
    // Print content of the $listSMS objects
    foreach($listSMS->getResponse() as $listsSMS) 
    {
        print_r($listsSMS);
    }
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
?>
