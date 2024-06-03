import { checkThemes, getThemes, setThemes } from "../../services/index.js";
const shopEndpoint = "/api/v1/theme";


export function themeV1Routes(app) {   
  app.get(`${shopEndpoint}/get`, async (req, res) => {  
    try {
      const themeData = await getThemes(req, res);
      res.status(200).send(themeData);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.get(`${shopEndpoint}/check`, async (req, res) => {  
    try {
      console.log('theme check ------------------------------');
      const themeData = await checkThemes(req, res);
      res.status(200).send(themeData);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.post(`${shopEndpoint}/set`, async (req, res) => { 
    try{
      const setThemeData = await setThemes(req, res);
      res.status(200).send(setThemeData);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}