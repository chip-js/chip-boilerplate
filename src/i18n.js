// See
//  * http://i18next.com/
//  * http://momentjs.com/
var i18next = require('i18next');
var moment = require('moment');
var app = require('./app');

i18next
  .use(require('i18next-xhr-backend'))
  .use(require('i18next-browser-languagedetector'))
  .init();

// Keep the two in sync
i18next.on('languageChanged', function(lng) {
  moment.locale(lng);
});

// Make t global if you'd like
// window.t = i18next.t.bind(i18next);

// Provide the usage of translate and moment within expressions
app.fragments.observations.globals.moment = moment;
app.fragments.observations.globals.t = i18next.t.bind(i18next);

// Require ALL moment locales so they get compiled in, or you can just require the ones you want
require('../node_modules/moment/locale/*.js', {mode: 'expand'});
