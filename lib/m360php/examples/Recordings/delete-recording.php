<?php
# First we must import the actual Message360 library
require_once '../../library/message360.php';
# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
# Ytel REST API credentials are required
$Message360 -> setOptions(array( 
        'account_sid'       => 'xxxxxxxxxx', 
    'auth_token'        => 'xxxxxxxxxx',
    'response_to_array' => true,        
));
try 
{
        # delete an recording
        $deleteRecording = $Message360->delete('Recording','deleteRecording',array('recordingId'=>'xxxxxxxxxx'));
        # Print content of the recording object
	 
        print_r($deleteRecording->getResponse());    
} 
catch (Message360_Exception $e) 
{
    echo "Error occured: " . $e->getMessage() . "\n";   
}

?>

