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
		/* new Collection product position update */
		const dataExport = await exportVariantRuleData.generateCollectionsCSV(req, res);
		// const collectionUpdate = await exportVariantRuleData.getCollection(req, res);
		/*  END Collection product position update */

		/* Collection Backup Plan */
		// Node When Create the sql file for product collection the last product will not be added in the sql file (generateCollectionsCSVBackup)
		// const dataExport = await exportVariantRuleData.generateCollectionsCSVBackup(req, res);
		// const dataExport = await exportVariantRuleData.getCollectionBackup(req, res);
		// const dataExport = await exportVariantRuleData.createBackupProductCollectionSQL(req, res);
		/* END Collection Backup Plan */	
		res.status(200).send("Collection Update Successfully");
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
