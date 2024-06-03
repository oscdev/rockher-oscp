import { verifyFrontRequest } from "../middleware/verify-request.js";
import { createDraftOrder, createDraftBuyNow } from "../services/index.js";

const shopEndpoint = "/api/appfront";

export function appfrontRoutes(app) {
  app.post(`${shopEndpoint}/draft`, verifyFrontRequest(app), async (req, res) => {
    try {
      const draft = await createDraftOrder(req, res);
	    // console.log("Req for draft order", req.body);
      res.status(200).send(draft);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.post(`${shopEndpoint}/draft-buy-now`, verifyFrontRequest(app), async (req, res) => {
    try {
      const draft = await createDraftBuyNow(req, res);	    
      res.status(200).send(draft);
    } catch (error) {
      res.status(500).send(error);
    }
  });

}