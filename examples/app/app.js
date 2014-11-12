/**
 * Created by thomas.schulz on 12.11.2014.
 */



(function () { // start IIFE
  'use strict';


  angular.module("app" , [ 'scope-sync']);




  angular.module("app").controller("testCtrl", function ($scope , syncService ) {


    $scope.title = "sync test";

    $scope.object = {
      test : "test",
      data : {
        data : {
          value : 12345
        }
      }
    };

    $scope.arr = [1,2,3,4,5,{
      test : "test",
      data : {
        data : {
          value : 12345
        }
      }
    },7];



    syncService.sync($scope , "base");



    console.log($scope);

  });

}()); // end IIFE