window.onload = function(){
	var el = document.createElement('div');
	el.setAttribute('id', 'afterLoad');
	el.innerHTML = 'div added after the whole page is load';
	document.getElementsByTagName('body')[0].appendChild(el);
}

var el = document.createElement('div');
el.setAttribute('id', 'noWaitLoad');
el.innerHTML = 'div added without waiting the page to load';
document.getElementsByTagName('body')[0].appendChild(el);
