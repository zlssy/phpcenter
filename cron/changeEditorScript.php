<?php

//将ckeditor编辑器切换为umeditor上线脚本

if(php_sapi_name() != 'cli')
{
    exit('access denied!');
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(0);

ob_start();
include dirname(dirname(__FILE__)) . '/system/system.php';

$_SERVER['REMOTE_ADDR'] = '10.128.208.176';
AWS_APP::run();
ob_end_clean();

require ROOT_PATH . 'system/config/database.php';

$db_master = $config['master'];
$db_prefix = $config['prefix'];
unset($config);

$pdo_obj = new mysqli($db_master['host'], $db_master['username'], $db_master['password'], $db_master['dbname']);
$pdo_obj->set_charset('utf8');
$question_table = "{$db_prefix}question";
$answer_table = "{$db_prefix}answer";
$article_table = "{$db_prefix}article";

//处理question
$question_query = $pdo_obj->query("select question_id,question_detail from {$question_table} order by question_id desc");
while($question = $question_query->fetch_assoc())
{
    $tm_question_id = intval($question['question_id']);
    $tm_question_detail = htmlspecialchars_decode($question['question_detail']);
    $tm_question_detail = html_purify($tm_question_detail);
    $tm_question_detail = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($tm_question_detail)));
    echo $tm_question_id . PHP_EOL;
    $sql = sprintf("update %s set question_detail='%s' where question_id=%d", $question_table, $tm_question_detail, $tm_question_id);
    $pdo_obj->query($sql);
}
echo 'question update finish...' . PHP_EOL;

//处理answer
$answer_query = $pdo_obj->query("select answer_id,answer_content from {$answer_table} order by answer_id desc");
while($answer = $answer_query->fetch_assoc())
{
    $tm_answer_id = intval($answer['answer_id']);
    $tm_answer_content = htmlspecialchars_decode($answer['answer_content']);
    $tm_answer_content = html_purify($tm_answer_content);
    $tm_answer_content = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($tm_answer_content)));
    echo $tm_answer_id . PHP_EOL;
    $sql = sprintf("update %s set answer_content='%s' where answer_id=%d", $answer_table, $tm_answer_content, $tm_answer_id);
    $pdo_obj->query($sql);
}
echo 'answer update finish...' . PHP_EOL;

//处理article
$article_query = $pdo_obj->query("select id,message from {$article_table} order by id desc");
while($article = $article_query->fetch_assoc())
{
    $tm_id = intval($article['id']);
    $tm_message = htmlspecialchars_decode($article['message']);
    $tm_message = html_purify($tm_message);
    $tm_message = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($tm_message)));
    echo $tm_id . PHP_EOL;
    $sql = sprintf("update %s set message='%s' where id=%d", $article_table, $tm_message, $tm_id);
    $pdo_obj->query($sql);
}
echo 'article update finish....' . PHP_EOL;

//处理话题topic
$topic_table = "{$db_prefix}topic";
$topic_query = $pdo_obj->query("select topic_id,topic_description from {$topic_table} order by topic_id desc");
while($topic = $topic_query->fetch_assoc())
{
    $tm_topic_id = intval($topic['topic_id']);
    $tm_topic_description = htmlspecialchars_decode($topic['topic_description']);
    $tm_topic_description = html_purify($tm_topic_description);
    $tm_topic_description = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($tm_topic_description)));
    echo $tm_topic_id . PHP_EOL;
    $sql = sprintf("update %s set topic_description='%s' where topic_id=%d", $topic_table, $tm_topic_description, $tm_topic_id);
    $pdo_obj->query($sql);
}
echo 'topic update finish....' . PHP_EOL;

//处理用户修改日志
$user_history_table = "{$db_prefix}user_action_history_data";
$article_query = $pdo_obj->query("select history_id,associate_content,associate_attached from {$user_history_table} order by history_id desc");
while($article = $article_query->fetch_assoc())
{
    $tm_history_id = intval($article['history_id']);
    $tm_associate_content = htmlspecialchars_decode($article['associate_content']);
    $tm_associate_content = html_purify($tm_associate_content);
    $tm_associate_content = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($tm_associate_content)));
    $tm_associate_attached = htmlspecialchars_decode($article['associate_attached']);
    $tm_associate_attached = html_purify($tm_associate_attached);
    $tm_associate_attached = FORMAT::parse_attachs(nl2br(FORMAT::parse_bbcode($tm_associate_attached)));
    echo $tm_history_id . PHP_EOL;
    $sql = sprintf("update %s set associate_content='%s',associate_attached='%s' where history_id=%d", $user_history_table, $tm_associate_content, $tm_associate_attached, $tm_history_id);
    $pdo_obj->query($sql);
}
echo 'user action history update finish....' . PHP_EOL;

echo 'all done...' . PHP_EOL;