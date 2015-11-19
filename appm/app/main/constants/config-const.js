'use strict'
angular.module('main')
.constant('Config', {

  // gulp environment: injects environment vars
  // https://github.com/mwaylabs/generator-m#gulp-environment
  ENV: {
    /*inject-env*/
    'URL': 'https://dasm.3apaxi.com/pddimp.yandex.ru/api2/admin/',
    'BASE_HREF': 'https://dasm.3apaxi.com/'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  // https://github.com/mwaylabs/generator-m#gulp-build-vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

})
