import { Shopify } from "@shopify/shopify-api";
import fs from "fs";

export const createDraftBuyNow = async (req, res) => {  
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    fs.appendFile(`${process.cwd()}/storage/draftorder/BuyNow-${shop}.txt`, " \n\n\n  ----------------Date----------------------- \n " + new Date(), err => { })
    fs.appendFile(`${process.cwd()}/storage/draftorder/BuyNow-${shop}.txt`, " \n  ----------------line items----------------------- \n " + JSON.stringify(req.body), err => { })
    const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shop);

    if (shopSessions.length > 0) {
        // calculation for buy now product variant price with type of discount selected
         var price = parseFloat(req.body.price);    
        var tierPrice = (req.body.rule.type == 'percent') ? parseFloat(req.body.rule.value) : parseFloat(req.body.rule.value)*100;
        if(req.body.rule.type == 'percent'){ 
            var calulatedPrice = (price*tierPrice/100);
        } else {
            var calulatedPrice = price-(tierPrice/100);
        }
        try {
            // Return calculated (line item price, line item total price and saving amount)
            const client = new Shopify.Clients.Graphql(shopSessions[0].shop, shopSessions[0].accessToken);            
            const appliedDiscount = {
                "valueType" : "FIXED_AMOUNT",
                "value" : calulatedPrice,
            };
            

            const DOInput = {
                "input": {
                    "lineItems": [{
                        "variantId" : 'gid://shopify/ProductVariant/'+req.body.variantId,
                        "quantity": parseInt(req.body.quantity),
                        "appliedDiscount": appliedDiscount
                    }]
                }
            }

            // console.log('DOInput', JSON.stringify(DOInput))
            
            const DO_QUERY = `mutation draftOrderCreate($input: DraftOrderInput!) {
                draftOrderCreate(input: $input) {
                draftOrder {
                    invoiceUrl
                }
                userErrors {
                    field
                    message
                }
                }
            }`;
            
            // Execute the GraphQL query using the client
            const DOData = await client.query({
                data: {
                    query: DO_QUERY,
                    variables: DOInput
                },
            }); 

            // console.log('DOData', JSON.stringify(DOData))
            // Store the invoice URL from the response
            return { 'draft_order': { 'invoice_url': DOData.body.data.draftOrderCreate.draftOrder.invoiceUrl } };
        } catch (error) {
            throw new Error("Error : " + error);
            // return { 'draft_order': { 'invoice_url': '' } };
        }
    }
}
export const createDraftOrder = async (req, res) => {    
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    fs.appendFile(`${process.cwd()}/storage/draftorder/${shop}.txt`, " \n\n\n  ----------------Date----------------------- \n " + new Date(), err => { })
    fs.appendFile(`${process.cwd()}/storage/draftorder/${shop}.txt`, " \n  ----------------line items----------------------- \n " + JSON.stringify(req.body.items), err => { })
    // @ts-ignore
    const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shop);
    //fs.appendFile(`${process.cwd()}/storage/draftorder/${shop}.txt`, " \n  ----------------Session----------------------- \n " + JSON.stringify(shopSessions), err => { })
    const lineItems = [];
    if (shopSessions.length > 0) {
        try {
            for (const [key, value] of Object.entries(req.body.items)) {                
                if (value.hasOwnProperty('applicable_rule')) {
                    const lineItemsObj = {};
                    lineItemsObj.appliedDiscount = {};
                    lineItemsObj.appliedDiscount.valueType = 'FIXED_AMOUNT';                
                    lineItemsObj.appliedDiscount.value = Number((parseFloat(value.price - value.applicable_rule[0]) / 100).toFixed(2));
                    lineItemsObj.variantId = 'gid://shopify/ProductVariant/' + value.variant_id;
                    lineItemsObj.quantity = value.quantity;

                    if (value.hasOwnProperty('properties')) {
                        if (value.properties !== null) {
                            if (value.properties.constructor.name == 'Array') {
                                lineItemsObj.customAttributes = value.properties;
                            } else {
                                if (Object.keys(value.properties).length) {
                                    let properties = [];
                                    for (var i = 0; i < Object.keys(value.properties).length; i++) {
                                        properties.push({ "key": Object.keys(value.properties)[i], "value": value.properties[Object.keys(value.properties)[i]] });
                                    }
                                    lineItemsObj.customAttributes = properties;

                                } else {
                                    //lineItemsObj.customAttributes = [{}];
                                }
                            }
                        }
                    }

                    req.body.items[key] = lineItemsObj;

                } else {
                    const lineItemsObj = {};
                    lineItemsObj.variantId = 'gid://shopify/ProductVariant/' + value.variant_id;
                    lineItemsObj.quantity = value.quantity;
                    req.body.items[key] = lineItemsObj;
                    if (value.hasOwnProperty('properties')) {
                        if (value.properties !== null) {
                            if (value.properties.constructor.name == 'Array') {
                                lineItemsObj.customAttributes = value.properties;
                            } else {
                                if (Object.keys(value.properties).length) {
                                    let properties = [];
                                    for (var i = 0; i < Object.keys(value.properties).length; i++) {
                                        properties.push({ "key": Object.keys(value.properties)[i], "value": value.properties[Object.keys(value.properties)[i]] });
                                    }
                                    lineItemsObj.customAttributes = properties;

                                } else {
                                    //lineItemsObj.customAttributes = [{}];
                                }
                            }
                        }
                    }
                }

                //lineItems.push(lineItemsObj)
                
            }
            fs.appendFile(`${process.cwd()}/storage/draftorder/${shop}.txt`, " \n  ----------------Modified line items----------------------- \n " + JSON.stringify(req.body.items), err => { })

            const client = new Shopify.Clients.Graphql(shopSessions[0].shop, shopSessions[0].accessToken);
            const DOInput = {
                "input": {
                    "lineItems": req.body.items,
                    "note": req.body.note,
                    "presentmentCurrencyCode": req.body.currency /*,
                "marketRegionCountryCode" : (req.body.currency == "CAD") ? 'CA' : 'US'*/
                }
            }

            fs.appendFile(`${process.cwd()}/storage/draftorder/${shop}.txt`, " \n  ----------------QL Input----------------------- \n " + JSON.stringify(DOInput), err => { })

            const DO_QUERY = `mutation draftOrderCreate($input: DraftOrderInput!) {
                draftOrderCreate(input: $input) {
                draftOrder {
                    invoiceUrl
                }
                userErrors {
                    field
                    message
                }
                }
            }`;
            
            // Execute the GraphQL query using the client
            const DOData = await client.query({
                data: {
                    query: DO_QUERY,
                    variables: DOInput
                },
            });
            fs.appendFile(`${process.cwd()}/storage/draftorder/${shop}.txt`, " \n  ----------------Draft Order Data----------------------- \n " + JSON.stringify(DOData), err => { })
            
            return { 'draft_order': { 'invoice_url': DOData.body.data.draftOrderCreate.draftOrder.invoiceUrl } };
        } catch (error) {
            console.error(error)            
            fs.appendFile(`${process.cwd()}/storage/draftorder/${shop}.txt`, " \n  ----------------Error----------------------- \n " + JSON.stringify(error), err => { })
            return { 'draft_order': { 'invoice_url': '' } };
        }
    } else {
        throw new Error('Something went wrong');
    }
};
