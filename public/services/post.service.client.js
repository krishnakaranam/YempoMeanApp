
(function () {
    angular
        .module("Yempo")
        .service("postService", postService);
    function postService($http) {

        this.createPost = createPost;
        this.createImage = createImage;
        this.getFeed = getFeed;
        this.favoritePostById = favoritePostById;
        this.unfavoritePostById = unfavoritePostById;
        this.clapPostById = clapPostById;
        this.unclapPostById = unclapPostById;
        this.retweetPostById = retweetPostById;
        this.unretweetPostById = unretweetPostById;
        this.getLikesByUserId = getLikesByUserId;
        this.getCommentsByUserId = getCommentsByUserId;
        this.getSharesByUserId = getSharesByUserId;

        var URL = '/api/post';

		// to be configured for image upload
        function createPost(post, userId, token) {
            var url = URL + '/create/'+userId;
            var imageUrl = URL + '/create/image/'+userId;
            return $http.post(url, post,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        function createImage(formdata, userId, token) {
            var imageUrl = URL + '/create/image/'+userId;
            return $http.post(imageUrl, formdata,{
                headers: {'Authorization': "Bearer "+token,
                          'Content-Type': undefined}
            })
                .then(function (response) {
                    return response.data;
                });
        }

		// Done
        function getFeed(userId, token) {
            var url = URL + '/feed/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
		// Done
        function favoritePostById(userId, token, postId) {
            var url = URL + '/favorite/' + userId + "/" + postId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
		// Done
        function unfavoritePostById(userId, token, postId) {
            var url = URL + '/unfavorite/' + userId + "/" + postId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
		// Done
        function clapPostById(userId, token, postId) {
            var url = URL + '/clap/' + userId + "/" + postId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
		// Done
        function unclapPostById(userId, token, postId) {
            var url = URL + '/unclap/' + userId + "/" + postId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
		// Done
        function retweetPostById(userId, token, postId) {
            var url = URL + '/retweet/' + userId + "/" + postId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
		// Done
        function unretweetPostById(userId, token, postId) {
            var url = URL + '/unretweet/' + userId + "/" + postId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // Done
        function getLikesByUserId(userId, token) {
            var url = URL + '/reach/likes/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
        // Done
        function getCommentsByUserId(userId, token) {
            var url = URL + '/reach/comments/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }
		
        // Done
        function getSharesByUserId(userId, token) {
            var url = URL + '/reach/shares/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

    }
})();