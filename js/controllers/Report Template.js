app.controller('ReportTemplateCtrl', ['$scope', '$rootScope','$log', '$tm1Ui', '$window', '$rootScope', '$timeout', '$location', 'screenSize', 'serviceDriver', function($scope, $rootScope, $log, $tm1Ui, $window, $rootScope, $timeout, $location, screenSize, serviceDriver) {
    $scope.timenow = new Date();
    $scope.monthnow = $scope.timenow.getMonth();
    $scope.yearnow = $scope.timenow.getFullYear();
    $scope.selectedyear = serviceDriver.yearSelected;
$scope.page = {
        month:1,
		months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        quarter: ["Q1","Q2","Q3","Q4"],
        slidermonths: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
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
     $scope.timeInterval = 'All Years';
    $tm1Ui.dimensionElements('dev',  'Year').then(function(data){
            var dates = [];
            var allYearsArray = [];
    
	        for(v = 0; v < data.length; v++){
                 
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
            
           
            serviceDriver.dateArray = dates;
            serviceDriver.yearsArray = allYearsArray;
            $scope.page.years = serviceDriver.yearsArray;
             console.log($scope.page.years, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4");
           
               
        });



    $scope.$watch('page.year', function(e){
        console.log("year selected" + e);
        serviceDriver.yearSelected = e;

    });

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
            if(document.getElementById("fixedtable")){
                if(document.getElementById("fixedtable").getElementsByTagName("td").length > 0){
                    $scope.scrollvisiblenum = (( document.getElementById("fixedtable").getElementsByTagName("tr").length) * (document.getElementById("fixedtable").getElementsByTagName("td")[0].getBoundingClientRect().height))+(document.getElementById("fixedtable").getBoundingClientRect().top) ;
                }
            }
       
            if($rootScope.navisopened && $rootScope.appSettings.showSideBar){
                if((($window.innerHeight)) < $scope.scrollvisiblenum){
                    //console.log("scroll in view");
                    $scope.scrollvisible = true;
                    if(document.getElementById("tablethead")){
                        document.getElementById("tablethead").style.paddingRight = '315px';
                    }
                }else{
                    $scope.scrollvisible = false;
                    //console.log("scroll not in view");
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
                       // console.log("scroll in view");
                        $scope.scrollvisible = true;
                        if(document.getElementById("tablethead")){
                            document.getElementById("tablethead").style.paddingRight = '73px';
                        }
                    }else{
                        $scope.scrollvisible = false;
                        //console.log("scroll not in view");
                        if(document.getElementById("tablethead")){
                            document.getElementById("tablethead").style.paddingRight = '67px';
                        }
                    }
                }
            
            }
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
        
       
      
        

           
           
    $scope.getHeight = function(){
       if(document.getElementById("topheader")){
            $scope.mytopheaderheight = document.getElementById("topheader").getBoundingClientRect().height;
            $scope.mytopheadertop = document.getElementById("topheader").getBoundingClientRect().top;
       }
        if(serviceDriver.filterSectionOpened){
            if(document.getElementById("filter-container")){
                $scope.myfilterheight = document.getElementById("filter-container").getBoundingClientRect().height;
            }
        }else{
            $scope.myfilterheight = 0;
        }
         
        $scope.mytopy = $scope.mytopheadertop + $scope.mytopheaderheight + (60 );
          
        if(document.getElementById("fixedtable")){
           document.getElementById('fixedtable').style.height = (parseInt($window.innerHeight)-($scope.mytopy)- $scope.myfilterheight)+"px";
        }
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
            $scope.paginationheight =  (document.getElementById("pagination").getBoundingClientRect().height) + (6);
            //console.log($scope.paginationheight, "pagination $scope.paginationheight $scope.paginationheight");
            //document.getElementById('tabletop').style.paddingTop = $scope.paginationheight + "px";
        }else{
            $scope.paginationheight =  0;
        }
        $scope.calculateHeight = $scope.mytopheadertop +  ($scope.mytopheaderheight) + $scope.myfilterheight + $scope.tableheadheight ;
        $scope.tableheight = parseInt($window.innerHeight) - $scope.calculateHeight - $scope.paginationheight ;
        
        console.log(parseInt($window.innerHeight) , " - ",  $scope.calculateHeight, " = ",   $scope.tableheight,   "$scope.mytableheadertop$scope.mytableheadertop");
         
         if(document.getElementById("fixedtable")){
            document.getElementById('fixedtable').style.height = (($scope.tableheight) )+"px";
         }
       


    
    });
    
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
            ceil: $scope.page.months,
            floor: 1, 
            showTicksValues: true,
            draggableRange: false,
            draggableRangeOnly: false
        }
    };


    
    /*$scope.slider = {
        value: 5,
        options: {
            showTicksValues: false,
            showTicks: 1,
            stepsArray: [
            {value: 1, legend: 'Jan'},
            {value: 2, legend: 'Feb'},
            {value: 3, legend: 'Mar'},
            {value: 4, legend: 'Apr'},
            {value: 5, legend: 'May'},
            {value: 6, legend: 'Jun'},
            {value: 7, legend: 'Jul'},
            {value: 8, legend: 'Aug'},
            {value: 9, legend: 'Sept'},
            {value: 10, legend: 'Oct'},
            {value: 11, legend: 'Nov'},
            {value: 12, legend: 'Dec'}
            ]
        }
    };
    */
 
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

        $scope.digestcicle = 0;
        $scope.manualchangeYear = false;
        $scope.page.month = 1;
        serviceDriver.minFilterRange = 0;
        serviceDriver.maxFilterRange = 1;
 
        if(parseInt($scope.monthnow) > parseInt(serviceDriver.maxFilterRange) ){
            serviceDriver.maxFilterRange = parseInt($scope.monthnow);
        }else{
            
            serviceDriver.maxFilterRange = 1;
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
            value:1,
            minValue2: 0,
            maxValue2: parseInt(serviceDriver.maxFilterRange),
            options2: {
                floor: 0,
                ceil: 12,
                step: 3,
                draggableRange:true,
                draggableRangeOnly: false,
                showTicks: true,
                }
            };
            
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
 
      }
     
