app.factory('serviceDriver', ['$rootScope', function($rootScope) {
  return {
    filterSectionOpened:"true",
    minFilterRange:"0",
    maxFilterRange:"1", 
    mobmonths:[],
    newmonthSelected:0,
    yearsArray:[],

    yearSelected:2016,
    dateArray:[]
  // factory function body that constructs shinyNewServiceInstance
   
  };
}]);