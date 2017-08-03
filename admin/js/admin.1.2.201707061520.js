
app.controller('AdminActiveFormCtrl', ['$scope', '$rootScope', '$tm1Ui', '$http', '$timeout', 
                                  function($scope, $rootScope, $tm1Ui, $http, $timeout) {
	
	// variable(s)
	$scope.options = {};
	$scope.page = {instance:'', cube:'', view:'', rowOptimalElementSize: 100};
	
	// function(s)
	$scope.updateCubes = function(){
		$tm1Ui.cubes($scope.page.instance).then(function(value){
			$scope.options.cubes = value;
		});
	};
	
	$scope.updateViews = function(){
		$tm1Ui.cubeViews($scope.page.instance, $scope.page.cube).then(function(value){
			$scope.options.views = value;
		});
	};
	
	$scope.getView = function(){
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			$scope.view = value;
		});
	};
	
	$scope.create = function(){
		
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			
			// Update the view in case it has changed.
			$scope.view = value;
			
			var stateConfig = {states:{}};
			stateConfig.states[$scope.page.menuState] = {};
			stateConfig.states[$scope.page.menuState].url = '/' + $scope.page.menuState;
			stateConfig.states[$scope.page.menuState].templateUrl = $scope.page.menuPageLocation;
			
			var menuItemConfig = {
					label:$scope.page.pageName,
					icon_class:$scope.page.menuIconClass,
					data:{
						page:$scope.page.menuState
					}
			};
			
			var data = {
				pageName: $scope.page.pageName,
				view: $scope.view,
				
				state: stateConfig,
				menuItem: menuItemConfig,
				
				useDBRRows: $scope.page.useDBROnRow,
				usePaging: $scope.page.usePaging,
				
				pageType: 'active-form',
				instance: $scope.page.instance
			};
			
			$scope.isDone = false;
			
			$http.post('api/admin/pages/create', data).then(function(value){
				
				$scope.isDone = true;
				$scope.page.cube = '';
				$scope.page.view = '';
				$scope.page.pageName = '';
				
				$timeout(function(){
					$scope.isDone = false;
				}, 3000);
				
			});
			
		});
		
	};
	
	$scope.updatePageProperty = function(){
		try{
			$scope.page.menuState = $scope.page.pageName.split(' ').join('-').toLowerCase();
			$scope.page.menuName = $scope.page.pageName;
			$scope.page.menuPageLocation = 'html/' + $scope.page.pageName + '.html';			
			$scope.page.menuIconClass = angular.isUndefined($scope.page.menuIconClass) ? 'fa-file-text-o' : $scope.page.menuIconClass;
		}
		catch(err){}
	};
	
	// on page load	
	$tm1Ui.applicationInstances().then(function(value){
		$scope.options.instances = value;
		if($scope.options.instances){
			$scope.page.instance = $scope.options.instances[0].name;
			$scope.updateCubes();
		}
	});
}]);
app.controller('EditorCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$tm1UiSetting', '$translate', '$window', '$tm1UiApp', '$log', '$http',
                             function($scope, $rootScope, $timeout, $state, $tm1UiSetting, $translate, $window, $tm1UiApp, $log, $http) {
	
	$scope.page = {};
	
	$scope.aceLoaded = function(_editor){
		
		setTimeout(function(){
			// Resize
			var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
			var top =  $(_editor.container).position().top;
      	  	var editorHeight = height - (top + 150);
	      	if(editorHeight < 0){
	      	  editorHeight = 0;
	      	}
	      	$(_editor.container).css("height", editorHeight);
		}, 500);
		
		$scope.$editor = _editor;
		$scope.$editor.$blockScrolling = Infinity;
		
		// Include auto complete
		ace.require("ace/ext/language_tools");
		$scope.$editor.setOptions({
		    enableBasicAutocompletion: true,
		    tabSize: 2
		});
		
		// set the content from the ace control
		$scope.updatedFileContents = function(){
			if($scope.page.file){				
				$scope.page.file.content = $scope.$editor.getValue();
				return true;
			}			
			return false;
		};
		
		$scope.$editor.on("blur", function(){
			$scope.updatedFileContents();		
		});
	    
		// bind keyboard shortcut for saving
		$scope.$editor.commands.addCommand({
		    name: 'save',
		    bindKey: {win: "Ctrl-S", "mac": "Cmd-S"},
		    exec: function(editor) {
		    	if($scope.updatedFileContents()){
		    		$scope.save();
		    	}		    	    	
		    }
		});
	};
	
	$scope.selected = function(){		
		$http.get("api/admin/editor?name=" + encodeURIComponent($scope.page.fileName)).then(function(success){
			var mode = $scope.page.fileName.split('.').pop();
			if(mode == "js") {
				mode = "javascript";
			}
			$scope.$editor.getSession().setMode("ace/mode/" + mode);
			$scope.page.file = success.data;
			$scope.$editor.setValue($scope.page.file.content, -1);
			
			// save for preference
			$rootScope.uiPrefs.editorPageSelected = $scope.page.fileName;
		});
	};
	
	$scope.save = function(){
		$scope.saved = false;
		$scope.saving = true;
		$http.post("api/admin/editor", $scope.page.file).then(function(success){
			
			$scope.saving = false;
			if(success.status == 200){
				$scope.saved = true;
			}
			else {
				$scope.message = success.data.message;
			}
			
			$timeout(function(){
				$scope.saved = false;
			}, 5000);
			
		});
	};
	
	$tm1UiSetting.get().then(function(settings){
		$scope.appSettings = settings;
		$scope.setTheme();
	});
	
	$scope.setTheme = function(){
		$timeout(function(){
			if($scope.$editor){
				$scope.$editor.setTheme("ace/theme/" + $scope.appSettings.editorTheme);
			}
			else {
				$scope.setTheme();
			}
		}, 200);
	};
	
	$http.get("api/admin/editor/list").then(function(success){
		$scope.page.files = success.data;
		
		// reload last selected item
		if($rootScope.uiPrefs.editorPageSelected){
			$scope.page.fileName = $rootScope.uiPrefs.editorPageSelected;
			$scope.selected();
		}
	});
	
}]);
app.controller('AdminHomeCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$translate', '$window', '$tm1Ui', '$log',
                             function($scope, $rootScope, $timeout, $state, $translate, $window, $tm1Ui, $log) {
	// variable(s)
	$scope.$state = $state;
	$scope.STATE_LOGIN_ADMIN = 'admin.login-admin';
	$scope.STATE_SETTING = 'admin.setting';
	$scope.STATE_ADMIN = 'admin';
	$scope.STATE_BASE = 'base';
	
	$scope.page = {
			currentUser: ''
	};
	
	// function(s)
	$scope.getCurrentState = function(){
		return $state.current.name;
	};
	
	$scope.logoutAdminConsole = function(){
		$tm1Ui.applicationAdminLogout().then(function(data){
			$state.go($scope.STATE_LOGIN_ADMIN);
		});
	};
	
	$scope.redirect = function(newValue, oldValue, scope){
		if(newValue == $scope.STATE_ADMIN || newValue == $scope.STATE_BASE){
			$state.go($scope.STATE_SETTING);
		}
		else if(newValue != $scope.STATE_LOGIN_ADMIN){ // ensure that the user is logged in
			$tm1Ui.applicationInfo().then(function(data){
				if(angular.isUndefined(data.currentAdminUsername)){
					$state.go($scope.STATE_LOGIN_ADMIN);
				}
			});
		}
	};
	
	// watcher(s)
	$scope.$watch($scope.getCurrentState, $scope.redirect);
	
	// on Page Load
	// Update User info
	$tm1Ui.applicationInfo().then(function(data){
		if(data.currentAdminUsername){
			$scope.page.currentUser = data.currentAdminUsername;
		}
	});
	
	$scope.$on('admin.login.success', function(event, args){
		$tm1Ui.applicationInfo().then(function(data){
			$scope.page.currentUser = data.currentAdminUsername;
		});
	});	
}]);

