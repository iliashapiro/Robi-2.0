
app.controller('MainCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$state', '$stateParams', '$http', '$location', function($scope, $rootScope, $interval, $timeout, $state, $stateParams, $http, $location) {
	
	// Contains the menu control
	$scope.menu = {};
	// contains the menu items
	$scope.menuData = [];	
	
	// Store search box stuff
	var searchLast = 0;
	$scope.menuSearch = {};
	$scope.menuSearchData = [];
	$scope.parameters = { search: "" };
	
	$scope.print = {
		pageOrientation: "Landscape",
		pageSize: "A4"
	};
	
	// this controller reference
	var _controller = this;
	
	
	// load menu from a file
	$http.get('api/app/menus').then(function(success, error){
		$scope.menuData.push(success.data);
		
		// Add the menu to a cache to be used for searching
		$scope.menuCache = _.cloneDeep($scope.menuData);	
		
		// find the sample index if present
		$rootScope.samplesMenuIndex = -1;
		if($scope.menuData[0] && $scope.menuData[0].children){		
			for(var i = 0; i < $scope.menuData[0].children.length; i++){
				if($scope.menuData[0].children[i].data && $scope.menuData[0].children[i].data.page && $scope.menuData[0].children[i].data.page == 'sample'){
					$rootScope.samplesMenuIndex = i;
					
					break;
				}
			}
		}
		$rootScope.menuData = _.cloneDeep($scope.menuData);
	});
	
	// Get the details of the instances from the java servlet
	$http.get("api/instances")
		.then(function(success, error) {
			
			$rootScope.instances = success.data;

		});
	
	var searchTimeout = false;
	
	$scope.isCopied = false;
	$scope.copySuccess = function(){
		$scope.isCopied = true;
		$timeout(function(){
			$scope.isCopied = false;
		}, 5000); 
	};
	
	$scope.search = function(){
		
		if(_.isEmpty($scope.parameters.search)){
			// Reset the menu
			$scope.menuSearchData = [];
			$scope.selectBranch($state.current.name, $stateParams);
		}
		else {
			
			var now = new Date();
			if(now.getTime() - searchLast < 500){
				// Search again later if it has been less than 500 ms and one hasn't already been scheduled
				if(searchTimeout == false){
					searchTimeout = true;
					$timeout(function(){
						searchTimeout = false;
						$scope.search();
					}, 500);
				}
				return;
			}
			
			var searchTerm = $scope.parameters.search.toLowerCase();
			
			// Search for items
			$scope.menuSearchData = [];
			searchBranch($scope.menuCache, searchTerm, $scope.menuSearchData);
		
			now = new Date();
			searchLast = now.getTime();
		}
		
	}
	
	var searchBranch = function(children, searchTerm, result){
		// Search recursively for leaf elements containing the search term
		if(children){
			for(var i = 0; i< children.length; i++){
				var branch = children[i];		
				if(branch.label.toLowerCase().indexOf(searchTerm) > -1){
					// Add the item to the search result
					result.push(branch);
				}
				searchBranch(branch.children, searchTerm, result);
			}
		}
	}
	
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){			
		// save last known state
		$rootScope.priorState = {
				state: fromState,
				param: fromParams
		};
		
		// This is used to select the item in the menu when navigating to a page
		
		// Get the parameters
		$scope.page = toState.name;
		$scope.parameters = toParams;
		
		// Select the branch in the menu
		$scope.selectBranch($scope.page, $scope.parameters);
	});
		
	$scope.menuSelect = function(branch){
		// Menu item clicked event handler
		// Navigate to the page
		
		if(!branch){			
			return;
		}
		
		if(branch.data && branch.data.page){			
			$rootScope.$broadcast('menu.branch.select', branch);	
			$state.transitionTo(branch.data.page, branch.data.parameters);
		}		
	}
	
	$scope.menuGenerateUrl = function(branch){
		
		if(!branch){			
			return "";
		}
		
		try {
			var url = $state.href(branch.data.page, branch.data.parameters);
			return url;
		}
		catch (e) {
			return "";
		}
	}
	
	$scope.selectBranch = function(page, parameters){
		
		// Used to select the menu item when a user navigates via the address bar
		
		var branch = null;
		
		if(page == "home" || page == "login" || page == "notfound"){	
			$scope.menu.deselect_branch();
			return;
		}
		else if(!page){
			$scope.menu.deselect_branch();
			return;
		}
		
		var branch = findBranch($scope.menuData, page, parameters);
		if(branch){			
			$scope.menu.select_branch(branch);
		}
		
	}
	
	var findBranch = function(children, page, parameters){
		// Recursively look for the menu
		if(children){
			for(var i = 0; i< children.length; i++){
				var branch = children[i];
				if(branch.data && branch.data.page && branch.data.page == page && _.eq(branch.data.parameters, parameters)){
					return branch;
				}
				var result = findBranch(branch.children, page, parameters);
				if(result){
					branch.expanded = true;
					return result;
				}
			}
		}
		return null;
	}
	
	$scope.pageUrlEncoded = function() {
		return encodeURIComponent($location.absUrl());
	};
	
	$scope.pageUrl = function() {
		return $location.absUrl();
	};
	
	// angular version
	$scope.angularVersion = angular.version;
	
}]);
