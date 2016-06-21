<?php
/**
 * WeCenter Framework
 *
 * An open source application development framework for PHP 5.2.2 or newer
 *
 * @package     WeCenter Framework
 * @author      WeCenter Dev Team
 * @copyright   Copyright (c) 2011 - 2014, WeCenter, Inc.
 * @license     http://www.wecenter.com/license/
 * @link        http://www.wecenter.com/
 * @since       Version 1.0
 * @filesource
 */

if (!defined('IN_ANWSION'))
{
    die;
}

class wenjuan_class extends AWS_MODEL{

    //定义问卷的状态
    const  WAIT_START = 1;
    const  OPEN       = 5;
    const  STOP       = 10;

    public static $list = array(
        self::WAIT_START => "未开放",
        self::OPEN       => "已开放",
        self::STOP       => "已关闭",
    );

    /**
     * @param $data
     * @return bool
     * @throws Exception
     */
    public function add_user_wenjuan($data){

        $current_time = time();
        try{

            $this->begin_transaction();

            if($data['starttime'] > $current_time){
                $status = self::WAIT_START;
            }else{
                $status = self::OPEN;
            }

            if($data['endtime'] <= $current_time){
                $status = self::STOP;
            }

            //问卷主表信息
            $sn = $this->make_sn();
            $main_row = array(
                'sn'         => $sn,
                'uid'        => $data['uid'],
                'status'     => $status,
                'title'      => $data['title'],
                'desc'       => $data['desc'],
                'version'    => 1,
                'islogin'    => $data['islogin'],
                'username'   => $data['username'],
                'starttime'  => $data['starttime'],
                'endtime'    => $data['endtime'],
                'createtime' => $current_time,
            );
            $qid = $this->insert('wenjuan', $main_row);

            //问卷详情信息
            $detail_row = array(
                'qid'        => intval($qid),
                'uid'        => intval($data['uid']),
                'title'      => $data['title'],
                'desc'       => $data['desc'],
                'content'    => $data['content'],
                'version'    => 1,
                'createtime' => $current_time,
            );

            $this->insert('wenjuan_detail', $detail_row);
            $this->commit();
            $result = array('sn' => $sn, 'status' => $status);

        }catch (Exception $e){
            $result = false;
            $this->roll_back();
            throw new Exception($e->getMessage());
        }

        return $result;
    }

    /**
     * 根据问卷ID 获取问卷详情
     * @param $sn
     * @return array|bool
     */
    public function get_wenjuan_by_sn($sn){

        $find = "sn = '%s'";
        $where = vsprintf($find, array($sn));
        $main_info = $this->fetch_row('wenjuan', $where);

        if(empty($main_info)){
            return false;
        }

        $find = "qid = %d and version = %d";
        $where = vsprintf($find, array($main_info['id'], $main_info['version']));
        $wenjuan_info = $this->fetch_row('wenjuan_detail', $where);

        if(!empty($wenjuan_info)){
            $wenjuan_info = array_merge($main_info, $wenjuan_info);
        }

        return $wenjuan_info;
    }


    /**
     * 更新答卷
     * @param $data
     * @return bool
     * @throws Exception
     */
    public function update_user_wenjuan($data){
        $result = false;
        $current_time = time();

        //查询主表
        $find = "sn = '%s'";
        $where = vsprintf($find, array($data['sn']));
        $main_info = $this->fetch_row('wenjuan', $where);

        if(empty($main_info)){
            return false;
        }

        //非自己的问卷不能编辑
        if($main_info['uid'] != $data['uid']){
            return false;
        }

        //问卷的时间对状态的影响
        if($data['starttime'] > $current_time){
            $status = self::WAIT_START;
        }else{
            $status = self::OPEN;
        }

        if($data['endtime'] <= $current_time){
            $status = self::STOP;
        }

        $main_row = array(
            'title'      => $data['title'],
            'desc'       => $data['desc'],
            'version'    => $data['version'],
            'islogin'    => $data['islogin'],
            'starttime'  => $data['starttime'],
            'endtime'    => $data['endtime'],
            'status'     => $status,
        );

        try{
            $this->begin_transaction();
            //检测版本号
            $this->update('wenjuan', $main_row, vsprintf("id = %d", array($main_info['id'])));

            $find = "qid = %d and version = %d";
            $where = vsprintf($find, array($main_info['id'], $main_info['version']));
            $detail_row = array(
                'title'      => $data['title'],
                'desc'       => $data['desc'],
                'content'    => $data['content'],
                'version'    => $data['version'],
                'updatetime' => $current_time,
            );
            $this->update('wenjuan_detail', $detail_row, $where);
            $this->commit();
            $result = array('sn' => $main_info['sn'], 'status' => $main_row['status']);
        }catch (Exception $e){
            $this->roll_back();
            throw new Exception($e->getMessage());
        }

        return $result;
    }

