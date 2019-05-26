// 返回顶部
function backTop(){
	var backTop = document.getElementsByClassName('backTop')[0];
	backTop.onclick = pageScroll;
	
	$(window).scroll(function(){
		if(window.scrollY >= 550){
            backTop.style.display = "block";
        }else if(window.scrollY < 550){
            backTop.style.display = "none";
        }
	});
	
	function pageScroll(){
		//设置定时器，不断执行，推到顶部
		var scrollDelay = setInterval(function(){
			//执行一次向上移动150
			window.scrollBy(0,-150);
			//到达顶部清除定时器
			if(document.documentElement.scrollTop == 0){
				clearInterval(scrollDelay);
			}
		},20);
	}
}