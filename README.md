# Chip Boilerplate

This repo is intended to get you started with a [chip.js](https://github.com/chip-js/chip) project.

It uses [gulp](http://gulpjs.com/) to manage the build processes and [browserify](http://browserify.org/) to provide
commonjs modules to your code.

It supports [newer css features](http://cssnext.io/), [less](http://lesscss.org/), [stylus](http://stylus-lang.com/),
and [coffeescript](http://coffeescript.org/) out of the box.

It is set up for localization and dates with [i18next](http://i18next.com/) and [momentjs](http://momentjs.com/).

It is ready to start creating unit tests.


You can download the latest from the [releases](https://github.com/chip-js/chip-boilerplate/releases) tab to get
started. Once downloaded, change to your new project directory and run;

```
npm install
```

You can run the application in a small bundled server using:

```
npm start
```

You can run the tests using:

```
npm test
```

You can build a production release with:

```
npm run build
```

You can add additional compilation steps and features by modifying `gulpfile.js`.
