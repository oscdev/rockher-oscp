import { cnf } from "../cnf.js";
import mysql from "mysql2";

const dbConnection = mysql.createConnection({
    host: (process.env.NODE_ENV === "production") ? process.env.DB_HOST : cnf.dev.HOST,
    user: (process.env.NODE_ENV === "production") ? process.env.DB_USER : cnf.dev.USER,
    password: (process.env.NODE_ENV === "production") ? process.env.DB_PASSWORD : cnf.dev.PASSWORD,
    database: (process.env.NODE_ENV === "production") ? process.env.DB_NAME : cnf.dev.DB
})

dbConnection.connect(function(error){
    if(!!error){
        throw new Error(error);
    }
  });

export const connection = dbConnection;