app.controller('AdminJobEditorCtrl', ['$scope', '$rootScope', '$timeout', '$tm1Ui', '$stateParams', '$state', '$ngBootbox', '$http', '$translate', '$location', '$interval', '$timeout',
                                    function($scope, $rootScope, $timeout, $tm1Ui, $stateParams, $state, $ngBootbox, $http, $translate, $location, $interval, $timeout) {	
	// Variable(s)
	$scope.defaults = {};
	$scope.values = {};	
	$scope.values.isSaving = false;
	$scope.values.isNew = false;
	
	$scope.values.hasJobNameError = false;
	$scope.values.hasEmailSubjectError = false;
	$scope.values.hasEmailToError = false;
	$scope.values.hasInvalidEmailError = false;
	$scope.values.hasReportError = false;
	$scope.values.hasTriggerError = false;
	
	$scope.values.showTriggerModal = false;
	$scope.values.translationIDs = [];
	$scope.values.translationIDs.push('PAGEJOBEDITORSUCCESSFULUPDATE');
	$scope.values.translationIDs.push('PAGEJOBEDITORUNSUCCESSFULUPDATE');
	$scope.values.translationIDs.push('PAGEJOBEDITORONDEMANDRUNPROMPT');
	$scope.values.translationIDs.push('PAGEJOBEDITORONDEMANDRUNREQUEST');
	$scope.values.translationIDs.push('PAGEJOBEDITORONDEMANDRUNWARNING');
	$scope.values.translationIDs.push('PAGEJOBEDITORONDEMANDRUNUNABLETOSAVEFILE');	
	$scope.values.translationIDs.push('PAGEJOBEDITORVALIDATIONREQUIREREPORT');
	$scope.values.translationIDs.push('PAGEJOBEDITORVALIDATIONREQUIREREPORTNAMEURL');
	$scope.values.translationIDs.push('PAGEJOBEDITORVALIDATIONREQUIREREPORTURLFORMAT');	
	$scope.values.translationIDs.push('PAGEJOBEDITORVALIDATIONREQUIREREPORTCREDENTIAL');
	$scope.values.translationIDs.push('PAGEJOBEDITORVALIDATIONREQUIREREPORTCREDENTIALINSTANCENAME');
	$scope.values.translationIDs.push('PAGEJOBEDITORVALIDATIONREQUIRETRIGGER');
	$scope.values.translationIDs.push('PAGEJOBEDITORVALIDATIONREQUIRETRIGGERNAMECRON');
	
	$scope.defaults.POLL_LIMIT = 20;
	$scope.defaults.POLL_INTERVAL_SEC = 2;
	
	$scope.defaults.POLL_STATUS_INIT = 0;
	$scope.defaults.POLL_STATUS_RUNNING = 1;
	$scope.defaults.POLL_STATUS_RUN_SUCCESS = 1.1;
	$scope.defaults.POLL_STATUS_RUN_ERROR = 1.2;
	
	$scope.values.pollerStatus = $scope.defaults.POLL_STATUS_INIT;
	
	// Function(s)
	$tm1Ui.scheduledJob($stateParams.jobId).then(function(jobDetail){
		if(jobDetail){
			$scope.values.isNew = false;
			$scope.values.job = jobDetail;
		}
		else{
			$scope.values.isNew = true;
			$scope.values.job = {
					id: $stateParams.jobId
			};
		}		
	});
	
	$scope.resetErrors = function(){
		$scope.values.hasJobNameError = false;
		$scope.values.hasEmailSubjectError = false;
		$scope.values.hasEmailToError = false;
		$scope.values.hasInvalidEmailError = false;
		$scope.values.hasReportError = false;
		$scope.values.hasTriggerError = false;
	};
	
	$scope.bootboxAlertWarning = function(message){
		$ngBootbox.alert('<div class="panel panel-warning"><div class="panel-heading">' + message + '</div></div>').then(function(){});
	};
	
	$scope.bootboxAlertError = function(message){
		$ngBootbox.alert('<div class="panel panel-danger"><div class="panel-heading">' + message + '</div></div>').then(function(){});
	};
	
	$scope.updatePollerStatus = function(pollerStatus){
		$scope.values.pollerStatus = pollerStatus;
		$timeout(function(){
			$scope.values.pollerStatus = $scope.defaults.POLL_STATUS_INIT;
		}, 1000 * 3);
	};
	
	// Translations
	$translate($scope.values.translationIDs).then(function(translations){
		$scope.values.messages = {};		
		$scope.values.messages.successfulUpdate = translations.PAGEJOBEDITORSUCCESSFULUPDATE;
		$scope.values.messages.unsuccessfulUpdate = translations.PAGEJOBEDITORUNSUCCESSFULUPDATE;
		$scope.values.messages.onDemandRunPrompt = translations.PAGEJOBEDITORONDEMANDRUNPROMPT;
		$scope.values.messages.onDemandRunRequest = translations.PAGEJOBEDITORONDEMANDRUNREQUEST;
		$scope.values.messages.onDemandRunWarning = translations.PAGEJOBEDITORONDEMANDRUNWARNING;		
		$scope.values.messages.onDemandRunError = translations.PAGEJOBEDITORONDEMANDRUNUNABLETOSAVEFILE;
		
		$scope.values.messages.validationReportRequired = translations.PAGEJOBEDITORVALIDATIONREQUIREREPORT;
		$scope.values.messages.validationReportNameAndURLRequired = translations.PAGEJOBEDITORVALIDATIONREQUIREREPORTNAMEURL;		
		$scope.values.messages.validationReportInvalidURL = translations.PAGEJOBEDITORVALIDATIONREQUIREREPORTURLFORMAT;		
		$scope.values.messages.validationReportCredentialRequired = translations.PAGEJOBEDITORVALIDATIONREQUIREREPORTCREDENTIAL;
		$scope.values.messages.validationReportCredentialInstanceAndNameRequired = translations.PAGEJOBEDITORVALIDATIONREQUIREREPORTCREDENTIALINSTANCENAME;
		$scope.values.messages.validationTriggerRequired = translations.PAGEJOBEDITORVALIDATIONREQUIRETRIGGER;
		$scope.values.messages.validationTriggerNameAndCronRequired = translations.PAGEJOBEDITORVALIDATIONREQUIRETRIGGERNAMECRON;		
	});
	
	// Instance(s) Information
	$scope.baseAppPath = undefined;
	$tm1Ui.applicationInstances().then(function(instances){
		if(instances){
			if(angular.isArray(instances)){
				$scope.baseAppPath = $location.protocol() + '://' + $location.host() + ':' + $location.port() + instances[0].baseApp;
			}
		}
	});
	
	$scope.onCronHelperApply = function(){
		$('#cronModal').modal('hide');
	};
	
	/*
	 * Report Operation(s)
	 * */	
	$scope.addReport = function(){
		if($scope.values.job.reports == undefined){
			$scope.values.job.reports = [];
		}
		
		$scope.values.job.reports.push({pageSize: 'A4', orientation: 'PORTRAIT'});
		$scope.values.hasReportError = false;
	};
	
	$scope.addReportCredential = function(report){
		if(report.credentials == undefined){
			report.credentials = [];
		}
		
		report.credentials.push({});
	};
	
	$scope.deleteReportCredential = function(report, index){
		report.credentials.splice(index, 1);
	};
	
	/*
	 * Trigger Operation(s)
	 * */
	$scope.addTrigger = function(){
		if($scope.values.job.triggers == undefined){
			$scope.values.job.triggers = [];
		}
		
		$scope.values.job.triggers.push({id: $scope.values.job.id + '-' + $scope.values.job.triggers.length});
		$scope.values.hasTriggerError = false;
	};
	
	$scope.setTrigger = function(trigger){
		$scope.targetTrigger = trigger;
		
		$scope.values.showTriggerModal = false;
		$timeout(function(){
			$scope.values.showTriggerModal = true;
		}, 1);
	};
	
	/*
	 * Job Operation(s)
	 * */
	$scope.jobFormHasErrors = function(){
		$scope.resetErrors();
		
		var hasErrors = false;
		
		if(_.isEmpty($scope.values.job.name)){
			$scope.values.hasJobNameError = true;			
			hasErrors = true;
		}
		
		if(_.isEmpty($scope.values.job.subject)){
			$scope.values.hasEmailSubjectError = true;			
			hasErrors = true;
		}
		
		if(_.isEmpty($scope.values.job.to)){
			$scope.values.hasEmailToError = true;			
			hasErrors = true;
		}
		else{ // check email address
			var emailRegex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
			var emailAddresses = $scope.values.job.to.split(',');
			_.forEach(emailAddresses, function(emailAddress){
				if(!hasErrors && !emailRegex.test(emailAddress)){
					$scope.values.hasInvalidEmailError = true;
					hasErrors = true;
				}
			});
		}
		
		// check if there is at least one report
		if(!hasErrors && angular.isUndefined($scope.values.job.reports) || ($scope.values.job.reports && $scope.values.job.reports.length < 1)){		
			$scope.values.hasReportError = true;
			hasErrors = true;
			
			$scope.bootboxAlertError($scope.values.messages.validationReportRequired);
		}
		
		// check if each of the report has Name and URL
		if(!hasErrors && $scope.values.job.reports){
			_.forEach($scope.values.job.reports, function(report){
				if(!hasErrors){
					if(_.isEmpty(report.name) || _.isEmpty(report.url)){
						$scope.values.hasReportError = true;
						hasErrors = true;
						
						$scope.bootboxAlertError($scope.values.messages.validationReportNameAndURLRequired);
					}
					else if(!_.isEmpty(report.url) && $scope.baseAppPath){ // check if the URL is from this application
						if(!_.startsWith(report.url.trim(), $scope.baseAppPath)){
							$scope.values.hasReportError = true;
							hasErrors = true;
							
							$scope.bootboxAlertError($scope.values.messages.validationReportInvalidURL + '[' + report.url + ']');
						}
					}
					
					// check the credentials if there are any
					if(!hasErrors){
						if(report.credentials){
							_.forEach(report.credentials, function(credential){
								if(!hasErrors && _.isEmpty(credential.instance)){
									$scope.values.hasReportError = true;
									hasErrors = true;
									
									$scope.bootboxAlertError($scope.values.messages.validationReportCredentialInstanceAndNameRequired);
								}
							});
						}
						else if(angular.isUndefined(report.credentials) || (report.credentials && report.credentials.length < 1)){
							$scope.values.hasReportError = true;
							hasErrors = true;
							
							$scope.bootboxAlertError($scope.values.messages.validationReportCredentialRequired);
						}	
					}					
				}
			});
		}
		
		// check if there is at least one trigger
		if(!hasErrors && angular.isUndefined($scope.values.job.triggers) || ($scope.values.job.triggers && $scope.values.job.triggers.length < 1)){								
			$scope.values.hasTriggerError = true;
			hasErrors = true;
			
			$scope.bootboxAlertError($scope.values.messages.validationTriggerRequired);
		}
		else if(!hasErrors && $scope.values.job.triggers){
			_.forEach($scope.values.job.triggers, function(trigger){
				if(_.isEmpty(trigger.name) || _.isEmpty(trigger.cron)){
					$scope.values.hasTriggerError = true;
					hasErrors = true;
					
					$scope.bootboxAlertError($scope.values.messages.validationTriggerNameAndCronRequired);
				}
			});
		}
		
		return hasErrors;
	};
	
	$scope.updateJobSchedules = function(){
		$http.post('api/admin/scheduler/update').then(function(success, error){			
			if($tm1Ui.helperIsSuccessful(success)){
				$ngBootbox.alert($scope.values.messages.successfulUpdate).then(function() {});		
			}
			else{
				$scope.bootboxAlertWarning(success.data.message);
			}
		});		
	};
	
	$scope.runJob = function(){
		if($scope.jobFormHasErrors()){
			return;
		}
		
		$ngBootbox.confirm($scope.values.messages.onDemandRunPrompt).then(function() {
			
			// save job file first
			$tm1Ui.saveOrUpdateScheduledJob($scope.values.job).then(function(data){
				if(data && data.success){
					// then run
					$http.get('api/admin/scheduler/' + encodeURIComponent($scope.values.job.id) + '/run').then(function(success, error){
						if($tm1Ui.helperIsSuccessful(success)){
							$scope.values.checkCount = 0;
							$scope.values.pollerStatus = $scope.defaults.POLL_STATUS_RUNNING;
								
							var jobPoller = $interval(function(){
								$http.get('api/admin/scheduler/' + encodeURIComponent($scope.values.job.id) + '/status').then(function(success, error){
									$scope.values.checkCount++;
									
									if($tm1Ui.helperIsSuccessful(success)){
										if(!success.data.isRunning){
											$interval.cancel(jobPoller);
											$scope.updatePollerStatus($scope.defaults.POLL_STATUS_RUN_SUCCESS);
										}
										else if($scope.values.checkCount >= $scope.defaults.POLL_LIMIT){
											$scope.bootboxAlertWarning($scope.values.messages.onDemandRunWarning);
											$scope.updatePollerStatus($scope.defaults.POLL_STATUS_RUN_ERROR);
										}
									}
									
									if($scope.values.checkCount >= $scope.defaults.POLL_LIMIT){
										$scope.updatePollerStatus($scope.defaults.POLL_STATUS_RUN_ERROR);
									}
								});
								
								
							}, 1000 * $scope.defaults.POLL_INTERVAL_SEC, $scope.defaults.POLL_LIMIT);							
						}
						else{
							$scope.bootboxAlertWarning(success.data.message);
						}
					});
				}
				else{
					$ngBootbox.alert($scope.values.messages.onDemandRunError).then(function(){});	
				}
			});	
	    }, function(){});
		
			
	};
	
	$scope.saveJob = function(){
		if($scope.jobFormHasErrors()){
			return;
		}
		
		$scope.values.isSaving = true;
		$tm1Ui.saveOrUpdateScheduledJob($scope.values.job).then(function(data){			
			if(data && data.success){
				
				// now to update and to reload the jobs in the scheduler
				$http.post('api/admin/scheduler/update').then(function(success, error){			
					if($tm1Ui.helperIsSuccessful(success)){
						$scope.values.isSaving = false;
				        $scope.values.isNew = false;
				        
						$ngBootbox.alert($scope.values.messages.successfulUpdate).then(function(){});		
					}
					else{
						$scope.bootboxAlertWarning(success.data.message);
					}
				});
				
			}
			else{
				$ngBootbox.alert($scope.values.messages.unsuccessfulUpdate).then(function(){});				
				throw data;
			}			
		});
	};
}]);

