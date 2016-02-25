require('es6-shim');
require('weakmap');
var app = require('./app');
var components = require('./components');
var i18n = require('./i18n');

components.registerWith(app);

app.listen();
