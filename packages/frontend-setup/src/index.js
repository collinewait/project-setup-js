// import y from './another';
// console.log('Hello Webpack Project......');
// console.log(process.env.NODE_ENV);
// y();

import React from 'react';
import ReactDOM from 'react-dom';

const title = 'React with Webpack and Babel';

ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);

if (process.env.NODE_ENV === 'development') {
    module.hot.accept();
}

console.log(process.env.NODE_ENV)
