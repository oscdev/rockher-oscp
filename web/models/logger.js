import { connection } from "../helpers/db-connection.js"
export const logger =  {
    logReq: async function(requestId, method, url, payload){
        try {
            return new Promise((resolve, reject) => {
                connection.query(`INSERT INTO oscp_req_log (req_id, req_url, req_method, req_payload) VALUES ('${requestId}', '${url}', '${method}', '${JSON.stringify(payload)}')`, function(error, results, fields){
                    if(error) throw error;
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })
        } catch (error) {
            throw new Error('Error : '+error)
        }
    },
    logRes: function(requestId, statusCode, msg, payload){
        try {
            return new Promise((resolve, reject) => {
                connection.query(`INSERT INTO oscp_res_log (req_id, res_status_code, res_status_msg, res_payload) VALUES ('${requestId}', '${statusCode}', '${msg}', '${JSON.stringify(payload)}')`, function(error, results, fields){
                    if(error) throw error;
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })
        } catch (error) {
            throw new Error('Error : '+error)
        }
    }
};