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
    # Fetch addParticipant
    $addParticipant = $Message360->post('Conferences','addParticipant',array(
            'conferencesid'=>'xxxxxxxxxx',
            'participantnumber'=>'xxxxxxxxxx',
            'deaf'=>'','muted'=>''
        ));

    # Print content of the addParticipant objects
    foreach($addParticipant->getResponse() as $paricipantList) 
    { 
        print_r($paricipantList);
    }
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";
}
?>
