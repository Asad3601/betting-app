require('dotenv').config()
PORT = process.env.PORT || 5000;
const express = require('express')
const cors = require('cors');
const sequelize=require('./db')
const bodyParser = require('body-parser');
const ErrorMiddleware=require('./middlewares/ErrorMiddleware')
const AuthRoute=require('./routes/AuthRoute')

const app = express()
 
   
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));
app.get('/health', (req, res) => {
    res.sendStatus(200); // Sends a 200 status code with no content
});

app.use("/api/auth/user", AuthRoute);




app.use(ErrorMiddleware);
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected successfully.');

        // Start the server only if the database connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
        process.exit(1); // Exit the process if the connection fails
    });
