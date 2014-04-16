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
$allowed_modules = array('teacher_list');
// default type: jsonp
// default action: null (return error)
$type = para('type');
if (is_null($type)) $type = 'jsonp';
$callback = para('callback');
if (is_null($callback)) $callback = 'callback';
$action = para('action');
if (in_array($action, $allowed_modules)) {
    include $action . ".php";
    if (isset($ret_data) && !is_null($ret_data)) {
        if (is_array($ret_data)) {
            $ret_data['charset'] = $output_charset;
        } else if (is_object($ret_data)) {
            $ret_data->charset = $output_charset;
        }
        $ret_data = array(
            'code' => 0,
            'msg' => 'ERR_SUCCESS',
            'charset' => $output_charset,
            'obj' => $ret_data
        );
    } else {
        $ret_data = array(
            'code' => -1,
            'msg' => '未知错误'
        );
    }
    echo output($ret_data);
} else {
    echo output(array('code' => -1, 'msg' => 'ERR_UNSPECIFIED_ACTION'));
}
function para($str) {
    return isset($_REQUEST[$str]) ? $_REQUEST[$str] : null;
}
function output($data) {
    global $output_charset, $type, $callback;
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
function curl($url, $data = null, $cookie = '') {
    // curl fetch with automatically gbk <-> utf-8 convertion.
    global $base_url;
    $ua = 'Powered by Qiu Shi Chao zju-csweb optimizer / By Senorsen (Zhang Sen) @ QSCTech';
    $url = mb_convert_encoding($base_url . $url, 'gbk' ,'utf-8');
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    if (!empty($cookie)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Host: 10.71.45.100",
            "Cookie: $cookie",
            "User-Agent: $ua"
        ));
    }
    if (is_null($data)) {
        // GET
    } else if (is_string($data)) {
        // POST
        $data = mb_convert_encoding($url, 'gbk', 'utf-8');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    } else if (is_array($data)) {
        // POST
        curl_setopt($ch, CURLOPT_POST, true);
        convert_arr_to_gbk($data);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    }
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $str = curl_exec($ch);
    curl_close($ch);
    if (is_null($str)) {
        $str = FALSE;
    } else {
        $str = mb_convert_encoding($str, 'utf-8', 'gbk');
    }
    return $str;
}
function convert_arr_to_gbk(&$obj) {
    // note that xiao sensen won't pass me an unchangable variable.
    if (is_object($obj) || is_array($obj)) {
        // hey but I cannot convert the key.
        foreach ($obj as $key => &$value) {
            convert_arr_to_gbk($value);
        }
        return $obj;
    } else if (is_string($obj)) {
        return ($obj =mb_convert_encoding($obj, 'gbk', 'utf-8'));
    }
}
