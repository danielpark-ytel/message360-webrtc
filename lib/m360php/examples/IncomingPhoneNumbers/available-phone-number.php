<?php
require_once '../../library/message360.php';
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array( 
        'account_sid'       => 'xxxxxxxxxxxxxxxxxx', 
    'auth_token'        => 'xxxxxxxxxxxxxxxxxx',
    'response_to_array' => true,      
));
try 
{
        // Fetch available phone number details
    $availablePhoneNumbers = $Message360->create('Incomingphone','availableNumber',array(
        "numberType" => 'all',  //required numberType => voice/sms/all (String)
        "areacode" => xxx, 		//required eg. "areacode" => 800, 	(Number)	(Default value is 'all')
        "pagesize" => xx		//optional eg. "pagesize" => 13   	(Number)	(default value is 10)
    )); 
        // Print content of the phone number  objects
        foreach($availablePhoneNumbers->getResponse() as $availableNumber) 
        { 
        print_r($availableNumber);
    }
}
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
} 
?>