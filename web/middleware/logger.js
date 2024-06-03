import { logger } from "../models/index.js";
import { promises } from "fs";
import winston from "winston";
import path from "path";

export default function logRequest(req, res, next) {
  req.requestId = Date.now();
  
  // Apply logs through winston package
  const infoLogger = winston.createLogger({
    level: 'info', //Default level
    format: winston.format.combine(
        // winston.format.timestamp(),
        winston.format.json()
  ),
  transports: [
    //new winston.transports.Console(),
    new winston.transports.File({
    filename: path.join(`${process.cwd()}/storage/log`, 'req-res.log'),
    level: 'info'
    }),
  ]
  });

  const errorLogger = winston.createLogger({
  level: 'error', //Default level
  format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
    filename: path.join(`${process.cwd()}/storage/log`, 'error.log'),
    level: 'error'
    }),
  ]
  });

  // Capture response payload
  const chunks = [];
  const originalWrite = res.write;
  const originalEnd = res.end;
  res.write = function (chunk) {
    chunks.push(Buffer.from(chunk));
    originalWrite.apply(res, arguments);
  };
  res.end = async function (chunk) {
    if (chunk) {
      chunks.push(Buffer.from(chunk));
  }
  const responsePayload = Buffer.concat(chunks).toString('utf8');
  

  //Log responsePayload with requestId to specify logs in errorlogs and reqreslogs. to avoid parse error in payload. 
 /*  try{
    const responseData = JSON.parse(responsePayload);
      if (responseData.success === false) {
      errorLogger.error(`Request ID: ${req.requestId}, Response Payload: ${responsePayload}`);
    } else {
    infoLogger.info(`Request ID: ${req.requestId}, Response Payload: ${responsePayload}`);
  }
  }catch(e){
    infoLogger.info(`Request ID: ${req.requestId}, Response Payload: ${responsePayload}`);
  } */

  infoLogger.info('------------------- End -----------------:');
  originalEnd.apply(res, arguments);
};

// Log info
infoLogger.info('------------------- Start -----------------:');
try{
  infoLogger.info(`Request shop_Domain: ${req.body.shop_domain}`);
}catch (e){
  infoLogger.info(`Request shop_Domain: 'No shopdomain found'`);
}
infoLogger.info(`Request ID: ${req.requestId}`);
infoLogger.info(`Request URL: ${req.originalUrl}`);
infoLogger.info(`Request Method: ${req.method}`);
infoLogger.info(`Response status : ${res.statusCode}`);

next();
}

export  async function getSQLQueryLogTime(functionName, shop=" ", dateTime1, dateTime2 ) {

  const dataFile = `${process.cwd()}/storage/sqlQueryTime.log`;
  await promises.appendFile(dataFile, "------------"+functionName+"------------" + '\n', { encoding: "utf8", mode: 0o666 });
  promises.appendFile(dataFile, "Shop Name:-"+ shop+'\n', { encoding: "utf8", mode: 0o666 });
  const formattedTime = `${dateTime1.toLocaleDateString()} ${dateTime1.toLocaleTimeString()}`;
  await promises.appendFile(dataFile, "SQL_QueryStartTime:- " + formattedTime + '\n', { encoding: "utf8", mode: 0o666 });

  // const dateTime2 = new Date();
  const formattedTime2 = `${dateTime2.toLocaleDateString()} ${dateTime2.toLocaleTimeString()}`;
  await promises.appendFile(dataFile, "SQL_QueryEndTime:- " + formattedTime2 + '\n', { encoding: "utf8", mode: 0o666 });
  const timeDifferenceMs = dateTime2 - dateTime1;

  // If you want to convert the time difference to seconds, you can do:
  const timeDifferenceSeconds = timeDifferenceMs / 1000;
  await promises.appendFile(dataFile, "timeDifferenceSeconds:- " + timeDifferenceSeconds + '\n', { encoding: "utf8", mode: 0o666 });
  return("SQL log Successfully")

}
