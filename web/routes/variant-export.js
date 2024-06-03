import { exportVariantRuleData } from "../services/index.js";
import { createReadStream } from "fs";
import csv from "csv-parser";
import { globalSession } from "../helpers/global-session.js"

const shopEndpoint = "/api/variantrule/export";

export function variantExportRoutes(app) {

	/**
	 *  Purpose: This route will take the shop admin request and enter operation ID in data base
	 * @param object req
	 * 
	 * @returns In res  (affected rows and inserted row count)
	 */
	app.get(`${shopEndpoint}`, async (req, res) => { //Create new request for export variant rules
		const dataExport = await exportVariantRuleData.requestOperation(req, res);
		res.status(200).send(dataExport);
	});

	/**
	 * Purpose: This route is used to get the Jsonl file get from shopify
	 * 
	 * @param req object
	 * @param res object
	 * @returns Void
	 */
	app.get(`${shopEndpoint}/cron/prepare-incomplete-operations`, async (req, res) => {
		const dataExportList = await exportVariantRuleData.processOperationsIDToSqlFile();
		res.status(200).send(dataExportList);
	});

	/**
	 * Purpose: This route is used to Dump the data into the database
	 * 
	 * @param req object
	 * @param res object
	 * 
	 * @returns Void
	 */
	app.get(`${shopEndpoint}/cron/upload-incomplete-operations`, async (req, res) => {
		const dataExportList = await exportVariantRuleData.ProcessSqlFileToDB();

		res.status(200).send(dataExportList);
	});

	/**
	 * Purpose: This route is used to get the all export operation list of last 24 hrs from app
	 * 
	 * @param req object
	 * @param res object
	 * 
	 * @returns Void
	 */
	app.get(`${shopEndpoint}/lists`, async (req, res) => {
		const dataExportList = await exportVariantRuleData.operationList(req, res);
		res.status(200).send(dataExportList);
	});

	/**
	 * Purpose: This route is used to get the csv file from app
	 * 
	 */
	app.get(`${shopEndpoint}/csv`, async (req, res) => {
		const csv = await exportVariantRuleData.getCsvData(req, res);
		res.status(200).send(csv.data);
	});
}