app.controller('AdminLoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$localStorage', '$tm1Ui', '$window', '$translate',
                             function($scope, $rootScope, $state, $stateParams, $timeout, $localStorage, $tm1Ui, $window, $translate) {
	$scope.isAuthorized = false;
	$scope.errorMessage = '';
	$scope.loginEnabled = true;
	$scope.loginButtonText = 'LOGIN';
	
	$scope.credentials = {
			userName: '',
			password: ''
	};
	
	// page events
	$scope.onUpdate = function(){
		$scope.errorMessage = '';
	};
	
	$scope.login = function(){		
		$tm1Ui.applicationAdminLogin($scope.credentials.userName, $scope.credentials.password).then(function(data){
			if(data.success){
				$scope.isAuthorized = true;				
				$scope.$emit('admin.login.success');				
				$window.history.back(-1);
			}
			else{				
				$scope.errorMessage = '';
				if(data.message && data.message.message){
					$scope.errorMessage = data.message.message;
				}
				else{
					$translate('UNAUTHORISED').then(function(translation){
						$scope.errorMessage = translation;
					});
				}
				
				$timeout(function(){			
					$scope.isLoggingIn = false;
				}, 2 * 1000);	
			}
		});				
	};
}]);
app.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$http', '$localStorage', '$base64', function($scope, $rootScope, $state, $stateParams, $timeout, $http, $localStorage, $base64) {
		
}]);
app.controller('MainCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$state', '$stateParams', '$http', '$translate',
                            function($scope, $rootScope, $interval, $timeout, $state, $stateParams, $http, $translate) {
	
	// Contains the menu control
	$scope.menu = {};
	// contains the menu items
	$scope.menuData = [];	
	
	// Store search box stuff
	var searchLast = 0;
	$scope.menuSearch = {};
	$scope.menuSearchData = [];
	$scope.parameters = { search: "" };
	
	// this controller reference
	var _controller = this;
	
	// 1. Menu Definition with Translation
	$translate(['SETTINGS', 'MENUADMINROOT', 'PAGECREATOR', 'MENUMANAGEMENT','EDITOR', 'MENUREPORTSMANAGER']).then(function (translation) {
		var _menus = {
				label:translation.MENUADMINROOT,
				data:{page: 'admin'},
				expanded: true,
				children:[]
		};	
		$scope.menuData.push(_menus);
		
		var _settingsMenu = {
				label:translation.SETTINGS,
				icon_class:'fa-paint-brush',
				data:{page: 'admin.setting'}
		};	
		_menus.children.push(_settingsMenu);
		
		var _sliceMenu = {
				label:translation.PAGECREATOR,
				icon_class:'fa-edit',
				data:{page: 'admin.page-creator'}
		};	
		_menus.children.push(_sliceMenu);
		
		var _editorMenu = {
				label:translation.EDITOR,
				icon_class:'fa-code',
				data:{page: 'admin.editor'}
		};	
		_menus.children.push(_editorMenu);
		
		var _menuManagementMenu = {
				label:translation.MENUMANAGEMENT,
				icon_class:'fa-bars',
				data:{page: 'admin.menu-management'}
		};	
		_menus.children.push(_menuManagementMenu);
		
		var _menuReportsManagerMenu = {
				label:translation.MENUREPORTSMANAGER,
				icon_class:'fa-list-alt',
				data:{page: 'admin.reports-manager'}
		};	
		_menus.children.push(_menuReportsManagerMenu);
		
		// 2. Create Menu Cache
		// Add the menu to a cache to be used for searching
		$scope.menuCache = _.cloneDeep($scope.menuData);
		
	});
	
	// Get the details of the instances from the java servlet
	$http.get("api/instances")
		.then(function(success, error) {
			
			$rootScope.instances = success.data;

		});
	
	var searchTimeout = false;
	
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
	};
	
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
	};
	
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
	};
	
	$scope.selectBranch = function(page, parameters){
		
		// Used to select the menu item when a user navigates via the address bar
		
		var branch = null;
		
		if(page == "home" || page == "admin.login" || page == "notfound"){	
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
		
	};
	
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
	};
	
}]);

