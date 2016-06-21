<?php
/*
+--------------------------------------------------------------------------
|   WeCenter [#RELEASE_VERSION#]
|   ========================================
|   by WeCenter Software
|   © 2011 - 2014 WeCenter. All Rights Reserved
|   http://www.wecenter.com
|   ========================================
|   Support: WeCenter@qq.com
|
+---------------------------------------------------------------------------
*/

define('IN_AJAX', TRUE);


if (!defined('IN_ANWSION'))
{
	die;
}

class ajax extends AWS_CONTROLLER
{

	public function get_access_rule()
	{
        //黑名单,黑名单中的检查  'white'白名单,白名单以外的检查
		$rule_action['rule_type'] = 'white';
		$rule_action['actions'] = array("save", "view", "all", "query", "answer");

		return $rule_action;
	}

	public function setup()
	{
        $content_type = "application/json;";
		HTTP::no_cache_header($content_type);
	}

    /**
     * 新增问卷|更新问卷
     */
    public function save_action(){

        if(empty($this->user_id)){
            H::ajax_json_output(AWS_APP::retjson(null, 1, "请先登录"));
        }

        if(empty($_POST['title']) || empty($_POST['content'])){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }

        $sn = strtolower(trim($_POST['sn']));
        $version = isset($_POST['version']) ? (int)$_POST['version'] : 1;

        //问卷的开始结束时间校验
        $current_time = time();
        $starttime = empty($_POST['starttime']) ? $current_time : $_POST['starttime'];
        $endtime   = empty($_POST['endtime']) ? ($current_time + (3600 *24 *30)) : $_POST['endtime'];

        //获取请求参数
        $data = array(
            'sn'        => $sn,
            'version'   => $version,
            'uid'       => $this->user_id,
            'username'  => $this->user_info['user_name'],
            'title'     => $_POST['title'],
            'desc'      => html_purify($_POST['desc']),
            'content'   => $_POST['content'],
            'islogin'   => empty($_POST['islogin']) ? 0 : 1,
            'starttime' => $starttime,
            'endtime'   => $endtime,
        );

        //检测问卷内容设置是否正确
        if(!$this->model('wenjuan')->check_wenjuan_input($_POST['content'])){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "问卷数据异常，请检查"));
        }

        //新增问卷
        if(empty($sn)){

            if($endtime <= $current_time){
                H::ajax_json_output(AWS_APP::retjson(null, -1, "问卷结束时间不能小于等于当前时间"));
            }

            if($endtime <= $starttime){
                H::ajax_json_output(AWS_APP::retjson(null, -1, "问卷结束时间不能小于等于开始时间"));
            }

            $response = $this->model('wenjuan')->add_user_wenjuan($data);
            if(!empty($response)){
                H::ajax_json_output(AWS_APP::retjson($response, 0, "新增成功"));
            }else{
                H::ajax_json_output(AWS_APP::retjson(null, -1, "新增失败"));
            }

        }else{
            //更新问卷
            $response = $this->model('wenjuan')->update_user_wenjuan($data);
            if(!empty($response)){
                H::ajax_json_output(AWS_APP::retjson($response, 0, "更新成功"));
            }else{
                H::ajax_json_output(AWS_APP::retjson(null, -1, "更新失败"));
            }
        }
    }


    /**
     * 查看问卷详情
     */
    public function view_action(){
        if(empty($_POST['sn'])){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }

        $sn = strtolower(trim($_POST['sn']));
        $result = $this->model('wenjuan')->get_wenjuan_by_sn($sn);

        if(!$result){
            H::ajax_json_output(AWS_APP::retjson());
        }else{

            $result['content'] = json_decode($result['content'], true);
            H::ajax_json_output(AWS_APP::retjson($result));
        }
    }

    /**
     * 根据用户ID查询问卷列表
     */
    public function list_action(){
        $page = isset($_POST['page']) ? (int)$_POST['page'] : 1;
        $per_page = isset($_POST['per_page']) ? (int)$_POST['per_page'] : 10;

        $where = vsprintf("uid = %d", array($this->user_id));
        $wenjuan_list = $this->model('wenjuan')->fetch_page('wenjuan', $where, 'id DESC', $page, $per_page);

        if(empty($wenjuan_list)){
            $wenjuan_list = array();
            $total_rows   = 0;
            $total_page   = 0;
        }else{

            //问卷结束时间与状态进行同步
            foreach($wenjuan_list as $wenjuan){
                $this->model('wenjuan')->change_wenjuan_status($wenjuan);
            }

            $total_rows = $this->model('wenjuan')->found_rows();
            $total_page = ceil($total_rows/$per_page);
        }

        $pager = array(
            'total_page'   => $total_page,
            'total_record' => $total_rows,
            'current_page' => $page,
            'per_page'     => $per_page
        );

        H::ajax_json_output(AWS_APP::retjson($wenjuan_list, 0, null, $pager));
    }


    /**
     * 返回所有的问卷
     */
    public function all_action(){
        $page = isset($_POST['page']) ? (int)$_POST['page'] : 1;
        $per_page = isset($_POST['per_page']) ? (int)$_POST['per_page'] : 10;

        $where = "1 = 1";
        $wenjuan_list = $this->model('wenjuan')->fetch_page('wenjuan', $where, 'id DESC', $page, $per_page);

        if(empty($wenjuan_list)){
            $wenjuan_list = array();
            $total_rows   = 0;
            $total_page   = 0;
        }else{

            //问卷结束时间与状态进行同步
            foreach($wenjuan_list as $wenjuan){
                $this->model('wenjuan')->change_wenjuan_status($wenjuan);
            }

            //统计分页信息
            $total_rows = $this->model('wenjuan')->found_rows();
            $total_page = ceil($total_rows/$per_page);
        }

        $pager = array(
            'total_page'   => $total_page,
            'total_record' => $total_rows,
            'current_page' => $page,
            'per_page'     => $per_page
        );

        H::ajax_json_output(AWS_APP::retjson($wenjuan_list, 0, null, $pager));
    }



    /**
     * 答题时，问卷查询
     * 需判断状态，是否答过
     */
    public function query_action(){
        if(empty($_POST['sn'])){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }
        $sn = strtolower(trim($_POST['sn']));

        //是否登录检测
        if(empty($this->user_id)){
            $this->user_id = $_COOKIE['btf__Session'];
        }

        $result = $this->model('wenjuan')->query_wenjuan($sn, $this->user_id);
        if($result['ret'] != 0){
            H::ajax_json_output(AWS_APP::retjson($result['data'], $result['ret'], $result['msg']));
        }else{
            H::ajax_json_output(AWS_APP::retjson($result['data']));
        }
    }


    /**
     * 回答问卷
     */
    public function answer_action(){

        $sn = strtolower(trim($_POST['sn']));
        $content = strtolower(trim($_POST['content']));

        //参数校验
        if(empty($sn) || empty($content)){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }

        //是否登录检测
        if(empty($this->user_id)){
            $this->user_id = $_COOKIE['btf__Session'];
        }

        //查询问卷
        $result = $this->model('wenjuan')->query_wenjuan($sn, $this->user_id);
        if($result['ret'] == 0){
            //答题保存
            $wenjuan_info = $result['data'];
            $user_name = isset($this->user_info['user_name']) ? $this->user_info['user_name'] : 'anonymous';
            if($this->model('wenjuan')->save_wenjuan_answer($wenjuan_info, $content, $this->user_id,$user_name)){

                H::ajax_json_output(AWS_APP::retjson(null, 0, "答题成功"));
            }else{
                H::ajax_json_output(AWS_APP::retjson(null, 1, "答题失败"));
            }
        }else{
            H::ajax_json_output(AWS_APP::retjson($result['data'], $result['ret'], $result['msg']));
        }
    }

    /**
     * 问卷的统计
     */
    public function statistic_action(){

        //参数校验
        $sn = strtolower(trim($_POST['sn']));
        if(empty($sn)){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }

        $result = $this->model('wenjuan')->get_wenjuan_statistics($sn);

        if($result){
            H::ajax_json_output(AWS_APP::retjson($result));
        }else{
            H::ajax_json_output(AWS_APP::retjson(null, 1, "暂无统计结果"));
        }
    }


    /**
     * 更改问卷状态
     */
    public function status_action(){
        //参数校验
        $sn = strtolower(trim($_POST['sn']));
        if(empty($sn)){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }
    }

    //统计问卷
    //下载统计结果

    /**
     * 图片上传
     * $path = ROOT_PATH."/uploads/wenjuan";
     *  //$layer40 = clone $layer;
     *  //echo $folder; exit;
     *  //$layer->getWidth(); // in pixel
     *  //$layer->getHeight(); // in pixel
     *  //$layer40->save();
     *  //echo $layer40->getWidth();
     */
    public function upload_action(){
        //上传配置
        include(AWS_PATH.'/Extensions/ueupload/Uploader.class.php');
        include(AWS_PATH.'/Extensions/PHPImageWorkshop/ImageWorkshop.php');

        $path = "uploads/wenjuan";
        $config = array(
            "savePath" => $path,
            "maxSize"  => 1000 ,
            "allowFiles" => array( ".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp" )
        );

        //参数校验
        if(!isset($_FILES['upfile'])){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }

        $up = new Uploader("upfile" , $config);
        $info = $up->getFileInfo();

        if(!empty($info) && ($info['state'] == 'SUCCESS')){

            //复制图片处理图片
            $host = "http://".$_SERVER['SERVER_NAME']."/";
            $layer = \PHPImageWorkshop\ImageWorkshop::initFromPath($info['url']);
            $layer100 = clone $layer;

            $path40 = $path.'/'.date('Ymd').'/40_40';
            is_dir($path40) || mkdir($path40);
            $layer->resizeInPixel(40,40);
            $layer->save($path40, $info['name']);
            $url40 = $path40.'/'.$info['name'];

            $path100 = $path.'/'.date('Ymd').'/100_100';
            is_dir($path100) || mkdir($path100);
            $layer100->resizeInPixel(100, 100);
            $layer100->save($path100, $info['name']);
            $url100 = $path100.'/'.$info['name'];

            //$result = array('big' => $host.$info['url'], 'mid' => $host.$url100, 'small' => $host.$url40);
            //unset($info['uri']);
            $info['url'] = $host.$info['url'];
            //$info['urls'] = $result;

        }else{
            H::ajax_json_output(AWS_APP::retjson(null, -1, "上传失败"));
        }
        H::ajax_json_output(AWS_APP::retjson($info));
    }

    /**
     * 下载统计结果
     *
     */
    public function download_action(){

        //参数校验
        error_reporting(E_ALL & ~E_NOTICE);
        $sn = strtolower(trim($_GET['sn']));

        if(empty($sn)){
            echo "请求参数错误";exit;
        }

        include(AWS_PATH.'/Extensions/excel/Classes/PHPExcel.php');
        $result = $this->model('wenjuan')->get_wenjuan_data($sn);

        //todo 校验问卷是否本人的
        if($this->user_id != $result['main']['uid']){
            echo '无权查看';exit;
        }
        
        if(!empty($result)){
            $main_info = $result['main'];
            $list      = $result['list'];
            $title     = $main_info['title'];
            $desc      = $main_info['desc'];
            $length    = count($list[0]);

            //获取列宽
            $column_arr = $this->model('wenjuan')->get_excel_column($length);
            $column_end = $column_arr[$length-1];

            // Set document properties
            $objPHPExcel = new PHPExcel();
            $objPHPExcel->getProperties()->setCreator("CE Platform")
                ->setLastModifiedBy("CE Platform")
                ->setTitle($title)
                ->setSubject($title)
                ->setDescription($desc)
                ->setCategory("Diao cha wen juan");
            $objPHPExcel->setActiveSheetIndex(0);
            $objPHPExcel->getActiveSheet()->setTitle('DiaoChaWenJuan');

            //设置标题
            $objPHPExcel->getActiveSheet()->mergeCells("A1:{$column_end}1");
            $objPHPExcel->getActiveSheet()->setCellValue('A1', $title);
            $objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()->setBold(true);
            $objPHPExcel->getActiveSheet()->getStyle('A1')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
            $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(30);

            //设置列名称
            $objPHPExcel->getActiveSheet()->getStyle("A2:{$column_end}2")->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle("A2:{$column_end}2")->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_WHITE);
            $objPHPExcel->getActiveSheet()->getStyle("A2:{$column_end}2")->getFill()->getStartColor()->setARGB('3B608D');

            //设置列宽
            foreach($column_arr as $idx){
                $objPHPExcel->getActiveSheet()->getColumnDimension($idx)->setAutoSize(true);
            }

            //循环输出内容
            $count = 2;
            foreach($list as $item){
                $index = 0;
                foreach($item as $val){
                    $objPHPExcel->getActiveSheet()->setCellValue($column_arr[$index].$count, $val);
                    $index++;
                }
                $count++;
            }

            // Redirect output to a client’s web browser (Excel2007)
            $filename = "wenjuan_".date('Y_m_d_H_i_s').".xlsx";
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="'.$filename.'"');
            header('Cache-Control: max-age=0');

            // If you're serving to IE 9, then the following may be needed
            header('Cache-Control: max-age=1');

            // If you're serving to IE over SSL, then the following may be needed
            header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
            header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
            header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
            header ('Pragma: public'); // HTTP/1.0

            $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");
            $objWriter->save('php://output');
            exit;

        }else{
            echo '暂无数据';exit;
        }
    }


    /**
     * 下载统计结果
     *
     */
    private function old_download_action(){
        include(AWS_PATH.'/Extensions/excel/xlsxwriter.class.php');
        //参数校验
        $sn = strtolower(trim($_GET['sn']));
        if(empty($sn)){
            H::ajax_json_output(AWS_APP::retjson(null, -1, "请求参数错误"));
        }

        //todo 校验问卷是否本人的

        $result = $this->model('wenjuan')->get_wenjuan_data($sn);
        if(!empty($result)){
            error_reporting(E_ALL & ~E_NOTICE);
            $filename = "wenjuan_".date('Y_m_d_H_i_s').".xlsx";
            header('Content-disposition: attachment; filename="'.XLSXWriter::sanitize_filename($filename).'"');
            header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header('Content-Transfer-Encoding: binary');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');

            $writer = new XLSXWriter();
            $length = count($result[1]);
            $writer->markMergedCell('Sheet1', 0, 0, 0, $length);
            $writer->writeSheet($result);
            $writer->writeToStdOut();exit;
        }else{
            echo '暂无数据';exit;
        }
    }

}
