import { apiModelImport, bdModelImport } from "./index.js";
export const modelImport = {
	bulkImportMutation: async function(stagePath, req, res){
		return await apiModelImport.bulkImportMutation(stagePath, req, res)
	},
	stagedUploadCreate: async function(req, res){
		return await apiModelImport.stagedUploadCreate(req, res)
	},
	getPollRecords:async function(req, res, importbulkdetails){
		return await apiModelImport.getPollRecords(req, res, importbulkdetails)
	},
	insertImportStatus: async function(req, res, filePath, initialCSV){
		return await bdModelImport.insertImportStatus( req, res, filePath, initialCSV)
	},
	// getImportOperationList: async function(req, res){
	// 	return await bdModelImport.getImportOperationList(req, res)
	// },
	getImportFileList: async function(req, res){
		return await bdModelImport.getImportFileList(req, res)
	},
	getBulkImportData:async function(req, res){
		return await bdModelImport.getBulkImportData(req, res)
	},
	updateBulkImportData:async function(req, res, pollResult,pollcount){
		return await bdModelImport.updateBulkImportData(req, res, pollResult,pollcount)
	},
	updateCountCSVData:async function(details,recordCount){
		return await bdModelImport.updateCountCSVData(details, recordCount)
	}
}