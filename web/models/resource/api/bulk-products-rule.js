import { Shopify } from "@shopify/shopify-api";
import { QL } from "../../../helpers/graph-ql.js";
import { globalSession } from "../../../helpers/global-session.js"

export const apiModelBulkProductsRule = {

  requestOperation: async function (req, res) {
    try {
			//const session = globalSession.get();
			const session = await Shopify.Utils.loadCurrentSession(req, res, false);
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

      let productIds = req.query.ids.split(',');
      productIds = productIds.map(id => `id:${id}`);

      const SPECIFIED_PRODUCTS_BULK_MUTATION = QL.SPECIFIED_PRODUCTS_BULK_MUTATION.replace('$ids', productIds.join(" OR "));

      //console.log('SPECIFIED_PRODUCTS_BULK_MUTATION', SPECIFIED_PRODUCTS_BULK_MUTATION)
      
			// Execute the GraphQL mutation using the client
			const runnerData = await client.query({
				data: {
					query: SPECIFIED_PRODUCTS_BULK_MUTATION,
				},
			});

			//console.log(runnerData.body.data.bulkOperationRunQuery)

			return runnerData.body.data.bulkOperationRunQuery;

		} catch (error) {

		}
  },
  shopDetail: async function (req, res) {
	try{
		//const session = globalSession.get();
		const session = await Shopify.Utils.loadCurrentSession(req, res, false);
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

		// Execute the GraphQL mutation using the client
		
		let shopData = await client.query({
			data: {
				query: QL.SHOP_CURRENCY,
			},
		});
		// console.log("shopDetail====>",shopData.body.data)
		return shopData.body.data.shop;

	} catch (error) {
		throw new Error("Error : " + error);
	}
  },
  shopMarket: async function (req, res) {
	try{
		//const session = globalSession.get();
		const session = await Shopify.Utils.loadCurrentSession(req, res, false);
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

		// Execute the GraphQL mutation using the client
		
		let shopData = await client.query({
			data: {
				query: QL.SHOP_MARKETS,
			},
		});
		// console.log("shopMarket====>",shopData.body.data.markets)
		return shopData.body.data.markets.nodes;

	} catch (error) {
		throw new Error("Error : " + error);
	}
  },
  generateProductData: async function (req, res, operation) {
    try {
      //console.log('generateProductData ====== ', operation)
      //return {};
      
			const session = await Shopify.Utils.loadCurrentSession(req, res, false);
			const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

			const APP_BULK_FETCH = `{
					node(id: "${operation.bulkOperation.id}") {
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
  }
}