    /**
     * 保存问卷，之前需进行答卷状态检查
     * @param $wenjuan
     * @param $content
     * @param $user_id
     * @param $user_name
     * @return int
     */
    public function save_wenjuan_answer($wenjuan , $content, $user_id, $user_name){
        $current_time = time();
        $answer_row = array(
            'qid'        => $wenjuan['qid'],
            'uid'        => $user_id,
            'username'   => $user_name,
            'content'    => $content,
            'version'    => $wenjuan['version'],
            'createtime' => $current_time,
        );
        return $this->insert('wenjuan_answer', $answer_row);
    }


    /**
     * @param $sn
     * @param $user_id
     * @return array
     * @throws Exception
     */
    public function query_wenjuan($sn, $user_id){
        return $this->check_current_wenjuan($sn, $user_id);
    }

    /**
     * 同步问卷的结束时间与结束状态
     * @param $wenjuan
     * @return bool
     * @throws Zend_Exception
     */
    public function change_wenjuan_status($wenjuan){
        $current_time = time();
        if(!is_array($wenjuan)){
            return false;
        }

        $where = vsprintf("id = %d", array($wenjuan['id']));
        $wenjuan_row = array();

        //判断开始状态
        if(($wenjuan['starttime'] < $current_time) &&  ($wenjuan['status'] == self::WAIT_START)){
            $wenjuan_row = array('status' => self::OPEN);
        }

        //判断结束状态
        if(($wenjuan['endtime'] < $current_time) && ($wenjuan['status'] != self::STOP)){
            $wenjuan_row = array('status' => self::STOP,);
        }

        if(!empty($wenjuan_row)){
            $this->update('wenjuan', $wenjuan_row, $where);
        }

        return true;
    }

    /**
     * 答卷统计引擎
     * @param $sn
     * @return bool
     */
    public function get_wenjuan_statistics($sn){
        $where = sprintf("sn = '%s'", $sn);
        $main_info = $this->fetch_row('wenjuan', $where);

        if(empty($main_info)){
            return false;
        }

        $find = "qid = %d and version = %d";
        $where = vsprintf($find, array($main_info['id'], $main_info['version']));
        $wenjuan_info = $this->fetch_row('wenjuan_detail', $where);

        if(empty($wenjuan_info)){
            return false;
        }

        //获取所有答卷
        $order = "createtime DESC";
        $answer_list = $this->fetch_all('wenjuan_answer', $where, $order);
        if(empty($answer_list)){
            return false;
        }

        //获取原始问卷详情
        $wenjuan_info = array_merge($main_info, $wenjuan_info);
        $wenjuan  = json_decode($wenjuan_info['content'], true);
        $wenjuan  = $this->pre_statistics($wenjuan);

        //逐个统计
        $count = 0;
        foreach($answer_list as $item){
            $answer_time = date('Y-m-d H:i:s', $item['createtime']);
            $answer = json_decode(strtolower($item['content']), true);
            $this->statistics_engine($wenjuan, $answer, $answer_time);
            $count++;
        }
        
        $wenjuan_info['count']   = $count;
        $wenjuan_info['content'] = array_values($wenjuan);
        return $wenjuan_info;
    }

