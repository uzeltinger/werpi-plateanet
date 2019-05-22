'use strict';




angular.module('werpiApp')
  .controller('RegistrationCtrl', function ($scope,$stateParams,Session,$rootScope,api,notify) {
  	$scope.token=$stateParams.token;
    $scope.registrationStatus=0;
    $scope.postRegistrationAction=null;

  	if ($scope.token){
  		var dataGet = { token : $scope.token };
  			  api.registration.get(dataGet).$promise.then(function(response) {
          $scope.registrationStatus=1;
          $scope.postRegistrationAction = response.postRegistrationAction;
  		   },function(response){
            $scope.registrationStatus=-1;
         }
         );
  	} else {

      $scope.registrationStatus=-1;
    }

    $scope.goReservation = function(){
      if($scope.postRegistrationAction!=null){
        window.location.href = $scope.postRegistrationAction;
      }
    }

  });
