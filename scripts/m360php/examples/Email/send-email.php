<?php
// First we must import the actual Message360 library
require_once '../../library/message360.php';
// Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360API\Lib\Message360::getInstance();
// Message360 REST API credentials are required
$Message360 -> setOptions(array(
'account_sid' => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
'auth_token' => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
'response_to_array' =>true,
));
try {
$sendMail = $Message360->create('Email','sendEmails', array(
    'to' => 'test@example.com', //{to}, Ex. For multiple recipients use 'example1@example.com,example2@example.com'
    'cc'	=>	'test@example.com', //{cc}, Ex. For multiple recipients use 'example1@example.com,example2@example.com'
    'bcc'	=>	'test@example.com', //{bcc}, Ex. For multiple recipients use 'example1@example.com,example2@example.com'
    'subject' => "Sample Program",//'{Subject}',
    'type' => "html",//'{Type}', // Ex. text or html
    'from' => 'test@example.com', //optional
    'message' => 'Test Mail',//'{Message}',// Ex. urlencode($message);
    'attachment[0]'=> '@'.realpath('php.png') // Ex. '@'.realpath('/home/pc1/Desktop/pm2.png');//{FULL_PATH_FILE}'
));
// Print content of the send mail object
print_r($sendMail->getResponse());
} catch (Message360_Exception $e) {
echo "Error occured: " . $e->getMessage() . "\n";
}
?>