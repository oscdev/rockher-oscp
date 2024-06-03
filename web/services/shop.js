import { Shopify } from "@shopify/shopify-api";
const USE_ONLINE_TOKENS = false;

// get shop data
// return type JSON
export const getShop = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const shopData = await client.get({path: 'shop.json'});
    return shopData.body.shop;
};

export const getShopSetting = async (req, res) => {
	const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

	const APP_SETTING_GET_MUTATION = `query {
		currentAppInstallation{
			id
			metafields(first: 100) {
				nodes{
					namespace
					key,
					value
				}
			}
		}
	} `
	const shopData = await client.query({
		data: {
			query: APP_SETTING_GET_MUTATION
		},
	});
	return shopData.body.data.currentAppInstallation.metafields.nodes;
};

export const setShopSetting = async (req, res) => {
	const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

	const APP_SETTING_GET_MUTATION = `query {
		currentAppInstallation{
			id
			metafields(first: 100) {
				nodes{
					namespace
					key,
					value
				}
			}
		}
	} `
	const shopData = await client.query({
		data: {
			query: APP_SETTING_GET_MUTATION
		},
	});

	const APP_SETTING_SET_MUTATION = `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
		metafieldsSet(metafields: $metafieldsSetInput) {
		  metafields {
			id
			namespace
			key,
			value
		  }
		  userErrors {
			field
			message
		  }
		}
	  }`

    const shopSetting = await client.query({
		data: {
		  query: APP_SETTING_SET_MUTATION,
		  variables: {
			"metafieldsSetInput": [
			  {
				"namespace": "app_settings",
				"key": "app_enabled",
				"type": "boolean",
				"value": (req.body.appStatus) ? "1" : "0",
				"ownerId": shopData.body.data.currentAppInstallation.id
			  }
			]
		  },
		},
	  });
    return shopSetting.body.data.metafieldsSet.metafields;
};

export const setDefaultShopSetting = async (shop, accessToken, status) => {

    const client = new Shopify.Clients.Graphql(shop, accessToken);


	const APP_SETTING_GET_MUTATION = `query {
		currentAppInstallation{
			id
			metafields(first: 100) {
				nodes{
					namespace
					key,
					value
				}
			}
		}
	} `
	const shopData = await client.query({
		data: {
			query: APP_SETTING_GET_MUTATION
		},
	});

	const APP_SETTING_SET_MUTATION = `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
		metafieldsSet(metafields: $metafieldsSetInput) {
		  metafields {
			id
			namespace
			key,
			value
		  }
		  userErrors {
			field
			message
		  }
		}
	  }`

    const shopSetting = await client.query({
		data: {
		  query: APP_SETTING_SET_MUTATION,
		  variables: {
			"metafieldsSetInput": [
			  {
				"namespace": "app_settings",
				"key": "app_enabled",
				"type": "boolean",
				"value": (status) ? "1" : "0",
				"ownerId": shopData.body.data.currentAppInstallation.id
			  }
			]
		  },
		},
	  });
    return shopSetting.body.data.metafieldsSet.metafields;
};