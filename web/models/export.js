import { bdModelExport, apiModelExport, } from "./index.js";
export const modelExport = {
	processOperationsIDToSqlFile: async function(){
		return await bdModelExport.processOperationsIDToSqlFile()
	},
	checkOperationStatus: async function(operation){
		return await apiModelExport.checkOperationStatus(operation)
	},
	getCSVMetaValue: async function(resourceId, req, res){
		return await bdModelExport.getCSVMetaValue(resourceId, req, res)
	},
	getExportOperationList: async function(req, res){
		return await bdModelExport.getExportOperationList(req, res)
	},
	insertRunnerData: async function(data, req, res){
		return await bdModelExport.insertRunnerData(data, req, res)
	},
	dumpDataFromTooLargeFile:  async function(datafile,	operationId){
		return await bdModelExport.dumpDataFromTooLargeFile(datafile, operationId)
	},
	getShopDetails: async function(req, res){
		return await apiModelExport.getShopDetails(req, res)
	},
	runBulkOperation: async function(req, res){
		return await apiModelExport.runBulkOperation(req, res)
	},
	operationStatusUpdate: async function(operationId, shopName){
		return await bdModelExport.operationStatusUpdate(operationId, shopName)
	},
	operationErrorStatusUpdate: async function(operationId, shopName){
		return await bdModelExport.operationErrorStatusUpdate(operationId, shopName)
	}

	/*getBulkDataFileUrl: async function(data){
		return await apiModelExport.getBulkDataFileUrl(data)
	},*/
}