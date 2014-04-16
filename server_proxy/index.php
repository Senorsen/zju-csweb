<?php
/**
 * zju-csweb server-side proxy backend
 * @author Senorsen
 * @version 20140416
 * @link http://www.senorsen.com/
 * @link http://project.qsc.senorsen.com/
 */

// config file
require __DIR__ . "/config.php";
$allowed_modules = array('index_page');
// default type: jsonp
// default action: null (return error)
$type = para('type');
if (is_null($type)) $type = 'jsonp';
$callback = para('callback');
if (is_null($callback)) $callback = 'callback';
$action = para('action');

function para($str) {
    return isset($_REQUEST[$str]) ? $_REQUEST[$str] : null;
}
function output($type, $data, $callback = 'callback') {
    global $output_charset;
    if ($type == 'jsonp') {
        header("Content-Type: application/javascript; charset=$output_charset");
        echo $callback;
        echo '(' . json_encode($data) . ');';
    } else if ($type == 'json') {
        header("Content-Type: application/json; charset=$output_charset");
        echo json_encode($data);
    }
    // no more data type supports.
}

