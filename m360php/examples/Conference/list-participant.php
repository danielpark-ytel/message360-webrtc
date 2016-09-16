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
    # Fetch listParticipant    
    $listParticipant = $Message360->listAll('Conferences', 'listParticipant', array(
    'Page'=>'1',
    'PageSize'=>'5',
    'deaf'=>'',
    'Muted'=>'',
    'conferenceid'=>'xxxxxxxxxx',
    ));
    # Print content of the listParticipant objects
    foreach($listParticipant->getResponse() as $ParticipantList) 
    { 
        print_r($ParticipantList);
    }

} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";
}

?>
