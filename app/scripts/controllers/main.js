'use strict';

/**
 * @ngdoc function
 * @name werpiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the werpiApp
 */
angular.module('werpiApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location, $filter, api, $window, SELLER) {    
    $scope.parkings = [];
    $scope.myPosition = { long: -58.3810793, lat: -34.606510 };
    $scope.showAll = 4;
    $scope.totalParkings = 0;
    $scope.urlIdTeatro = null;
    $scope.mostrarDistancia = false;

    if ($location.search().id_teatro) {
      $scope.urlIdTeatro = $location.search().id_teatro;
      $window.sessionStorage.setItem("urlIdTeatro", $scope.urlIdTeatro);
      $scope.mostrarDistancia = true;
    } else {
      if ($window.sessionStorage.getItem('urlIdTeatro')) {
        $scope.urlIdTeatro = $window.sessionStorage.getItem('urlIdTeatro');
      }
    }
    
    $window.sessionStorage.setItem("reservarUrl",'');

    $scope.urlfuncion = null;

    moment.locale('es');

    if ($location.search().funcion) {
      $scope.urlfuncion = $location.search().funcion;
      //console.log("$scope.urlfuncion",$scope.urlfuncion);
      let momentDateFrom = moment($scope.urlfuncion,'DD-MM-YYYY HH:mm');
      momentDateFrom.subtract(2,"h");      
      let menosDosHoras = moment(momentDateFrom).format("DD-MM-YYYY HH:mm");
      //console.log("menosDosHoras",menosDosHoras);
      $window.sessionStorage.setItem("urlfuncion", menosDosHoras);
    } else {
      if ($window.sessionStorage.getItem('urlfuncion')) {
        $scope.urlfuncion = $window.sessionStorage.getItem('urlfuncion');
      }
    }

    api.plateanet.getTeatros().$promise.then(function (response) {
      $scope.allTeatros = response.data;
      $scope.selectedTeatro = $scope.allTeatros[0];
      $scope.allTeatros = $filter('orderBy')($scope.allTeatros, 'ComboDescription');
      $scope.showTeatros = true;
      var places = [];
      angular.forEach($scope.allTeatros, function (teatro) {

        if ($scope.urlIdTeatro && $scope.urlIdTeatro != '') {
          if ($scope.urlIdTeatro == teatro.Id) {
            var place = { id: 'teatro-' + teatro.Id, info: { icon: "images/map-plateanet.png", lat: teatro.Latitud, long: teatro.Longitud, name: teatro.Name, description: teatro.Name } };
            places.push(place);
            $scope.URLFixedPostion = { name: '', coords: { longitude: teatro.Longitud, latitude: teatro.Latitud } };
          }
        } else {
          var place = { id: 'teatro-' + teatro.Id, info: { icon: "images/map-plateanet.png", lat: teatro.Latitud, long: teatro.Longitud, name: teatro.Name, description: teatro.Name } };
          places.push(place);
        }
      });
      $scope.otherPlaces = places;
      $scope.myPosition.lat = places[0].info.lat;
      $scope.myPosition.long = places[0].info.long;
      getList();
    }, function (response) { 
      $scope.showTeatros = false; 
      getList();
    });

    

    function getList() {
      api.parking.lista({ 'sellerId': SELLER.sellerID, 'latitude': $scope.myPosition.lat, 'longitude': $scope.myPosition.long }).$promise.then(function (response) {
        var parkings = response.data.parkings;
        if ($location.search().id_teatro) {
          parkings=parkings.slice(0, 4);
        }
        $scope.totalParkings = parkings.length;
        angular.forEach(parkings, function (info, key) {
          var buttonReservar = '<button type="button" id="btn-reservar" onClick="window.sessionStorage.setItem(\'reservarUrl\', \'#/buy/?parkingId=' + info.parkingId + '&lat=' + $scope.myPosition.lat + '&lng=' + $scope.myPosition.long + '\');window.location.href=\'#/buy/?parkingId=' + info.parkingId + '&lat=' + $scope.myPosition.lat + '&lng=' + $scope.myPosition.long + '\'" class=""><img src="./images/reservar.svg" alt="">Reservar</button>';
          info.buttonReservar = buttonReservar;
        });
        $scope.parkings = parkings;
      });
    }

    $scope.reservar = function (parking) {
      let urlfuncion = "";
      if ($window.sessionStorage.getItem('urlfuncion')) {
        urlfuncion = $window.sessionStorage.getItem('urlfuncion');
      }
      let urlIdTeatro = "";
      if ($window.sessionStorage.getItem('urlIdTeatro')) {
        urlIdTeatro = $window.sessionStorage.getItem('urlIdTeatro');
      }
      let reservarUrl = '#/buy/?parkingId=' + parking.parkingId + '&lat=' + $scope.myPosition.lat + '&lng=' + $scope.myPosition.long;
      let postRegistrationAction ={
        "urlfuncion": urlfuncion,
        "urlIdTeatro": urlIdTeatro,
        "reservarUrl": reservarUrl
      }
      window.sessionStorage.setItem('postRegistrationAction', JSON.stringify(postRegistrationAction));
console.log("postRegistrationAction",postRegistrationAction);
      window.sessionStorage.setItem('reservarUrl', reservarUrl);
      window.location.href = reservarUrl;
    }

    $scope.verMas = function () {
      $scope.showAll = $scope.totalParkings;
    }
  });