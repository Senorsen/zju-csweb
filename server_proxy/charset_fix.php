<?php
// only insert charset-data
$titles = array(
    'csweb_init' => '计算机基础课程网站',
    'program_init' => '程序设计上级考试与练习系统'
);
$pages = array(
    'csweb_init' => 'http://10.71.45.100/',
    'program_init' => 'http://10.77.30.31/'
);
$orgp = $_GET['page'];
$page = $pages[$orgp];
$str = curl($page);
if ($str === FALSE) {
    $ret_data = array(
        'title' => '错误',
        'body' => '发生错误：无法读取数据。可能是远程网站发生了某种问题，或者本扩展程序出了点差错～')
    ;
} else {
    $str = str_ireplace('<head>', '<head><meta charset="utf-8">', $str);
    $ret_data = array(
        'title' => $titles[$orgp],
        'body' => $str
    );
}

