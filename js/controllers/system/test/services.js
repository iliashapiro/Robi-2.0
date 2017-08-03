app.controller('ServicesCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$state', '$stateParams', '$http', '$tm1Ui',
                                function($scope, $rootScope, $interval, $timeout, $state, $stateParams, $http, $tm1Ui) {
	
	$scope.page = {app:{}};
	
	$scope.batchTest = function(){
		$tm1Ui.processExecute('dev', 'Bedrock.Dim.Clone'
				, 'pSourceDim', 'Account'
				, 'pTargetDim', 'Account.Test'
				, 'pAttr', 1
		).then(function(data){
			console.debug('batchTest(Bedrock.Dim.Clone) %o', data);
		});
		
		$tm1Ui.processExecute('dev', 'Bedrock.Server.SaveDataAll'			
		).then(function(data){
			console.debug('batchTest(Bedrock.Server.SaveDataAll) %o', data);
		});
	};
	
	$scope.multiDbrTest = function(){
		
		var dbrRequests = [];
		
		var dbrRequest = {};
		dbrRequest.instance = 'dev';
		dbrRequest.cube = 'System Info';
		dbrRequest.cubeElements = ['Current Date', 'Comment'];
		dbrRequests.push(dbrRequest);
		
		var dbrRequest = {};
		dbrRequest.instance = 'dev';
		dbrRequest.cube = 'System Info';
		dbrRequest.cubeElements = ['Logging Directory', 'Comment'];
		dbrRequests.push(dbrRequest);
		
		$tm1Ui.cellGets(dbrRequests).then(function(data){
			console.debug('data %o', data);
		});
	};
	
	$scope.batchedDbrTest = function(){
		$tm1Ui.cellGetBatch('dev', 'System Info', ['Current Date', 'Comment']).then(function(data){
			console.debug('cellGetbatch %o', data);
		});
		
		$tm1Ui.cellGetBatch('dev', 'System Info', ['Logging Directory', 'Comment'], '999').then(function(data){
			console.debug('cellGetbatch %o', data);
		});		
	};
	
	// Admin Login
    $scope.applicationAdminLogin = function(username, password){
        $tm1Ui.applicationAdminLogin(username, password).then(function(data){
            console.debug('applicationAdminLogin() %o ', data);            
            $scope.page.result = data;
        });
    };

    // Admin Logout
    $scope.applicationAdminLogout = function(username, password){
        $tm1Ui.applicationAdminLogout().then(function(data){
            console.debug('applicationAdminLogout() %o ', data);            
            $scope.page.result = data;
        });
    };
    
    // Application Info
    $scope.applicationInfo = function(){
        $tm1Ui.applicationInfo().then(function(data){
            console.debug('applicationInfo() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Application Instances
    $scope.applicationInstances = function(){
        $tm1Ui.applicationInstances().then(function(data){
            console.debug('applicationInstances() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Application Login
    $scope.applicationLogin = function(instance, username, password, cam){
        $tm1Ui.applicationLogin(instance, username, password, cam).then(function(data){
            console.debug('applicationLogin() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Application Logout
    $scope.applicationLogout = function(instance){
        $tm1Ui.applicationLogout(instance).then(function(data){
            console.debug('applicationLogout() %o ', data);
            $scope.page.result = data;
        });
    };
    
    
    // Application Menus
    $scope.applicationMenus = function(){
        $tm1Ui.applicationMenus().then(function(data){
            console.debug('applicationMenus() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Application Name
    $scope.applicationName = function(){
        $tm1Ui.applicationName().then(function(data){
            console.debug('applicationName() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Application User
    $scope.applicationUser = function(instance){
        $tm1Ui.applicationUser(instance).then(function(data){
            console.debug('applicationUser() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Application Refresh
    $scope.dataRefresh = function(){
        $tm1Ui.dataRefresh();
        console.debug('dataRefresh()');
    };
    
    // Application Delete File    
    $scope.deleteFile = function(instance, fileToDelete){
    	$tm1Ui.applicationDeleteFile(instance, fileToDelete).then(function(data){
            console.debug('applicationDeleteFile() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Attribute Get
    $scope.attributeGet = function(instance, dimension, element, attribute){
        $tm1Ui.attributeGet(instance, dimension, element, attribute).then(function(data){
            console.debug('attributeGet() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Attribute Put
    $scope.attributePut = function(value, instance, dimension, element, attribute){
        $tm1Ui.attributePut(value, instance, dimension, element, attribute).then(function(data){
            console.debug('attributePut() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Cell Get
    $scope.cellGet = function(instance, cube, element1, element2, element3, element4, element5, element6, element7, element8, element9, element10){
        $tm1Ui.cellGet(instance, cube, element1, element2, element3, element4, element5, element6, element7, element8, element9, element10).then(function(data){
            console.debug('cellGet() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Cell Put
    $scope.cellPut = function(value, instance, cube, element1, element2, element3, element4, element5, element6, element7, element8, element9, element10){
        $tm1Ui.cellPut(value, instance, cube, element1, element2, element3, element4, element5, element6, element7, element8, element9, element10).then(function(data){
            console.debug('cellPut() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Execute MDX
    $scope.cubeExecuteMdx = function(instance, mdx, restPath){
        $tm1Ui.cubeExecuteMdx(instance, mdx, restPath).then(function(data){
            console.debug('cubeExecuteMdx() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Cube View Definition
    $scope.cubeView = function(instance, cube, view){
        $tm1Ui.cubeView(instance, cube, view).then(function(data){
            console.debug('cubeView() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Cube Views
    $scope.cubeViews = function(instance, cube){
        $tm1Ui.cubeViews(instance, cube).then(function(data){
            console.debug('cubeViews() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Cubes
    $scope.cubes = function(instance){
        $tm1Ui.cubes(instance).then(function(data){
            console.debug('cubes() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Dimension Element
    $scope.dimensionElement = function(instance, dimension, elementOrAlias, attributes){
        $tm1Ui.dimensionElement(instance, dimension, elementOrAlias, attributes).then(function(data){
            console.debug('dimensionElement() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Dimension Elements
    $scope.dimensionElements = function(instance, dimension, attributes, subset, mdx, filter, batchSize, showHierarchy, elementsOnly){
    	elementsOnly = elementsOnly == 'true' ? true : false;
    	showHierarchy = showHierarchy == 'true' ? true : false;
    	
        $tm1Ui.dimensionElements(instance, dimension, attributes, subset, mdx, filter, batchSize, showHierarchy, elementsOnly).then(function(data){
            console.debug('dimensionElements() %o ', data);
            $scope.page.result = data;
        });
    };
    
    // Process
    $scope.process = function(instance, name){
        $tm1Ui.process(instance, name).then(function(data){
            console.debug('process() %o ', data);
            $scope.page.result = data;
        });
    };
    
    $scope.processExecute = function(instance, name, parameters){
        $tm1Ui.processExecute(instance, name, parameters).then(function(data){
            console.debug('processExecute() %o ', data);
            $scope.page.result = data;
        });
    };
    
    $scope.updateProcessParameters = function(instance, name){
    	$tm1Ui.process(instance, name).then(function(data){            
            $scope.page.app.parameters = data.Parameters;
        });
    };
    
    // Helper
    $scope.generateUUID = function(){
    	console.debug('generateUUID() %o ', $tm1Ui.helperGenerateUUID());
    };
    
    $scope.formatNumber = function(value, decimal){
    	$scope.page.app.formattedNumber = $tm1Ui.formatNumber(value, decimal);
    	console.debug('formatNumber() %o ', $scope.page.app.formattedNumber);
    };
    
    $scope.formatPercentage = function(value, decimal){
    	$scope.page.app.formattedPercentage = $tm1Ui.formatPercentage(value, decimal);
    	console.debug('formatPercentage() %o ', $scope.page.app.formattedPercentage);
    };
    
}]);