import { bulkProduct, importVariantRuleData } from "../services/index.js";

const shopEndpoint = "/api/bulk-products";

export function bulkProductsRule(app) {
	/**
	 *  Purpose: This route will take the shop admin request and enter operation ID in data base
	 * @param object req
	 * 
	 * @returns In res  (affected rows and inserted row count)
	 */
  app.post(`${shopEndpoint}`, async (req, res) => {    
    const stageStatus = await importVariantRuleData.requestOperationViaBulkForm(req, res);
    res.status(200).send(stageStatus);
  });

	app.get(`${shopEndpoint}`, async (req, res) => {  
		const requestOperation = await bulkProduct.requestOperation(req, res);
		const shopDeta = await bulkProduct.shopDetail(req, res);
    // const currencyCodes = shopDeta.shopmarket.map(item => item.currencySettings.currencyCode);
    const currencyCodes = Array.from(new Set(shopDeta.shopmarket.map(item => item.currencySettings.currencyCode)));
    async function recursiveGenerateData() {
      const generatedData = await bulkProduct.generateProductData(req, res, requestOperation);
      //console.log(generatedData)
      if (generatedData.status == 'COMPLETED' && generatedData.url !== null) {
        const jsonData = await bulkProduct.getJsonFromLines(generatedData.url);
        // res.status(200).send({"products" : jsonData, "defaultCurrency": "", "storeCurrencies": ["INR","UK","US","CNY"] });
        res.status(200).send({"products" : jsonData, "defaultCurrency":shopDeta.shopdata.currencyCode, "currencyFormat": shopDeta.shopdata.currencyFormats.moneyInEmailsFormat, "storeCurrencies": currencyCodes});
      } else if (generatedData.status == 'COMPLETED' && generatedData.url == null) { 
        res.status(200).send({});
      } else {
        // If data is not generated, recursively call the function again
        setTimeout(async () => {
          await recursiveGenerateData();
        }, 200);
      }
    }
    await recursiveGenerateData();
	});
}
