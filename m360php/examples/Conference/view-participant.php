<?php
# First we must import the actual Message360 library
require_once '../../library/message360.php';
# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
# Message360 REST API credentials are required
$Message360 -> setOptions(array( 
    'account_sid'       => "xxxxxxxxxx", 
    'auth_token'        => "xxxxxxxxxx",
    'response_to_array' =>true
    ));
try 
{    
    # Fetch viewParticipant
    $viewParticipant = $Message360->listAll('Conferences','viewParticipant',array(
    'conferenceid'=>'xxxxxxxxxx',
    'participantsid'=>'xxxxxxxxx'));
    # Print content of the viewParticipant objects
    foreach($viewParticipant->getResponse() as $paricipantList) 
    { 
        print_r($paricipantList);
    }
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
?>
