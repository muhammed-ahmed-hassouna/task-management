const express = require('express');
const mongoose = require('mongoose');
// const morgan = require('morgan');
// const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();



mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB Connection Error:', err);
});

db.once('open', () => {
    console.log('Database');
});

const app = express();
app.use(express.json());
// app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`SERVER ON PORT ${PORT}`);
});
const userRoute = require('./routes/user-routes');
const taskRoute = require('./routes/task-routes');

app.use(userRoute);
app.use(taskRoute);
