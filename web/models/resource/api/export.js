import { Shopify } from "@shopify/shopify-api";
import { QL } from "../../../helpers/graph-ql.js";
import { globalSession } from "../../../helpers/global-session.js"


export const apiModelExport = {
	checkOperationStatus: async function(operation){
		try {
			const client = new Shopify.Clients.Graphql(operation.sh_shop, operation.accessToken);
			const APP_BULK_FETCH = `{
					node(id: "${operation.sh_operation_id}") {
					  ... on BulkOperation {
						url
						partialDataUrl
						status
						completedAt
					  }
					}
				  }`;
			// Execute the GraphQL query using the client
			const bulkData = await client.query({
				data: {
					query: APP_BULK_FETCH,
				},
			});

			return bulkData.body.data.node;

		} catch (error) {
			console.error('error ===== ', error)
		}
	},
	getShopDetails: async function(req, res){
		try {
			//const session = globalSession.get();
			const session = await Shopify.Utils.loadCurrentSession(req, res, false);
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

			let shopData = await client.query({
				data: {
					query: QL.SHOP_TIMEZONE,
				},
			});
			return shopData.body.data.shop;
		} catch (error) {
			throw new Error("Error : " + error);
		}
	},
	runBulkOperation : async function(req, res){
		try {
			//const session = globalSession.get();
			const session = await Shopify.Utils.loadCurrentSession(req, res, false);
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

			// Execute the GraphQL mutation using the client
			const runnerData = await client.query({
				data: {
					query: QL.PRODUCT_BULK_MUTATION,
				},
			});

			// console.log(runnerData.body.data.bulkOperationRunQuery)

			return runnerData.body.data.bulkOperationRunQuery;

		} catch (error) {

		}
	},
	/*getBulkDataFileUrl : async function(data){
		try {
			const session = globalSession.get();
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
			const APP_BULK_FETCH = `{
					node(id: "${data.bulkOperation.id}") {
					  ... on BulkOperation {
						url
						partialDataUrl
					  }
					}
				  }`;
			// Execute the GraphQL query using the client
			const bulkData = await client.query({
				data: {
					query: APP_BULK_FETCH,
				},
			});

			return bulkData.body.data.node;

		} catch (error) {

		}
	}*/
}