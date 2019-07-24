import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import bodyParser from 'body-parser';

import models from './models';

// import y from './another';

// console.log('Hello Node.js project.');
// y()
// console.log(process.env.MY_SECRET);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use((req, res, next) => {
    req.context = {
        models,
        me: models.users[1],
    };
    next();
});

app.get('/session', (req, res) => {
    return res.send(req.context.models.users[req.context.me.id]);
});

app.get('/users', (req, res) => {
    return res.send(Object.values(req.context.models.users));
});

app.get('/users/:userId', (req, res) => {
    return res.send(req.context.models.users[req.params.userId]);
});

app.post('/users', (req, res) => {
return res.send('POST HTTP method on user resource');
});

app.put('/users/:userId', (req, res) => {
return res.send(`PUT HTTP method on user/${req.params.userId} resource`);
});

app.delete('/users/:userId', (req, res) => {
return res.send(`DELETE HTTP method on user/${req.params.userId} resource`);
});

app.get('/messages', (req, res) => {
    return res.send(Object.values(req.context.models.messages));
  });
  
  app.get('/messages/:messageId', (req, res) => {
    return res.send(req.context.models.messages[req.params.messageId]);
});

app.post('/messages', (req, res) => {
    const id = uuidv4();
    const message = {
      id,
      text: req.body.text,
      userId: req.context.me.id,
    };
  
    req.context.models.messages[id] = message;
  
    return res.send(message);
});

app.delete('/messages/:messageId', (req, res) => {
    const {
        [req.params.messageId]: message,
        ...otherMessages
      } = req.context.models.messages;
    
      req.context.models.messages = otherMessages;
  
    return res.send(message);
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);