    /**
     * 问卷预处理，把原始问卷组装成统计结果格式，筛选出需要统计的项目
     * @param $wenjuan
     * @return array
     */
    private function pre_statistics($wenjuan){

        $result = array();
        foreach($wenjuan as $item){
            $type = strtolower($item['field_type']);

            //常规题型
            if(in_array($type, array('radio', 'checkboxes', 'dropdown', 'singlepic', 'mutipic'))){
                $options = array();
                foreach($item['field_options']['options'] as $val){
                    if(in_array($type, array('singlepic', 'mutipic'))){
                        $options[] = array('label' => $val['label'], 'uri' => $val['uri'], 'thumb' => $val['thumb'], 'amount' => 0);
                    }else{
                        $options[] = array('label' => $val['label'], 'amount' => 0);
                    }

                }

                //增加其它项的统计
                if(isset($item['field_options']['include_other_option']) && $item['field_options']['include_other_option']){
                    $options[] = array("label" => "其它", "amount" => 0);
                }
                $item['field_options']['options'] = $options;
                $result[$item['cid']] = $item;

            //矩阵题型
            }elseif(in_array($type, array('mutimatrix', 'singlematrix'))){

                $arrTemp = $options = array();
                if(!empty($item['field_options']['cols']) && is_array($item['field_options']['cols'])){
                    foreach($item['field_options']['cols'] as $val){
                        $arrTemp[] = array('label' => $val['label'], 'amount' => 0);
                    }
                }

                if(!empty($item['field_options']['rows']) && is_array($item['field_options']['rows'])){
                    foreach($item['field_options']['rows'] as $val){
                        $options[] = array('label' => $val['label'], 'items' => $arrTemp);
                    }
                }

                $item['field_options']['options'] = $options;
                $result[$item['cid']] = $item;

            //简答题、填空题
            }elseif(in_array($type, array('mutitext', 'text'))){
                $item['field_options']['options'] = array();
                $result[$item['cid']] = $item;

            //打分题
            }elseif(in_array($type, array('grade'))){
                $total = (int)$item['field_options']['max_score'];
                $item['field_options']['options'] = $this->grade_score_options($total);
                $result[$item['cid']] = $item;
            }else{
                unset($item);
            }
        }

        return $result;
    }


    /**
     * 答题统计引擎
     * @param $wenjuan
     * @param $answer
     * @param $answer_time
     */
    private function statistics_engine(&$wenjuan, $answer, $answer_time){
        $need_cids = array_keys($wenjuan);
        foreach($answer as $item){
            if(!in_array($item['cid'], $need_cids)){
                continue;
            }

            $default = &$wenjuan[$item['cid']];
            $type = strtolower($default['field_type']);

            //普通题型的统计
            if(in_array($type, array('radio', 'checkboxes', 'dropdown', 'singlepic', 'mutipic'))){

                //选项和答案的关系
                foreach($default['field_options']['options'] as &$val){
                    //统计其它选项
                    if(($val['label'] == '其它') && !empty($item['result_other'])){
                        $val['amount'] += 1;
                    }

                    if(in_array(strtolower($val['label']), $item['result'])){
                        $val['amount'] += 1;
                    }
                }
            //矩阵题型的统计
            }elseif(in_array($type, array('mutimatrix', 'singlematrix'))){

                //循环没一列的数据
                foreach($item['result'] as $col){
                    foreach($default['field_options']['options'] as &$row){
                        foreach($row['items'] as &$val){
                            if(in_array(strtolower($val['label']), $col[$row['label']])){
                                $val['amount'] += 1;
                            }
                        }
                    }
                }

            //简答题
            }elseif(in_array($type, array('mutitext', 'text'))){
                if(count($default['field_options']['options']) < 10){
                    $default['field_options']['options'][] = array('result' => $item['result'], 'time' => $answer_time);
                }

            //打分题
            }elseif(in_array($type, array('grade'))){
                foreach($default['field_options']['options'] as &$val){
                    if(!empty($item['result']) && ($val['label'] == $item['result'])){
                        $val['amount'] += 1;
                    }
                }
            }
        }

        return $wenjuan;
    }


    /**
     * 依据打分题型，获取子项
     * @param int $num
     * @return array
     */
    private function grade_score_options(int $num){
        $num = min(10, $num);
        $num = max(1, $num);

        $options = array();
        for($i = 1; $i <= $num; $i++){
            $options[] = array('label' => $i, 'amount' => 0);
        }

        return $options;
    }

