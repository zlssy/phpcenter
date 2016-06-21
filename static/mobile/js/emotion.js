//手机端表情插件	add by yee
(function($){
	var _init_template = '<div class="smile_box_panel" id="smile_box"><div class="j_smile smile_container smile_smile"><ul class="smile_list swiper-wrapper"><li class="swiper-slide"><div><a href="javascript:;" data-smile="%E5%91%B5%E5%91%B5"><span class="smile_popo" style="background-position-y:0"></span></a> <a href="javascript:;" data-smile="%E5%93%88%E5%93%88"><span class="smile_popo" style="background-position-y:-30px"></span></a> <a href="javascript:;" data-smile="%E5%90%90%E8%88%8C"><span class="smile_popo" style="background-position-y:-60px"></span></a> <a href="javascript:;" data-smile="%E5%95%8A"><span class="smile_popo" style="background-position-y:-90px"></span></a> <a href="javascript:;" data-smile="%E9%85%B7"><span class="smile_popo" style="background-position-y:-120px"></span></a> <a href="javascript:;" data-smile="%E6%80%92"><span class="smile_popo" style="background-position-y:-150px"></span></a> <a href="javascript:;" data-smile="%E5%BC%80%E5%BF%83"><span class="smile_popo" style="background-position-y:-180px"></span></a> <a href="javascript:;" data-smile="%E6%B1%97"><span class="smile_popo" style="background-position-y:-210px"></span></a> <a href="javascript:;" data-smile="%E6%B3%AA"><span class="smile_popo" style="background-position-y:-240px"></span></a> <a href="javascript:;" data-smile="%E9%BB%91%E7%BA%BF"><span class="smile_popo" style="background-position-y:-270px"></span></a> <a href="javascript:;" data-smile="%E9%84%99%E8%A7%86"><span class="smile_popo" style="background-position-y:-300px"></span></a> <a href="javascript:;" data-smile="%E4%B8%8D%E9%AB%98%E5%85%B4"><span class="smile_popo" style="background-position-y:-330px"></span></a> <a href="javascript:;" data-smile="%E7%9C%9F%E6%A3%92"><span class="smile_popo" style="background-position-y:-360px"></span></a> <a href="javascript:;" data-smile="%E9%92%B1"><span class="smile_popo" style="background-position-y:-390px"></span></a> <a href="javascript:;" data-smile="%E7%96%91%E9%97%AE"><span class="smile_popo" style="background-position-y:-420px"></span></a> <a href="javascript:;" data-smile="%E9%98%B4%E9%99%A9"><span class="smile_popo" style="background-position-y:-450px"></span></a> <a href="javascript:;" data-smile="%E5%90%90"><span class="smile_popo" style="background-position-y:-480px"></span></a> <a href="javascript:;" data-smile="%E5%92%A6"><span class="smile_popo" style="background-position-y:-510px"></span></a> <a href="javascript:;" data-smile="%E5%A7%94%E5%B1%88"><span class="smile_popo" style="background-position-y:-540px"></span></a> <a href="javascript:;" data-smile="%E8%8A%B1%E5%BF%83"><span class="smile_popo" style="background-position-y:-570px"></span></a> <a href="javascript:;" data-smile="%E5%91%BC~"><span class="smile_popo" style="background-position-y:-600px"></span></a> <a href="javascript:;" data-smile="%E7%AC%91%E7%9C%BC"><span class="smile_popo" style="background-position-y:-630px"></span></a> <a href="javascript:;" data-smile="%E5%86%B7"><span class="smile_popo" style="background-position-y:-660px"></span></a> <a href="javascript:;" data-smile="%E5%A4%AA%E5%BC%80%E5%BF%832"><span class="smile_popo" style="background-position-y:-690px"></span></a> <a href="javascript:;" data-smile="%E6%BB%91%E7%A8%BD"><span class="smile_popo" style="background-position-y:-720px"></span></a> <a href="javascript:;" data-smile="%E5%8B%89%E5%BC%BA"><span class="smile_popo" style="background-position-y:-750px"></span></a> <a href="javascript:;" data-smile="%E7%8B%82%E6%B1%97"><span class="smile_popo" style="background-position-y:-780px"></span></a> <a href="javascript:;" data-smile="%E4%B9%96"><span class="smile_popo" style="background-position-y:-810px"></span></a></div></li><li class="swiper-slide"><div><a href="javascript:;" data-smile="%E7%9D%A1%E8%A7%89"><span class="smile_popo" style="background-position-y:-840px"></span></a> <a href="javascript:;" data-smile="%E6%83%8A%E5%93%AD"><span class="smile_popo" style="background-position-y:-870px"></span></a> <a href="javascript:;" data-smile="%E5%8D%87%E8%B5%B7"><span class="smile_popo" style="background-position-y:-900px"></span></a> <a href="javascript:;" data-smile="%E6%83%8A%E8%AE%B6"><span class="smile_popo" style="background-position-y:-930px"></span></a> <a href="javascript:;" data-smile="%E5%96%B7"><span class="smile_popo" style="background-position-y:-960px"></span></a> <a href="javascript:;" data-smile="%E7%88%B1%E5%BF%83"><span class="smile_popo" style="background-position-y:-990px"></span></a> <a href="javascript:;" data-smile="%E5%BF%83%E7%A2%8E"><span class="smile_popo" style="background-position-y:-1020px"></span></a> <a href="javascript:;" data-smile="%E7%8E%AB%E7%91%B0"><span class="smile_popo" style="background-position-y:-1050px"></span></a> <a href="javascript:;" data-smile="%E7%A4%BC%E7%89%A9"><span class="smile_popo" style="background-position-y:-1080px"></span></a> <a href="javascript:;" data-smile="%E5%BD%A9%E8%99%B9"><span class="smile_popo" style="background-position-y:-1110px"></span></a> <a href="javascript:;" data-smile="%E6%98%9F%E6%98%9F%E6%9C%88%E4%BA%AE"><span class="smile_popo" style="background-position-y:-1140px"></span></a> <a href="javascript:;" data-smile="%E5%A4%AA%E9%98%B3"><span class="smile_popo" style="background-position-y:-1170px"></span></a> <a href="javascript:;" data-smile="%E9%92%B1%E5%B8%81"><span class="smile_popo" style="background-position-y:-1200px"></span></a> <a href="javascript:;" data-smile="%E7%81%AF%E6%B3%A1"><span class="smile_popo" style="background-position-y:-1230px"></span></a> <a href="javascript:;" data-smile="%E8%8C%B6%E6%9D%AF"><span class="smile_popo" style="background-position-y:-1260px"></span></a> <a href="javascript:;" data-smile="%E8%9B%8B%E7%B3%95"><span class="smile_popo" style="background-position-y:-1290px"></span></a> <a href="javascript:;" data-smile="%E9%9F%B3%E4%B9%90"><span class="smile_popo" style="background-position-y:-1320px"></span></a> <a href="javascript:;" data-smile="haha"><span class="smile_popo" style="background-position-y:-1350px"></span></a> <a href="javascript:;" data-smile="%E8%83%9C%E5%88%A9"><span class="smile_popo" style="background-position-y:-1380px"></span></a> <a href="javascript:;" data-smile="%E5%A4%A7%E6%8B%87%E6%8C%87"><span class="smile_popo" style="background-position-y:-1410px"></span></a> <a href="javascript:;" data-smile="%E5%BC%B1"><span class="smile_popo" style="background-position-y:-1440px"></span></a> <a href="javascript:;" data-smile="OK"><span class="smile_popo" style="background-position-y:-1470px"></span></a> <a href="javascript:;" data-smile="Kiss~"><span class="smile_tusiji" style="background-position-y:0"></span></a> <a href="javascript:;" data-smile="Love"><span class="smile_tusiji" style="background-position-y:-35px"></span></a> <a href="javascript:;" data-smile="Yeah"><span class="smile_tusiji" style="background-position-y:-70px"></span></a> <a href="javascript:;" data-smile="%E5%95%8A!"><span class="smile_tusiji" style="background-position-y:-105px"></span></a> <a href="javascript:;" data-smile="%E8%83%8C%E6%89%AD"><span class="smile_tusiji" style="background-position-y:-140px"></span></a> <a href="javascript:;" data-smile="%E9%A1%B6%E8%B5%B7"><span class="smile_tusiji" style="background-position-y:-175px"></span></a></div></li><li class="swiper-slide"><div><a href="javascript:;" data-smile="%E6%8A%96%E8%83%B8"><span class="smile_tusiji" style="background-position-y:-210px"></span></a> <a href="javascript:;" data-smile="88"><span class="smile_tusiji" style="background-position-y:-245px"></span></a> <a href="javascript:;" data-smile="%E6%B1%97!"><span class="smile_tusiji" style="background-position-y:-280px"></span></a> <a href="javascript:;" data-smile="%E7%9E%8C%E7%9D%A1"><span class="smile_tusiji" style="background-position-y:-315px"></span></a> <a href="javascript:;" data-smile="%E9%B2%81%E6%8B%89"><span class="smile_tusiji" style="background-position-y:-350px"></span></a> <a href="javascript:;" data-smile="%E6%8B%8D%E7%A0%96"><span class="smile_tusiji" style="background-position-y:-385px"></span></a> <a href="javascript:;" data-smile="%E6%8F%89%E8%84%B8"><span class="smile_tusiji" style="background-position-y:-420px"></span></a> <a href="javascript:;" data-smile="%E7%94%9F%E6%97%A5%E5%BF%AB%E4%B9%90"><span class="smile_tusiji" style="background-position-y:-455px"></span></a> <a href="javascript:;" data-smile="%E8%B5%96%E7%9A%AE"><span class="smile_ali" style="background-position-y:0"></span></a> <a href="javascript:;" data-smile="%E6%84%9F%E5%8A%A8"><span class="smile_ali" style="background-position-y:-35px"></span></a> <a href="javascript:;" data-smile="%E6%83%8A%E8%AE%B62"><span class="smile_ali" style="background-position-y:-70px"></span></a> <a href="javascript:;" data-smile="%E6%80%92%E6%B0%94"><span class="smile_ali" style="background-position-y:-105px"></span></a> <a href="javascript:;" data-smile="%E5%93%AD%E6%B3%A3"><span class="smile_ali" style="background-position-y:-140px"></span></a> <a href="javascript:;" data-smile="%E5%90%83%E6%83%8A"><span class="smile_ali" style="background-position-y:-175px"></span></a> <a href="javascript:;" data-smile="%E5%98%B2%E5%BC%84"><span class="smile_ali" style="background-position-y:-210px"></span></a> <a href="javascript:;" data-smile="%E9%A3%98%E8%BF%87"><span class="smile_ali" style="background-position-y:-245px"></span></a> <a href="javascript:;" data-smile="%E8%BD%AC%E5%9C%88%E5%93%AD"><span class="smile_ali" style="background-position-y:-280px"></span></a> <a href="javascript:;" data-smile="%E7%A5%9E%E7%BB%8F%E7%97%85"><span class="smile_ali" style="background-position-y:-315px"></span></a> <a href="javascript:;" data-smile="%E6%8F%AA%E8%80%B3%E6%9C%B5"><span class="smile_ali" style="background-position-y:-350px"></span></a> <a href="javascript:;" data-smile="%E6%83%8A%E6%B1%97"><span class="smile_ali" style="background-position-y:-385px"></span></a> <a href="javascript:;" data-smile="%E9%9A%90%E8%BA%AB"><span class="smile_ali" style="background-position-y:-420px"></span></a> <a href="javascript:;" data-smile="%E4%B8%8D%E8%A6%81%E5%98%9B"><span class="smile_ali" style="background-position-y:-455px"></span></a> <a href="javascript:;" data-smile="%E9%81%81"><span class="smile_ali" style="background-position-y:-490px"></span></a> <a href="javascript:;" data-smile="%E4%B8%8D%E5%85%AC%E5%B9%B3"><span class="smile_ali" style="background-position-y:-525px"></span></a> <a href="javascript:;" data-smile="%E7%88%AC%E6%9D%A5%E4%BA%86"><span class="smile_ali" style="background-position-y:-560px"></span></a> <a href="javascript:;" data-smile="%E8%9B%8B%E8%8A%B1%E5%93%AD"><span class="smile_ali" style="background-position-y:-595px"></span></a> <a href="javascript:;" data-smile="%E6%B8%A9%E6%9A%96"><span class="smile_ali" style="background-position-y:-630px"></span></a> <a href="javascript:;" data-smile="%E7%82%B9%E5%A4%B4"><span class="smile_ali" style="background-position-y:-665px"></span></a></div></li><li class="swiper-slide"><div><a href="javascript:;" data-smile="%E6%92%92%E9%92%B1"><span class="smile_ali" style="background-position-y:-700px"></span></a> <a href="javascript:;" data-smile="%E7%8C%AE%E8%8A%B1"><span class="smile_ali" style="background-position-y:-735px"></span></a> <a href="javascript:;" data-smile="%E5%AF%92"><span class="smile_ali" style="background-position-y:-770px"></span></a> <a href="javascript:;" data-smile="%E5%82%BB%E7%AC%91"><span class="smile_ali" style="background-position-y:-805px"></span></a> <a href="javascript:;" data-smile="%E6%89%AD%E6%89%AD"><span class="smile_ali" style="background-position-y:-840px"></span></a> <a href="javascript:;" data-smile="%E7%96%AF"><span class="smile_ali" style="background-position-y:-875px"></span></a> <a href="javascript:;" data-smile="%E6%8A%93%E7%8B%82"><span class="smile_ali" style="background-position-y:-910px"></span></a> <a href="javascript:;" data-smile="%E6%8A%93"><span class="smile_ali" style="background-position-y:-945px"></span></a> <a href="javascript:;" data-smile="%E8%9C%B7"><span class="smile_ali" style="background-position-y:-980px"></span></a> <a href="javascript:;" data-smile="%E6%8C%A0%E5%A2%99"><span class="smile_ali" style="background-position-y:-1015px"></span></a> <a href="javascript:;" data-smile="%E7%8B%82%E7%AC%91"><span class="smile_ali" style="background-position-y:-1050px"></span></a> <a href="javascript:;" data-smile="%E6%8A%B1%E6%9E%95"><span class="smile_ali" style="background-position-y:-1085px"></span></a> <a href="javascript:;" data-smile="%E5%90%BC%E5%8F%AB"><span class="smile_ali" style="background-position-y:-1120px"></span></a> <a href="javascript:;" data-smile="%E5%9A%B7"><span class="smile_ali" style="background-position-y:-1155px"></span></a> <a href="javascript:;" data-smile="%E5%94%A0%E5%8F%A8"><span class="smile_ali" style="background-position-y:-1190px"></span></a> <a href="javascript:;" data-smile="%E6%8D%8F%E8%84%B8"><span class="smile_ali" style="background-position-y:-1225px"></span></a> <a href="javascript:;" data-smile="%E7%8B%82%E7%AC%912"><span class="smile_ali" style="background-position-y:-1260px"></span></a> <a href="javascript:;" data-smile="%E9%83%81%E9%97%B7"><span class="smile_ali" style="background-position-y:-1295px"></span></a> <a href="javascript:;" data-smile="%E6%BD%9C%E6%B0%B4"><span class="smile_ali" style="background-position-y:-1330px"></span></a> <a href="javascript:;" data-smile="%E5%BC%80%E5%BF%83"><span class="smile_ali" style="background-position-y:-1365px"></span></a> <a href="javascript:;" data-smile="%E5%86%B7%E7%AC%91%E8%AF%9D"><span class="smile_ali" style="background-position-y:-1400px"></span></a> <a href="javascript:;" data-smile="%E9%A1%B6"><span class="smile_ali" style="background-position-y:-1435px"></span></a> <a href="javascript:;" data-smile="%E6%BD%9C"><span class="smile_ali" style="background-position-y:-1470px"></span></a> <a href="javascript:;" data-smile="%E7%94%BB%E5%9C%88%E5%9C%88"><span class="smile_ali" style="background-position-y:-1505px"></span></a> <a href="javascript:;" data-smile="%E7%8E%A9%E7%94%B5%E8%84%91"><span class="smile_ali" style="background-position-y:-1540px"></span></a> <a href="javascript:;" data-smile="%E5%90%902"><span class="smile_ali" style="background-position-y:-1575px"></span></a> <a href="javascript:;" data-smile="%E5%93%AD%E7%9D%80%E8%B7%91"><span class="smile_ali" style="background-position-y:-1610px"></span></a> <a href="javascript:;" data-smile="%E9%98%BF%E7%8B%B8%E4%BE%A0"><span class="smile_ali" style="background-position-y:-1645px"></span></a></div></li><li class="swiper-slide"><div><a href="javascript:;" data-smile="%E5%86%B7%E6%AD%BB%E4%BA%86"><span class="smile_ali" style="background-position-y:-1680px"></span></a> <a href="javascript:;" data-smile="%E6%83%86%E6%80%85~"><span class="smile_ali" style="background-position-y:-1715px"></span></a> <a href="javascript:;" data-smile="%E6%91%B8%E5%A4%B4"><span class="smile_ali" style="background-position-y:-1750px"></span></a> <a href="javascript:;" data-smile="%E8%B9%AD"><span class="smile_ali" style="background-position-y:-1785px"></span></a> <a href="javascript:;" data-smile="%E6%89%93%E6%BB%9A"><span class="smile_ali" style="background-position-y:-1820px"></span></a> <a href="javascript:;" data-smile="%E5%8F%A9%E6%8B%9C"><span class="smile_ali" style="background-position-y:-1855px"></span></a> <a href="javascript:;" data-smile="%E6%91%B8"><span class="smile_ali" style="background-position-y:-1890px"></span></a> <a href="javascript:;" data-smile="%E6%95%B0%E9%92%B1"><span class="smile_ali" style="background-position-y:-1925px"></span></a> <a href="javascript:;" data-smile="%E6%8B%96%E8%B5%B0"><span class="smile_ali" style="background-position-y:-1960px"></span></a> <a href="javascript:;" data-smile="%E7%83%AD"><span class="smile_ali" style="background-position-y:-1995px"></span></a> <a href="javascript:;" data-smile="%E5%8A%A01"><span class="smile_ali" style="background-position-y:-2030px"></span></a> <a href="javascript:;" data-smile="%E5%8E%8B%E5%8A%9B"><span class="smile_ali" style="background-position-y:-2065px"></span></a> <a href="javascript:;" data-smile="%E8%A1%A8%E9%80%BC%E6%88%91"><span class="smile_ali" style="background-position-y:-2100px"></span></a> <a href="javascript:;" data-smile="%E4%BA%BA%E5%91%A2"><span class="smile_ali" style="background-position-y:-2135px"></span></a> <a href="javascript:;" data-smile="%E6%91%87%E6%99%83"><span class="smile_ali" style="background-position-y:-2170px"></span></a> <a href="javascript:;" data-smile="%E6%89%93%E5%9C%B0%E9%BC%A0"><span class="smile_ali" style="background-position-y:-2205px"></span></a> <a href="javascript:;" data-smile="%E8%BF%99%E4%B8%AA%E5%B1%8C"><span class="smile_ali" style="background-position-y:-2240px"></span></a> <a href="javascript:;" data-smile="%E6%81%90%E6%85%8C"><span class="smile_ali" style="background-position-y:-2275px"></span></a> <a href="javascript:;" data-smile="%E6%99%95%E4%B9%8E%E4%B9%8E"><span class="smile_ali" style="background-position-y:-2310px"></span></a> <a href="javascript:;" data-smile="%E6%B5%AE%E4%BA%91"><span class="smile_ali" style="background-position-y:-2345px"></span></a> <a href="javascript:;" data-smile="%E7%BB%99%E5%8A%9B"><span class="smile_ali" style="background-position-y:-2380px"></span></a> <a href="javascript:;" data-smile="%E6%9D%AF%E5%85%B7%E4%BA%86"><span class="smile_ali" style="background-position-y:-2415px"></span></a> <a href="javascript:;" data-smile="%E8%B9%A6%E8%B9%A6%E8%B7%B3%E8%B7%B3"><span class="smile_tb10" style="background-position-y:0"></span></a> <a href="javascript:;" data-smile="%E6%99%83%E6%82%A0"><span class="smile_tb10" style="background-position-y:-30px"></span></a> <a href="javascript:;" data-smile="%E6%91%87%E6%91%87%E6%91%86%E6%91%86"><span class="smile_tb10" style="background-position-y:-60px"></span></a> <a href="javascript:;" data-smile="%E5%A4%A7%E6%92%92%E8%8A%B1"><span class="smile_tb10" style="background-position-y:-90px"></span></a> <a href="javascript:;" data-smile="%E9%AB%98%E9%AB%98%E5%85%B4%E5%85%B4"><span class="smile_tb10" style="background-position-y:-120px"></span></a> <a href="javascript:;" data-smile="%E5%BC%B9%E5%90%89%E4%BB%96"><span class="smile_tb10" style="background-position-y:-150px"></span></a></div></li><li class="swiper-slide"><div><a href="javascript:;" data-smile="%E9%AD%94%E6%B3%95%E6%A3%92"><span class="smile_tb10" style="background-position-y:-180px"></span></a> <a href="javascript:;" data-smile="%E6%89%9B%E5%A4%A7%E6%97%97"><span class="smile_tb10" style="background-position-y:-210px"></span></a> <a href="javascript:;" data-smile="%E7%82%B9%E8%9C%A1%E7%83%9B"><span class="smile_tb10" style="background-position-y:-240px"></span></a> <a href="javascript:;" data-smile="%E5%A4%A7%E7%A7%A7%E6%AD%8C"><span class="smile_tb10" style="background-position-y:-270px"></span></a> <a href="javascript:;" data-smile="%E8%B4%B4%E5%90%A7%E5%8D%81%E5%91%A8%E5%B9%B4"><span class="smile_tb10" style="background-position-y:-300px"></span></a> <a href="javascript:;" data-smile="%E5%8D%81%E5%91%A8%E5%B9%B4"><span class="smile_tb10" style="background-position-y:-330px"></span></a> <a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a><a href="#"></a></div></li></ul><div class="j_slide_aim smile_slide_aim"></div></div><div class="j_smile_btn_group smile_btn_group"><a class="smile_active smile_btn_pic" href="javascript:;"><span class="smile_icon"></span></a> <a class="smile_btn_font" href="javascript:;"></a> <a class="smile_btn_del" href="javascript:;" id="smile_close"><b class="smile_btn_close"></b></a></div></div>';
	var emotion_template = '(#{type})';
	var map_arr = {
		'呵呵' : 'image_emoticon1.png',
		'哈哈' : 'image_emoticon2.png',
		'吐舌' : 'image_emoticon3.png',
		'啊' : 'image_emoticon4.png',
		'酷' : 'image_emoticon5.png',
		'怒' : 'image_emoticon6.png',
		'开心' : 'image_emoticon7.png',
		'汗' : 'image_emoticon8.png',
		'泪' : 'image_emoticon9.png',
		'黑线' : 'image_emoticon10.png',
		'鄙视' : 'image_emoticon11.png',
		'不高兴' : 'image_emoticon12.png',
		'真棒' : 'image_emoticon13.png',
		'钱' : 'image_emoticon14.png',
		'疑问' : 'image_emoticon15.png',
		'阴险' : 'image_emoticon16.png',
		'吐' : 'image_emoticon17.png',
		'咦' : 'image_emoticon18.png',
		'委屈' : 'image_emoticon19.png',
		'花心' : 'image_emoticon20.png',
		'呼~' : 'image_emoticon21.png',
		'笑眼' : 'image_emoticon22.png',
		'冷' : 'image_emoticon23.png',
		'太开心' : 'image_emoticon24.png',
		'滑稽' : 'image_emoticon25.png',
		'勉强' : 'image_emoticon26.png',
		'狂汗' : 'image_emoticon27.png',
		'乖' : 'image_emoticon28.png',
		'睡觉' : 'image_emoticon29.png',
		'惊哭' : 'image_emoticon30.png',
		'升起' : 'image_emoticon31.png',
		'惊讶' : 'image_emoticon32.png',
		'喷' : 'image_emoticon33.png',
		'爱心' : 'image_emoticon34.png',
		'心碎' : 'image_emoticon35.png',
		'玫瑰' : 'image_emoticon36.png',
		'礼物' : 'image_emoticon37.png',
		'彩虹' : 'image_emoticon38.png',
		'星星月亮' : 'image_emoticon39.png',
		'太阳' : 'image_emoticon40.png',
		'钱币' : 'image_emoticon41.png',
		'灯泡' : 'image_emoticon42.png',
		'茶杯' : 'image_emoticon43.png',
		'蛋糕' : 'image_emoticon44.png',
		'音乐' : 'image_emoticon45.png',
		'haha' : 'image_emoticon46.png',
		'胜利' : 'image_emoticon47.png',
		'大拇指' : 'image_emoticon48.png',
		'弱' : 'image_emoticon49.png',
		'OK' : 'image_emoticon50.png',
		'Kiss~' : 't_0001.gif',
		'Love' : 't_0002.gif',
		'Yeah' : 't_0003.gif',
		'啊!' : 't_0004.gif',
		'背扭' : 't_0005.gif',
		'顶起' : 't_0006.gif',
		'抖胸' : 't_0007.gif',
		88 : 't_0008.gif',
		'汗!' : 't_0009.gif',
		'瞌睡' : 't_0010.gif',
		'鲁拉' : 't_0011.gif',
		'拍砖' : 't_0012.gif',
		'揉脸' : 't_0013.gif',
		'生日快乐' : 't_0014.gif',
		'赖皮' : 'ali_001.gif',
		'感动' : 'ali_002.gif',
		'惊讶2' : 'ali_003.gif',
		'怒气' : 'ali_004.gif',
		'哭泣' : 'ali_005.gif',
		'吃惊' : 'ali_006.gif',
		'嘲弄' : 'ali_007.gif',
		'飘过' : 'ali_008.gif',
		'转圈哭' : 'ali_009.gif',
		'神经病' : 'ali_010.gif',
		'揪耳朵' : 'ali_011.gif',
		'惊汗' : 'ali_012.gif',
		'隐身' : 'ali_013.gif',
		'不要嘛' : 'ali_014.gif',
		'遁' : 'ali_015.gif',
		'不公平' : 'ali_016.gif',
		'爬来了' : 'ali_017.gif',
		'蛋花哭' : 'ali_018.gif',
		'温暖' : 'ali_019.gif',
		'点头' : 'ali_020.gif',
		'撒钱' : 'ali_021.gif',
		'献花' : 'ali_022.gif',
		'寒' : 'ali_023.gif',
		'傻笑' : 'ali_024.gif',
		'扭扭' : 'ali_025.gif',
		'疯' : 'ali_026.gif',
		'抓狂' : 'ali_027.gif',
		'抓' : 'ali_028.gif',
		'蜷' : 'ali_029.gif',
		'挠墙' : 'ali_030.gif',
		'狂笑' : 'ali_031.gif',
		'抱枕' : 'ali_032.gif',
		'吼叫' : 'ali_033.gif',
		'嚷' : 'ali_034.gif',
		'唠叨' : 'ali_035.gif',
		'捏脸' : 'ali_036.gif',
		'狂笑2' : 'ali_037.gif',
		'郁闷' : 'ali_038.gif',
		'潜水' : 'ali_039.gif',
		'开心2' : 'ali_040.gif',
		'冷笑话' : 'ali_041.gif',
		'顶' : 'ali_042.gif',
		'潜' : 'ali_043.gif',
		'画圈圈' : 'ali_044.gif',
		'玩电脑' : 'ali_045.gif',
		'吐2' : 'ali_046.gif',
		'哭着跑' : 'ali_047.gif',
		'阿狸侠' : 'ali_048.gif',
		'冷死了' : 'ali_049.gif',
		'惆怅~' : 'ali_050.gif',
		'摸头' : 'ali_051.gif',
		'蹭' : 'ali_052.gif',
		'打滚' : 'ali_053.gif',
		'叩拜' : 'ali_054.gif',
		'摸' : 'ali_055.gif',
		'数钱' : 'ali_056.gif',
		'拖走' : 'ali_057.gif',
		'热' : 'ali_058.gif',
		'加1' : 'ali_059.gif',
		'压力' : 'ali_060.gif',
		'表逼我' : 'ali_061.gif',
		'人呢' : 'ali_062.gif',
		'摇晃' : 'ali_063.gif',
		'打地鼠' : 'ali_064.gif',
		'这个屌' : 'ali_065.gif',
		'恐慌' : 'ali_066.gif',
		'晕乎乎' : 'ali_067.gif',
		'浮云' : 'ali_068.gif',
		'给力' : 'ali_069.gif',
		'杯具了' : 'ali_070.gif',
		'蹦蹦跳跳' : '10th_001.gif',
		'晃悠' : '10th_002.gif',
		'摇摇摆摆' : '10th_003.gif',
		'大撒花' : '10th_004.gif',
		'高高兴兴' : '10th_005.gif',
		'弹吉他' : '10th_006.gif',
		'魔法棒' : '10th_007.gif',
		'扛大旗' : '10th_008.gif',
		'点蜡烛' : '10th_009.gif',
		'大秧歌' : '10th_010.gif',
		'贴吧十周年' : '10th_011.gif',
		'十周年' : '10th_012.gif',
	};
	var emotion_url = G_STATIC_URL + '/common/emotions/';
	var html_template = '<img src="{url}" alt="{name}" />';
	var CLS = 'active';
	var em = {
		is_show : false,
		is_dom_init : false,
		relate_node : null,
		container : null,
		editor : false,
		control : null,
		is_parse : false,	//是否将表情解析为html
		init : function(){
			var $body = $('body'), $smile_control = $('.smile_control'), _this = this;
			$body.append(_init_template);
			$('<script type="text/javascript" src="/static/mobile/js/swipe_slide.min.js"></script>').appendTo($body);
			$smile_control.on('click', function(){
				if(_this.is_show)
					return false;

				_this.relate_node = $(this).closest('.top_smile_box');
				em.show();
			});
			_this.control = $smile_control;
		},
		dom_init : function(){
			//swipe
			setTimeout(function(){
				var swiper = new Swiper('.smile_container', {
					pagination: '.smile_slide_aim',
					bulletActiveClass : 'active',
					paginationElement : 'a',
				});
			}, 0);

			var _this = this;
			this.container = $('#smile_box');
			this.container.find('#smile_close').click(function(){
				em.hide();
			}).end().find('.swiper-slide a').click(function(){
				var data_smile = $.trim($(this).data('smile')), $tt;
				if(data_smile.length == 0)
					return false;

				data_smile = decodeURIComponent(data_smile);
				if(_this.is_parse) {
					data_smile = _this.parse_to_html(data_smile);
				} else {
					data_smile = emotion_template.replace('{type}', data_smile);
				}
				if(_this.editor.execCommand) {
					$tt = _this.editor;
					$tt.focus();
					$tt.execCommand('inserthtml', data_smile);
				} else {
					$tt = _this.relate_node.find('textarea');
					$tt.insertAtCaret(data_smile);
				}

				$tt.focus();
				em.hide();
			});
			this.is_dom_init = true;
		},
		show : function(){
			if(!this.is_dom_init) {
				this.dom_init();
			}

			if(this.relate_node.hasClass('need_move')) {
				var _this = this;
				setTimeout(function(){
					var $smile_box = _this.container, smile_box_height = $smile_box.height();
					_this.relate_node.css({
						position:'fixed',
						bottom : smile_box_height
					});
				}, 0);
			}
			this.container.show();
			this.control.addClass(CLS);
			this.is_show = true;
		},
		hide : function(){
			if(this.relate_node.hasClass('need_move')) {
				this.relate_node.css({
					position : 'static',
					bottom : 'auto'
				});
			}

			$.scrollTo(this.relate_node, 0, {queue : true});
			this.container.hide();
			this.control.removeClass(CLS);
			this.is_show = false;
		},
		inject : function(options){	//inject options
			$.extend(this, options);
		},
		parse_emotion : function(html){	//解析表情成html函数

		},
		parse_to_html : function(str){
			var i, v, turl, result = str;
			for (i in map_arr) {
				if(str == i) {
					v = map_arr[i];
					turl = emotion_url + v;
					result = html_template.replace('{url}', turl).replace('{name}', i);
					break;
				}
			}
			return result;
		}
	};

	AWS.emotion = em;
	$(function(){
		em.init();
	});
})(jQuery);