app.controller('AdminMenuManagementCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$translate', '$window', '$tm1Ui', '$ngBootbox', '$log',
                             function($scope, $rootScope, $timeout, $state, $translate, $window, $tm1Ui, $ngBootbox, $log) {
	// variable(s)	
	$scope.userMenus = [];
	$scope.userMenusFlat = [];
	$scope.userStates = {};
	
	$scope.menuSelected = {};
	$scope.isSaveNeeded = false;
	
	$scope.menuErrorMessage = '';
	$scope.errors = [];
	
	// function(s)
	$scope.randomKey = function(){
		return _.random(1, true);
	};
	
	$scope.displayErrorMessage = function(message){
		$scope.menuErrorMessage = message;		
		$timeout(function(){
			$scope.menuErrorMessage = '';
		}, 3 * 1000);
	};
	
	$scope.validateUserMenus = function(){
		var errorIndex = _.findIndex($scope.errors, function(o) { return o.isInvalidUrl; });
		if(errorIndex != -1){
			$scope.displayErrorMessage('Invalid Page Urls found. Please rectify before saving.');
			
			return false;
		}
		
		return true;
	};
	
	$scope.saveUserMenu = function(){
		if($scope.validateUserMenus()){
			$tm1Ui.applicationSaveUserMenus($scope.userMenus).then(function(data){
				if(data.success){
					
					// now save states
					$tm1Ui.applicationSaveUserStates($scope.userStates).then(function(data){
						if(data.success){
							$scope.reloadMenu();
						}
						else{
							$scope.displayErrorMessage('Unable to save states. Please check logs.');
						}
					});					
				}
				else{
					$scope.displayErrorMessage('Unable to save menu. Please check logs.');
				}			
			});	
		}
	};
	
	$scope.onMenuUpdate = function(menuSelected){
		$scope.menuSelected.isUpdated = true;
		$scope.isSaveNeeded = true;
	};
	
	$scope.onMenuTemplateUrlUpdate = function(menuSelected){
		$scope.onMenuUpdate(menuSelected);
		
		// check if HTML page exist
		$tm1UiHelper.doesPageExists($scope.userStates[menuSelected.data.page].templateUrl).then(function(data){
			var errorIndex = _.findIndex($scope.errors, function(o) { return o.state == menuSelected.data.page; });
			if(errorIndex == -1){
				$scope.errors.push({state:menuSelected.data.page, isInvalidUrl:false});
				errorIndex = $scope.errors.length - 1;
			}
			
			$scope.errors[errorIndex].isInvalidUrl = false;
			$scope.menuSelected.isInvalidUrl = false;
			if(!data.status){
				$scope.errors[errorIndex].isInvalidUrl = true;
				$scope.menuSelected.isInvalidUrl = true;
				$scope.displayErrorMessage('Cannot find "' + $scope.userStates[menuSelected.data.page].templateUrl + '", please check.');
			}
		});
	};
	
	$scope.findMenuByKey = function(menuKey){
		$scope.menuReference = undefined;
		var findMenuReference = function(_userMenus, _key){
			_.forEach(_userMenus, function(_userMenu){
				if(angular.isUndefined($scope.menuReference)){
					if(_userMenu.key == _key){
						$scope.menuReference = _userMenu;				
					}
					else if(_userMenu.children && _userMenu.children.length > 0){
						findMenuReference(_userMenu.children, _key);
					}
				}
			});
		};
		
		findMenuReference($scope.userMenus, menuKey);
		
		return $scope.menuReference;
	};
	
	$scope.updateAddModal = function(menuSelected){
		if(!menuSelected.targetPage){
			menuSelected.targetPage = $scope.userMenusFlat[0];
		}		
	};
	
	$scope.updateFlattenedUserMenus = function(menuSelected){
		$scope.userMenusFlat.length = 0; 
		var flatFunction = function(flatArray, __userMenus){
			_.forEach(__userMenus, function(_userMenu){
				flatArray.push(_userMenu);
				 
				if(_userMenu.children && _userMenu.children.length > 0){
					flatFunction(flatArray, _userMenu.children); 
				}
			});
		};
		
		if(menuSelected.level && menuSelected.level > 1){
			$scope.userMenusFlat.push({key:$scope.randomKey(), label:'ROOT', levelDesc:'ROOT'});
		}
		
		flatFunction($scope.userMenusFlat, $scope.userMenus);		
	};
	
	$scope.deleteMenu = function(menuSelected){		
		$scope.deleteMenuWithOptions(menuSelected, {showPrompt:true});	
	};
	
	$scope.deleteMenuWithOptions = function(menuSelected, options){
		var deleteMenu = function(_key, _userMenus){
			_.remove(_userMenus, function(n) {return n.key == _key;});
			
			_.forEach(_userMenus, function(_userMenu){
				if(_userMenu.children && _userMenu.children.length > 0){
					deleteMenu(_key, _userMenu.children);
				}
			});			
		};
		
		if(options && options.showPrompt){
			$ngBootbox.confirm('Are you sure you wanted to delete menu entry <strong>' + menuSelected.label + '</strong>?').then(
					function() {						
						deleteMenu(menuSelected.key, $scope.userMenus);
						$scope.onMenuUpdate();
					}, 
					function() {
						$log.log(menuSelected);
						$log.log('is not deleted');
					}
				);	
		}
		else{
			deleteMenu(menuSelected.key, $scope.userMenus);
			$scope.onMenuUpdate();
		}
	};
	
	$scope.moveMenu = function(menuSelected){		
		if(menuSelected.targetPage){
			var menuCopy = _.cloneDeep(menuSelected);
			menuCopy.key = $scope.randomKey();
			
			// find target menu
			var menuReference = $scope.findMenuByKey(menuSelected.targetPage.key);
			if(menuSelected.targetPage.label == 'ROOT'){ // if moving or copying to the main 			
				if(menuSelected.copyOnly){
					if(!(menuSelected.includeChildren && menuSelected.includeChildren)){
						menuCopy.children = undefined;
					}					
				}
				else{
					// delete menu
					$scope.deleteMenuWithOptions(menuSelected, null);
				}
				
				$scope.userMenus.push(menuCopy);
			}
			else{
				if(angular.isUndefined(menuReference.children)){
					menuReference.children = [];
				}
				
				menuReference.isUpdated = true;
				if(menuSelected.copyOnly){
					if(!(menuSelected.includeChildren && menuSelected.includeChildren)){
						menuCopy.children = undefined;
					}
					menuReference.children.push(menuCopy);				
					menuReference.expanded = true;
				}
				else{ // move everything
					menuReference.children.push(menuCopy);				
					menuReference.expanded = true;
					
					// delete menu
					$scope.deleteMenuWithOptions(menuSelected, null);
				}
			}			
		}
		
		$scope.onMenuUpdate();
	};
	
	$scope.addPage = function(){
		$state.go('admin.page-creator');
	};
	
	$scope.reloadMenu = function(){
		$scope.userMenus.length = 0;
		$scope.userStates = {};
		
		$scope.isSaveNeeded = false;
		$scope.menuSelected = undefined;
		
		// user menus and states
		$tm1Ui.applicationUserMenus().then(function(data){
			$scope.userMenus = data;			
		});
		
		$tm1Ui.applicationUserStates().then(function(data){
			$scope.userStates = data;
		});
	};
	
	$scope.selectMenu = function(menu){
		$scope.menuSelected = menu;
		
		$scope.menuSelected.isSystemPage = false;
		if($scope.userStates[$scope.menuSelected.data.page].isSystem){
			$scope.menuSelected.isSystemPage = true;
		};
	};
	
	// On Page Load
	$scope.reloadMenu();
}]);

