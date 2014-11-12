/**
 * Created by thomas.schulz on 12.11.2014.
 */

(function () { // start IIFE
  'use strict';

  angular.module('scope-sync', []).
      provider('syncService', function () {
        // expose to provider
        this.$get = function ($rootScope, $location, $log) {

          var socket = io.connect();


          function sync( scopeObj , scopensp ){


            (function bindSync( defaultObj , objnsp ){
              for(var defaultKey in defaultObj){
                if ( defaultObj.hasOwnProperty(defaultKey) && defaultKey.indexOf('$') !== 0 && typeof defaultObj[defaultKey] !== 'function' ) {

                  console.log(typeof defaultObj[defaultKey]);


                  if( typeof defaultObj[defaultKey] === 'object' ){
                    bindSync(defaultObj[defaultKey] , (objnsp||"") + defaultKey + '.' );
                  }else{

                    (function ( obj , key  ) {
                      var valueClosure = obj[key];

                      var syncNamespace = (scopensp || "") + "/" + (objnsp || "") + key;

                      // register for incoming changes from the server
                      socket.on( syncNamespace , function(data){
                        valueClosure = data;
                        // apply the scope to notify changes
                        scopeObj.$apply();
                      });

                      Object.defineProperty(obj, key , {
                        get: function () {
                          // return local stored data
                          return valueClosure;
                        },
                        set: function(value){
                          // send update to socket.io proxy
                          socket.emit( syncNamespace , value);
                          // update prob for getter
                          valueClosure = value;
                        }
                      });
                    })( defaultObj , defaultKey  );

                  }// end else
                }
              }
            })( scopeObj );


          }
          return { sync: sync };

        }
      });


}()); // end IIFE