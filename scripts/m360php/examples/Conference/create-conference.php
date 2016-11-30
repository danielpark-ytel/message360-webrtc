<?php
# First we must import the actual Message360 library
require_once '../../library/message360.php';
# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
# Message360 REST API credentials are required
$Message360 -> setOptions(array(
 'account_sid'       => 'XXXXXXXXXXXXXXX', 
    'auth_token'        => 'XXXXXXXXXXXX',    
'response_to_array' => true,
));
try {
# create Call
 $call = $Message360->create('Conferences', 'createConference', array(
                'ToCountryCode' => '{toCountryCode}', // required
                'To' => '{toNumber}', // required
                'FromCountryCode' => '{fromCountryCode}', // required
                'From' => '{fromNumber}', // required
                'StatusCallback' => '{statusCallbackUrl}',
                'StatusCallbackMethod' => '{statusCallBackMethod}',
                'Muted' => '{muted}',
                'Deaf' => '{deaf}',
                'Record' => '{record}',
                'RecordCallback' => '{recordCallBackUrl}',
                'RecordCallbackMethod' => '{recordCallBackMethod}',
              
                    ));

print_r($call->getResponse());
} catch (Message360_Exception $e) {
echo "Error occured: " . $e->getMessage() . "\n";
}