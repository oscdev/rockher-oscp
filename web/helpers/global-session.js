import { Shopify } from "@shopify/shopify-api";
const USE_ONLINE_TOKENS = false;
let GLOBAL_SESSION = null;

export const globalSession = {
	set: async function(req, res, next){
		const session = await Shopify.Utils.loadCurrentSession(req,	res, USE_ONLINE_TOKENS);
		GLOBAL_SESSION = session;
		next()
	},
	get: function(){
		return GLOBAL_SESSION;
	}
}