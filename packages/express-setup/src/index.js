import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import models, { sequelize } from './models';
import routes from './routes';

// import y from './another';

// console.log('Hello Node.js project.');
// y()
// console.log(process.env.MY_SECRET);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/session', routes.session);
app.use('/users', routes.user);
app.use(cors());
app.use((req, res, next) => {
    req.context = {
        models,
        me: models.users[1],
    };
    next();
});
app.use('/messages', routes.message);




const port = process.env.PORT || 3000;

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
  );
});