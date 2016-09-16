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
try 
{
# Voice Effect
$voiceEffect = $Message360->create('Calls','voiceEffect', array(
        'CallSid' => 'XXXXXX',
        //'AudioDirection'   => 'X',//optional
        //'PitchSemiTones'  => 'XXXXXX',//optional
        //'PitchOctaves'  => 'XXXXXX',//optional
        //'Pitch'  => 'XXXXXX',//optional
        //'Rate'  => 'XXXXXX',//optional
        //'Tempo	'  => 'XXXXXX',//optional
    ));
# Print content of the calls objects
print_r($voiceEffect->getResponse());
} 
catch (Message360_Exception $e) 
{
   echo "Error occured: " . $e->getMessage() . "\n";   
}
