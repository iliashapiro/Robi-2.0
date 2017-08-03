
var topOffset = 50;
var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

var app = angular.module('app', 
		['ui.router', 'angularMoment', 'ngSanitize', 'ngFileUpload',
         'ngStorage', 'angularBootstrapNavTree', 'angularUUID2', 'nvd3', 'tm1Ui.provider',
         'ui.bootstrap', 'base64', 'tm1Ui', 'ui.bootstrap.contextMenu', 'textAngular', 'ngBootbox', 
         'hljs', 'ngTable', 'pascalprecht.translate','ui.ace', 'matchMedia', 'ngclipboard']);

app.config(['$stateProvider', '$logProvider', 'tm1UiRouterProvider', 'hljsServiceProvider', function($stateProvider, $logProvider, tm1UiRouterProvider, hljsServiceProvider) {
	
	$logProvider.debugEnabled(false);
	
	// default - required to have at least one
	$stateProvider
		.state('base', {url: '', templateUrl: 'admin/html/admin/home.html'})
		.state('admin', {url: '/', templateUrl: 'admin/html/admin/home.html'})
		.state('admin.login-tm1', {url: 'login-tm1/:instance?type&name', templateUrl: 'admin/html/admin/login-tm1.html'})
		.state('admin.slice', {url: 'slice', templateUrl: 'admin/html/admin/slice.html'})
		.state('admin.active-form', {url: 'active-form', templateUrl: 'admin/html/admin/active-form.html'})
		.state('admin.setting', {url: 'setting', templateUrl: 'admin/html/admin/setting.html'})
		.state('admin.login-admin', {url: 'login-admin', templateUrl: 'admin/html/admin/login-admin.html'})
		.state('admin.menu-management', {url: 'menu-management', templateUrl: 'admin/html/admin/menu-management.html'})
		.state('admin.page-creator', {url: 'page-creator', templateUrl: 'admin/html/admin/page-creator.html'})
		.state('admin.editor', {url: 'editor', templateUrl: 'admin/html/admin/editor.html'})
		
		.state('admin.reports-manager', {url: 'reports-manager', templateUrl: 'admin/html/admin/reports-manager.html'})
		.state('admin.job-editor', {url: 'job-editor/{jobId}', templateUrl: 'admin/html/admin/job-editor.html', params:{job: null}})
	;
	
	
}]);

app.config(['$translateProvider', function ($translateProvider) {
	
	var lang = "en";
	$translateProvider.useSanitizeValueStrategy('sanitize');
	
    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/locale-',
        suffix: '.json'
    });
    
    $translateProvider.preferredLanguage(lang);
    $translateProvider.fallbackLanguage('en');
    
}]);



