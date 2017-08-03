app.controller('SimplePageCtrl', ['$scope', '$rootScope','$log', '$tm1Ui', '$window', '$rootScope', '$timeout', '$location', 'screenSize', 'serviceDriver', function($scope, $rootScope, $log, $tm1Ui, $window, $rootScope, $timeout, $location, screenSize, serviceDriver) {
    
    /// this a test for github to recognise the change
	$scope.page = {
		months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        employees: []
	};
	$scope.screenSize=screenSize;
    $scope.q1=["Jan","Feb","Mar"];
    $scope.q2=["Apr","May","Jun"];
    $scope.q3=["Jul","Aug","Sep"];
    $scope.q4=["Oct","Nov","Dec"];
    
    $scope.minFilterRange = serviceDriver.minFilterRange;
    $scope.maxFilterRange = serviceDriver.maxFilterRange;
  
    $scope.employeeDetails={
        id:'',
        name:'',
        region:'',
        dept:''
    };
    
    $scope.employeeToDelete={
        id:'',
        name:''
    };
    
    $scope.filter = function(value){
    	
    	if(value.yearTotal == null){
    		// Data isn't ready so don't display row
    		return false;
    	}
    	
    	if($scope.page.suppressZeros && value.yearTotal == 0){
    		return false;
    	}
    	
    	if($scope.page.filter && $scope.page.filter != ""){
    		if(value["Full Name"].toLowerCase().indexOf($scope.page.filter) == -1){
    			return false;
    		}
    	}

    	return true;
    };
    
    $scope.findFilterStateStart = function(){
        $tm1Ui.cellGet('dev', 'System User Settings', 'Admin', 'Show Filter', 'String').then(function(data){
   
	        
            if(data.Value === 'true'){
                 
                $rootScope.showfilter = true;
            }else{
                $rootScope.showfilter = false;
            }
            
        });
       

    }
    
 
	$scope.table = $tm1Ui.tableCreate($scope, $scope.page.employees, {preload: false, filter: $scope.filter});
    
    $scope.employeeDelete = function(id,name){
        $scope.employeeToDelete.id=id;  
        $scope.employeeToDelete.name=name;     
    };
    
    $scope.employeeDetailsShow=function(id,name){
       
        $scope.employeeDetails.id=id;  
        $scope.employeeDetails.name=name;

    };

    $scope.employeeMeasure = function(employee){
    	if(employee.salaryYearEntered > 0){
    		return "Base Salary";
		}
		else{
			return "Full Time Base Salary";
		} 
    };
    
    if(serviceDriver.filterSectionOpened){
        if(document.getElementById("filter-container")){
            $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height;
        }
    }else{
        $scope.myfilterheight = 0;
    }
    if(document.getElementById("topheader")){
        $scope.mytopheadertop = document.getElementById("topheader").getBoundingClientRect().top;
    }
    $scope.mytopy =  $scope.mytopheadertop + $scope.mytopheaderheight + (60 );
    
    $scope.scrollvisible = false;
     
    $scope.$watch('activeTab', function(e){

        
        if($rootScope.appSettings.showSideBar){
             
        }else{
            if(document.getElementById("fixedcontroler")){
                    document.getElementById("fixedcontroler").style.width = 100 + "%";
                    document.getElementById("fixedcontroler").style.paddingRight= 0 + "px";
                    document.getElementById("fixedcontroler").style.left= 0 + "px";
            }
        }
        $timeout(function() {
           
		    $window.dispatchEvent(new Event("resize"));
			 
		}, 100);  
      

    });
    $scope.navisopened  =  $rootScope.navisopened ;
    $scope.$watch('$root.navisopened', function() {
        $scope.navisopened = $rootScope.navisopened;
        
    
        
        if($rootScope.navisopened && $rootScope.appSettings.showSideBar){
        
        }else{
            if(document.getElementById("left-nav-section-v2") && $rootScope.appSettings.showSideBar){
                document.getElementById("fixedcontroler").style.width = (($window.innerWidth) - (60)- (5)) + "px";
            }
        }
            
            
                    
            
        $timeout(function() {
            console.log("navis opened resize");
            $window.dispatchEvent(new Event("resize"));
        
        }, 400);  
        
    });
        
    
    $scope.filterOpen = function(indicator){
         
            if(indicator){
                if(document.getElementById("filter-container")){
                    $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height;
                }
            }else{
                $scope.myfilterheight = 0;
            }
           //Add the filter open closed to the cube called "System User Settings" 
            $tm1Ui.cellPut($rootScope.showfilter , 'dev', 'System User Settings', 'Admin', 'Show Filter', 'String').then(function(data){
                     
            });
            ///resize the stage after 100 millisec ; 
            //filter should open in instantly no animation or you will have to increase the timeout to match so the resize happens affter the events has occured.

            $timeout(function() {
               $window.dispatchEvent(new Event("resize"));
		    }, 100);    


    }
    
      
           
    angular.element($window).on('resize', function () {
        if($rootScope.appSettings.showSideBar && !screenSize.is('xs')){
            
            if($rootScope.navisopened ){
                if($("#fixedcontroler").hasClass("navopen")){
                    
                }else{
                    if($rootScope.uiPrefs.isPinned){
                         if($("#fixedcontroler").hasClass("mobileview")){
                            $("#fixedcontroler").removeClass("mobileview");
                         }
                        $("#fixedcontroler").addClass("navopen");
                    }
                    
                }
                
               
                if(document.getElementById("left-nav-section-v2")){
                    document.getElementById("fixedcontroler").style.width = (($window.innerWidth - 65)) + "px";
                      //left nav opened 
                      
                }
            }else{
                  //left nav closed 
                if(document.getElementById("left-nav-section-v2")){
                    document.getElementById("fixedcontroler").style.width = (($window.innerWidth - (65))) + "px";
                }
            }
             $("#fixedcontroler").removeClass("mobileview");
        }else{
             //left nav not shown  or the width is less than 768px is xs ie screenSize.is('xs')
            if(document.getElementById("left-nav-section-v2")){
                    document.getElementById("fixedcontroler").style.width = 100 + "%";
                    
                   $("#fixedcontroler").removeClass("navopen");
                   $("#fixedcontroler").addClass("mobileview");

                    
            }
        }
        
        //run through the building blocks of the pge and find whats the height and width
        
        if(document.getElementById("topheader")){
            //find the top css position of the header "topheader"
            $scope.mytopheadertop = document.getElementById("topheader").getBoundingClientRect().top;
            //find height of the header "topheader"
            $scope.mytopheaderheight = document.getElementById("topheader").getBoundingClientRect().height;
            
        } 
        
         if(serviceDriver.filterSectionOpened){
                if(document.getElementById("filter-container")){
                        
                    $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height  ;
                }
            }else{
                $scope.myfilterheight = 0;
            }
        
     
       
       if(document.getElementById("pagination")){
            $scope.paginationheight =  (document.getElementById("pagination").getBoundingClientRect().height) + (6);
            
        }else{
            $scope.paginationheight =  0;
   
        }
        /// header top css should be 50px; since the canvas nav is 50px + height (variable changes if page is resized) + filterheight (variable changes if page is resized)
         
        $scope.calculateHeight = $scope.mytopheadertop + $scope.mytopheaderheight + $scope.myfilterheight  ;


        /// $window.innerHeight - calculateHeight  - pagination  = height of the table container 
        $scope.tableheight = parseInt($window.innerHeight) - $scope.calculateHeight - $scope.paginationheight ;
        
        console.log(parseInt($window.innerHeight) , " - ",  $scope.calculateHeight, " = ",   $scope.tableheight,"; " ,$scope.mytopheadertop , " top + filter ", $scope.myfilterheight,    "$scope.mytableheadertop$scope.mytableheadertop");
        /// this is what sets the height of the fixedtable conatiner = $scope.tableheight
         if(document.getElementById("fixedtable")){
            document.getElementById('fixedtable').style.height = (($scope.tableheight) )+"px";
         }
       


    
    });
    $scope.scrolledpos = 0;
    //scroll div with id="fixedtable" 
     $( "#fixedtable" ).scroll(function(e) { 
        var mytableheaderArray = document.getElementsByClassName("fixedhead"); 
         
         for(var ttt = 0; ttt < mytableheaderArray.length; ttt++){
             var mytableheader = mytableheaderArray[ttt]
              mytableheader.style.left = "-" + e.target.scrollLeft + "px";
         }
        
          console.log(e.target.scrollLeft, "scrollTOP" );
         
    });


   
       
}]);

