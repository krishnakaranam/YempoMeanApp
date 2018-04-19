(function (app) {
    angular
        .module("Yempo", ['ngRoute', 'ngMaterial'])
        .controller("LoginController",LoginController)
        .controller("ProfileController",ProfileController)
        .controller("RegisterController",RegisterController)
        .controller("ReachController",ReachController)
        .controller("FeedController",FeedController)
        .controller("FilterController",FilterController)
        .config(AppConfig);

    function LoginController($scope,userService,$location, $anchorScroll) {
        $scope.login = login;
        function login(user) {
            $scope.error = null;
            var user = {
                email : user.username,
                password : user.password
            }
            userService.findUserByCredentials(user)
                .then(function (userResponse) {
                    if (userResponse.message === "Login successful") {
                        $location.url('/user/' + userResponse._id + '/' + userResponse.token);
                    }
                    else {
                        if (userResponse) {
                            $scope.error = userResponse;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        $anchorScroll('top');
                    }
                })
        }
    }

    function RegisterController($location, userService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.register = register;

        function register(user) {
            console.log("inside reg");
            $scope.error = null;
            var user = {
                email : user.username,
                password : user.password,
                verifypassword : user.verifypassword,
                registrationkey : user.registrationkey
            };
            if (user.password !== user.verifypassword) {
                $scope.error = {
                    "message" : " Passwords does not match "
                };
                $anchorScroll('top');
            }
            else {
                userService.createUser(user)
                    .then(function (userResponse) {
                        if (userResponse.message === "User already registered.") {
                            $scope.error = userResponse;
                        }else if (userResponse.message !== "Incorrect Registration Key") {
                            $location.url('/');
                        }else {
                            if (userResponse) {
                                $scope.error = userResponse;
                            }
                            else {
                                $scope.error = " Oops! Something went wrong. Please try again later ";
                            }
                            $anchorScroll('top');
                        }
                    })
            }

        }

    }

    function ProfileController($location, userService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;
        $scope.displayUser = displayUser;
        $scope.profileError = profileError;
        $scope.openReach = openReach;
        $scope.openFeed = openFeed;
        $scope.openFilters = openFilters;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;

        function init() {
            userService.findUserById($scope.userId,$scope.token)
                .then(displayUser, profileError);
        }

        init();

        function displayUser(user) {
            $scope.currentUser = user;
        }

        function profileError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openReach(){
            $location.url('/reach/' + $scope.userId + '/' + $scope.token);
        }

        function openFeed(){
            $location.url('/feed/' + $scope.userId + '/' + $scope.token);
        }

        function openFilters(){
            $location.url('/filter/' + $scope.userId + '/' + $scope.token);
        }

        function openSlideMenu(){
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu(){
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }
    }

    function ReachController($location, userService, postService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;
        $scope.openProfile = openProfile;
        $scope.openFeed = openFeed;
        $scope.openFilters = openFilters;

        function init() {
            postService.getLikesByUserId($scope.userId, $scope.token)
                .then(displayReachLikes, reachError);
            postService.getCommentsByUserId($scope.userId, $scope.token)
                .then(displayReachComments, reachError);
            postService.getSharesByUserId($scope.userId, $scope.token)
                .then(displayReachShares, reachError);
        }

        init();

        function displayReachLikes(likes) {
            $scope.likes = likes;
        }
        function displayReachComments(comments) {
            $scope.comments = comments;
        }
        function displayReachShares(shares) {
            $scope.shares = shares;
        }

        function reachError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openProfile(){
            $location.url('/user/' + $scope.userId + '/' + $scope.token);
        }

        function openFeed(){
            $location.url('/feed/' + $scope.userId + '/' + $scope.token);
        }

        function openFilters(){
            $location.url('/filter/' + $scope.userId + '/' + $scope.token);
        }

        function openSlideMenu(){
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu(){
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }

    }

    function FeedController($location, userService, postService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;
        $scope.displayFeed = displayFeed;
        $scope.feedError = feedError;
        $scope.displayUser = displayUser;
        $scope.profileError = profileError;
        $scope.openReach = openReach;
        $scope.openProfile = openProfile;
        $scope.openFilters = openFilters;
        $scope.createPost = createPost;
        $scope.getFeed = getFeed;
        $scope.favoritePost = favoritePost;
        $scope.clapPost = clapPost;
        $scope.retweetPost = retweetPost;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;
        $scope.openWritePost = openWritePost;
        $scope.closeWritePost = closeWritePost;
        $scope.searchPost = searchPost;
        $scope.selectSort = selectSort;

        function init() {
            postService.getFeed($scope.userId,$scope.token)
                .then(displayFeed, feedError);
            userService.findUserById($scope.userId,$scope.token)
                .then(displayUser, profileError);
            $scope.selectsort = "sort";
        }

        init();

        function searchPost() {
            if($scope.search !== ""){
                postService.getFeed($scope.userId,$scope.token)
                    .then(feed => {
                        var feedList = feed.posts;
                        var filteredFeed = [];
                        for(var i = 0; i < feedList.length; i++) {
                            if (feedList[i].text.includes($scope.search)) {
                                filteredFeed.push(feedList[i]);
                            }
                        }
                        if($scope.search) {
                            $scope.currentFeed = filteredFeed;
                        }else{
                            init();
                        }
                    });
            }
        }

        function selectSort() {
            var actualFeed = $scope.currentFeed;
            if($scope.selectsort == "favorites"){
                actualFeed.sort(sortfavorites);
                $scope.currentFeed = actualFeed;
            }
            if($scope.selectsort == "retweets"){
                actualFeed.sort(sortretweets);
                $scope.currentFeed = actualFeed;
            }
            if($scope.selectsort == "claps"){
                actualFeed.sort(sortclaps);
                $scope.currentFeed = actualFeed;
            }
        }

        function sortfavorites(a,b){
            return(b.favorites - a.favorites)
        }

        function sortretweets(a,b){
            return(b.retweets - a.retweets)
        }

        function sortclaps(a,b){
            return(b.claps - a.claps)
        }

        function displayFeed(feed) {
            $scope.currentFeed = feed.posts;
        }

        function feedError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function displayUser(user) {
            $scope.currentUser = user;
        }

        function profileError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openReach(){
            $location.url('/reach/' + $scope.userId + '/' + $scope.token);
        }

        function openProfile(){
            $location.url('/user/' + $scope.userId + '/' + $scope.token);
        }

        function openFilters(){
            $location.url('/filter/' + $scope.userId + '/' + $scope.token);
        }

        function createPost(newpost) {
            $scope.error = null;
            var post = {
                text : newpost.text
        };
            postService.createPost(post, $scope.userId, $scope.token)
                .then(function (postResponse) {
                    if (postResponse) {
                        $scope.error = postResponse.message;
                        newpost.text = "";
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                    }
                    init();
                })
        }

        function getFeed() {
            $scope.error = null;

            postService.getFeed($scope.userId, $scope.token)
                .then(function (posts) {
                    if (posts) {
                        $scope.posts = posts.posts;
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                    }
                    init();
                })
        }

        function favoritePost(postId, favorited) {
            $scope.error = null;

            if(favorited){
                postService.unfavoritePostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            }else{
                postService.favoritePostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            }
        }

        function clapPost(postId, clapped) {
            $scope.error = null;
            if(clapped){
                postService.unclapPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            } else {
                postService.clapPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            }
        }

        function retweetPost(postId, retweeted) {
            $scope.error = null;

            if(retweeted){
                postService.unretweetPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            }else{
                postService.retweetPostById($scope.userId, $scope.token, postId)
                    .then(function (resp) {
                        if (resp) {
                            $scope.error = resp.message;
                        }
                        else {
                            $scope.error = " Oops! Something went wrong. Please try again later ";
                        }
                        init();
                    })
            }
        }

        function openSlideMenu(){
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu(){
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }

        function openWritePost(){
            document.getElementById("textpost").style.width = '78vw';
            document.getElementById('textpost').style.height='20vw';
            document.getElementById('writepost').style.height='76vw';
            document.getElementById('closepost').style.visibility='visible';
            document.getElementById('blackline').style.visibility='visible';
            document.getElementById('fbicon').style.visibility='visible';
            document.getElementById('twiticon').style.visibility='visible';
            document.getElementById('facecheck').style.visibility='visible';
            document.getElementById('twitcheck').style.visibility='visible';
            document.getElementById('sharebt').style.visibility='visible';
            document.getElementById('shpost').style.visibility='visible';
        }

        function closeWritePost(){
            document.getElementById("textpost").style.width = '78vw';
            document.getElementById('textpost').style.height='10vw';
            document.getElementById('writepost').style.height='28vw';
            document.getElementById('closepost').style.visibility='hidden';
            document.getElementById('blackline').style.visibility='hidden';
            document.getElementById('fbicon').style.visibility='hidden';
            document.getElementById('twiticon').style.visibility='hidden';
            document.getElementById('facecheck').style.visibility='hidden';
            document.getElementById('twitcheck').style.visibility='hidden';
            document.getElementById('sharebt').style.visibility='hidden';
            document.getElementById('shpost').style.visibility='hidden';
        }

    }

    function FilterController($location, userService, filterService, $routeParams, $anchorScroll, $route, $scope) {
        $scope.userId = $routeParams.userId;
        $scope.token = $routeParams.token;

        var friendsInYourArea = [];
        var acquaintancesInYourArea = [];
        var bridgesInYourArea = [];
        var colorsInYourArea = [];

        $scope.displayMostFollowers = displayMostFollowers;
        $scope.displayLeastFollowers = displayLeastFollowers;
        $scope.displayGatewayFollowers = displayGatewayFollowers;
        $scope.displayMostActiveFollowers = displayMostActiveFollowers;
        $scope.displayLeastActiveFollowers = displayLeastActiveFollowers;
        $scope.displayMostInteractiveFollowers = displayMostInteractiveFollowers;
        $scope.filterError = filterError;
        $scope.openReach = openReach;
        $scope.openFeed = openFeed;
        $scope.openProfile = openProfile;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;

        function init() {
            filterService.getMostFollowers($scope.userId,$scope.token)
                .then(displayMostFollowers, filterError);
            filterService.getLeastFollowers($scope.userId,$scope.token)
                .then(displayLeastFollowers, filterError);
            filterService.getGatewayFollowers($scope.userId,$scope.token)
                .then(displayGatewayFollowers, filterError);
            filterService.getMostActiveFollowers($scope.userId,$scope.token)
                .then(displayMostActiveFollowers, filterError);
            filterService.getLeastActiveFollowers($scope.userId,$scope.token)
                .then(displayLeastActiveFollowers, filterError);
            filterService.getMostInteractiveFollowers($scope.userId,$scope.token)
                .then(displayMostInteractiveFollowers, filterError);
        }

        init();

        function displayMostFollowers(followerArrray) {
            $scope.mostFollowers = followerArrray;
        }

        function displayLeastFollowers(followerArrray) {
            $scope.leastFollowers = followerArrray;
        }

        function displayGatewayFollowers(followerArrray) {
            $scope.gatewayFollowers = followerArrray;
        }

        function displayMostActiveFollowers(followerArrray) {
            $scope.mostActiveFollowers = followerArrray;
        }

        function displayLeastActiveFollowers(followerArrray) {
            $scope.leastActiveFollowers = followerArrray;
        }

        function displayMostInteractiveFollowers(followerArrray) {
            $scope.mostInteractiveFollowers = followerArrray;
        }

        function filterError() {
            $scope.error = "Oops! Something went wrong. Please try again later";
            $anchorScroll('top');
        }

        function openProfile(){
            $location.url('/user/' + $scope.userId + '/' + $scope.token);
        }

        function openReach(){
            $location.url('/reach/' + $scope.userId + '/' + $scope.token);
        }

        function openFeed(){
            $location.url('/feed/' + $scope.userId + '/' + $scope.token);
        }

        function openSlideMenu(){
            $scope.openslide = "open";
            document.getElementById('side-menu').style.width = '50vw';
        }

        function closeSlideMenu(){
            $scope.openslide = null;
            document.getElementById('side-menu').style.width = '0';
        }
        // Most Followers Code :

        var acquaintances = ["one","two","three"];
        var bridges = ["one","two","three"];
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

        // Most Followers Code End

    }


    function AppConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'login.html'
            })
            .when('/user/:userId/:token', {
                templateUrl: 'profile.html'
            })
            .when('/register', {
                templateUrl: 'register.html'
            })
            .when('/filter/:userId/:token', {
            templateUrl: 'filters.html'
            })
            .when('/reach/:userId/:token', {
                templateUrl: 'myreach.html'
            })
            .when('/feed/:userId/:token', {
                templateUrl: 'feed.html'
            })
    }
    
})();