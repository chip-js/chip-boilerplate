// Auto-require the components
var templates = require('./*/*.html', {mode: 'hash'});
var components = require('./*/*@(.js|.coffee)', {mode: 'hash'});

exports.registerWith = function(app) {

  Object.keys(components).forEach(function(module) {
    var name = module.split('/').pop();
    var definition = components[module];
    definition.template = templates[module];
    app.component(name, definition);
  });

};