    /**
     * 判断状态
     * 判断开始结束时间
     * 判断是否已经答过该题
     * 检测问卷状态
     * @param $sn
     * @param $user_id
     * @return array
     */
    private function check_current_wenjuan($sn, $user_id){
        $current_time = time();
        $find = "sn = '%s'";
        $where = vsprintf($find, array($sn));
        $main_info = $this->fetch_row('wenjuan', $where);

        do{
            //检查问卷是否存在
            if(empty($main_info)){
                $result = array('ret'=> 10, 'data' => $main_info, 'msg' => "答卷不存在");
                break;
            }

            //该问卷未开始 ->状态
            if($main_info['status'] == self::WAIT_START){
                $result = array('ret'=> 20, 'data' => $main_info, 'msg' => "该问卷状态未开始");
                break;
            }

            //问卷结束 ->状态
            if($main_info['status'] == self::STOP){
                $result = array('ret'=> 21, 'data' => $main_info, 'msg'=> "该问卷状态已结束");
                break;
            }

            //问卷未开始，开始时间的判断
            if($main_info['starttime'] > $current_time){
                $result = array('ret'=> 30, 'data' => $main_info, 'msg' => "该问卷时间未开始");
                break;
            }

            //问卷已结束，结束时间的判断
            if($main_info['endtime'] < $current_time){
                $result = array('ret'=> 31, 'data' => $main_info, 'msg' => "该问卷时间已结束");
                break;
            }

            //检查问卷是否需要登录
            if(($main_info['islogin'] == 1) && ($user_id == $_COOKIE['btf__Session'])){
                $result = array('ret'=> 1, 'data' => $main_info, 'msg' => "请先登录");
                break;
            }

            //检查答题人是否已答过问卷
            $find  = "uid = '%s' and qid = %d";
            $where = vsprintf($find, array($user_id, $main_info['id']));
            $answer_info = $this->fetch_one('wenjuan_answer', 'id', $where);

            if(!empty($answer_info)){
                $result = array('ret'=> 11, 'data' => $main_info, 'msg' => "该问卷已答过");
                break;
            }

            //查询问卷明细
            $find = "qid = %d and version = %d";
            $where = vsprintf($find, array($main_info['id'], $main_info['version']));
            $wenjuan_info = $this->fetch_row('wenjuan_detail', $where);
            if(empty($wenjuan_info)){
                $result = array('ret'=> 12, 'data' => $main_info, 'msg' => "该问卷版本不存在");
                break;
            }

            $wenjuan_info = array_merge($main_info, $wenjuan_info);
            $wenjuan_info['content'] = json_decode($wenjuan_info['content'], true);
            $result  = array('ret'=> 0,  'data' => $wenjuan_info, 'msg' => null);

        }while(false);

        return $result;
    }

    /**
     * 生成问卷序列
     * @return string
     */
    private function make_sn(){
        return substr(md5(uniqid('wenjuan').rand(1, 100)), 10, 10);
    }


    /**
     * 校验问卷输入数据
     * @param $content
     * @return bool
     */
    public function check_wenjuan_input($content){
        $result = false;
        $content = json_decode($content, true);
        do{
            if(empty($content) || !is_array($content)){
                break;
            }

            //校验各个子选项
            foreach($content as $item){
                $type = strtolower(trim($item['field_type']));
                $array = array('radio', 'checkboxes', 'dropdown', 'text', 'grade',
                    'mutitext', 'singlematrix', 'mutimatrix', 'singlepic', 'mutipic');

                if(!in_array($type, $array)){
                    break;
                }

                $method = "check_input_".$type;
                $result = $this->{$method}($item);

                if($result == false){
                    break;
                }
            }

        }while(false);

        return $result;
    }

    /**
     * 校验radio类型的题目
     * @param $field
     * @return bool
     */
    private function check_input_radio($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        $min = 1;
        if(empty($field['field_options']['options']) || count($field['field_options']['options']) < $min){
            return false;
        }

        return true;
    }

    /**
     * 校验checkboxes类型的题目
     * @param $field
     * @return bool
     */
    private function check_input_checkboxes($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        $total = count($field['field_options']['options']);
        if(isset($field['field_options']['include_other_option']) && $field['field_options']['include_other_option']){
            $total += 1;
        }

        $min = (int)$field['field_options']['min'];
        $min = max(1, $min);
        if(empty($field['field_options']['options']) || $total < $min){
            return false;
        }

        return true;
    }

    /**
     * 校验dropdown类型的题目
     * @param $field
     * @return bool
     */
    private function check_input_dropdown($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        $min = 1;
        if(empty($field['field_options']['options']) || count($field['field_options']['options']) < $min){
            return false;
        }

        return true;
    }

    /**
     * 校验text类型的题目
     * @param $field
     * @return bool
     */
    private function check_input_text($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        return true;
    }

