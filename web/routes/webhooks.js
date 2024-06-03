import { Shopify } from "@shopify/shopify-api";

const shopEndpoint = "/api/webhooks";

export function webhookRoutes(app) {     
  app.post(`${shopEndpoint}/uninstall`, async (req, res) => {    
    try {
      console.log(`WEBHOOKS ${shopEndpoint}/uninstall`);
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Un Install Webhook processed, returned status code 200`);      
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });

  // This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint  
  // in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
  // the code when you store customer data.
  // More details can be found on shopify.dev:
  // https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks


  app.post(`${shopEndpoint}/gdpr`, async (req, res) => {   
    try {
      console.log(`WEBHOOKS ${shopEndpoint}/gdpr`)
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`GDPR Webhook processed, returned status code 200`);     
    } catch (e) {
      console.log(`Failed to process webhook: ${e.message}`);
      if (!res.headersSent) {
        res.status(500).send(e.message);
      }
    }
  });
}