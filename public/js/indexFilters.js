function openSlideMenu(){
	console.log("open");
      document.getElementById('side-menu').style.width = '50vw';
      document.getElementById('main').style.marginLeft = '50vw';
}

function closeSlideMenu(){
      document.getElementById('side-menu').style.width = '0';
      document.getElementById('main').style.marginLeft = '0';
}

		var friendsInYourArea = [];
        var acquaintancesInYourArea = [];
        var bridgesInYourArea = [];
        var colorsInYourArea = [];

$(function(){
$.ajax({
		type: 'GET',
		url: '/api/filters/mostfollowers',
		success: function(data){
		var followers = JSON.parse(data);
		
		var acquaintances = followers.map(a => a.screen_name);
		var bridges = followers.map(a => a.mutual_connection);
		
		var friends = [];
    
    var angle = 360/ (friends.length + acquaintances.length);

    var canvas = d3.select("#mostFollowers")
        .append("svg")
        .attr("width", 360)
        .attr("height", 460);//change to dynamic

    var myCx = 360/2;
    var myCy = 460/2;
    var rValue = 20;

    var rValue1 = 75;
    var rValue2 = 150;

    var friendsLines = canvas.selectAll("lines")
        .data(friends)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
        })
        .attr("y1", function (d, i) {
            return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
        })
        .attr("x2", myCx)
        .attr("y2", myCy)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    var bridgeDashes = canvas.selectAll("lines")
        .data(bridges)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
        })
        .attr("y1", function (d, i) {
            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
        })
        .attr("x2", myCx)
        .attr("y2", myCy)
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var bridgeToAcquaintancesDashes = canvas.selectAll("lines")
        .data(bridges)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
        })
        .attr("y1", function (d, i) {
            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
        })
        .attr("x2", function (d, i) {
            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
        })
        .attr("y2", function (d, i) {
            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
        })
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var circle = canvas.append("circle")
        .attr("cx", myCx)
        .attr("cy", myCy)
        .attr("r", rValue)
        .style("fill", "black");

    canvas.append("text")
        .text("you")
        .attr("x", myCx - 15)
        .attr("y", myCy)
        .style('fill', 'white');

    var friendsPetals = canvas.selectAll("circles")
        .data(friends)
        .enter()
        .append("circle")
        .attr("cx", function (d, i){
            return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
        })
        .attr("cy", function (d, i) {
            return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
        })
        .attr("r", rValue)
        .style("fill", "red");
		
	var friendsPetalsText = canvas.selectAll("circles")
        .data(friends)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCx + Math.cos(i * Math.PI * angle / 180) * rValue1;
        })
        .attr("y", function (d, i) {
            return myCy + Math.sin(i * Math.PI * angle / 180) * rValue1;
        })
        .style("fill", "black");

    var acquaintancesPetals = canvas.selectAll("circles")
        .data(acquaintances)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;

        })
        .attr("cy", function (d, i) {
            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
        })
        .attr("r", rValue)
        .style("fill", "red")
		.on('click', toggleColor("red"));
		
	var acquaintancesPetalsText = canvas.selectAll("circles")
        .data(acquaintances)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue2;
        })
        .attr("y", function (d, i) {
            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue2;
        })
        .style("fill", "black");


    var bridgesPetals = canvas.selectAll("circles")
        .data(bridges)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;

        })
        .attr("cy", function (d, i) {
            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
        })
        .attr("r", rValue)
        .style("fill", "gray");
		
	var bridgesPetalsText = canvas.selectAll("circles")
        .data(bridges)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCx + Math.cos((friends.length + i) * Math.PI * angle / 180) * rValue1;
        })
        .attr("y", function (d, i) {
            return myCy + Math.sin((friends.length + i) * Math.PI * angle / 180) * rValue1;
        })
        .style("fill", "black");
		
		}});
});

function toggleColor(color){
        var currentColor = color;
        return function(){
            var col = d3.select(this).style('fill').toString();
            var colStr = d3.rgb(col).toString();
            var magenta = d3.rgb("magenta").toString();

			if(colStr != magenta){
                currentColor = "magenta";
                var selectedData = d3.select(this).data();
                acquaintancesInYourArea.push(selectedData[0]);
                colorsInYourArea.push(color);
                return d3.select(this).style("fill", currentColor);
			} else {
                var selectedData = d3.select(this).data();
                var i = acquaintancesInYourArea.indexOf(selectedData[0]);
                if(i != -1) {
                    acquaintancesInYourArea.splice(i, 1);
                    colorsInYourArea.splice(i, 1);
                }
                return d3.select(this).style("fill", color);
			}
        }
};