$scope.selected = ["true","false","false","false"];
$scope.selectMonth = function(monthselected){
        
        switch(parseInt(monthselected) ) {
            case 0:
                
                   serviceDriver.minFilterRange = 0;
                    serviceDriver.maxFilterRange = 3;
                    console.log("monthselcted", monthselected);
                break;
            case 1:
                
                   serviceDriver.minFilterRange = 0;
                    serviceDriver.maxFilterRange = 6;
                    console.log("monthselcted", monthselected);
                break;
            case 2:
               
                   serviceDriver.minFilterRange = 0;
                    serviceDriver.maxFilterRange = 9;
                    console.log("monthselcted", monthselected);
                break;
            case 3:
                
                   serviceDriver.minFilterRange = 0;
                   serviceDriver.maxFilterRange = 12;
                   console.log("monthselcted", monthselected);
                break;
            default:
                 
        }
         $scope.$broadcast('monthChange');
         
       
          

        
}
$scope.$watch(function(){
   return serviceDriver.minFilterRange;
}, function(newValue, oldValue){
    //console.log(newValue + ' ' + oldValue);
   // console.log( serviceDriver.minFilterRange, serviceDriver.maxFilterRange, "     %%%%%%%%%%%");

   if(serviceDriver.maxFilterRange  >= 12){
        $scope.selected[3] = 'true'; 
    }else{ 
        
        $scope.selected[3] = 'false';  
    }
    


    if(serviceDriver.maxFilterRange  < 9){
        $scope.selected[2] = 'false'; 
    }else{ 
        if(serviceDriver.minFilterRange  >= 9){
            $scope.selected[2] = 'false';  
        }else{
            $scope.selected[2] = 'true';  
        }
      
    }

    if(serviceDriver.maxFilterRange  < 6){
        $scope.selected[1] = 'false'; 
    }else{ 
        if(serviceDriver.minFilterRange  >= 6){
            $scope.selected[1] = 'false';  
        }else{
            $scope.selected[1] = 'true';  
        }
      
    }




    if(serviceDriver.minFilterRange  <= 1){
        $scope.selected[0] = 'true'; 
    }else{ 
        $scope.selected[0] = 'false';  
    }
   console.log( $scope.selected, "     %%%%%%%%%%%");
   
   for(var t = 0; t< $scope.selected.length; t++){
        
        switch(t) {
        case 0:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ1 = true;
            }else{
                $scope.page.showQ1 = false;
            }
            break;
        case 1:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ2 = true;
            }else{
                $scope.page.showQ2 = false;
            }
            break;
    case 2:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ3 = true;
            }else{
                $scope.page.showQ3 = false;
            }
            break;
        case 3:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ4 = true;
            }else{
                $scope.page.showQ4 = false;
            }
            break;
        default:
        
    }
   }
         
    
});














$scope.$watch(function(){
   return serviceDriver.maxFilterRange;
}, function(newValue, oldValue){
      
    if(serviceDriver.maxFilterRange  >= 12){
        $scope.selected[3] = 'true'; 
    }else{ 
        
        $scope.selected[3] = 'false';  
    }
    


    if(serviceDriver.maxFilterRange  < 9){
        $scope.selected[2] = 'false'; 
    }else{ 
        if(serviceDriver.minFilterRange  >= 9){
            $scope.selected[2] = 'false';  
        }else{
            $scope.selected[2] = 'true';  
        }
      
    }

    if(serviceDriver.maxFilterRange  < 6){
        $scope.selected[1] = 'false'; 
    }else{ 
        if(serviceDriver.minFilterRange  >= 6){
            $scope.selected[1] = 'false';  
        }else{
            $scope.selected[1] = 'true';  
        }
      
    }




    if(serviceDriver.minFilterRange  <= 1){
        $scope.selected[0] = 'true'; 
    }else{ 
        $scope.selected[0] = 'false';  
    }
     for(var t = 0; t< $scope.selected.length; t++){
        
        switch(t) {
        case 0:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ1 = true;
            }else{
                $scope.page.showQ1 = false;
            }
            break;
        case 1:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ2 = true;
            }else{
                $scope.page.showQ2 = false;
            }
            break;
    case 2:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ3 = true;
            }else{
                $scope.page.showQ3 = false;
            }
            break;
        case 3:
            if($scope.selected[t] === 'true'){
                $scope.page.showQ4 = true;
            }else{
                $scope.page.showQ4 = false;
            }
            break;
        default:
        
    }
   }
   console.log( $scope.selected, "     %%%%%%%%%%%");
   
});


    $scope.$watch('page.month', function(e){
        $scope.$broadcast('rzSliderForceRender');
    });
    $scope.$watch('page.year', function(e){
        $scope.digestcicle++;
       if(!$scope.manualchangeYear){
           if($scope.digestcicle > 0){
                $scope.manualchangeYear = true;
           }
          
       }else{
            $scope.timeInterval= "Year";
        
       }
        if(isNaN(e)){
             console.log(" undefined");
         }else{
              console.log("##########    changed year", e);
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

