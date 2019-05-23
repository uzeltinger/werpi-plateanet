'use strict';




angular.module('werpiApp')
  .controller('RegistrationCtrl', function ($scope,$stateParams,Session,$rootScope,api,notify) {
  	$scope.token=$stateParams.token;
    $scope.registrationStatus=0;
    $scope.postRegistrationAction=null;

  	if ($scope.token){
  		var dataGet = { token : $scope.token };
  			  api.registration.get(dataGet).$promise.then(function(response) {
            console.log("response",response);
          $scope.registrationStatus=1;
          $scope.postRegistrationAction = response.data.post_registration_action;
  		   },function(response){
            $scope.registrationStatus=-1;
         }
         );
  	} else {

      $scope.registrationStatus=-1;
    }

    $scope.goReservation = function(){
      console.log("postRegistrationAction",$scope.postRegistrationAction);
      if($scope.postRegistrationAction!=null){
        window.location.href = $scope.postRegistrationAction;
      }
    }

  });
