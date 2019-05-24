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
        let postRegistrationAction = JSON.parse($scope.postRegistrationAction);
        if(postRegistrationAction.urlfuncion){
          window.sessionStorage.setItem('urlfuncion', postRegistrationAction.urlfuncion);
        }
        if(postRegistrationAction.urlIdTeatro){
        window.sessionStorage.setItem('urlIdTeatro', postRegistrationAction.urlIdTeatro);
        }        
        if(postRegistrationAction.reservarUrl){
        window.sessionStorage.setItem('reservarUrl', postRegistrationAction.reservarUrl);
        }
        window.location.href = postRegistrationAction.reservarUrl;
      }
    }

  });
