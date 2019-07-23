import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// import y from './another';

// console.log('Hello Node.js project.');
// y()
// console.log(process.env.MY_SECRET);
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});
  
app.post('/', (req, res) => {
return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
return res.send('Received a DELETE HTTP method');
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);