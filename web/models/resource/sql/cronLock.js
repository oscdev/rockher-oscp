import { connection } from "../../../helpers/db-connection.js"
export const dbCronLock = {
  engageSQL: async function () {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT COUNT(*) FROM shopify_sessions`, (error, result) => {
        if (error) {
          console.warn(error);
          resolve();
        }
        resolve(result);
      });
    })    
  },
 checkLock: async function (schedule) {
	// console.log('schedule ===', schedule)
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM cron_lock WHERE updated_at > NOW() AND schedule = '${schedule}'`, (error, result) => {
        if (error) {
          console.warn(error);
          resolve();
        }
        if (result.length) {
            resolve({status: 'busy'});
        }else {
            resolve({status: 'release'});
        }
      });
    });
  },

 acquireLock: async function(schedule) {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE cron_lock SET updated_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE schedule = '${schedule}'`, (error, result) => {
        if (error) {
          console.warn(error);
          resolve();
        } else if (result.changedRows === 0) {
          console.warn('Failed to acquire lock.');
          console.warn(`UPDATE cron_lock SET updated_at = DATE_ADD(NOW(), INTERVAL 5 MINUTE) WHERE schedule = '${schedule}'`);
          resolve();
        } else {
          resolve();
        }
      });
    });
  },

  // Release the cron lock
   releaseLock: async function(schedule) {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE cron_lock SET updated_at = now() WHERE schedule = '${schedule}'`, (error, result) => {
        if (error) {
          console.warn(error);
          resolve();
        } else if (result.changedRows === 0) {
          console.warn('Failed to acquire lock.');
          console.warn(`UPDATE cron_lock SET updated_at = now() WHERE schedule = '${schedule}'`);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }
}