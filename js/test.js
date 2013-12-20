setInterval(function () {
	var date = new Date(),
		time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	document.getElementById('time2').innerHTML = time;
}, 1000);