var app = angular.module("myapp", [])
.directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if (v) {
                        elm.css('display', 'block');
                    } else {
                        elm.css('display', 'none');
                    }
                });
            }
        };

    }]);

var productList = [];
var index = 0;
var success; 
var sortfilters = false;

app.controller("myCtrl", function($scope,$http) {

	$scope.showList = false;
	$scope.btnloadmore = true;
	$scope.fetchDataServer = function() {	

  		 // First time load
  	
  	var queryField = "";
    var sortField = "";
    var indexField = "&index="+index+"&limit=27";
    if(this.query !=null && this.query != "")
  		 	queryField = "&q="+this.query;
    
    if(this.sort !=null && this.sort != "")
       sortField = "&sortField="+this.sort;
  		
  	var serverUrl = "http://api.shortlyst.com/v1/products?apikey=e3ebd9fdf9704775c7fd6bb4f20e1798" +queryField + indexField +sortField;

	  $http({ method: 'GET', url: serverUrl}).
	  then(function (data, status, headers, config) {
	  	 	if(index >= (data.data.numFound-1)){
	  		$scope.btnloadmore = false;
	  	}
	  	// console.log(data.data.productList.length);
	  	// console.log(data.data);
	  	if(index==0)
	  	{
	  		productList = [];
	  	}

	  	for(var i=0;i<data.data.productList.length;i++)
	  	{
	  		productList.push(data.data.productList[i]);
	  	}
	  	$scope.productList = productList;
		 // ...
	  }),
	  function (data, status, headers, config) {
	    // ...
	    console.log("error");
	  }
  	};

  	$scope.sortproduct=function(){
  		$scope.fetchDataServer();
  	}

  	$scope.searchProduct = function() {
    if(this.query) {
    	index=0;
    	$scope.fetchDataServer();
    }

  };

  $scope.loadMore = function(){
  		index++;
  		$scope.fetchDataServer();
  }

  	$scope.changeList=  function(){
		$scope.showList = true;
	};
	$scope.changeGrid = function(){
		$scope.showList = false;
	};

  $scope.sortlist = function(){ 
    $scope.sortfilters = $scope.sortfilters ? false : true;
  };
});

	