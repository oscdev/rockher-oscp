import { getShop, getShopSetting, setShopSetting } from "../../services/index.js";
const shopEndpoint = "/api/shop";

export function shopRoutes(app) {
    app.get(`${shopEndpoint}`, async (req, res) => {
        try {
          const shopData = await getShop(req, res);
          res.status(200).send(shopData);
        } catch (error) {
          res.status(500).send(error);
        }
    });

    app.get(`${shopEndpoint}/setting`, async (req, res) => {
        try {
          const shopData = await getShopSetting(req, res);
          res.status(200).send(shopData);
        } catch (error) {
          res.status(500).send(error);
        }
    });
	app.post(`${shopEndpoint}/setting`, async (req, res) => {
        try {
          const shopData = await setShopSetting(req, res);
          res.status(200).send(shopData);
        } catch (error) {
          res.status(500).send(error);
        }
    });
}
