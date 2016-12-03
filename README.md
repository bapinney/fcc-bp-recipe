Stuff I just npm install --save-dev'ed

npm install babel-core babel-loader jshint jshint-loader node-libs-browser babel-preset-es2015 babel-preset-react webpack  --save-dev

https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.281q2cu6f

npm start will include a source map to the compiled JSX.  However, it does not write the .JS to the current directory.  It can either be saved from the Sources tab in DevTools when visiting the Webpack URL, or you can run gulp compileBabel, which will write out a compiled JSX file (with source maps inline) to the current directory.

babel-plugin-transform-es2015-modules-commonjs is used to allow module.exports to work.  See https://babeljs.io/docs/plugins/transform-es2015-modules-commonjs/

