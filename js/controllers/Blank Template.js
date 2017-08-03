app.controller('BlankTemplateCtrl', ['$scope', '$rootScope','$log', '$tm1Ui', '$window', '$rootScope', '$timeout', '$location', 'screenSize', 'serviceDriver', function($scope, $rootScope, $log, $tm1Ui, $window, $rootScope, $timeout, $location, screenSize, serviceDriver) {
    
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
 
   $scope.ticks = ["2016","Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "2017", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "2018", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"] ;
    $scope.miniticks = ["2016", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D", "2017", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D",  "2018", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D", "J"] 
    $scope.yearsloaded = parseInt($scope.ticks.length / 11);

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

    $scope.findFilterStaten = function(){
        $tm1Ui.cellGet('dev', 'System User Settings', 'Admin', 'Show Filter', 'String').then(function(data){
         console.log(data.Value ,"    DDDDDDDDDDDDDDD");
	        
            if(data.Value === 'true'){
                 
                $rootScope.showfilter = true;
            }else{
                $rootScope.showfilter = false;
            }
            
        });
       

    }
    
	//$scope.table = $tm1UiTable.create($scope.page.employee);
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
    


    //$scope.showfilter = serviceDriver.filterSectionOpened;
    $scope.findFilterState = function(){
        
        return serviceDriver.filterSectionOpened;
    }
    $scope.navisopened  =  $rootScope.navisopened ;
    $scope.scrolledpos = 0;

   $scope.filterone;
   $scope.filtertwo;
     
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
    if(document.getElementById("fixedtable")){
        if(document.getElementById("fixedtable").getElementsByTagName("td").length > 0){
            $scope.scrollvisiblenum = (( document.getElementById("fixedtable").getElementsByTagName("tr").length) * (document.getElementById("fixedtable").getElementsByTagName("td")[0].getBoundingClientRect().height))+(document.getElementById("fixedtable").getBoundingClientRect().top) ;
        }
    }
    $scope.$watch('activeTab', function(e){

        console.log(e, "$$$$$$$$$$$$$$$$$$$");
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
    
        $scope.$watch('$root.navisopened', function() {
            $scope.navisopened = $rootScope.navisopened;
            
               
            $timeout(function() {
           
		        $window.dispatchEvent(new Event("resize"));
			
		    }, 350);  
           
        });
        
      
      
      
        

           
           
    $scope.getHeight = function(){
       $timeout(function() {
               $window.dispatchEvent(new Event("resize"));
		    }, 0);   
    }

    $scope.filterOpen = function(indicator){
           
            $tm1Ui.cellPut($rootScope.showfilter , 'dev', 'System User Settings', 'Admin', 'Show Filter', 'String').then(function(data){
                     
            });
            $timeout(function() {
               $window.dispatchEvent(new Event("resize"));
		    }, 100);    


    }
    $rootScope.mycolonetoppxarray = [];
    $rootScope.mycoloneheightpxarray = [];
    $rootScope.mycolonewidthpxarray = [];
    if(document.getElementById("fixedtable")){
        if(document.getElementById("fixedtable").getElementsByTagName("tr").length > 0){
            
            var mycolheightarraylength = document.getElementById("fixedtable").getElementsByTagName("tr").length;
            for(var cc = 0; cc < mycolheightarraylength; cc++ ){
                var tmpheight = (document.getElementById("fixedtable").getElementsByTagName("tr")[cc].getBoundingClientRect().height);
                $rootScope.mycoloneheightpxarray.push(tmpheight);
                
            }

        }
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
                     //document.getElementById("fixedcontroler").style.paddingRight = "240px";
                      
                }
            }else{
                 
                if(document.getElementById("left-nav-section-v2")){
                    document.getElementById("fixedcontroler").style.width = (($window.innerWidth - (65))) + "px";
                }
            }
             $("#fixedcontroler").removeClass("mobileview");
        }else{
            
            if(document.getElementById("left-nav-section-v2")){
                    document.getElementById("fixedcontroler").style.width = 100 + "%";
                   // document.getElementById("fixedcontroler").style.paddingRight = "6px";
                   $("#fixedcontroler").removeClass("navopen");
                   $("#fixedcontroler").addClass("mobileview");

                    
            }
        }
        
        
      
        if(document.getElementById("fixedtable")){
            if(document.getElementById("tablethead")){
                 document.getElementById("fixedtable").style.marginTop =  (3)+(document.getElementById("tablethead").getBoundingClientRect().height)+'px';
            }else{
                 document.getElementById("fixedtable").style.marginTop = 0;
            }
           
        }
         $rootScope.mycoloneheightpxarray = [];
         $rootScope.mycolonetoppxarray = [];
           
          //console.log($rootScope.mycolonetoppxarray, "$rootScope.mycolonetoppxarray");
         if(document.getElementById("fixedtable")){
         if(document.getElementById("fixedtable").getElementsByTagName("tr").length > 0){
        
                var mycolheightarraylength = document.getElementById("fixedtable").getElementsByTagName("tr").length;
                for(var cc = 0; cc < mycolheightarraylength; cc++ ){
                    var tmpheight = (document.getElementById("fixedtable").getElementsByTagName("tr")[cc].getBoundingClientRect().height);
                     if(document.getElementById("tablethead")){
                    var tmptp = (document.getElementById("fixedtable").getElementsByTagName("tr")[cc].getBoundingClientRect().top)- (document.getElementById("fixedtable").getElementsByTagName("tr")[0].getBoundingClientRect().top) +(document.getElementById("tablethead").getBoundingClientRect().height)+(3) ;
                     }else{

                     }

                    $rootScope.mycoloneheightpxarray.push(tmpheight);
                    
                    $rootScope.mycolonetoppxarray.push(tmptp);
                    
                }

            }
         }
         
     
     
            
            
        if(document.getElementById("topheader")){
            $scope.mytopheaderheight = document.getElementById("topheader").getBoundingClientRect().height;
            $scope.mytopheadertop = document.getElementById("topheader").getBoundingClientRect().top;
            if(document.getElementById("tablethead")){
                $scope.tableheadheight = document.getElementById("tablethead").getBoundingClientRect().height;
            }
        } 
        
        if(serviceDriver.filterSectionOpened){
            if(document.getElementById("filter-container")){
                $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height;
            }
        }else{
            $scope.myfilterheight = 0;
        }
        if(document.getElementById("fixedtable")){
            if(document.getElementById("fixedtable").getElementsByTagName("td").length > 0){
                $scope.scrollvisiblenum = (( document.getElementById("fixedtable").getElementsByTagName("tr").length) * (document.getElementById("fixedtable").getElementsByTagName("td")[0].getBoundingClientRect().height))+(document.getElementById("fixedtable").getBoundingClientRect().top)+(0) ;
       
            }
          }
       
            if($rootScope.navisopened && $rootScope.appSettings.showSideBar){
                if((($window.innerHeight)) < $scope.scrollvisiblenum){
                  
                    $scope.scrollvisible = true;
                    if(document.getElementById("tablethead")){
                        document.getElementById("tablethead").style.paddingRight = '315px';
                    }
                }else{
                    $scope.scrollvisible = false;
                     
                    if(document.getElementById("tablethead")){
                        document.getElementById("tablethead").style.paddingRight = '300px';
                    }
                }
            }else{
                if(!$rootScope.appSettings.showSideBar){
                    if((($window.innerHeight)) < $scope.scrollvisiblenum){   
                        $scope.scrollvisible = true;
                        if(document.getElementById("tablethead")){
                            document.getElementById("tablethead").style.paddingRight = '15px';
                        }
                    }else{
                        $scope.scrollvisible = false;
                        if(document.getElementById("tablethead")){
                            document.getElementById("tablethead").style.paddingRight = '0px';
                        }
                    }
                }else{
                    if((($window.innerHeight)) < $scope.scrollvisiblenum){
                         
                        $scope.scrollvisible = true;
                        if(document.getElementById("tablethead")){
                            document.getElementById("tablethead").style.paddingRight = '73px';
                        }
                    }else{
                        $scope.scrollvisible = false;
                         
                        if(document.getElementById("tablethead")){
                            document.getElementById("tablethead").style.paddingRight = '67px';
                        }
                    }
                }
            
            }
       
       if(document.getElementById("pagination")){
            $scope.paginationheight =  (document.getElementById("pagination").getBoundingClientRect().height) + (12);
            //console.log($scope.paginationheight, "pagination $scope.paginationheight $scope.paginationheight");
            //document.getElementById('tabletop').style.paddingTop = $scope.paginationheight + "px";
        }
        $scope.calculateHeight = $scope.mytopheadertop +  ($scope.mytopheaderheight) + $scope.myfilterheight + $scope.tableheadheight ;
        $scope.tableheight = parseInt($window.innerHeight) - $scope.calculateHeight - $scope.paginationheight ;
        
        //console.log(parseInt($window.innerHeight) , " - ",  $scope.calculateHeight, " = ",   $scope.tableheight,   "$scope.mytableheadertop$scope.mytableheadertop");
         
         if(document.getElementById("fixedtable")){
            document.getElementById('fixedtable').style.height = (($scope.tableheight)-(1))+"px";
         }
       


    
    });
      
           
		    $window.dispatchEvent(new Event("resize"));
  
     $( "#fixedtable" ).scroll(function(e) { 
          var mytableheaderArray = document.getElementsByClassName("fixedhead"); 
         
         for(var ttt = 0; ttt < mytableheaderArray.length; ttt++){
             var mytableheader = mytableheaderArray[ttt]
              mytableheader.style.left = "-" + e.target.scrollLeft + "px";
         }
          $scope.scrolledpos = e.target.scrollTop;

          console.log(e.target.scrollTop, "scrollTOP" );
         
    });


    //Range slider with ticks and values
    $scope.range_slider_ticks_values = {
        minValue: $scope.minFilterRange,
        maxValue: $scope.maxFilterRange,
        
        options: {
            ceil: $scope.ticks.length,
            floor: 1, 
            showTicksValues: true,
            draggableRange: true,
            draggableRangeOnly: false
        }
    };

    $scope.getValueinMonths = function(){
         
        
        var width = 0;
        var id = setInterval(frame, 1);
        
        function frame() {
            if (width === 100) {
                var windowwidth = (parseInt($window.innerWidth));
                //console.log("   document trace months ticks", document.getElementById('rzslider').getElementsByClassName("rz-ticks")[0].getElementsByTagName('span')[0]);
               
               if(document.getElementById('rzslider')){
                    var lengthofTimerSlider = document.getElementById('rzslider').getElementsByClassName("rz-ticks")[0].getElementsByTagName('span').length;
                 for(var f = 0; f < lengthofTimerSlider; f++){
                     var monthtochange = $scope.ticks[f];
                     if(windowwidth < parseInt(767)){
                          monthtochange = $scope.miniticks[f];
                     }else{
                         
                     }

                     document.getElementById('rzslider').getElementsByClassName('rz-pointer-max')[0].addEventListener("mousedown", $scope.doSliderClick );
                     document.getElementById('rzslider').getElementsByTagName('div')[0].style.width = ($scope.yearsloaded *( 100 ))+'%';
                     
                     var tickobj = document.getElementById('rzslider').getElementsByClassName("rz-ticks")[0].getElementsByTagName('span')[f];
                     tickobj.innerHTML = monthtochange;
                         
                    
                    $scope.$broadcast('rzSliderForceRender');
                    clearInterval(id);
                 }
               
               }else{
                    clearInterval(id);
               }
               
              
            } else {
            width++; 
             
            }
        }
 
        //return $scope.ticks[m];
    }
    $scope.doSliderClick = function(){
       // console.log("clicked slider"+ document.getElementById('rzslider').getElementsByTagName('span')[2].getAttribute("aria-valuenow") , "%%%%%%")
    }
    $scope.refreshSlider = function () {
        $timeout(function () {
            $scope.$broadcast('destroy');
            $scope.$broadcast('rzSliderForceRender');
            
            
        }, 100);  
    };
}]);