import { verifyFrontRequest } from "../middleware/verify-request.js";
import { CheckoutOrder } from "../services/index.js";

const shopEndpoint = "/api/appfront";

export function checkoutOrderRoutes(app) {
  app.post(`${shopEndpoint}/checkout`, verifyFrontRequest(app), async (req, res) => {
    try {
      // call the object of class and function
      const draft = new CheckoutOrder();
      await draft.init(req, res)
      //get the checkout page url
      const invoiceUrl = await draft.getInvoiceUrl();
    //   console.log("req checkout  == ",req.body )
      // console.log("invoiceUrl checkout  == ",invoiceUrl )
      res.status(200).send(invoiceUrl);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}