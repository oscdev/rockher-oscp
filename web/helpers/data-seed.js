import { connection } from "./db-connection.js"
import mysql from "mysql2";
const query1 = `CREATE TABLE IF NOT EXISTS metafields (
  id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
  shop varchar(255) NOT NULL UNIQUE,
  operation_id varchar(255) NOT NULL UNIQUE,
  metafield_id varchar(255) NOT NULL,
  parent_id varchar(255) NOT NULL,
  key_name varchar(255) NOT NULL UNIQUE,
  namespace varchar(255) NOT NULL UNIQUE,
  meta_value longtext NOT NULL
) ENGINE=INNODB;`;

  connection.query(query1, (err, results, fields) => {
    if (err) {
      console.error('Error executing query 1:', err);
      return;
    }
    console.log('Query 1 executed successfully. Result:', results);

  });

 

  const query2 = `CREATE TABLE IF NOT EXISTS products (
    id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
    shop varchar(255) NOT NULL,
    operation_id varchar(255) NOT NULL,
    product_id varchar(255) NOT NULL UNIQUE,
    title varchar(255) NOT NULL
  ) ENGINE=INNODB;`;

    connection.query(query2, (err, results, fields) => {
      if (err) {
        console.error('Error executing query 1:', err);
        return;
      }
    console.log('Query 2 executed successfully. Result:', results);

  });

  const query3 = `CREATE TABLE IF NOT EXISTS bulk_operation_status (
	id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
	sh_shop varchar(255) NOT NULL UNIQUE,
	sh_operation_id varchar(255) NOT NULL UNIQUE,
	sh_operation_status varchar(255) NOT NULL,
	sh_operation_user_errors varchar(255) NOT NULL,
  app_operation_error varchar(256) , 
	app_operation_status ENUM ('WAITING','COMPLETE','ERROR') UNIQUE,
	user_status int(11) default 0,
	created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=INNODB;`;

  connection.query(query3, (err, results, fields) => {
	if (err) {
	  console.error('Error executing query 3:', err);
	  return;
	}

	console.log('Query 3 executed successfully. Result:', results);
  });

  const query4 = `CREATE TABLE IF NOT EXISTS cron_lock (
	id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
	schedule varchar(255) NOT NULL,
	updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=INNODB;`;

  connection.query(query4, (err, results, fields) => {
	if (err) {
	  console.error('Error executing query 4:', err);
	  return;
	}

	console.log('Query 3 executed successfully. Result:', results);
  });

  const query5 = `INSERT INTO cron_lock (schedule) VALUES ('prepare-incomplete-operations')`;
  `INSERT INTO cron_lock (schedule) VALUES ('upload-incomplete-operations')`;

  connection.query(query5, (err, results, fields) => {
	if (err) {
	  console.error('Error executing query 5:', err);
	  return;
	}

	console.log('Query 3 executed successfully. Result:', results);
  });

  const query6 = `CREATE TABLE IF NOT EXISTS oscp_req_log (
    id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
    req_id bigint(20) NOT NULL,
    req_url text NOT NULL,
    req_method varchar(255) NOT NULL,
    req_payload longtext NOT NULL
  ) ENGINE=INNODB;`;

    connection.query(query6, (err, results, fields) => {
      if (err) {
        console.error('Error executing query 6:', err);
        return;
      }
    console.log('Query 6 executed successfully. Result:', results);

  });

  const query7 = `CREATE TABLE IF NOT EXISTS oscp_res_log (
    id int(11) NOT NULL AUTO_INCREMENT UNIQUE,
    req_id bigint(20) NOT NULL,
    res_status_code varchar(255) NOT NULL,
    res_status_msg varchar(255) NOT NULL,
    res_payload longtext NOT NULL
  ) ENGINE=INNODB;`;

    connection.query(query7, (err, results, fields) => {
      if (err) {
        console.error('Error executing query 7:', err);
        return;
      }
    console.log('Query 7 executed successfully. Result:', results);

  });