    /**
     * 校验mutitext类型的题目
     *
     * $min_len = (int)$field['field_options']['minlength'];
     * $max_len = (int)$field['field_options']['maxlength'];
     * @param $field
     * @return bool
     */
    private function check_input_mutitext($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        return true;
    }

    /**
     * 检测单选矩阵题型
     * @param $field
     * @return bool
     */
    private function check_input_singlematrix($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        if(empty($field['field_options']['cols']) || empty($field['field_options']['rows'])){
            return false;
        }

        return true;
    }

    /**
     * 检测单选矩阵题型
     * @param $field
     * @return bool
     */
    private function check_input_mutimatrix($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        if(empty($field['field_options']['cols']) || empty($field['field_options']['rows'])){
            return false;
        }

        return true;
    }

    /**
     * 校验图片单选类型的题目
     * @param $field
     * @return bool
     */
    private function check_input_singlepic($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        return true;
    }


    /**
     * 校验图片多选类型的题目
     * @param $field
     * @return bool
     */
    private function check_input_mutipic($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        return true;
    }


    /**
     * 星星打分题型
     * @param $field
     * @return bool
     */
    private function check_input_grade($field){
        if(empty($field) || !is_array($field)){
            return false;
        }

        if(empty($field['label'])){
            return false;
        }

        $score = (int)$field['field_options']['max_score'];
        if($score < 1 || $score > 10){
            return false;
        }

        return true;
    }

    /**
     * 生成约定的下载统计格式
     * @param $sn
     * @return bool
     */
    public function get_wenjuan_data($sn){
        $where = sprintf("sn = '%s'", $sn);
        $main_info = $this->fetch_row('wenjuan', $where);

        if(empty($main_info)){
            return false;
        }

        $find = "qid = %d and version = %d";
        $where = vsprintf($find, array($main_info['id'], $main_info['version']));
        $wenjuan_info = $this->fetch_row('wenjuan_detail', $where);
        if(empty($wenjuan_info)){
            return false;
        }

        //获取所有答卷
        $order = "createtime DESC";
        $answer_list = $this->fetch_all('wenjuan_answer', $where, $order);

        //获取原始问卷详情
        $wenjuan_info = array_merge($main_info, $wenjuan_info);
        $wenjuan = json_decode($wenjuan_info['content'], true);
        $wenjuan = $this->pre_wenjuan_data($wenjuan);

        //组装待下载的数据
        $list = array();
        if(!empty($answer_list)){
            foreach($answer_list as $item){
                $list[] = $this->make_wenjuan_data($wenjuan, $item);
            }
        }

        //生成excel头部信息
        $header = $this->make_wenjuan_header($wenjuan);
        array_unshift($list, $header);

        //生成问卷信息
        $result = array('main' => $wenjuan_info, 'list'  => $list);
        return $result;
    }

    /**
     * 预生成问卷统计格式
     * @param $wenjuan
     * @return array
     */
    protected function pre_wenjuan_data($wenjuan){
        $result = array();
        foreach($wenjuan as $item){
            $result[$item['cid']] = array('label' => $item['label'], 'field_type' => $item['field_type']);
        }
        return $result;
    }

    /**
     * 生成excel头部信息
     * @param $wenjuan
     * @return array
     */
    protected function make_wenjuan_header($wenjuan){
        $header = array(
            'username'   => '姓名',
            'createtime' => '答题时间',
        );

        $count = 1;
        foreach($wenjuan as $key => $item){
            $header[$key] = "Q".$count.":".$item['label'];
            $count++;
        }
        return $header;
    }


