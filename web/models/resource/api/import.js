import { Shopify } from "@shopify/shopify-api";
import { QL } from "../../../helpers/graph-ql.js";
import { globalSession } from "../../../helpers/global-session.js"

export const apiModelImport = {
	bulkImportMutation: async function(stagePath, req, res){
		//const session = globalSession.get();
		const session = await Shopify.Utils.loadCurrentSession(req, res, false);
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
		// Execute the bulk operation mutation using the client
		try {
			return await client.query({
				data: {
					query: QL.BULK_OPERATION_RUN_MUTATION,
					variables: {
						mutation: QL.CREATE_PRODUCT_MUTATION,
						stagedUploadPath: stagePath[0],
					}
				},
			});
		} catch (error) {
			console.error(error)
			// Handle any errors that occur during the execution
			// (You can add appropriate error handling logic here)
		}
	},
	stagedUploadCreate: async function(req, res){
		try {
			// Execute the GraphQL mutation using the client
			//const session = globalSession.get();
			const session = await Shopify.Utils.loadCurrentSession(req, res, false);
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
			const runnerData = await client.query({
				data: {
					query: QL.BULK_UPLOAD_STAGE_MUTATION,
					variables: {
						"input": [
							{
								"filename": "bulk_op_vars",
								"httpMethod": "POST",
								"mimeType": "text/jsonl",
								"resource": "BULK_MUTATION_VARIABLES"
							}
						]
					}
				},
			});
			// Return the stagedTargets from the GraphQL response
			return runnerData.body.data.stagedUploadsCreate.stagedTargets;

		} catch (error) {
			throw new Error('Error : ' + error)
		}
	},

	getPollRecords: async function(req, res, importbulkdetails){	
		//console.log("mportbulkdetails123===========", importbulkdetails)
		try {
		// console.log("polldata.body5777");
		// Execute the GraphQL mutation using the client.
		//const session = await Shopify.Utils.loadCurrentSession(req, res, false);
		const pollData = [];
		const shop = importbulkdetails.sh_shop;
		//console.log("importbulkdetails61", importbulkdetails);
		const client = new Shopify.Clients.Graphql(importbulkdetails.sh_shop, importbulkdetails.accessToken);
		const result = await client.query({
			data: {
				query: QL.POLL_ERROR,
			},
		});
		// console.log("polldata.body", result.body);
		pollData.push({
		shop : shop,
		pollStatus :result.body.data.currentBulkOperation 
		})
		// Return the stagedTargets from the GraphQL response
		return pollData;
		} catch (error) {
			throw new Error('Error : ' + error)
		}
	}
}