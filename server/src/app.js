const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();


app.use(cors({ origin: 'http://localhost:3001' })); // verifica port la client
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bugRoutes = require('./routes/bugRoutes');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bugs', bugRoutes);

const PORT = process.env.PORT || 3000;


(async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Server running http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('DB connection failed', error);
    }
})();