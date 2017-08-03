app.controller('DashboardTemplateCtrl', ['$scope', '$rootScope','$log', '$tm1Ui', '$window', '$rootScope', '$timeout', '$location', 'screenSize', 'serviceDriver', function($scope, $rootScope, $log, $tm1Ui, $window, $rootScope, $timeout, $location, screenSize, serviceDriver) {
    $scope.timenow = new Date();
    $scope.monthnow = $scope.timenow.getMonth();
    $scope.yearnow = $scope.timenow.getFullYear();
    console.log($scope.monthnow,  $scope.yearnow, "  month now$scope.monthnow$scope.monthnow$scope.monthnow$scope.monthnow$scope.monthnow");
	// A. layout and default sizes
	$scope.mobilemonths = ["J","F","M","A","M","J","J","A","S","O","N","D"],
    serviceDriver.minFilterRange = 0;
    serviceDriver.maxFilterRange = 1;

    $scope.mobileview = false;
	$scope.page = {
        month:1,
		months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        mobilemonths: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        employees: [],
         
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

    $scope.findFilterStaten = function(){
        $tm1Ui.cellGet('dev', 'System User Settings', 'Admin', 'Show Filter', 'String').then(function(data){
         
	        
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

      
    $scope.monthSelected = function(){
        console.log("moth selected:" );
        // console.log("moth selected:"+ document.getElementsByClassName('x-value')[0].innerHTML);
    }
     
     
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
        $scope.$watch('page.subsetRevenue.length && page.subsetProfit.length && page.subsetExpense.length', function() {
            $timeout(function() {
                console.log("navis opened resize");
		        $window.dispatchEvent(new Event("resize"));
			     
		    }, 400);  
           
        });
        
      

    
      
    $scope.decideTime = function(monthpassedthrough, yearpassedthrough){
        
        
        var tmpoobjLength = document.getElementById('desktopslider').getElementsByTagName('div').length;
        

        for(var g = 0; g < tmpoobjLength; g++){
             var tmpoobj = document.getElementById('desktopslider').getElementsByTagName('div')[g];
             if(parseInt($scope.yearnow) === parseInt(yearpassedthrough) ){
                if(parseInt(g) >= parseInt($scope.monthnow)){
                    console.log("########## ", parseInt($scope.monthnow), parseInt(monthpassedthrough), parseInt(yearpassedthrough), parseInt($scope.yearnow), parseInt(monthpassedthrough) );
                    tmpoobj.style.backgroundColor =  "rgba(255,255,255,0.3)";
                }else{
                    tmpoobj.style.backgroundColor =   "rgba(0,0,0,0.3)";
                }
            }else{
                tmpoobj.style.backgroundColor = "rgba(0,0,0,0.3)";
            }
         
        }
       
        
    }


           
    $scope.getHeight = function(){
            
           
         $window.dispatchEvent(new Event("resize"));
    }
    $scope.filterOpen = function(indicator){
         
            if(indicator){
                if(document.getElementById("filter-container")){
                    $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height;
                }
            }else{
                $scope.myfilterheight = 0;
            }
           
            $tm1Ui.cellPut($rootScope.showfilter , 'dev', 'System User Settings', 'Admin', 'Show Filter', 'String').then(function(data){
                     
            });
            $timeout(function() {
               $window.dispatchEvent(new Event("resize"));
		    }, 100);    


    }
   
    $scope.sliderwidth = 100;
    angular.element($window).on('resize', function () {
            if((parseInt($window.innerWidth)) < parseInt(767)){
                    $scope.mobileview = true;
                    $scope.sliderwidth = 100;
                }else{
                    $scope.mobileview = false;
                    $scope.sliderwidth = 100;
                }
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





            if(document.getElementById("topheader")){
                $scope.mytopheaderheight = document.getElementById("topheader").getBoundingClientRect().height;
                $scope.mytopheadertop = document.getElementById("topheader").getBoundingClientRect().top;
                
            } 

            if(serviceDriver.filterSectionOpened){
                if(document.getElementById("filter-container")){
                        $scope.$broadcast('rzSliderForceRender');
                    $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height;
                }
            }else{
                $scope.myfilterheight = 0;
            }



            if(document.getElementById("pagination")){
                $scope.paginationheight =  (document.getElementById("pagination").getBoundingClientRect().height) ;
                //console.log($scope.paginationheight, "pagination $scope.paginationheight $scope.paginationheight");
                //document.getElementById('tabletop').style.paddingTop = $scope.paginationheight + "px";
            }else{
                $scope.paginationheight =  0;
            }
            $scope.calculateHeight = $scope.mytopheadertop + $scope.mytopheaderheight + $scope.myfilterheight  ;
            $scope.tableheight = parseInt($window.innerHeight) - $scope.calculateHeight - $scope.paginationheight ;

            console.log(parseInt($window.innerHeight) , " - ",  $scope.calculateHeight, " = ",   $scope.tableheight,"               ; " ,$scope.mytopheadertop , " + ", $scope.mytopheaderheight, " top + hight + filter ", $scope.myfilterheight," + pagination"  ,$scope.paginationheight,  "$scope.mytableheadertop$scope.mytableheadertop");
                
                if(document.getElementById("fixedtable")){
                document.getElementById('fixedtable').style.height = (($scope.tableheight))+"px";
                
                }
       
                $scope.resizeAgainafterstop();
         
    
    });
    $scope.refreshChartafterHide = function(){
        $timeout(function() {
               $window.dispatchEvent(new Event("resize"));
		}, 100); 
    }
    $scope.resizeAgainafterstop = function(){
        if((parseInt($window.innerWidth)) < parseInt(767)){
                        $scope.sliderwidth = 100;
                }else{
                    $scope.sliderwidth = 100;
                }
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
                       
                        $("#fixedcontroler").removeClass("navopen");
                        $("#fixedcontroler").addClass("mobileview");

                        
                }
            }





            if(document.getElementById("topheader")){
              
                 
                 
                     $scope.mytopheaderheight = document.getElementById("topheader").getBoundingClientRect().height;
                 
                
                     $scope.mytopheadertop = document.getElementById("topheader").getBoundingClientRect().top;
               
            } else{
                $scope.mytopheadertop = 50;
                $scope.mytopheaderheight = 0;
            }

            if(serviceDriver.filterSectionOpened){
                if(document.getElementById("filter-container")){
                        $scope.$broadcast('rzSliderForceRender');
                    $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height + (12);
                }
            }else{
                $scope.myfilterheight = 15;
            }


            if($rootScope.activeTab === 'KPI'){
                 if(document.getElementById("pagination")){
                    $scope.paginationheight =  (document.getElementById("pagination").getBoundingClientRect().height)  ;
                
                }
            }
           else{
                $scope.paginationheight =  12;
            }
            console.log($rootScope.activeTab +"$rootScope.activeTab$rootScope.activeTab$rootScope.activeTab$rootScope.activeTab");
            $scope.calculateHeight = $scope.mytopheadertop + $scope.mytopheaderheight + $scope.myfilterheight  ;
            $scope.tableheight = parseInt($window.innerHeight) - $scope.calculateHeight - $scope.paginationheight ;

            console.log(parseInt($window.innerHeight) , " - ",  $scope.calculateHeight, " = ",   $scope.tableheight,"               ; " ,$scope.mytopheadertop , " + ", $scope.mytopheaderheight, " top + hight + filter ", $scope.myfilterheight," + pagination"  ,$scope.paginationheight,  "$scope.mytableheadertop$scope.mytableheadertop");
                
                if(document.getElementById("fixedtable")){
                document.getElementById('fixedtable').style.height = (($scope.tableheight))+"px";
                
                }
       

    }

     $( "#fixedtable" ).scroll(function(e) { 
          var mytableheaderArray = document.getElementsByClassName("fixedhead"); 
         
         for(var ttt = 0; ttt < mytableheaderArray.length; ttt++){
             var mytableheader = mytableheaderArray[ttt]
              mytableheader.style.left = "-" + e.target.scrollLeft + "px";
         }
          $scope.scrolledpos = e.target.scrollTop;

          console.log(e.target.scrollTop, "scrollTOP" );
         
    });


    $scope.panel = {height:'350px'};

	$scope.varianceTolerance = 0.05;

	$scope.defaults = {
		region: 'Total Europe',
		department:'Corporate',
		driver: 'Net Sales'
	}
	
	$scope.page = {
			region: $scope.defaults.region,
			department: $scope.defaults.department,
			version: 'Budget',
			driver: $scope.defaults.driver,
			segment: 'region'
	};
	
	// Get the URL query parameters using $location.search()
	
	if($location.search().region){
		$scope.page.region = $location.search().region;
	}
	
	if($location.search().department){
		$scope.page.department = $location.search().department;
	}
	
	if($location.search().driver){
		$scope.page.driver = $location.search().driver;
	}

	$scope.excludeTotalYear = function(item){
		return item.element != 'Total Year';
	}

	$scope.getMonth = function(offset){
		var date = moment([parseInt($scope.page.year), parseInt($scope.page.month.substring(1, 3)) - 1, 1]);
		date.add(offset, 'months');
		return date.format("MMM YY");
	}
	
	
	// Below $location.search("region", region) is used to the URL query parameter so it can be used while converting to PDF
	
	$scope.setRegion = function(region){
		$scope.page.region = region;
		if(region != $scope.defaults.region){
			$location.search("region", region);
		}
		else {
			$location.search("region", null);
		}
	};
	
	$scope.setDepartment = function(department){
		$scope.page.department = department;
		if(department != $scope.defaults.department){
			$location.search("department", department);
		}
		else {
			$location.search("department", null);
		}
	};
	
	$scope.setDriver = function(driver){
		$scope.page.driver = driver;
		if(driver != $scope.defaults.driver){
			$location.search("driver", driver);
		}
		else {
			$location.search("driver", null);
		}
	};

    //Range slider with ticks and values
    $scope.range_slider_ticks_values = {
        minValue: $scope.minFilterRange,
        maxValue: $scope.maxFilterRange,
        
        options: {
            ceil: $scope.page.months,
            floor: 1, 
            showTicksValues: true,
            draggableRange: false,
            draggableRangeOnly: false
        }
    };

     
 
     $scope.timeInterval = 'All Years';
      
           
       
      

        $tm1Ui.dimensionElements('dev',  'Year').then(function(data){
            var dates = [];
            var allYearsArray = [];
    
	        for(v = 0; v < data.length; v++){
                 console.log(data[v].Name ,"    JJJJJJJJJJJJJJJJJJJJ");
                 if(isNaN(data[v].Name)){

                 }else{
                     allYearsArray.push(data[v].Name);
                 }
            }
            allYearsArray.sort();
            
            serviceDriver.yearsArray =  allYearsArray;
               if($scope.timeInterval === 'Weeks'){
                    for (var i = 1; i <= 31; i++) {
                         dates.push(new Date(serviceDriver.yearsArray[serviceDriver.yearsArray.lenhgth-1], 7, i));
                    }
                }else{
                    if($scope.timeInterval === 'Year'){
                        for (var v = 0; v <  12; v++) {
                             dates.push(new Date(serviceDriver.yearsArray[serviceDriver.yearsArray.length-1], (v+1), 1));
                        }
                    }else{
                        if($scope.timeInterval === 'All Years'){
                            for (var b = 0; b < serviceDriver.yearsArray.length; b++) {
                                 dates.push(new Date(serviceDriver.yearsArray[b], 12, 31));
                            }
                        }
                    }
                }
            
            console.log(dates);
            serviceDriver.dateArray = dates;
            serviceDriver.yearsArray = allYearsArray;
            
            $scope.refreshSliderwithData(dates);
               
        });

    
     
    $scope.selectMonth = function(monthselected){
        serviceDriver.minFilterRange = monthselected;
        serviceDriver.maxFilterRange = monthselected+1;
         
        $scope.$broadcast('monthChange');
          

        
    }
      $scope.refreshSliderwithData = function(datepassed){
       var arrayDateSplit = (datepassed[0]).toString().split(" ");
             console.log(arrayDateSplit, "arrayDateSplitarrayDateSplitarrayDateSplitarrayDateSplitarrayDateSplit")
               $scope.slider = {
                    value: datepassed[1], // or new Date(2016, 7, 10) is you want to use different instances
                    
                    options: {
                        floor: 1,
                        showSelectionBar: true,
                        stepsArray: datepassed,
                        translate: function(date) {
                        if (date != null)
                            return date.toDateString();
                        return '';
                        }
                    }
                };
                $scope.slider2 = {
                     
                minValue2: serviceDriver.minFilterRange,
                maxValue2: serviceDriver.maxFilterRange,
                options2: {
                    floor: 0,
                    ceil: 12,
                    draggableRangeOnly: true,
                    showTicks: true,
                    }
                };
               
                $timeout(function () {
                    $scope.$broadcast('rzSliderForceRender');
                });
 
      }
    $scope.digestcicle = 0;
    $scope.manualchangeYear = false;
    $scope.page.month = 1;

    $scope.$watch(function(){
    return serviceDriver.maxFilterRange;
    }, function(newValue, oldValue){
        console.log(newValue + ' ' + oldValue);
        console.log($scope.page.month, serviceDriver.minFilterRange);

        
            if(((serviceDriver.maxFilterRange)) < 10){
                $scope.page.month = "0"+((serviceDriver.maxFilterRange));
            }else{
                $scope.page.month = ((serviceDriver.maxFilterRange));
            }
        
        
    });
 
    $scope.$watch('page.month', function(e){
        $scope.$broadcast('rzSliderForceRender');
    });
     
$scope.$watch(function(){
   return serviceDriver.yearSelected;
}, function(newValue, oldValue){
$scope.selectedyear = serviceDriver.yearSelected;
   console.log(serviceDriver.yearSelected) ;
});

    $scope.$watch('page.year', function(e){
        console.log("year selected" + e);
        serviceDriver.yearSelected = e;

        $scope.digestcicle++;
       if(!$scope.manualchangeYear){
           if($scope.digestcicle > 0){
                $scope.manualchangeYear = true;
           }
          
       }else{
            $scope.timeInterval= "Weeks";
        
       }
        if(isNaN(e)){
             console.log(" undefined");
         }else{
              $scope.decideTime(parseInt($scope.page.month), parseInt(serviceDriver.yearSelected) );
              console.log("##########    changed year", parseInt(e), parseInt(serviceDriver.yearSelected), parseInt($scope.page.month), $scope.yearnow); 
              $scope.refreshSliderComplete(e);
               
         }
        
       
    });

	$scope.refreshSliderComplete = function(yr){
         var datees = [];
        
         if($scope.timeInterval === 'Weeks'){
                    for (var i = 1; i <= 31; i++) {
                         datees.push(new Date(yr, 1, i));
                    }
                }else{
                    if($scope.timeInterval === 'Year'){
                        for (var v = 0; v <  12; v++) {
                             datees.push(new Date(yr, (v), 1));
                        }
                    }else{
                        if($scope.timeInterval === 'All Years'){
                            for (var b = 0; b < serviceDriver.yearsArray.length; b++) {
                                 datees.push(new Date(serviceDriver.yearsArray[b], 12, 31));
                            }
                        }
                    }
                }
            
            console.log(datees);
            $scope.refreshSliderwithData(datees);

    }
    

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

