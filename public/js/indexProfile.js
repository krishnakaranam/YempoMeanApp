function openSlideMenu(){
	console.log("open");
      document.getElementById('side-menu').style.width = '50vw';
      document.getElementById('main').style.marginLeft = '50vw';
}

function closeSlideMenu(){
      document.getElementById('side-menu').style.width = '0';
      document.getElementById('main').style.marginLeft = '0';
}