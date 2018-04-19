(function (app) {
    angular
        .module("Yempo", ['ngRoute', 'ngMaterial'])
        .controller("LoginController",LoginController)
        .controller("ProfileController",ProfileController)
        .controller("RegisterController",RegisterController)
        .controller("ReachController",ReachController)
        .controller("FeedController",FeedController)
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
                    if (userResponse.message !== "Login failed") {
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
        $scope.favoritePostById = favoritePostById;
        $scope.unfavoritePostById = unfavoritePostById;
        $scope.clapPostById = clapPostById;
        $scope.unclapPostById = unclapPostById;
        $scope.retweetPostById = retweetPostById;
        $scope.unretweetPostById = unretweetPostById;
        $scope.openSlideMenu = openSlideMenu;
        $scope.closeSlideMenu = closeSlideMenu;
        $scope.openWritePost = openWritePost;
        $scope.closeWritePost = closeWritePost;

        function init() {
            postService.getFeed($scope.userId,$scope.token)
                .then(displayFeed, feedError);
            userService.findUserById($scope.userId,$scope.token)
                .then(displayUser, profileError);
        }

        init();

        function displayFeed(feed) {
            console.log(feed);
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
            console.log("The post is",post);
            postService.createPost(post, $scope.userId, $scope.token)
                .then(function (postResponse) {
                    if (postResponse) {
                        $scope.error = postResponse.message;
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                    }
                    $anchorScroll('top');
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
                    $anchorScroll('top');
                })
        }

        function favoritePostById(postId) {
            $scope.error = null;

            postService.favoritePostById($scope.userId, $scope.token, postId)
                .then(function (resp) {
                    if (resp) {
                        $scope.error = resp.message;
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                    }
                    $anchorScroll('top');
                })
        }

        function unfavoritePostById(postId) {
            $scope.error = null;

            postService.unfavoritePostById($scope.userId, $scope.token, postId)
                .then(function (resp) {
                    if (resp) {
                        $scope.error = resp.message;
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                    }
                    $anchorScroll('top');
                })
        }

        function clapPostById(postId) {
            $scope.error = null;

            postService.clapPostById($scope.userId, $scope.token, postId)
                .then(function (resp) {
                    if (resp) {
                        $scope.error = resp.message;
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                    }
                    $anchorScroll('top');
                })
        }

        function unclapPostById(postId) {
            $scope.error = null;

            postService.unclapPostById($scope.userId, $scope.token, postId)
                .then(function (resp) {
                    if (resp) {
                        feedCtrl.error = resp.message;
                    }
                    else {
                        feedCtrl.error = " Oops! Something went wrong. Please try again later ";
                    }
                    $anchorScroll('top');
                })
        }

        function retweetPostById(postId) {
            $scope.error = null;

            postService.retweetPostById($scope.userId, postId)
                .then(function (resp) {
                    if (resp) {
                        $scope.error = resp.message;
                    }
                    else {
                        $scope.error = " Oops! Something went wrong. Please try again later ";
                    }
                    $anchorScroll('top');
                })
        }

        function unretweetPostById(postId) {
            feedCtrl.error = null;

            postService.unretweetPostById(feedCtrl.userId, postId)
                .then(function (resp) {
                    if (resp) {
                        feedCtrl.error = resp.message;
                    }
                    else {
                        feedCtrl.error = " Oops! Something went wrong. Please try again later ";
                    }
                    $anchorScroll('top');
                })
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