//Handle http errors
app.factory('authHttpResponseInterceptor',['$q', '$location', '$rootScope', '$window', '$log', function($q, $location, $rootScope, $window, $log){
    return {
        'response': function(response){        	
            return response || $q.when(response);
        },
        'responseError': function(rejection) {
        	if (rejection.status === 401) {
        		var parts = rejection.config.url.split("/");
        		if(parts.length > 1 && (parts[0] == "tm1" || parts[0] == "api")){
        			
        			var instance = parts.length > 2 ? parts[2] : parts[1];
        			var type = $rootScope.$state.current.name;
        			var name = $rootScope.$stateParams.name;
        			
        			if(type != 'admin.login-tm1'){
 			   			var isInstanceFound = false; 
 			   			var _instance = '';
 			   			
    	    			_.each($rootScope.instances, function(s){				
    						if(s.name.toLowerCase() === instance.toLowerCase()){
    							s.isLoggedIn = false;
    							s.cam = null;
    							s.userName = null;
    							
    							isInstanceFound = true;
    						}			
    					});
    	    			
    	    			// check and get first instance
    	    			if(!isInstanceFound && rejection.config && rejection.config.data){
    	    				if(angular.isArray(rejection.config.data) && rejection.config.data.length > 0){ // Array
    	    					
    	    					// check if we can find the one that caused the 401 (applicable for DBRs only)
    	    					_.forEach(rejection.config.data, function(_dbrRequest){
    	    						if(_.isEmpty(_instance) && _dbrRequest.cube && _dbrRequest.elements && rejection.data && rejection.data[_dbrRequest.id] && rejection.data[_dbrRequest.id].statusCode && rejection.data[_dbrRequest.id].statusCode == 401){
    	    							_instance = _dbrRequest.instance;
    	    						}
    	    					});
    	    					
    	    					if(_.isEmpty(_instance) && rejection.config.data[0].instance){
    	    						_instance = rejection.config.data[0].instance;
    	    					}    	    						
    	    				}
    	    				else{ // Object
    	    					if(rejection.config.data.instance) _instance = rejection.config.data.instance;
    	    				}
    	    			}
    	    			else{
    	    				_instance = instance;
    	    			}
            			
            			$rootScope.$state.transitionTo('admin.login-tm1', {instance: _instance});
        			}
        			
        			return rejection;
        		}
            }
        	else if (rejection.status === 403) {
        		var parts = rejection.config.url.split("/");
        		if(parts.length > 1 && (parts[0] == "tm1" || parts[0] == "api")){
        			
        			var instance = parts.length > 2 ? parts[2] : parts[1];
        			var type = $rootScope.$state.current.name;
        			var name = $rootScope.$stateParams.name;
        			
        			if(type != 'admin.login-admin'){
 			   			var isInstanceFound = false; 
 			   			var _instance = '';
 			   			
    	    			_.each($rootScope.instances, function(s){				
    						if(s.name.toLowerCase() === instance.toLowerCase()){
    							s.isLoggedIn = false;
    							s.cam = null;
    							s.userName = null;
    							
    							isInstanceFound = true;
    						}			
    					});
    	    			
    	    			// check and get first instance
    	    			if(!isInstanceFound && rejection.config && rejection.config.data){    	    				
    	    				if(angular.isArray(rejection.config.data) && rejection.config.data.length > 0){ // Array
    	    					if(rejection.config.data[0].instance) _instance = rejection.config.data[0].instance;
    	    				}
    	    				else{ // Object
    	    					if(rejection.config.data.instance) _instance = rejection.config.data.instance;
    	    				}
    	    			}
    	    			else{
    	    				_instance = instance;
    	    			}
            			
            			$rootScope.$state.transitionTo('admin.login-admin', {instance: _instance});
        			}
        			
        			return rejection;
        		}
            }
            
            if (rejection.status === 400 || rejection.status === 404) {
            	// Allow status to flow through to the controller
            	return rejection;
            }
            
            if (rejection.status === 500) {
            	// $log.warn('TM1 Server Might Be Down. Please Check.');
            	return rejection;
            }
            
            return $q.reject(rejection);
        }
    }
}]);


// keep track of requests
app.factory('countHttpInterceptor',['$rootScope', '$q', function($rootScope, $q){
	
	if(!$rootScope.requestCount){
		$rootScope.requestCount = 0;
	}
	
	return {
		// optional method
	    'request': function(config) {
	    	$rootScope.requestCount++;
	    	return config;
	    },

	    // optional method
	    'requestError': function(rejection) {
	    	$rootScope.requestCount++;
	    	return $q.reject(rejection);
	    },
	    
	    'response': function(response) {
	    	$rootScope.requestCount--;
	    	return response;
    	},

	    // optional method
    	'responseError': function(rejection) {
    		$rootScope.requestCount--;
    		return $q.reject(rejection);
	    }
	};
}]);

app.config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
    
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
    $httpProvider.interceptors.push('countHttpInterceptor');
    $httpProvider.defaults.withCredentials = true;    
    $locationProvider.hashPrefix('');
    
}]);

