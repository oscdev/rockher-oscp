import crypto from "crypto";
import { Shopify } from "@shopify/shopify-api";

/*
* Verify user route requests
*  To verify the shopify HMAC verification with mandatory webhook test from shopify
* Shopify apps do HMAC validation to ensure that the request received by them has actually originated from the Shopify platform. Shopify uses a secret key to generate an HMAC of the request body and sends it along with the request.
*/

export const hmacVerify = (req, res, next) => {
  try {
    const generateHash = crypto
      .createHmac("SHA256", process.env.SHOPIFY_API_SECRET)
      .update(JSON.stringify(req.body), "utf8")
      .digest("base64");
    const hmac = req.headers["x-shopify-hmac-sha256"];
    if (Shopify.Utils.safeCompare(generateHash, hmac)) {
      console.log("HMAC successfully verified for GDPR webhook route.");
      return next();
    } else {
      console.log("Shopify hmac verification for GDPR webhook failed, aborting.");
      return res.status(401).send();
    }
  } catch (error) {
    console.log("--> HMAC ERROR", error);
    return res.status(401).send();
  }
};
