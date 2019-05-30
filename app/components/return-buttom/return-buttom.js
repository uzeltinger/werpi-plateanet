angular.module("returnButtom", [])
  .component("returnButtom", {    
    controller: function($scope, $rootScope) {
      this.$onInit = function() {
        console.log(this);
      };

      $scope.goBack = function(event) {
        event.preventDefault();
        console.log("$rootScope.paySection", $rootScope.paySection);
        if($rootScope.paySection === 'step-two' && !$rootScope.estacionarSection) {
          $rootScope.paySection = 'step-one';
          return;
        }
    
        if($rootScope.goBackCallback){
          $rootScope.goBackCallback();
          $rootScope.goBackCallback = ''; // safety reset
          return;
        }
        //$state.go('main');
        if($rootScope.loginPage){
          $rootScope.loginPage = false;
          $state.go('main');
          return;
        }
        window.history.back();
      }


    },
    templateUrl: "./components/return-buttom/return-buttom.html"
  });