app.controller('AdminPageCreatorCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$http', '$translate', '$window', '$tm1Ui', '$log',
                             function($scope, $rootScope, $timeout, $state, $http, $translate, $window, $tm1Ui, $log) {
	// variable(s)
	$scope.page = {};
	
	$scope.page.success = false;
	$scope.page.message = '';		
	$scope.page.type = '';
	
	$scope.button = {
			isEnabled: true,
			text: 'CREATE'
	};
	
	// function(s)
	$scope.isPageTypeSupported = function(pageType){
		if(pageType == 'blank' || pageType == 'dashboard'){
			return true;
		}
		
		return false;
	};
	
	$scope.resetPageProperty = function(){
		$scope.page.pageName = '';
		$scope.page.menuState = '';
		$scope.page.menuName = '';
		$scope.page.menuPageLocation = '';	
		$scope.page.menuIconClass = undefined;
	};
	
	$scope.resetButton = function(){
		$translate('CREATE').then(function (translation) {
			$scope.button.text = translation;
		});
	};
	
	$scope.resetErrorMessage = function(){
		$scope.page.message = '';
	};
	
	$scope.displayPageCreationStatus = function(successStatus, translateId){
		$scope.page.success = successStatus;
		$translate(translateId).then(function (translation) {
			$scope.page.message = translation;
			
			// reset if successful
			if($scope.page.success){
				$timeout(function(){
					$scope.page.type = '';
					$scope.button.isEnabled = true;
					
					$scope.resetErrorMessage();
					$scope.resetPageProperty();					
				}, 3 * 1000);
			}
			else{
				$scope.button.isEnabled = true;
			}
			
			$scope.resetButton();
		});
	};
	
	$scope.createPage = function(pageType){
		
		// check if state already exists, prevent user from using this
		$tm1Ui.applicationStates().then(function(data){
			if(angular.isUndefined(data[$scope.page.menuState])){
				// button
				$scope.button.isEnabled = false;
				$translate('MESSAGEWAIT').then(function (translation) {
					$scope.button.text = translation;
				});
				
				// state
				var stateConfig = {states:{}};
				stateConfig.states[$scope.page.menuState] = {};
				stateConfig.states[$scope.page.menuState].url = '/' + $scope.page.menuState;
				stateConfig.states[$scope.page.menuState].templateUrl = $scope.page.menuPageLocation;
				
				// menu
				var menuItemConfig = {
						label:$scope.page.menuName,
						icon_class:$scope.page.menuIconClass,
						data:{
							page:$scope.page.menuState
						}
				};
				
				var data = {
						pageName: $scope.page.pageName,
						state: stateConfig,
						menuItem: menuItemConfig,
						pageType: pageType
				};
				
				$http.post('api/admin/pages/create', data).then(function(success, error){
					if($tm1Ui.helperIsSuccessful(success)){
						$scope.displayPageCreationStatus(true, 'PAGECREATED');
					}
					else{
						$scope.displayPageCreationStatus(false, 'PAGECREATEERROR');
					}
				});	
			}
			else{
				$scope.displayPageCreationStatus(false, 'PAGECREATESTATEEXISTERROR');
			}
		});
		
			
	};
	
	$scope.updatePageProperty = function(){
		try{
			$scope.page.menuState = $scope.page.pageName.split(' ').join('-').toLowerCase();
			$scope.page.menuName = $scope.page.pageName;
			$scope.page.menuPageLocation = 'html/' + $scope.page.pageName + '.html';			
			$scope.page.menuIconClass = angular.isUndefined($scope.page.menuIconClass) ? 'fa-file-text-o' : $scope.page.menuIconClass;
			
			$scope.resetErrorMessage();
		}
		catch(err){}
	};
	
	// On Page Load
	$scope.resetButton();
}]);

