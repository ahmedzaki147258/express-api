const express = require('express');
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const { log1, log2 }  = require('./logger/logging');
const employees = require('./routes/employees');
const users = require('./routes/users');
const auth = require('./routes/auth');
const logger = require('./config/logger');
const compression = require('compression');


mongoose.connect('mongodb+srv://ahmedzaki123789:3BuTxTyFBGSI7U5Z@cluster0.gvulqrk.mongodb.net/emplyees?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to Database.....'))
  .catch((error) => logger.error('check your database server: ' + error));
mongoose.set('useCreateIndex', true);

app.use(express.json());
app.use(helmet());
app.use(compression());

if(app.get('env') === "development"){
    app.use(log1);
    app.use(log2);
    app.use(morgan('tiny'));
}
app.use('/api/employees', employees);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'false',
        message: 'page not found !'
    })
});

app.get('/', (req, res) => {
    res.send('Ahmed zaki');
});

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log('App working on PORT ' + PORT + ' ......'))