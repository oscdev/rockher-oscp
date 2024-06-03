import { getProduct, getProductVariant, getProductMetafields, saveProductMetafields, getShop } from "../../services/index.js";

const shopEndpoint = "/api/v1/product";


export function productsV1Routes(app) {
    app.get(`${shopEndpoint}`, async (req, res) => { 
        try {
          const productData = await getProduct(req, res);
          //const productData = await getProductVariant(req, res);
          //const productData = await getProductMetafields(req, res);          
          res.status(200).send(productData);
        } catch (error) {
          res.status(500).send(error);
        }
      });
      
      app.get(`${shopEndpoint}/variants`, async (req, res) => { 
        try {     
          const productData = await getProductVariant(req, res);
          res.status(200).send(productData);
        } catch (error) {
          res.status(500).send(error);
        }
      });
    
      app.get(`${shopEndpoint}/metafields`, async (req, res) => {          
        try { 
          const productData = await getProductMetafields(req, res);
          res.status(200).send(productData);
        } catch (error) {
          res.status(500).send(error);
        }
      });
    
       app.post(`${shopEndpoint}/metafields`, async (req, res) => {  
        try {     
          const productData = await saveProductMetafields(req, res);      
          res.status(200).send();
        } catch (error) {
          res.status(500).send(error);
        }
      });
    
      app.get(`${shopEndpoint}/count`, async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(
          req,
          res,
          app.get("use-online-tokens")
        );
        const { Product } = await import(
          `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
        );
    
        const countData = await Product.count({ session });
        res.status(200).send(countData);
      });
    
      app.get(`${shopEndpoint}/create`, async (req, res) => {
        const session = await Shopify.Utils.loadCurrentSession(
          req,
          res,
          app.get("use-online-tokens")
        );
        let status = 200;
        let error = null;
    
        try {
          await productCreator(session);
        } catch (e) {          
          status = 500;
          error = e.message;
        }
        res.status(status).send({ success: status === 200, error });
      });
}