app.controller('AdminReportsManagerCtrl', ['$scope', '$rootScope', '$tm1UiSetting', '$log', '$tm1Ui', '$translate', '$state', '$ngBootbox', '$http',
                                    function($scope, $rootScope, $tm1UiSetting, $log, $tm1Ui, $translate, $state, $ngBootbox, $http) {
	
	$scope.lists = {};	
	
	
	$scope.gotoJobEditor = function(job){
		$state.go('admin.job-editor', {jobId: job.id, job: job});
	};
	
	$scope.deleteJob = function(job){		
		// confirm first
		var jobName = _.isEmpty(job.name) ? 'UNKNOWN' : job.name;
		
		$ngBootbox.confirm('Are you sure you want to delete [' + jobName + ']?')
	    .then(function() {
	    	$tm1Ui.deleteScheduledJob(job.id).then(function(data){
				if(data.success){
					$scope.refreshJobs();
					$ngBootbox.alert('Job [' + jobName + '] deleted.').then(function(){});
				}
				else{
					$log.error(data);
					throw 'Error deleting job';				
				}
			});
	    }, function() {
	        // do nothing
	    });		
	};
	
	$scope.createNewJob = function(){
		$scope.gotoJobEditor({id: $tm1Ui.helperGenerateUUID()});
	};
	
	$scope.refreshJobs = function(){
		$tm1Ui.scheduledJobs().then(function(data){
			$scope.lists.jobs = data;
		});	
	};
	
	// finally
	$scope.refreshJobs();
}]);

