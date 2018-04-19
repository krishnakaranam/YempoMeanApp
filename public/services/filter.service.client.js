
(function () {
    angular
        .module("Yempo")
        .service("filterService", filterService);
    function filterService($http) {

        this.filterMessage = filterMessage;
        this.getMostFollowers = getMostFollowers;
        this.getLeastFollowers = getLeastFollowers;
        this.getGatewayFollowers = getGatewayFollowers;
        this.getMostActiveFollowers = getMostActiveFollowers;
        this.getLeastActiveFollowers = getLeastActiveFollowers;
        this.getMostInteractiveFollowers = getMostInteractiveFollowers;

        var URL = '/api/filter';

        // to be configured for image upload
        function filterMessage(message, userId, token) {
            var url = URL + '/message/'+userId;
            return $http.post(url, message,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // Done
        function getMostFollowers(userId, token) {
            var url = URL + '/mostfollowers/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // Done
        function getLeastFollowers(userId, token) {
            var url = URL + '/leastfollowers/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // Done
        function getGatewayFollowers(userId, token) {
            var url = URL + '/gateway/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // Done
        function getMostActiveFollowers(userId, token) {
            var url = URL + '/mostactive/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // Done
        function getLeastActiveFollowers(userId, token) {
            var url = URL + '/leastactive/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

        // Done
        function getMostInteractiveFollowers(userId, token) {
            var url = URL + '/mostinteractive/' + userId;
            return $http.get(url,{
                headers: {'Authorization': "Bearer "+token}
            })
                .then(function (response) {
                    return response.data;
                });
        }

    }
})();