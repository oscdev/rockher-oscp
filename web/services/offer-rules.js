import { Shopify } from "@shopify/shopify-api";
import { readFileSync } from "fs";
import { stringify } from "querystring";
const USE_ONLINE_TOKENS = false;
const isProd = process.env.NODE_ENV === "production";

export const getRuleREST = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const ruleData = await client.get({
        path: 'metafields.json',
        query: { namespace : 'oscpPriceRule', key : 'customPrice'}
    });

      for(var i=0; i<ruleData.body.metafields.length; i++){
        ruleData.body.metafields[i].value = JSON.parse(ruleData.body.metafields[i].value)
      }

    return ruleData.body.metafields;

};


export const setRuleREST = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    await client.post({
        path : 'metafields.json',
        query : {},
        type : 'application/json',
        data : {
            metafield : {
                namespace : 'oscpPriceRule',
                key : 'customPrice',
                type : 'json',
                value : JSON.stringify(req.body)
          }
        }
      });
    return req.body;
}

export const deleteRule = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const del = await client.delete({
        path: 'metafields/24063205245156.json'
    });
    return del;
}

export const getRule = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

	const APP_RULE_GET_MUTATION = `query {
		currentAppInstallation{
			id
			metafields(first: 100, namespace: "oscpPriceRule") {
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
			query: APP_RULE_GET_MUTATION
		},
	});

	for(var i=0; i<shopData.body.data.currentAppInstallation.metafields.nodes.length; i++){
        shopData.body.data.currentAppInstallation.metafields.nodes[i].value = JSON.parse(shopData.body.data.currentAppInstallation.metafields.nodes[i].value)
      }
	return shopData.body.data.currentAppInstallation.metafields.nodes;

};

export const setRule = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

	const APP_RULE_GET_MUTATION = `query {
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
			query: APP_RULE_GET_MUTATION
		},
	});

	const APP_RULE_SET_MUTATION = `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
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
		  query: APP_RULE_SET_MUTATION,
		  variables: {
			"metafieldsSetInput": [
			  {
				"namespace": "oscpPriceRule",
				"key": "customPrice",
				"type": "json",
				"value": JSON.stringify(req.body),
				"ownerId": shopData.body.data.currentAppInstallation.id
			  }
			]
		  },
		},
	  });
    return shopSetting.body.data.metafieldsSet.metafields;
};