app.controller('AdminSettingCtrl', ['$scope', '$rootScope', '$tm1UiSetting', '$http', '$timeout', '$tm1UiHelper', '$log', '$window', '$base64', '$tm1Ui', '$translate',
                                    function($scope, $rootScope, $tm1UiSetting, $http, $timeout, $tm1UiHelper, $log, $window, $base64, $tm1Ui, $translate) {
	
	// variables
	$scope.appSettings = {};
	$scope.admin = {
			password:{
				current:'',
				confirm1:'',
				confirm2:''
			}
	};
	
	$scope.currentConsoleUser = '';
	
	/*
	$scope.saveSettings = {
			message: '',
			success: false
	};
	*/
	
	$scope.savePassword = {
			message: '',
			success: false
	};
	
	// PASSWORD
	$scope.displayUpdatePasswordStatus = function(successStatus, translateId){
		$scope.savePassword.success = successStatus;
		$translate(translateId).then(function (translation) {
			$scope.savePassword.message = translation;			
			$timeout(function(){
				$scope.savePassword.message = '';
			}, 3 * 1000);
		});
	};
	
	// update password
	$scope.updateAdminPassword = function(){
		if($scope.admin.password.confirm1 != $scope.admin.password.confirm2){
			$scope.displayUpdatePasswordStatus(false, 'PASSWORDNOTMATCHING');
		}
		else{
			var userUpdate = {user:{}};
			userUpdate.username = $scope.currentConsoleUser;
			userUpdate.encryptedPassword = $base64.encode($scope.admin.password.current);
			userUpdate.encryptedNewPassword = $base64.encode($scope.admin.password.confirm1);
			
			$http.post('api/admin/users/update', userUpdate).then(function(success, error){
				if($tm1UiHelper.isSuccessful(success)){
					$scope.admin.password.current = '';
					$scope.admin.password.confirm1 = '';
					$scope.admin.password.confirm2 = '';
					
					$scope.displayUpdatePasswordStatus(true, 'PASSWORDUPDATESUCCESS');
				}
				else{
					$scope.admin.password.confirm2 = '';
					if(success.data.error && success.data.error.message){
						$scope.displayUpdatePasswordStatus(false, success.data.error.message);						
					}
					else{
						$scope.displayUpdatePasswordStatus(false, 'PASSWORDUPDATEERROR');
					}
					
					$log.error(success);
				}
			});
		}		
	};
	
	$scope.onPasswordUpdate = function(){
		$scope.savePassword.message = '';
	};
	
	// MENU
	$scope.displaySaveSettingsStatus = function(sectionID, successStatus, translateId){
		$scope[sectionID] = $scope[sectionID] == undefined ? {} : $scope[sectionID];		
		$scope[sectionID].success = successStatus;
		$translate(translateId).then(function (translation) {
			$scope[sectionID].message = translation;			
			$timeout(function(){
				$scope[sectionID].message = '';
			}, 3 * 1000);
		});
	};
	
	$scope.updateSMTPPort = function(appSettings){
		appSettings.smtpPort = appSettings.smtpSSL ? 587 : 25;
	};
	
	// save settings
	$scope.saveSettings = function(sectionID){
		if(_.isEmpty($scope.appSettings.fileUploadDirRelativePath)){
			$scope.displaySaveSettingsStatus(sectionID, false, 'FILEPATHEMPTY');
		}
		else{
			$tm1Ui.applicationSettingsSave($scope.appSettings).then(function(data){
				if(!data.success){
					$scope.displaySaveSettingsStatus(sectionID, false, 'SETTINGSSAVEERROR');				
				}
				else{
					$scope.displaySaveSettingsStatus(sectionID, true, 'SETTINGSSAVESUCCESS');
				}
			});
		}		
	};
	
	// GENERAL
	// check settings
	$tm1Ui.applicationSettings().then(function(settings){
		$scope.appSettings = settings;
	});
	
	// get current user's name
	$tm1Ui.applicationInfo().then(function(data){
		if(data.currentAdminUsername){
			$scope.currentConsoleUser = data.currentAdminUsername;
		}
	});
	
	
}]);

