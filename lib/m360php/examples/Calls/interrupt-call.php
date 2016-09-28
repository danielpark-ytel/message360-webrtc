<?php
# First we must import the actual Message360 library
require_once '../../library/message360.php';
# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
# Message360 REST API credentials are required
$Message360 -> setOptions(array( 
    'account_sid'       => 'XXXXXX', 
    'auth_token'        => 'XXXXXX',    
    'response_to_array' => true,
));
try {
# Interrupt Call
$interruptCall = $Message360->create('Calls', 'interruptCalls', array(
        'CallSid' => 'XXXXXX',
        'Status'   => 'XXXXXX',
        'Url'  => 'XXXXXX',
        'Method'  => 'XXXXXX',
    ));
# Print content of the calls objects

print_r($interruptCall->getResponse());
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
}
