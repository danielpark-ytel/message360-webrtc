<?php
namespace Message360API\Lib;
/** @see Message360_Exception * */
require_once 'Exception.php';

class Message360_Connector
{
    protected $curl_data = array();
    protected $response_association = false;
    protected $_component = null;

    /**
     * @param string $component
     */
    function __construct($curl_data, $response_association = false, $component = null)
    {
        //echo "<pre>";print_r($curl_data);die;echo "</pre>";
        $this->curl_data = $curl_data;
        $this->response_association = $response_association;
        $this->_component = $component;

        if ($this->curl_data['errno'] > 0) {
            $errno = $this->curl_data['errno'];
            $error = $this->curl_data['error'];
            throw new \Message360_Exception("Curl returned error with code '{$errno}' and message '{$error}'");
        } else {
            $http_code = $this->curl_data['info']['http_code'];
            if ($http_code != 200) {
                $data = trim($this->curl_data['exec']);
                if (substr($data, 0, 5) == '<?xml') {
                    $xml_data = simplexml_load_string($data);
                    $error_code = isset($xml_data->RestException->Status) ? (string)$xml_data->RestException->Status : 500;
                    $error_message = isset($xml_data->RestException->Message) ? (string)$xml_data->RestException->Message : 'Internal wrapper error';
                } else {
                    $json_data = json_decode(trim($this->curl_data['exec']), false);
                    if (json_last_error() > 0) {
                        $error_code = 500;
                        $error_message = $this->_validateJSON();
                    } else {
                        $error_code = isset($json_data->status) ? $json_data->status : 500;
                        $error_message = isset($json_data->message) ? $json_data->message : 'Internal wrapper error';
                    }
                }


                throw new \Message360_Exception(
                "An error occured while querying message360 with the message '{$error_message}' and the error code '{$error_code}'"
                );
            }
        }

        $this->_decodeJSON();
    }

    function __get($name)
    {
        if ($this->response_association == false) {
                    return isset($this->curl_data['response']->$name) ?
                    $this->curl_data['response']->$name : null;
        } else {
                    return isset($this->curl_data['response'][$name]) ?
                    $this->curl_data['response'][$name] : null;
        }
    }

    function __toString()
    {
        return print_r($this->curl_data['response'], true);
    }

    function attr($key, $default_value = null)
    {
        $schemas = Message360_Schemas::getInstance();

        if ($schemas->isPagingProperty($key) !== null) {
            $available_attrs = implode(", ", $schemas->getPagingProperties());
            throw new \Message360_Exception(
            "Attribute you've requested '{$key}' cannot be found. Available attributes are: '{$available_attrs}'"
            );
        }
        if ($this->response_association == false) {
                    return isset($this->curl_data['response']->$key) ? $this->curl_data['response']->$key : $default_value;
        } else {
                    return isset($this->curl_data['response'][$key]) ? $this->curl_data['response'][$key] : $default_value;
        }
    }

    function getResponse()
    {
        return $this->curl_data['response'];
    }

    function items($access_key = null)
    {
        $component = is_null($access_key) ? $this->_component : $access_key;
        if ($this->response_association == false) {
                    return isset($this->curl_data['response']->$component) ? $this->curl_data['response']->$component : array();
        } else {
                    return isset($this->curl_data['response'][$component]) ? $this->curl_data['response'][$component] : array();
        }
    }

    private function _decodeJSON()
    {
        $result = json_decode(trim($this->curl_data['exec']), $this->response_association);

        $error = '';
        # JSON will be validated only if you use PHP 5 >= 5.3.0
        if (floatval(phpversion()) < 5.3) {
            if (function_exists('json_last_error')) {

                $error = $this->_validateJSON();

                if (!empty($error)) {
                    throw new Message360_Exception('JSON Error: ' . $error);
                }
            }
        }


        $this->curl_data['response'] = $result;
    }

    private function _validateJSON()
    {
        switch (json_last_error()) {
            case JSON_ERROR_DEPTH:
                $error = ' - Maximum stack depth exceeded';
                break;
            case JSON_ERROR_CTRL_CHAR:
                $error = ' - Unexpected control character found';
                break;
            case JSON_ERROR_STATE_MISMATCH:
                $error = ' - Invalid or Malformed JSON';
                break;
            case JSON_ERROR_SYNTAX:
                $error = ' - Syntax error, malformed JSON';
                break;
            case JSON_ERROR_NONE:
            default:
        }

        return $error;
    }

}
