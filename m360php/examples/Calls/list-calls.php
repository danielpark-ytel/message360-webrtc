<?php
# First we must import the actual Message360 library
require_once '../../library/message360.php';
# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
# Message360 REST API credentials are required
$Message360 -> setOptions(array(
'account_sid' => 'xxxxx',
'auth_token' => 'xxxx',
'response_to_array' => true,
));
try
{
    # Fetch calls
    $calls = $Message360->post('Calls','listCalls',array(
    'Page'=>'1',//optional
    'PageSize'=>'10', //optional
    'to'=>'XXXXXXXXXX',//optional
    'from'=>'XXXXXXXXXX', //optional
    'DateCreated'=>'XXXX-XX-XX' //optional
    )); 
# Print content of the calls objects
print_r($calls->getResponse());
} catch (Message360_Exception $e) {
echo "Error occured: " . $e->getMessage() . "\n";
}
