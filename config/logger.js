const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
        filename: 'error.log',
        level: 'error',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    new winston.transports.MongoDB({ 
        level: 'error',
        options: {useUnifiedTopology: true},
        db: 'mongodb://127.0.0.1:27017/emplyees',
    }),
  ],
});

module.exports = logger;