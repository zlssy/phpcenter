<?php
    header("Content-Type:text/html;charset=utf-8");
    define('ROOT_PATH', dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/');
    error_reporting( E_ERROR | E_WARNING );
    date_default_timezone_set("Asia/chongqing");
    include "Uploader.class.php";

    $max_size_config = ini_get('upload_max_filesize');
    $max_size = intval($max_size_config) * 1024;
    $min_max_size = 2048;
    $max_size < $min_max_size && $max_size = $min_max_size;
    $affix_path = 'uploads/umeditor/';
    $umeditor_upload_dir = ROOT_PATH . $affix_path;
    //上传配置
    $config = array(
        "savePath" => $umeditor_upload_dir ,             //存储文件夹
        "maxSize" => $max_size ,                   //允许的文件最大尺寸，单位KB
        "allowFiles" => array( ".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp" )  //允许的文件格式
    );
    //上传文件目录
    $up = new Uploader( "upfile" , $config );
    $type = $_REQUEST['type'];
    $callback=$_GET['callback'];

    $info = $up->getFileInfo();
    $info['url'] = str_replace($umeditor_upload_dir, '', $info['url']);

    /**
     * 返回数据
     */
    if($callback) {
        echo '<script>'.$callback.'('.json_encode($info).')</script>';
    } else {
        echo json_encode($info);
    }
