![](http://message360.com/wordpress/wp-content/uploads/2014/08/message360.png)

### Welcome to the Message360 PHP Helper Library
This is home to the Official PHP Message360 REST API. 

```php
<?php
## First we must import the actual Message360 library
require_once '../../library/message360.php';

# Now what we need to do is instantiate the library and set the required options defined above
$Message360 = Message360::getInstance();

# Message360 REST API credentials are required
$Message360 -> setOptions(array( 
    'account_sid'       => 'xxxx-xxxxxx-xxxxxx', 
    'auth_token'        => 'xxxx-xxxxxx-xxxxxx',
    'response_to_array' =>true,
    ));

try 
{	# Fetch transcribeRecoring
    $transcribeRecoring = $Message360->create('Transcriptions','TranscribeRecordingAPI',array(
    'recordingsid'=>''
    ));
	# Print content of the transcribeRecoring objects		
	print_r($transcribeRecoring->getResponse());
} 
catch (Message360_Exception $e) 
{
    echo "Error occurred: " . $e->getMessage() . "\n";
}
?>
```

An account for Message360 is free to sign up for at [https://api.message360.com](https://api.message360.com)

### About Message360
Empowering technology to meet modern day communication needs. Through a simple to use API, developers can build, connect, and manage all communications platforms in one system. 

Communicating with prospects, leads and customers is the single most important thing when protecting and growing your business. Now, take it to the next level by imagining the possibilities and how your business can communicate with these people.

More information can be obtained about message360 at [http://www.message360.com](http://message360.com/)

### Support or Contact
Having trouble with Pages or the library?  Visit [https://api.message360.com](https://api.message360.com) and click the Help button in the bottom right corner or [contact support](mailto:support@ytel.com) and we’ll help you sort it out.

### Company Information
© 2015 Ytel, Inc. | Ytel™ All Rights Reserved. | 800.382.4913 | www.ytel.com
