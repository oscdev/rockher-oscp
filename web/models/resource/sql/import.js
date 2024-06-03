import { connection } from "../../../helpers/db-connection.js"
import { cnf } from "../../../cnf.js";
import { Shopify } from "@shopify/shopify-api";

import { getSQLQueryLogTime } from "../../../middleware/logger.js";


export const bdModelImport = { 

    insertImportStatus: async function(req, res, filePath, initialCSV){
        try{
			const session = await Shopify.Utils.loadCurrentSession(req,	res, false);
            const dateTime1 = new Date();
    
            return new Promise((resolve, reject) => {
                connection.query(`INSERT INTO bulk_import_status (sh_shop, file_attachment, app_status, shop_status,poll_status,csvname_modified) VALUES ('${session.shop}', '${filePath}', 'WAITING', 'Active','PENDING','${initialCSV}')`, function (error, results, fields) {
                    if (error) {
                        console.warn(error);
                        resolve();
                    }
                    if (cnf.debug === true) {
                        const dateTime2 = new Date();
                        getSQLQueryLogTime("insertImportStatus",session.shop,dateTime1,dateTime2)
                    }
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })
        }
        catch (error){
            throw new Error('Error : '+error)
        }
    },
    // getImportOperationList: async function(filePath, req, res){
    //     try{
	// 		const session = await Shopify.Utils.loadCurrentSession(req,	res, false);
    //         console.log("testtt",session)
	// 		//const session = globalSession.get();
	// 		return new Promise((resolve, reject) => {
    //             connection.query(`SELECT bis.sh_shop, bos.sh_operation_id, ss.accessToken FROM bulk_import_status bis JOIN shopify_sessions ss ON bis.sh_shop = ss.shop WHERE bis.app_status = 'WAITING' ORDER BY bos.created_at ASC LIMIT 5`, function (error, results, fields){
    //                 if(error) throw error;
    //                 resolve(JSON.parse(JSON.stringify(results)));
    //             })
    //         })
    //     }
    //     catch (error){
    //         throw new Error('Error : '+error)
    //     }
    // },
    getImportFileList: async function(req, res){
        try {
            const session = await Shopify.Utils.loadCurrentSession(req,	res, false);
            const dateTime1 = new Date();
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM bulk_import_status WHERE sh_shop = '${session.shop}' AND created_at > NOW() - INTERVAL 7 DAY `, function(error, results, fields){
                if (error) {
                    console.warn(error);
                    resolve();
                }
                if (cnf.debug === true) {
                    const dateTime2 = new Date();
                    getSQLQueryLogTime("getImportFileList",session.shop,dateTime1,dateTime2)        
                }
                resolve(JSON.parse(JSON.stringify(results)));
            })
        })
        } 
        catch (error) {
            throw new Error('Error : '+error)
        }
    },
    getBulkImportData: async function(req, res){
        try {
            const dateTime1 = new Date();
            return new Promise((resolve, reject) => {
                connection.query(`SELECT bis.sh_shop, ss.accessToken ,bis.csvname_modified
                FROM bulk_import_status bis
                JOIN shopify_sessions ss ON bis.sh_shop = ss.shop
                WHERE bis.app_status = 'WAITING'
                ORDER BY bis.created_at ASC
                LIMIT 5;`, function (error, results, fields){
                    if (error) {
                        console.warn(error);
                        resolve();
                    }
                    if (cnf.debug === true) {
                        const dateTime2 = new Date();
                        getSQLQueryLogTime("getBulkImportData"," ",dateTime1,dateTime2) 
                    }
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })
        } catch (error) {
            throw new Error('Error : '+error)
        }
    },
    updateBulkImportData: async function(req, res, pollResult,pollcount){
        try {
            const dateTime1 = new Date();
            
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE bulk_import_status SET line_error = '${pollcount}', No_of_lines_recieved = '${pollResult[0].pollStatus.rootObjectCount}', poll_status='${pollResult[0].pollStatus.status}',app_status='COMPLETED' where sh_shop = '${pollResult[0].shop}' AND poll_status = 'PENDING';`, function (error, results, fields){
                if (error) {
                    console.warn(error);
                    resolve();
                }
                if (cnf.debug === true) {
                    const dateTime2 = new Date();
                    getSQLQueryLogTime("updateBulkImportData",pollResult[0].shop,dateTime1,dateTime2)                         
                }
                resolve(JSON.parse(JSON.stringify(results)));
            })
        })
        } catch (error) {
            throw new Error('Error : '+error)
        }
    },
    updateCountCSVData: async function(shop,recordCount){
        try {
            const dateTime1 = new Date();
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE bulk_import_status SET No_of_lines = '${recordCount}' where sh_shop = '${shop}';`, function (error, results, fields){
                if (error) {
                    console.warn(error);
                    resolve();
                }
                if (cnf.debug === true) {
                    const dateTime2 = new Date();
                    getSQLQueryLogTime("updateCountCSVData",shop,dateTime1,dateTime2)
                }
                resolve(JSON.parse(JSON.stringify(results)));
            })
        })
        } catch (error) {
            throw new Error('Error : '+error)
        }
    },
}
