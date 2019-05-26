function likeData(){
	//图片
	var imgArr = ['img/dm7.jpg','img/dm7.jpg','img/dm7.jpg'];
	//题头
	var titleArr = ['上海·NANA MIZUKI LIVE ISLAND 2018+','上海·NANA MIZUKI LIVE ISLAND 2018+','上海·NANA MIZUKI LIVE ISLAND 2018+'];
	//地点
	var placeArr = ['上海证大喜玛拉雅艺术中心大观舞台','上海证大喜玛拉雅艺术中心大观舞台','上海证大喜玛拉雅艺术中心大观舞台'];
	//时间
	var timeArr = ['2018.12.31','2018.12.31','2018.12.31','2018.12.31','2018.12.31','2018.12.31'];
	//价格
	var priceArr = [880,880,880];
	//创建数组存入对象
	var data = [];
	for(var i=0;i<imgArr.length;i++){
		var obj = {};
		obj.like_img = imgArr[i];
		obj.like_title = titleArr[i];
		obj.like_place = placeArr[i];
		obj.like_time = timeArr[i];
		obj.like_price = priceArr[i];
		data.push(obj);
	}
	return data;
}
