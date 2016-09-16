<?php
namespace Message360API\Lib;
class Message360_Connect extends Message360_Related
{
    protected static $_instance = null;
	
    protected static $_status   = true;
	
    static function getInstance() {
        if(is_null(self::$_instance)) self::$_instance = new self();
        return self::$_instance;
    }
	
    public function getConnectUrl($connect_sid) {
        if(strlen($connect_sid) != 34) {
            new \Message360_Exception("Please provide valid Connect SID in order to generate Connect URL");
        }
		
        return 'https://www.message360.com/connect/authorize/' . $connect_sid;
    }
	
	
    public function setCredentials($connect_sid, $access_key, $access_token) {
		
        if(strlen($connect_sid) != 34) {
            new \Message360_Exception("Please provide valid Connect SID in order to set connect credentials!");
        }
		
        if(strlen($access_key) != 34) {
            new \Message360_Exception("Please provide valid AccessKey in order to set connect credentials!");
        }
		
        if(strlen($access_token) != 34) {
            new \Message360_Exception("Please provide valid AccessToken in order to set connect credentials!");
        }
		
        self::$_connectHeaders[] = "CONNECT-ACCESS-SID: {$connect_sid}";
        self::$_connectHeaders[] = "CONNECT-ACCESS-KEY: {$access_key}";
        self::$_connectHeaders[] = "CONNECT-ACCESS-TOKEN: {$access_token}";
    }
	
    public function enable() { self::$_status = true; }
	
    public function disable(){ self::$_status = false; }
	
    public function getStatus() { return self::$_status; }
}