$(function(){
$.ajax({
		type: 'GET',
		url: '/api/filters/gateway',
		success: function(data){
		var gateway = JSON.parse(data);
		
		console.log(gateway);
		
		var acquaintancesGateway = gateway.map(a => a.screen_name);
		var bridgesGateway = gateway.map(a => a.len);
		
		var friendsGateway = [];
    
    var angleGateway = 360/ (friendsGateway.length + acquaintancesGateway.length);

    var canvasGateway = d3.select("#gatewayToOutside")
        .append("svg")
        .attr("width", 360)
        .attr("height", 460);//change to dynamic

    var myCxGateway = 360/2;
    var myCyGateway = 460/2;
    var rValueGateway = 20;

    var rValueGateway1 = 75;
    var rValueGateway2 = 150;

    var friendsGatewayLines = canvasGateway.selectAll("lines")
        .data(friendsGateway)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxGateway + Math.cos(i * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("y1", function (d, i) {
            return myCyGateway + Math.sin(i * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("x2", myCxGateway)
        .attr("y2", myCyGateway)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    var bridgeDashesGateway = canvasGateway.selectAll("lines")
        .data(bridgesGateway)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxGateway + Math.cos((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("y1", function (d, i) {
            return myCyGateway + Math.sin((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("x2", myCxGateway)
        .attr("y2", myCyGateway)
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var bridgeToAcquaintancesDashesGateway = canvasGateway.selectAll("lines")
        .data(bridgesGateway)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxGateway + Math.cos((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("y1", function (d, i) {
            return myCyGateway + Math.sin((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("x2", function (d, i) {
            return myCxGateway + Math.cos((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway2;
        })
        .attr("y2", function (d, i) {
            return myCyGateway + Math.sin((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway2;
        })
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var circle = canvasGateway.append("circle")
        .attr("cx", myCxGateway)
        .attr("cy", myCyGateway)
        .attr("r", rValueGateway)
        .style("fill", "black");

    canvasGateway.append("text")
        .text("you")
        .attr("x", myCxGateway - 15)
        .attr("y", myCyGateway)
        .style('fill', 'white');

    var friendsGatewayPetals = canvasGateway.selectAll("circles")
        .data(friendsGateway)
        .enter()
        .append("circle")
        .attr("cx", function (d, i){
            return myCxGateway + Math.cos(i * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("cy", function (d, i) {
            return myCyGateway + Math.sin(i * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("r", rValueGateway)
        .style("fill", "red");
		
	var friendsGatewayPetalsText = canvasGateway.selectAll("circles")
        .data(friendsGateway)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxGateway + Math.cos(i * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("y", function (d, i) {
            return myCyGateway + Math.sin(i * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .style("fill", "black");

    var acquaintancesGatewayPetals = canvasGateway.selectAll("circles")
        .data(acquaintancesGateway)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxGateway + Math.cos((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway2;
        })
        .attr("cy", function (d, i) {
            return myCyGateway + Math.sin((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway2;
        })
        .attr("r", rValueGateway)
        .style("fill", "royalblue")
		.on('click', toggleColor("royalblue"));
		
	var acquaintancesGatewayPetalsText = canvasGateway.selectAll("circles")
        .data(acquaintancesGateway)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxGateway + Math.cos((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway2;
        })
        .attr("y", function (d, i) {
            return myCyGateway + Math.sin((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway2;
        })
        .style("fill", "black");


    var bridgesGatewayPetals = canvasGateway.selectAll("circles")
        .data(bridgesGateway)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxGateway + Math.cos((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;

        })
        .attr("cy", function (d, i) {
            return myCyGateway + Math.sin((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("r", rValueGateway)
        .style("fill", "gray");
		
	var bridgesGatewayPetalsText = canvasGateway.selectAll("circles")
        .data(bridgesGateway)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxGateway + Math.cos((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .attr("y", function (d, i) {
            return myCyGateway + Math.sin((friendsGateway.length + i) * Math.PI * angleGateway / 180) * rValueGateway1;
        })
        .style("fill", "black");
		
		}
});
});
	
	// leastFollowers
	
$(function(){
$.ajax({
		type: 'GET',
		url: '/api/filters/leastfollowers',
		success: function(data){
		var leastfollowers = JSON.parse(data);
		console.log("these are the least followers");
		console.log(leastfollowers);
		
		var acquaintancesleastFollowers = leastfollowers.map(a => a.screen_name);
		var bridgesleastFollowers = leastfollowers.map(a => a.followers_count);
		
		var friendsleastFollowers = [];
    
    var angleleastFollowers = 360/ (friendsleastFollowers.length + acquaintancesleastFollowers.length);

    var canvasleastFollowers = d3.select("#leastFollowers")
        .append("svg")
        .attr("width", 360)
        .attr("height", 460);//change to dynamic

    var myCxleastFollowers = 360/2;
    var myCyleastFollowers = 460/2;
    var rValueleastFollowers = 20;

    var rValueleastFollowers1 = 75;
    var rValueleastFollowers2 = 150;

    var friendsleastFollowersLines = canvasleastFollowers.selectAll("lines")
        .data(friendsleastFollowers)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxleastFollowers + Math.cos(i * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("y1", function (d, i) {
            return myCyleastFollowers + Math.sin(i * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("x2", myCxleastFollowers)
        .attr("y2", myCyleastFollowers)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    var bridgeDashesleastFollowers = canvasleastFollowers.selectAll("lines")
        .data(bridgesleastFollowers)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxleastFollowers + Math.cos((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("y1", function (d, i) {
            return myCyleastFollowers + Math.sin((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("x2", myCxleastFollowers)
        .attr("y2", myCyleastFollowers)
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var bridgeToAcquaintancesDashesleastFollowers = canvasleastFollowers.selectAll("lines")
        .data(bridgesleastFollowers)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxleastFollowers + Math.cos((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("y1", function (d, i) {
            return myCyleastFollowers + Math.sin((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("x2", function (d, i) {
            return myCxleastFollowers + Math.cos((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers2;
        })
        .attr("y2", function (d, i) {
            return myCyleastFollowers + Math.sin((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers2;
        })
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");
		
    canvasleastFollowers.append("text")
        .text("you")
        .attr("x", myCxleastFollowers - 15)
        .attr("y", myCyleastFollowers)
        .style('fill', 'white');

    var friendsleastFollowersPetals = canvasleastFollowers.selectAll("circles")
        .data(friendsleastFollowers)
        .enter()
        .append("circle")
        .attr("cx", function (d, i){
            return myCxleastFollowers + Math.cos(i * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("cy", function (d, i) {
            return myCyleastFollowers + Math.sin(i * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("r", rValueleastFollowers)
        .style("fill", "red");
		
	var friendsleastFollowersPetalsText = canvasleastFollowers.selectAll("circles")
        .data(friendsleastFollowers)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxleastFollowers + Math.cos(i * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("y", function (d, i) {
            return myCyleastFollowers + Math.sin(i * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .style("fill", "black");

    var acquaintancesleastFollowersPetals = canvasleastFollowers.selectAll("circles")
        .data(acquaintancesleastFollowers)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxleastFollowers + Math.cos((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers2;

        })
        .attr("cy", function (d, i) {
            return myCyleastFollowers + Math.sin((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers2;
        })
        .attr("r", rValueleastFollowers)
        .style("fill", "deepskyblue")
		.on('click', toggleColor("deepskyblue"));
		
	var acquaintancesleastFollowersPetalsText = canvasleastFollowers.selectAll("circles")
        .data(acquaintancesleastFollowers)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxleastFollowers + Math.cos((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers2;
        })
        .attr("y", function (d, i) {
            return myCyleastFollowers + Math.sin((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers2;
        })
        .style("fill", "black");


    var bridgesleastFollowersPetals = canvasleastFollowers.selectAll("circles")
        .data(bridgesleastFollowers)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxleastFollowers + Math.cos((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;

        })
        .attr("cy", function (d, i) {
            return myCyleastFollowers + Math.sin((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("r", rValueleastFollowers)
        .style("fill", "gray");
		
	var bridgesleastFollowersPetalsText = canvasleastFollowers.selectAll("circles")
        .data(bridgesleastFollowers)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxleastFollowers + Math.cos((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .attr("y", function (d, i) {
            return myCyleastFollowers + Math.sin((friendsleastFollowers.length + i) * Math.PI * angleleastFollowers / 180) * rValueleastFollowers1;
        })
        .style("fill", "black");
		
		}
	});
});
	
	// end least followers
		

		
$(function(){
$.ajax({
		type: 'GET',
		url: '/api/filters/mostactive',
		success: function(data){
		var followers = JSON.parse(data);
		
		var acquaintancesActive = followers.map(a => a.screen_name);
		var bridgesActive = followers.map(a => a.statuses_count);
		
		var friendsActive = [];
    
    var angleActive = 360/ (friendsActive.length + acquaintancesActive.length);

    var canvasActive = d3.select("#mostActive")
        .append("svg")
        .attr("width", 360)
        .attr("height", 460);//change to dynamic

    var myCxActive = 360/2;
    var myCyActive = 460/2;
    var rValueActive = 20;

    var rValueActive1 = 75;
    var rValueActive2 = 150;

    var friendsActiveLines = canvasActive.selectAll("lines")
        .data(friendsActive)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxActive + Math.cos(i * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("y1", function (d, i) {
            return myCyActive + Math.sin(i * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("x2", myCxActive)
        .attr("y2", myCyActive)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    var bridgeDashesActive = canvasActive.selectAll("lines")
        .data(bridgesActive)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxActive + Math.cos((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("y1", function (d, i) {
            return myCyActive + Math.sin((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("x2", myCxActive)
        .attr("y2", myCyActive)
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var bridgeToAcquaintancesDashesActive = canvasActive.selectAll("lines")
        .data(bridgesActive)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxActive + Math.cos((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("y1", function (d, i) {
            return myCyActive + Math.sin((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("x2", function (d, i) {
            return myCxActive + Math.cos((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive2;
        })
        .attr("y2", function (d, i) {
            return myCyActive + Math.sin((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive2;
        })
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var circle = canvasActive.append("circle")
        .attr("cx", myCxActive)
        .attr("cy", myCyActive)
        .attr("r", rValueActive)
        .style("fill", "black");

    canvasActive.append("text")
        .text("you")
        .attr("x", myCxActive - 15)
        .attr("y", myCyActive)
        .style('fill', 'white');

    var friendsActivePetals = canvasActive.selectAll("circles")
        .data(friendsActive)
        .enter()
        .append("circle")
        .attr("cx", function (d, i){
            return myCxActive + Math.cos(i * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("cy", function (d, i) {
            return myCyActive + Math.sin(i * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("r", rValueActive)
        .style("fill", "red");
		
	var friendsActivePetalsText = canvasActive.selectAll("circles")
        .data(friendsActive)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxActive + Math.cos(i * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("y", function (d, i) {
            return myCyActive + Math.sin(i * Math.PI * angleActive / 180) * rValueActive1;
        })
        .style("fill", "black");

    var acquaintancesActivePetals = canvasActive.selectAll("circles")
        .data(acquaintancesActive)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxActive + Math.cos((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive2;

        })
        .attr("cy", function (d, i) {
            return myCyActive + Math.sin((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive2;
        })
        .attr("r", rValueActive)
        .style("fill", "orange")
        .on('click', toggleColor("orange"));
		
	var acquaintancesActivePetalsText = canvasActive.selectAll("circles")
        .data(acquaintancesActive)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxActive + Math.cos((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive2;
        })
        .attr("y", function (d, i) {
            return myCyActive + Math.sin((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive2;
        })
        .style("fill", "black");


    var bridgesActivePetals = canvasActive.selectAll("circles")
        .data(bridgesActive)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxActive + Math.cos((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;

        })
        .attr("cy", function (d, i) {
            return myCyActive + Math.sin((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("r", rValueActive)
        .style("fill", "gray");
		
	var bridgesActivePetalsText = canvasActive.selectAll("circles")
        .data(bridgesActive)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxActive + Math.cos((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;
        })
        .attr("y", function (d, i) {
            return myCyActive + Math.sin((friendsActive.length + i) * Math.PI * angleActive / 180) * rValueActive1;
        })
        .style("fill", "black");
		
		}});
		});
		
		$(function(){
		$.ajax({
		type: 'GET',
		url: '/api/filters/mostinteractive',
		success: function(data){
		var followers = JSON.parse(data);
		
		var acquaintancesInteractive = followers.map(a => a.screen_name);
		var bridgesInteractive = followers.map(a => a.favourites_count);
		
		var friendsInteractive = [];
    
    var angleInteractive = 360/ (friendsInteractive.length + acquaintancesInteractive.length);

    var canvasInteractive = d3.select("#mostInteractive")
        .append("svg")
        .attr("width", 360)
        .attr("height", 460);//change to dynamic

    var myCxInteractive = 360/2;
    var myCyInteractive = 460/2;
    var rValueInteractive = 20;

    var rValueInteractive1 = 75;
    var rValueInteractive2 = 150;

    var friendsInteractiveLines = canvasInteractive.selectAll("lines")
        .data(friendsInteractive)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxInteractive + Math.cos(i * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("y1", function (d, i) {
            return myCyInteractive + Math.sin(i * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("x2", myCxInteractive)
        .attr("y2", myCyInteractive)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    var bridgeDashesInteractive = canvasInteractive.selectAll("lines")
        .data(bridgesInteractive)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxInteractive + Math.cos((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("y1", function (d, i) {
            return myCyInteractive + Math.sin((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("x2", myCxInteractive)
        .attr("y2", myCyInteractive)
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var bridgeToAcquaintancesDashesInteractive = canvasInteractive.selectAll("lines")
        .data(bridgesInteractive)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return myCxInteractive + Math.cos((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("y1", function (d, i) {
            return myCyInteractive + Math.sin((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("x2", function (d, i) {
            return myCxInteractive + Math.cos((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive2;
        })
        .attr("y2", function (d, i) {
            return myCyInteractive + Math.sin((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive2;
        })
        .style("stroke-dasharray", "5 5")
        .attr("stroke", "black");

    var circle = canvasInteractive.append("circle")
        .attr("cx", myCxInteractive)
        .attr("cy", myCyInteractive)
        .attr("r", rValueInteractive)
        .style("fill", "black");

    canvasInteractive.append("text")
        .text("you")
        .attr("x", myCxInteractive - 15)
        .attr("y", myCyInteractive)
        .style('fill', 'white');

    var friendsInteractivePetals = canvasInteractive.selectAll("circles")
        .data(friendsInteractive)
        .enter()
        .append("circle")
        .attr("cx", function (d, i){
            return myCxInteractive + Math.cos(i * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("cy", function (d, i) {
            return myCyInteractive + Math.sin(i * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("r", rValueInteractive)
        .style("fill", "red");
		
	var friendsInteractivePetalsText = canvasInteractive.selectAll("circles")
        .data(friendsInteractive)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxInteractive + Math.cos(i * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("y", function (d, i) {
            return myCyInteractive + Math.sin(i * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .style("fill", "black");

    var acquaintancesInteractivePetals = canvasInteractive.selectAll("circles")
        .data(acquaintancesInteractive)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxInteractive + Math.cos((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive2;

        })
        .attr("cy", function (d, i) {
            return myCyInteractive + Math.sin((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive2;
        })
        .attr("r", rValueInteractive)
        .style("fill", "forestgreen")
        .on('click', toggleColor("forestgreen"));
		
	var acquaintancesInteractivePetalsText = canvasInteractive.selectAll("circles")
        .data(acquaintancesInteractive)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxInteractive + Math.cos((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive2;
        })
        .attr("y", function (d, i) {
            return myCyInteractive + Math.sin((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive2;
        })
        .style("fill", "black");

    var bridgesInteractivePetals = canvasInteractive.selectAll("circles")
        .data(bridgesInteractive)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return myCxInteractive + Math.cos((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;

        })
        .attr("cy", function (d, i) {
            return myCyInteractive + Math.sin((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("r", rValueInteractive)
        .style("fill", "gray");
		
	var bridgesInteractivePetalsText = canvasInteractive.selectAll("circles")
        .data(bridgesInteractive)
        .enter()
		.append("text")
        .text(function(d) { return d; })
        .attr("x", function (d, i){
            return myCxInteractive + Math.cos((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .attr("y", function (d, i) {
            return myCyInteractive + Math.sin((friendsInteractive.length + i) * Math.PI * angleInteractive / 180) * rValueInteractive1;
        })
        .style("fill", "black");
		
		}});
});

    //setTimeout(InYourArea, 1000);

function InYourArea(acquaintancesInYourArea,bridgesInYourArea,friendsInYourArea,colorsInYourArea) {
        //console.log(acquaintancesInYourArea);
        //console.log(bridgesInYourArea);
        console.log("acquaintancesInYourArea inside is  ",acquaintancesInYourArea);
        var angleInYourArea = 360 / (friendsInYourArea.length + acquaintancesInYourArea.length);

        var inYourArea = d3.select("#inYourArea");
        var insideSVG = inYourArea.select("svg");
        insideSVG.remove();

        var canvasInYourArea = d3.select("#inYourArea")
            .append("svg")
            .attr("width", 360)
            .attr("height", 460);//change to dynamic

        var myCxInYourArea = 360 / 2;
        var myCyInYourArea = 460 / 2;
        var rValueInYourArea = 20;

        var rValueInYourArea1 = 75;
        var rValueInYourArea2 = 150;

        var friendsInYourAreaLines = canvasInYourArea.selectAll("lines")
            .data(acquaintancesInYourArea)
            .enter()
            .append("line")
            .attr("x1", function (d, i) {
                return myCxInYourArea + Math.cos(i * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("y1", function (d, i) {
                return myCyInYourArea + Math.sin(i * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("x2", myCxInYourArea)
            .attr("y2", myCyInYourArea)
            .attr("stroke-width", 1)
            .attr("stroke", "black");

        var bridgeDashesInYourArea = canvasInYourArea.selectAll("lines")
            .data(acquaintancesInYourArea)
            .enter()
            .append("line")
            .attr("x1", function (d, i) {
                return myCxInYourArea + Math.cos((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("y1", function (d, i) {
                return myCyInYourArea + Math.sin((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("x2", myCxInYourArea)
            .attr("y2", myCyInYourArea)
            .style("stroke-dasharray", "5 5")
            .attr("stroke", "black");

        var bridgeToacquaintancesInYourAreaDashes = canvasInYourArea.selectAll("lines")
            .data(acquaintancesInYourArea)
            .enter()
            .append("line")
            .attr("x1", function (d, i) {
                return myCxInYourArea + Math.cos((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("y1", function (d, i) {
                return myCyInYourArea + Math.sin((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("x2", function (d, i) {
                return myCxInYourArea + Math.cos((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea2;
            })
            .attr("y2", function (d, i) {
                return myCyInYourArea + Math.sin((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea2;
            })
            .style("stroke-dasharray", "5 5")
            .attr("stroke", "black");

        var circle = canvasInYourArea.append("circle")
            .attr("cx", myCxInYourArea)
            .attr("cy", myCyInYourArea)
            .attr("r", rValueInYourArea)
            .style("fill", "black");

        canvasInYourArea.append("text")
            .text("you")
            .attr("x", myCxInYourArea - 15)
            .attr("y", myCyInYourArea)
            .style('fill', 'white');

        var friendsInYourAreaPetals = canvasInYourArea.selectAll("circles")
            .data(friendsInYourArea)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return myCxInYourArea + Math.cos(i * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("cy", function (d, i) {
                return myCyInYourArea + Math.sin(i * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("r", rValueInYourArea)
            .style("fill", "red")
            .append("text")
            .text("you")
            .attr("x", function (d, i) {
                return myCxInYourArea + Math.cos(i * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            } - 15)
            .attr("y", function (d, i) {
                return myCyInYourArea + Math.sin(i * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            });


        var acquaintancesInYourAreaPetals = canvasInYourArea.selectAll("circles")
            .data(acquaintancesInYourArea)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return myCxInYourArea + Math.cos((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea2;

            })
            .attr("cy", function (d, i) {
                return myCyInYourArea + Math.sin((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea2;
            })
            .attr("r", rValueInYourArea)
            .style("fill", function(d, i) {
                return colorsInYourArea[i];
            });

        var acquaintancesInYourAreaPetalsText = canvasInYourArea.selectAll("circles")
            .data(acquaintancesInYourArea)
            .enter()
            .append("text")
            .text(function(d) { return d; })
            .attr("x", function (d, i){
                return myCxInYourArea + Math.cos((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea2;
            })
            .attr("y", function (d, i) {
                return myCyInYourArea + Math.sin((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea2;
            })
            .style("fill", "black");

        var bridgesInYourAreaPetals = canvasInYourArea.selectAll("circles")
            .data(bridgesInYourArea)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return myCxInYourArea + Math.cos((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("cy", function (d, i) {
                return myCyInYourArea + Math.sin((friendsInYourArea.length + i) * Math.PI * angleInYourArea / 180) * rValueInYourArea1;
            })
            .attr("r", rValueInYourArea)
            .style("fill", "gray");
}

function clicked() {
    console.log("acquaintancesInYourArea is ",acquaintancesInYourArea);
    InYourArea(acquaintancesInYourArea,bridgesInYourArea,friendsInYourArea,colorsInYourArea);
}