app.run(['$rootScope', '$localStorage', '$http', '$filter', '$templateCache', 'amMoment', '$state', '$stateParams', '$tm1UiHelper', 'tm1UiRouter', '$location', '$urlRouter', '$timeout', '$tm1UiSetting',
         function($rootScope, $localStorage, $http, $filter, $templateCache, amMoment, $state, $stateParams, $tm1UiHelper, tm1UiRouter, $location, $urlRouter, $timeout, $tm1UiSetting) {
	
	$tm1UiSetting.applicationName().then(function(data){
		$rootScope.appName = data.name;	
	});
	
	$rootScope.uiPrefs = $localStorage.$default({instances: []});
	$rootScope.uiPrefs.menu = true;
	
	$rootScope.isLoading = false;
	
	// function(s)
	$rootScope.$watch('requestCount', function(){
		
		if($rootScope.isLoadingTimer){
			// Cancel the timer if it exists
			$timeout.cancel($rootScope.isLoadingTimer);
			$rootScope.isLoadingTimer = null;
		}
		
		if($rootScope.requestCount > 0){
			$rootScope.isLoading = true;
		}
		else {
			if($rootScope.isLoading){
				
				// Use a timer to wait 1s to make sure there aren't subsequent requests
				$rootScope.isLoadingTimer = $timeout(function(){
					if($rootScope.requestCount == 0){
						$rootScope.isLoading = false;
					}
				}, 1000);
			}
		}
	});
	
	
	$rootScope.showHideMenu = function (collapsed){
		
		if(collapsed == null){
			collapsed = $(".sidebar-nav").hasClass("in");
		}
		
		if(collapsed){
			$("#page-wrapper").addClass("navbar-collapse");
			$("#tab-wrapper").addClass("navbar-collapse");
			$(".sidebar-nav").addClass("collapse");
			$(".sidebar-nav").addClass("in");
			$rootScope.uiPrefs.menu = false;
		}
		else {
			$("#page-wrapper").removeClass("navbar-collapse");
			$("#tab-wrapper").removeClass("navbar-collapse");
			$("#page-wrapper").removeClass("collapse");
			$("#tab-wrapper").removeClass("collapse");
			$(".sidebar-nav").removeClass("in");
			$rootScope.uiPrefs.menu = true;
		}
		
	};

	$rootScope.navbarToggle = function(){
		
		var width = (window.innerWidth > 0) ? window.innerWidth : window.screen.width;
		var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        height = height - topOffset;
		
		
        if(width >= 768){
			$rootScope.showHideMenu($rootScope.uiPrefs.menu);
			if($(".sidebar-nav").hasClass("in")){
				$(".sidebar").css("height", 0);
	        }
	        else {
	        	$(".sidebar").css("height", height);
	        }
		}
		else {
			$(".sidebar").css("height", "");
			$rootScope.showHideMenu($rootScope.uiPrefs.menu);
		}
		
	};
	
	$rootScope.resizeSideBar = function(){
		
		var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        height = height - topOffset;
        
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            $('nav').addClass('navbar-static-top');
            $('nav').removeClass('navbar-fixed-top');
            topOffset = 100; // 2-row-menu
            $(".sidebar").css("height", "");
            $rootScope.showHideMenu(false);
        } else {
            $('nav').addClass('navbar-fixed-top');
            $('nav').removeClass('navbar-static-top');
            $rootScope.showHideMenu(!$rootScope.uiPrefs.menu);
            if($(".sidebar-nav").hasClass("in")){
            	$(".sidebar").css("height", 0);
            }
            else {
            	$(".sidebar").css("height", height);
            }
        }     
		
	}
	
	$rootScope.$panelToggle = function($event){
		
		var id = $($event.target).parent("a").attr("id");
		if($rootScope.uiPrefs[id]){
			$rootScope.uiPrefs[id] = false;
		}
		else {
			$rootScope.uiPrefs[id] = true;
		}
		
	};
	
	// bootstrap start	
	$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
	
	$(".dropdown-menu").on("click", function(e) {
        e.stopPropagation();
    });
	
	$(window).bind("load resize", function() {        
		$rootScope.resizeSideBar();   
		
		var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
        height = height - 150;
		
		$(".ace_editor").each(function(index, element){
        	var top =  $(this).position().top;
        	var editorHeight = height - top;
        	if(editorHeight < 0){
        		editorHeight = 0;
        	}
        	$(this).css("height", editorHeight);
        });
        
    });
	
	$tm1UiHelper.initBatcher({
		'maxTime': 50,
		'maxRequestCount': 500,			
		'maxRequestElementCount': 3
	});
	
	// set global settings for DBR
	$http.get('api/instances').then(function(success, error){
		if(success.status == 200){
			$rootScope['instanceSettings'] = {};
			angular.forEach(success.data, function(instance){
				$rootScope['instanceSettings'][instance.name] = {};
				angular.forEach(instance, function(value, key){
					if(key != 'name'){
						$rootScope['instanceSettings'][instance.name][key] = value;
					}
				});
			});			
		}
	});
	
	// moved
	$http.get("api/license").then(function(success, error) {		
		$rootScope['license'] = success.data;
	});	
}]);