    /**
     * 统计数据的格式
     * @param $wenjuan
     * @param $answer
     *
     * @return array
     */
    protected function make_wenjuan_data($wenjuan, $answer){

        $content = json_decode($answer['content'], true);
        $temp = array();
        if(!empty($content) && is_array($content)){
            foreach($content as $val){
                $temp[$val['cid']] = $val;
            }
        }

        //查询用户真实姓名
        if($answer['username'] != 'anonymous'){
            $where = vsprintf("uid = %d", array($answer['uid']));
            $user_info = $this->fetch_row('users', $where);
            $user_info['realname'] = empty($user_info['realname']) ? '*' : $user_info['realname'];
        }else{
            $user_info['realname'] = '匿名';
        }

        $row = array(
            'username'   => $answer['username'] .'('. $user_info['realname'] .')',
            'createtime' => date('Y-m-d H:i:s', $answer['createtime']),
        );

        //开始组装数据
        foreach($wenjuan as $key => $val){

            if(!isset($temp[$key])){
                $row[$key] = "";
                continue;
            }

            //根据不同题目类型，组装答案
            switch(strtolower($val['field_type'])){
                case "radio":
                    $row[$key] = $this->get_answer_radio($temp[$key]);
                    break;
                case "checkboxes":
                    $row[$key] = $this->get_answer_checkboxes($temp[$key]);
                    break;
                case "dropdown":
                    $row[$key] = $this->get_answer_dropdown($temp[$key]);
                    break;
                case "text":
                    $row[$key] = $this->get_answer_text($temp[$key]);
                    break;
                case "mutitext":
                    $row[$key] = $this->get_answer_mutitext($temp[$key]);
                    break;
                case "singlepic":
                    $row[$key] = $this->get_answer_singlePic($temp[$key]);
                    break;
                case "mutipic":
                    $row[$key] = $this->get_answer_mutiPic($temp[$key]);
                    break;
                case "singlematrix":
                    $row[$key] = $this->get_answer_singleMatrix($temp[$key]);
                    break;
                case "mutimatrix":
                    $row[$key] = $this->get_answer_mutiMatrix($temp[$key]);
                    break;
                default:
                    $row[$key] = '';
            }
        }
        
        return $row;
    }

    /**
     * 单选题答案
     * @param $answer
     * @return string
     */
    private function get_answer_radio($answer){
        $result = implode(',', $answer['result']);
        if(isset($answer['result_other']) && !empty($answer['result_other'])){
            $result = empty($result) ? $answer['result_other'] : $result.','.$answer['result_other'];
        }

        return $result;
    }

    /**
     * 多选题答案
     * @param $answer
     * @return string
     */
    private function get_answer_checkboxes($answer){
        $result = implode(',', $answer['result']);
        if(isset($answer['result_other']) && !empty($answer['result_other'])){
            $result = empty($result) ? $answer['result_other'] : $result.','.$answer['result_other'];
        }
        return $result;
    }

    /**
     * 下拉题答案
     * @param $answer
     * @return string
     */
    private function get_answer_dropdown($answer){
        $result = implode(',', $answer['result']);
        return $result;
    }

    /**
     * 填空题答案
     * @param $answer
     * @return string
     */
    private function get_answer_text($answer){
        $result = $answer['result'];
        return $result;
    }


    /**
     * 简答题答案
     * @param $answer
     * @return string
     */
    private function get_answer_mutitext($answer){
        $result = $answer['result'];
        return $result;
    }

    /**
     * 单选图片题答案
     * @param $answer
     * @return string
     */
    private function get_answer_singlePic($answer){
        $result = implode(',', $answer['result']);
        return $result;
    }

    /**
     * 多选图片题答案
     * @param $answer
     * @return string
     */
    private function get_answer_mutiPic($answer){
        $result = implode(',', $answer['result']);
        return $result;
    }

    /**
     * 单选矩阵题答案
     * @param $answer
     * @return string
     */
    private function get_answer_singleMatrix($answer){
        $result = '';

        foreach($answer['result'] as $item){
            foreach($item as $key => $val){
                $result .= $key.":".implode(',', $val). " | ";
            }
        }
        return trim($result, ' | ');
    }

    /**
     * 多选矩阵题答案
     * @param $answer
     * @return string
     */
    private function get_answer_mutiMatrix($answer){
        $result = '';
        foreach($answer['result'] as $item){
            foreach($item as $key => $val){
                $result .= $key.":".implode(',', $val). " | ";
            }
        }
        return trim($result, ' | ');
    }

    /**
     * 生成EXCEL序列
     * @param int $length
     * @return array
     */
    public function get_excel_column($length=52){
        $length = min(676, $length);
        $result = array();
        $zimu = array("A","B","C","D","E","F","G","H","I","J","K","L",
            "M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
        for($i=0; $i< $length; $i++){
            $index = floor($i/26);
            $mod   = $i%26;
            if($index < 1){
                $result[] = $zimu[$i];
            }else{
                $result[] = $zimu[$index-1].$zimu[$mod];
            }
        }
        return $result;
    }
}
