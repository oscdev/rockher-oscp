import { importVariantRuleData } from "../services/index.js";
import { globalSession } from "../helpers/global-session.js"

const shopEndpoint = "/api/variantrule/import";

/**
	 * Purpose: Save the uploaded CSV file in app Upload folder
	 * 
	 * @param req object
	 * @param res object
	 * 
	 * @returns Void
	 */
export function variantImportRoutes(app) {
	app.post(`${shopEndpoint}`, async (req, res) => {
		const dataImport = await importVariantRuleData.requestOperation(req, res);
		//console.log("dataImport", dataImport);
		//console.log("ggggg");
		res.status(200).send(dataImport);
		// if(dataImport.status == 'success'){
		// 	res.status(200).send(dataImport);
		// }else{
		// 	res.status(500).send(dataImport.msg);
		// }
	});
	app.get(`${shopEndpoint}/lists`, async (req, res) => {
		const dataExportList = await importVariantRuleData.importCSVList(req, res);
		res.status(200).send(dataExportList);
	});
	app.get(`${shopEndpoint}/pollRequest`, async (req, res) => {
		//console.log("route run ")
		const dataImport = await importVariantRuleData.getPollRecords(req, res);
		//console.log("dataImport========",dataImport)
		res.status(200).send(dataImport);
		//console.log("dataImport11111===",dataImport)
	});

}
