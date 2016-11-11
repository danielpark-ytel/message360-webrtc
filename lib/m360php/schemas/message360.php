<?php
namespace Message360API\Lib;
/**
     * @author Afzal Patel <afzal@ytel.co.in>
     * @version V1.1(v1b)
     */

if (floatval(phpversion()) < 5.2) {
    trigger_error(sprintf(
        "Your PHP version %s is not valid. In order to run Message360 helper you will need to have at least PHP 5.2 or above.", 
            phpversion() 
    ));
}

/** @see Message360_Exception */
require_once 'message360/Exception.php';

/** @see Message360_Schemas */
require_once 'message360/Schemas.php';

/** @see Message360_InboundXML **/
require_once 'message360/InboundXML.php';

/** @see Message360_Helpers **/
require_once 'message360/Helpers.php';

/** @see Message360_Connector **/
require_once 'message360/Connector.php';

/** @see Message360_Related **/
require_once 'message360/Related.php';

/** @see Message360_Client **/
require_once 'message360/Sdk.php';

/** @see Message360_Client **/
require_once 'message360/Connect.php';

final class Message360 extends Message360_Related
{
    protected static $_instance = null;
    
    static function getInstance() {
        if (is_null(self::$_instance)) self::$_instance = new self();
        return self::$_instance;
    }
}