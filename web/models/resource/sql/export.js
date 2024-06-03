import { connection } from "../../../helpers/db-connection.js"
import { cnf } from "../../../cnf.js";

import { Shopify } from "@shopify/shopify-api";
import { getSQLQueryLogTime } from "../../../middleware/logger.js";


export const bdModelExport = {
	processOperationsIDToSqlFile: async function(){
		try {
            const dateTime1 = new Date();
			return new Promise((resolve, reject) => {
                connection.query(`SELECT bos.sh_shop, bos.sh_operation_id, ss.accessToken FROM bulk_operation_status bos JOIN shopify_sessions ss ON bos.sh_shop = ss.shop WHERE bos.app_operation_status = 'WAITING' ORDER BY bos.created_at ASC LIMIT 5`, function (error, results, fields){
                if (error) {
                    console.warn(error);
                    resolve();
                }
                if (cnf.debug === true) {
                    const dateTime2 = new Date();
                    getSQLQueryLogTime("getIncompleteOperations"," ",dateTime1,dateTime2)        
                }
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })
        } catch (error) {
            throw new Error('Error : '+error)
        }
	},
    getExportOperationList: async function(req, res){
        try {
			const session = await Shopify.Utils.loadCurrentSession(req,	res, false);
            const dateTime1 = new Date();
            
            return new Promise((resolve, reject) => {
                connection.query(`SELECT bos.sh_operation_id, bos.sh_shop, bos.app_operation_status, bos.created_at, COUNT(metafields.meta_value) AS meta_value_count FROM bulk_operation_status bos LEFT JOIN metafields ON bos.sh_operation_id = metafields.operation_id WHERE bos.sh_shop = '${session.shop}' AND bos.created_at > NOW() - INTERVAL 7 DAY GROUP BY bos.sh_operation_id, bos.sh_shop, bos.app_operation_status, bos.created_at`, function(error, results, fields){
                    if (error) {
                        console.warn(error);
                        resolve();
                      }
                    if (cnf.debug === true) {
                        const dateTime2 = new Date();
                        getSQLQueryLogTime("getExportOperationList",session.shop,dateTime1,dateTime2)
                    }
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })
        } catch (error) {
            throw new Error('Error : '+error)
        }
    },

    getCSVMetaValue: async function(resourceId, req, res){
        try{
			const session = await Shopify.Utils.loadCurrentSession(req,	res, false);
            const dateTime1 = new Date();
            
            return new Promise((resolve, reject) => {
                connection.query(`SELECT m.meta_value, m.key_name, v.title, v.price, v.sh_variant_id, v.sku, p.title AS product_name FROM metafields m LEFT JOIN variants v ON (m.parent_id = v.sh_variant_id AND m.operation_id = v.sh_operation_id) LEFT JOIN products p ON (v.sh_parent_id = p.product_id AND v.sh_operation_id = p.operation_id) WHERE m.shop = v.sh_shop AND m.namespace = 'oscpPriceRule' AND m.operation_id = '${resourceId}' AND m.shop = '${session.shop}' ORDER BY m.parent_id, CAST(SUBSTRING(m.key_name, 5) AS UNSIGNED)`, async function (error, results, fields) {
                    if (error) {
                        console.warn(error);
                        resolve();
                    }
                    if (cnf.debug === true) {
                        const dateTime2 = new Date();
                        getSQLQueryLogTime("getCSVMetaValue",session.shop,dateTime1,dateTime2)                      
                    }
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })

        }
        catch (error){
            throw new Error('Error : '+error)
        }
    },
    insertRunnerData: async function(data, req, res){
        try{
			const session = await Shopify.Utils.loadCurrentSession(req,	res, false);
            const dateTime1 = new Date();
            // console.log("hellloooo=============mnsadad")
            
            return new Promise((resolve, reject) => {
                connection.query(`INSERT INTO bulk_operation_status (sh_shop, sh_operation_id, sh_operation_status, sh_operation_user_errors, app_operation_status) VALUES ('${session.shop}', '${data.bulkOperation.id}', '${data.bulkOperation.status}', '${JSON.stringify(data.userErrors)}', 'WAITING')`, function (error, results, fields) {
                    if (error) {
                        console.warn(error);
                        resolve();
                    }
                    if (cnf.debug === true) {
                        const dateTime2 = new Date();
                        getSQLQueryLogTime("insertRunnerData",session.shop,dateTime1,dateTime2)
                    }
                    resolve(JSON.parse(JSON.stringify(results)));
                })
            })
        }
        catch (error){
            throw new Error('Error : '+error)
        }
    },
	operationStatusUpdate: async function (operationId, shopName) {
		try {
            const dateTime1 = new Date();
            
			return new Promise((resolve, reject) => {
				connection.query(`UPDATE bulk_operation_status SET app_operation_status = 'COMPLETE' WHERE sh_operation_id = '${operationId}' AND sh_shop = '${shopName}'`, function (error, results, fields) {
					if (error) {
                        console.warn(error);
                        resolve();
                    }
                    if (cnf.debug === true) {
                        const dateTime2 = new Date();
                        getSQLQueryLogTime("operationStatusUpdate",shopName,dateTime1,dateTime2)
                    }
					resolve(JSON.parse(JSON.stringify(results)));
				})
			});
		}
		catch (error) {
				throw new Error('Error : ' + error)
			}
	},
	operationErrorStatusUpdate: async function (operationId, shopName) {
		try {
            const dateTime1 = new Date();
            
			return new Promise((resolve, reject) => {
				connection.query(`UPDATE bulk_operation_status SET app_operation_status = 'ERROR' WHERE sh_operation_id = '${operationId}' AND sh_shop = '${shopName}'`, function (error, results, fields) {
					if (error) {
                        console.warn(error);
                        resolve();
                    }
                    if (cnf.debug === true) {
                        const dateTime2 = new Date();
                        getSQLQueryLogTime("operationErrorStatusUpdate",shopName,dateTime1,dateTime2)
                    }
					resolve(JSON.parse(JSON.stringify(results)));
				})
			});
		}
		catch (error) {
				throw new Error('Error : ' + error)
			}
	},
};