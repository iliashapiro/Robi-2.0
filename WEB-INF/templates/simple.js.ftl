app.controller('${pageNameClean}Ctrl', ['$scope', '$rootScope', '$tm1Ui', function($scope, $rootScope, $tm1Ui) {
	
  $scope.page = {
    titles: {},
    rows: []
  };
  
  // Set default title values
  <#list view.getTitles() as item>
    <#if (item.getSubset()?length == 0)>
  $scope.page.titles["${item.getDimension()}"] = "${item.getSelected()}";
    </#if>
  </#list>
  
  // Populate the column subsets
  <#list view.getColumns() as item>
    <#if (item.getSubset()?length == 0)>
  $scope.page["${item.getDimension()}"] = [];
    <#list item.getElements() as element>
  $scope.page["${item.getDimension()}"].push({key: "${element.getKey()}", alias: "${element.getAlias()}", level: ${element.getLevel()?c}, index: ${element.index?c}, type: "${element.getType()}", isLeaf: ${element.getLevel()?c} == 0});
    </#list>
    </#if>
  </#list>
  
  // Populate the row subsets
  <#list view.getRows() as item>
    <#if (item.getSubset()?length == 0)>
  $scope.page.rows = [];
    <#list item.getElements() as element>
  $scope.page.rows.push({key: "${element.getKey()}", alias: "${element.getAlias()}", level: ${element.getLevel()?c}, index: ${element.index?c}, type: "${element.getType()}", isLeaf: ${element.getLevel()?c} == 0});
    </#list>
    </#if>
  </#list>
  
  $scope.table = $tm1Ui.tableCreate($scope, $scope.page.rows, {preload: false});
	
}]);
