
module.exports = {
  template: require('./not-found.html'),

  attached: function() {
    this.oldTitle = document.title;
    document.title = 'Page Not Found';
  },

  detached: function() {
    document.title = this.oldTitle;
  }
};
