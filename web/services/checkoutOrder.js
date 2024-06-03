import { Shopify } from "@shopify/shopify-api";
import { appendFile } from "fs";

// Define the Order class
export const CheckoutOrder = class {
    // Private properties
    #invoiceUrl = '';
    #shop = '';
    #shopSessions = '';
    #APIClient = '';
    #cartReqPayload = '';

    constructor() {}

    // Initialize method to set up initial values
    async init(req, res){
        this.#cartReqPayload = req.body;
        this.#shop = Shopify.Utils.sanitizeShop(req.query.shop);
        this.#shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(this.#shop); 
        this.#APIClient = new Shopify.Clients.Rest(this.#shopSessions[0].shop, this.#shopSessions[0].accessToken);
    }
    // Method to get the invoice URL using call the checkout api
    async getInvoiceUrl(){ 
        try {
            const draftReq = await this.#APIClient.post({
                path : 'checkouts.json',
                query : {},
                type : 'application/json',
                data : {
                    checkout : this.#reqPayload()
                }
            });   
           
            // console.log('ORDER === ',JSON.stringify(draftReq.body));

            this.#invoiceUrl = draftReq.body.checkout.web_url;
            
            return {'checkout_order': { 'invoice_url' : this.#invoiceUrl }};
        } catch (error) {
            let content = "";
            let currentDate = new Date();
            content = content + " \n ----------------Draft order payload " + currentDate + "----------------------- \n " + JSON.stringify(this.#cartReqPayload) ;
            content = content + " \n ----------------error----------------------- \n " + error + " \n\n\n ";

            appendFile(`${process.cwd()}/storage/checkoutOrderError.txt`, content, err => { })
            throw new Error('Something went wrong');
        }
    }


    // Private method to generate the request payload geting line_item attribute and note attribute
    #reqPayload(){
        return {
           line_items: this.#getLineItems(),
           note :  this.#cartReqPayload.note
        };       
    }
    
// Private method to get line items for the request payload
    #getLineItems(){
        const lineItems = [];
        for(const [key, value] of Object.entries(this.#cartReqPayload.items)) {
        //    console.log("total_price     == ",this.#cartReqPayload.items)
            if(value.hasOwnProperty('applicable_rule')){
                 // Create an applied discount object
                const appliedDiscount = {
                    value_type: 'fixed_amount',
                    value: ((value.final_price - value.applicable_rule[0])/100),
                    amount: ((value.final_line_price - value.applicable_rule[1])/100),
                    description : "amount"
                };
               
                const propertiesAttr =  this.#cartReqPayload.items[key].properties;

                lineItems.push({
                    "variant_id": value.id,
                    "quantity": value.quantity,
                    "applied_discounts": [appliedDiscount],
                    "properties": propertiesAttr
                }) 
            } else{
                 // Handle simple products without applied_discounts
                 const propertiesAttr = this.#cartReqPayload.items[key].properties;

                 lineItems.push({
                     "variant_id": value.id,
                     "quantity": value.quantity,
                     "properties": propertiesAttr
                 });
            }
             // Handle properties of items 
            if(value.hasOwnProperty('properties')){
                if(value.properties !== null){
                    // Check if properties are an array or an object
                    if(value.properties.constructor.name == 'Array'){
                        this.#cartReqPayload.items[key].properties = value.properties;
                    }else{
                         // Convert properties to an array
                        if(Object.keys(value.properties).length){
                            let properties = [];

                            for(var i=0; i<Object.keys(value.properties).length; i++){
                                properties.push({ "name": Object.keys(value.properties)[i], "value":value.properties[Object.keys(value.properties)[i]]});
                            }
                            this.#cartReqPayload.items[key].properties = properties;
                            // console.log("this.#cartReqPayload.items[key].properties", this.#cartReqPayload.items[key].properties)
                        }else{
                            this.#cartReqPayload.items[key].properties = [{}];
                        }
                    }

                }

            }     
        }
        return lineItems;
    }
    
}