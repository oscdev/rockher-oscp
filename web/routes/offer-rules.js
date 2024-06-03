import { getRule, setRule, deleteRule } from "../services/index.js";
const shopEndpoint = "/api/rule";


export function offerRuleRoutes(app) {   
      app.get(`${shopEndpoint}`, async (req, res) => {  
        try {
            const ruleData = await getRule(req, res);           
            res.status(200).send(ruleData);
        } catch (error) {
          res.status(500).send(error);
        }
      });
      
      app.post(`${shopEndpoint}`, async (req, res) => {  
        try {   
            const ruleData = await setRule(req, res);
            //console.log('rule === ', ruleData)
            res.status(200).send(ruleData);
        } catch (error) {
          res.status(500).send(error);
        }
      });

      app.delete(`${shopEndpoint}`, async (req, res) => {  
        try {   
           const ruleData = await deleteRule(req, res);
           //console.log('rule === ', ruleData)
            res.status(200).send(ruleData);
        } catch (error) {
          res.status(500).send(error);
        }
      });
}