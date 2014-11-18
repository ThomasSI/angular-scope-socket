/**
 * Created by thomas.schulz on 12.11.2014.
 */

(function () { // start IIFE
  'use strict';

  angular.module('scope-sync', []).
      provider('syncService', function () {
        var socket;

        this.connect = function(){
          if(io && io.connect){
            socket = io.connect.apply(this , arguments);
          }
        };

        this.io = function(){
          if(io){
            socket = io.apply(this , arguments);
          }
        };



        // expose to provider
        this.$get = function () {

          // if the socket is created in the provider stop auto connect
          socket = socket || io.connect();

          /**
           * this function sync the given controller scope and call the apply method on socket.io changes
           * @param scopeObj : scope for syncing
           * @param scopensp : an optional namespace as prefix for communication
           * @param filterPrefix : an optional filterPrefix for properties e.g. filter = "_"; scope.test1 synced; scope._test1 not synced;
           */
          function sync( scopeObj , scopensp , filterPrefix  ){

            (function bindSync( defaultObj , objnsp ){


              // add watcher to all objects
              Object.observe(defaultObj, function changeListener(changes){
                // This asynchronous callback runs
                changes.forEach(function(change) {
                  // Letting us know what changed
                  //console.log(change.type, change.name, change.oldValue);

                  if(change.type === 'add' && typeof change.object[change.name] === 'object'){
                    // bad hack but works
                    // is to slow
                    bindSync(change.object , objnsp);
                    Object.observe(change.object[change.name] , changeListener);
                  }
                });
              });


              for(var defaultKey in defaultObj){
                if (defaultObj.hasOwnProperty(defaultKey) &&
                    defaultKey !== "this" && // ignore property this
                    ( !filterPrefix || defaultKey.indexOf( filterPrefix ) !== 0 ) && // if a filter is defined then use this filter
                    defaultKey.indexOf('$') !== 0 && // ignore all angular properties
                    typeof defaultObj[defaultKey] !== 'function' ) { // ignore all functions

                  if( typeof defaultObj[defaultKey] === 'object' ){

                    if(Array.isArray(defaultObj[defaultKey])){
                      bindSync(defaultObj[defaultKey] , (objnsp||"") + defaultKey );
                    }else{
                      if(Array.isArray(defaultObj)){
                        bindSync(defaultObj[defaultKey] , (objnsp||"") + "[" + defaultKey + '].' );
                      }else{
                        bindSync(defaultObj[defaultKey] , (objnsp||"") + defaultKey + '.' );
                      }
                    }

                  }else{

                    (function ( obj , key  ) {
                      var valueClosure = obj[key];
                      var syncNamespace;
                      if(Array.isArray(defaultObj)){
                        syncNamespace = (scopensp || "") + "/" + (objnsp || "") + "[" + key + "]" ;
                      }else{
                        syncNamespace = (scopensp || "") + "/" + (objnsp || "") + key;
                      }
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


          return {
            sync: sync,
            io : io
          };
        }
      });


}()); // end IIFE