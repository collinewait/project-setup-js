import 'dotenv/config';
import express from 'express';

import y from './another';

console.log('Hello Node.js project.');
y()
console.log(process.env.MY_SECRET);


const app = express();

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);