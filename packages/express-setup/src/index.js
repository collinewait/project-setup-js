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
app.use(async (req, res, next) => {
    req.context = {
      models,
      me: await models.User.findByLogin('rwieruch'),
    };
    next();
});
app.use('/messages', routes.message);




const port = process.env.PORT || 3000;

const eraseDatabaseOnSync = true;

const createUsersWithMessages = async () => {
    await models.User.create(
      {
        username: 'rwieruch',
        messages: [
          {
            text: 'Published the Road to learn React',
          },
        ],
      },
      {
        include: [models.Message],
      },
    );

    await models.User.create(
        {
          username: 'ddavids',
          messages: [
            {
              text: 'Happy to release ...',
            },
            {
              text: 'Published a complete ...',
            },
          ],
        },
        {
          include: [models.Message],
        },
    );
};
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
   if (eraseDatabaseOnSync) {
        createUsersWithMessages();
    }
   app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
   );
});