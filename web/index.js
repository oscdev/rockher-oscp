// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";

import applyAuthMiddleware from "./middleware/auth.js";
import logRequest from "./middleware/logger.js";
import { verifyRequest } from "./middleware/verify-request.js";
//import { setupGDPRWebHooks } from "./gdpr.js";
import redirectToAuth from "./helpers/redirect-to-auth.js";
import { BillingInterval } from "./helpers/ensure-billing.js";
import { AppInstallations } from "./app_installations.js";
import bodyParser from "body-parser";
import cors from "cors";
import { hmacVerify } from "./helpers/hmacVerify.js";
import { productsV1Routes, offerRuleRoutes, variantExportRoutes, variantImportRoutes, themeV1Routes, appfrontRoutes, webhookRoutes, shopRoutes, bulkProductsRule } from "./routes/index.js";
// import { productsV1Routes, offerRuleRoutes, variantExportRoutes, variantImportRoutes, themeV1Routes,  webhookRoutes, shopRoutes ,checkoutOrderRoutes } from "./routes/index.js";

import { cnf } from "./cnf.js";
import { dbCronLock } from "./models/resource/sql/cronLock.js";
//import mysql from "mysql"

import cron from 'node-cron';
cron.schedule("*/10 * * * * *", async function() { 
  const engageSQL = await dbCronLock.engageSQL();
  //console.log('----------------'+ JSON.stringify(engageSQL) +'------------------')
}); 

const DB_PATH = `${process.cwd()}/database.sqlite`;

/*let db = new sqlite3.Database(DB_PATH , (err) => {
  if(err) {
    console.log("Error Occurred - " + err.message);
  }
})*/

const USE_ONLINE_TOKENS = false;
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

/*Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST.split("://")[0],
  API_VERSION: ApiVersion.October22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  // See note below regarding using CustomSessionStorage with this template.
  SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
  ...(process.env.SHOP_CUSTOM_DOMAIN && {CUSTOM_SHOP_DOMAINS: [process.env.SHOP_CUSTOM_DOMAIN]}),
});*/



Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST.split("://")[0],
  // @ts-ignore
  API_VERSION: "2023-07",
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  // See note below regarding using CustomSessionStorage with this template.
  SESSION_STORAGE: Shopify.Session.MySQLSessionStorage.withCredentials(
    (process.env.NODE_ENV === "production") ? process.env.DB_HOST : cnf.dev.HOST,
    (process.env.NODE_ENV === "production") ? process.env.DB_NAME : cnf.dev.DB,
    (process.env.NODE_ENV === "production") ? process.env.DB_USER : cnf.dev.USER,
    (process.env.NODE_ENV === "production") ? process.env.DB_PASSWORD : cnf.dev.PASSWORD,
    {sessionTableName: 'shopify_sessions'}
  ),
  ...(process.env.SHOP_CUSTOM_DOMAIN && {CUSTOM_SHOP_DOMAINS: [process.env.SHOP_CUSTOM_DOMAIN]}),
});





// NOTE: If you choose to implement your own storage strategy using
// Shopify.Session.CustomSessionStorage, you MUST implement the optional
// findSessionsByShopCallback and deleteSessionsCallback methods.  These are
// required for the app_installations.js component in this template to
// work properly.

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/api/webhooks/uninstall",
  webhookHandler: async (_topic, shop, _body) => {
    console.log('webhookHandler ---------------'+_topic+'----------------')
    await AppInstallations.delete(shop);
  },
});

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $6 (only USD is currently supported)
  chargeName: "Monthly Charge",
  amount: 6.0,
  currencyCode: "USD",
  interval: BillingInterval.Every30Days,
  trialDays: 30,
};



// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();
  app.use(fileUpload({
	limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  }));
  app.set("use-online-tokens", USE_ONLINE_TOKENS);
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app, {
    billing: billingSettings,
  });

  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.

  app.use(cors({origin: '*'}));
  app.use("/api/webhooks/gdpr", bodyParser.json(), hmacVerify);
  app.use("/api/appfront", bodyParser.json());
  app.use("/api/rule", bodyParser.json({ limit: '1000mb' }));
  app.use("/api/bulk-products", bodyParser.json({ limit: '1000mb' }));
  

  app.use(logRequest)

  webhookRoutes(app);
  appfrontRoutes(app);
  // checkoutOrderRoutes(app);

  variantExportRoutes(app);
  variantImportRoutes(app);


  // All endpoints after this point will require an active session
  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );




  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(express.json());

  shopRoutes(app);
  productsV1Routes(app);
  offerRuleRoutes(app);
  themeV1Routes(app);
  bulkProductsRule(app)  



  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  app.use("/*", async (req, res, next) => {

    if (typeof req.query.shop !== "string") {
      res.status(500);
      return res.send("No shop provided");
    }

    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    const appInstalled = await AppInstallations.includes(shop);

    if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
      return redirectToAuth(req, res, app);
    }

    if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
      const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);

      return res.redirect(embeddedUrl + req.path);
    }

    const htmlFile = join(
      isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
      "index.html"
    );

    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(htmlFile));
  });

  return { app };
}

createServer().then(({ app }) => app.listen(PORT));