app.controller('AdminSliceCtrl', ['$scope', '$rootScope', '$tm1Ui', '$http', '$timeout', 
                                  function($scope, $rootScope, $tm1Ui, $http, $timeout) {
	
	// variable(s)
	$scope.options = {};
	$scope.page = {instance:'', cube:'', view:''};
	
	// function(s)
	$scope.updateCubes = function(){
		$tm1Ui.cubes($scope.page.instance).then(function(value){
			$scope.options.cubes = value;
		});
	};
	
	$scope.updateViews = function(){
		$tm1Ui.cubeViews($scope.page.instance, $scope.page.cube).then(function(value){
			$scope.options.views = value;
		});
	};
	
	$scope.getView = function(){
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			$scope.view = value;
		});
	};
	
	$scope.create = function(){
		
		$tm1Ui.cubeView($scope.page.instance, $scope.page.cube, $scope.page.view).then(function(value){
			
			// Update the view in case it has changed.
			$scope.view = value;
			
			if($scope.view.rows.length > 1 || $scope.view.columns.length > 1){
				return;
			}
			
			var stateConfig = {states:{}};
			stateConfig.states[$scope.page.menuState] = {};
			stateConfig.states[$scope.page.menuState].url = '/' + $scope.page.menuState;
			stateConfig.states[$scope.page.menuState].templateUrl = $scope.page.menuPageLocation;
			
			var menuItemConfig = {
					label:$scope.page.pageName,
					icon_class:$scope.page.menuIconClass,
					data:{
						page:$scope.page.menuState
					}
			};
			
			var data = {
				pageName: $scope.page.pageName,
				view: $scope.view,
				
				state: stateConfig,
				menuItem: menuItemConfig
			};
			
			$scope.isDone = false;
			
			$http.post("api/admin/view/" + $scope.page.instance, data).then(function(value){
				
				$scope.isDone = true;
				
				$timeout(function(){
					$scope.isDone = false;
				}, 3000);
				
			});
			
		});
		
	};
	
	$scope.updatePageProperty = function(){
		try{
			$scope.page.menuState = $scope.page.pageName.split(' ').join('-').toLowerCase();
			$scope.page.menuName = $scope.page.pageName;
			$scope.page.menuPageLocation = 'html/' + $scope.page.pageName + '.html';			
			$scope.page.menuIconClass = angular.isUndefined($scope.page.menuIconClass) ? 'fa-file-text-o' : $scope.page.menuIconClass;
		}
		catch(err){}
	};
	
	// on page load	
	$tm1Ui.applicationInstances().then(function(value){
		$scope.options.instances = value;
		if($scope.options.instances){
			$scope.page.instance = $scope.options.instances[0].name;
			$scope.updateCubes();
		}
	});
}]);