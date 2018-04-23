
(function () {
    angular
        .module("Yempo")
        .factory("userService", userService);
    function userService($http) {
        var userURL = '/api/user';

        var api = {
            createUser: createUser,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            connectTwitter: connectTwitter
        };
        return api;

        // done
        function createUser(user) {
            var url = userURL + '/signup';
            return $http.post(url, user)
                .then(function (response) {
                    return response.data;
                }, function (error) {
                    return error.data;
                });
        }

        function connectTwitter(userId) {
            var url = 'login/twitter';
            return $http.get(url);
        }

        // done
        function findUserById(userId,token) {
            var url = userURL + '/profile/' + userId;
            return $http.get(url,{
                    headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // extra
        function findUserByUsername(username) {
            var url = userURL + '?username=' + username;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        // done
        function findUserByCredentials(user) {
            var url = userURL + '/login';
            return $http.post(url, user)
                .then(function (response) {
                    return response.data;
                }, function (error) {
                    return error.data;
                });
        }

    }
})();