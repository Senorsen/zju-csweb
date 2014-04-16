<?php
// only insert charset-data
$str = curl('/');
if ($str === FALSE) {
    $ret_data = array(
        'title' => '错误',
        'body' => '发生错误：无法读取计算机科学与技术学院 基础教学中心教学网站 服务器数据。可能是10.71.45.100发生了某种问题，或者本扩展程序出了点差错～')
    ;
} else {
    $str = str_replace('<HEAD>', '<head><meta charset="utf-8">', $str);
    $ret_data = array(
        'title' => '计算机基础课程网站',
        'body' => $str
    );
}

