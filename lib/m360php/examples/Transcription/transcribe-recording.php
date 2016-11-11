<?php
	
    # First we must import the actual Message360 library
    require_once '../../library/message360.php';

    # Now what we need to do is instantiate the library and set the required options defined above
    $Message360 = Message360API\Lib\Message360::getInstance();

    # Message360 REST API credentials are required
    $Message360 -> setOptions(array( 
        'account_sid'       => 'xxxxxxxxxxxxxxxxxxxx', 
        'auth_token'        => 'xxxxxxxxxxxxxxxxxxxx',
        'response_to_array' =>true,
        ));
    try 
    {	
        # Fetch transcribeRecoring
        $transcribeRecoring = $Message360->create('Transcriptions','recordingTranscription',array(
                    'recordingSid'=>'xxxxxxxxxxxxxxxxxxxx'
                    ));
        # Print content of the transcribeRecoring objects		
        print "<pre>";
        print_r($transcribeRecoring->getResponse());
        print "</pre>";
    } 
    catch (Message360_Exception $e) 
    {
        echo "Error occured: " . $e->getMessage() . "\n";
    }
?>
