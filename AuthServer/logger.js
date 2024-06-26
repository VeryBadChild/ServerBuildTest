const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;


const logDir = `${process.cwd()}/logs`;


const logFormat = printf(({ level, message, label, timestamp }) => {
   return `${timestamp} [${label}] ${level} : ${message}`; 
});

const logFormatSimple = printf(({level,message, timestamp})=>{
    return `${timestamp} [${level}] : ${message}`;
})

const logger = winston.createLogger({
   format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      label({ label: 'AuthServer' }), 
      logFormat, 
   ),
   transports: [
      new winstonDaily({
         level: 'info', 
         datePattern: 'YYYY-MM-DD', 
         dirname: logDir, 
         filename: `%DATE%.log`,
         maxFiles: 30, 
         zippedArchive: true,
      }),
      new winstonDaily({
         level: 'error', 
         datePattern: 'YYYY-MM-DD',
         dirname: logDir + '/error', 
         filename: `%DATE%.error.log`,
         maxFiles: 30,
         zippedArchive: true,
      }),
   ],
   
   exceptionHandlers: [
      new winstonDaily({
         level: 'error',
         datePattern: 'YYYY-MM-DD',
         dirname: logDir,
         filename: `%DATE%.exception.log`,
         maxFiles: 30,
         zippedArchive: true,
      }),
   ],
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // 색깔 넣어서 출력
                logFormatSimple,
            ),
        })
    );
}


module.exports = logger;