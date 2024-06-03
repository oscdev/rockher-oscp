import { Shopify } from "@shopify/shopify-api";
import { readFileSync } from "fs";
//const fs = require('fs');
import fs from "fs";
import { apiModelBulkProductsRule } from "../models/index.js";
import axios from "axios";

export const bulkProduct = { 
    requestOperation : async function (req, res) {
        const bulkProductRule = await apiModelBulkProductsRule.requestOperation(req, res);
		return bulkProductRule;
	},
    shopDetail : async function (req, res) {
        const shopdata = await apiModelBulkProductsRule.shopDetail(req, res);
        //const shopMarket = await apiModelBulkProductsRule.shopMarket(req, res);
        const shopMarket = [];
        const shopMarketnew = shopMarket.map(item => ({
            currencySettings: item.currencySettings.baseCurrency
          }));
        const result = {
            shopmarket: shopMarketnew,
            shopdata: shopdata
          };
        //console.log("result",result)
		return result;
	},
    generateProductData : async function (req, res, operation) {
        const bulkProductRule = await apiModelBulkProductsRule.generateProductData(req, res, operation);
		return bulkProductRule;
	},
    getJsonFromLines : async function (dataUrl) {
        try {           
            const response = await axios.get(dataUrl);
            const products = {};
            const rules = {};
            const finalProducts = [];

            const lines = response.data.split(/[\r\n]+/);

            

            for (const line of lines) {   //Filter Products data and push in to products object         
                if (line.trim() !== '') {
                    const record = JSON.parse(line); 
                    if (record.id.search("gid://shopify/Product/") > -1) {
                        //console.log('line===', record.id)
                        let productId = record.id.split('/');
                        productId = productId[productId.length-1]
                        if(!products.hasOwnProperty(`${productId}`)){
                            products[`${productId}`] = {'id': record.id, 'title': record.title, 'variants': {}}
                        }                    
                    }  
                }                             
            }

            for (const line of lines) {   //Filter variants data and push in to products object              
                if (line.trim() !== '') {
                    const record = JSON.parse(line); 
                    if (record.id.search("gid://shopify/ProductVariant/") > -1) { 
                        let productId = record.__parentId.split('/');
                        productId = productId[productId.length-1]

                        let variantId = record.id.split('/');
                        variantId = variantId[variantId.length-1]

                        products[`${productId}`]['variants'][`${variantId}`] = {'id': record.id, 'name': record.title, 'sku':record.sku, 'price': record.price, 'rules': []}                                         
                    }  
                }                             
            }

            for (const line of lines) {   //Filter variants rule data and push in to products object           
                if (line.trim() !== '') {
                    const record = JSON.parse(line); 
                    if (record.id.search("gid://shopify/Metafield/") > -1) { 
                        let recordId = record.id.split('/');
                        recordId = recordId[recordId.length-1];
                        if (record.namespace == 'oscp'){
                            let variantId = record.__parentId.split('/');
                            variantId = variantId[variantId.length-1];

                            if(!rules.hasOwnProperty(`${variantId}`)) rules[`${variantId}`] = [];
                            var ruleData = JSON.parse(record.value)
                            ruleData.uniqueRuleIdentifier = record.key;
                            ruleData.id = recordId;
                            rules[`${variantId}`].push(ruleData);
                        }                                                               
                    }  
                }                             
            }

            for (const productKey in products) { //Re arrange variants JSON structure 
                const finalVariants = [];
                for (const variantKey in products[`${productKey}`][`variants`]) {                    
                    if(typeof(rules[`${variantKey}`]) !== 'undefined'){                        
                        products[`${productKey}`][`variants`][`${variantKey}`]['rules'] = rules[`${variantKey}`];                        
                    }
                    let rulesData =  products[`${productKey}`][`variants`][`${variantKey}`]['rules'];
                    
                    rulesData.sort((a, b) => {
                        const qtyA = Number(a.qty);
                        const qtyB = Number(b.qty);  
                        if (qtyA < qtyB) {
                            return -1;
                        } else if (qtyA > qtyB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    // Filter items with non-blank "qty" and non-blank "value"
                    //rulesData = rulesData.filter(item => item.qty.trim() !== '' && item.value !== null);

                    
                    //console.log('ssss ===', rulesData)
                    
                    finalVariants.push({
                        'id': variantKey,
                        'name': products[`${productKey}`][`variants`][`${variantKey}`]['name'],
                        'sku': products[`${productKey}`][`variants`][`${variantKey}`]['sku'],
                        'price': products[`${productKey}`][`variants`][`${variantKey}`]['price'],
                        'rules': rulesData
                    })
                }

                finalProducts.push({'id': productKey, 'title': products[`${productKey}`]['title'], 'variants': finalVariants})
            }            
            return finalProducts;
  
          } catch (error) {
            console.error('Error occurred while saving file:', error);
          }        
	},
};


    