<?php
# First we must import the actual Message360 library
require_once '../../library/message360.php';
# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
# Message360 REST API credentials are required
$Message360 -> setOptions(array( 
    'account_sid'       => 'xxxx', 
    'auth_token'        => 'xxxx',    
    'response_to_array' => true,
));
try {
# Record Call
$recordCall = $Message360->create('Calls', 'recordCall', array(
        'CallSid' => 'XXXXXX',
        //'Record'   => 'X',//optional
        //'Direction'  => 'XXXXXX',//optional
        //'TimeLimit	'  => 'XXXXXX',//optional
        //'CallbackUrl'  => 'XXXXXX',//optional
        //'FileFormat'  => 'XXXXXX',//optional
    ));
# Print content of the calls objects
    print_r($recordCall->getResponse());
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
}
