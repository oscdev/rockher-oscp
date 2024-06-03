import { Shopify } from "@shopify/shopify-api";
import { readFileSync } from "fs";
import { stringify } from "querystring";
const USE_ONLINE_TOKENS = false;
const isProd = process.env.NODE_ENV === "production";

//import mysql from "mysql";

// get installed store themes 
// return type JSON
export const getThemes = async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
  // @ts-ignore
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  const themeData = await client.get({
      path: 'themes.json'
  });
  return themeData.body;
};

const getAppSettingsData = async (client, themeId) => {
  const key = 'config/settings_data.json';


  try {
    const { body: { asset } } = await client.get({
      path: `themes/${themeId}/assets`,
      query: { "asset[key]": key }
    });

    // Assuming the asset is in JSON format, parse the value
    const settingsData = JSON.parse(asset.value);

    return settingsData;
  } catch (error) {
    console.error('Error fetching theme settings data:', error);
    return { error: 'Failed to fetch theme settings data.' };
  }
};

const getThemeSettingsSectionData = async (client, themeId) => {
  const key = 'templates/product.json';


  try {
    const { body: { asset } } = await client.get({
      path: `themes/${themeId}/assets`,
      query: { "asset[key]": key }
    });

    // Assuming the asset is in JSON format, parse the value
    const settingsData = JSON.parse(asset.value);
    const blocks = settingsData.sections.main.blocks;
    const oscpWholesaleAppBlocks = Object.keys(blocks)
      .filter(key => key.startsWith('oscp_wholesale_app_block'))
      .map(key => blocks[key]);

    if (oscpWholesaleAppBlocks.length > 0) {
      // The keys starting with 'oscp_wholesale_app_block' exist in the 'blocks' object
      console.log('oscp_wholesale_app_block data:', oscpWholesaleAppBlocks);
    } else {
      // The keys starting with 'oscp_wholesale_app_block' do not exist in the 'blocks' object
      console.log('No oscp_wholesale_app_block keys found in blocks.');
    }
        return oscpWholesaleAppBlocks;
  } catch (error) {
    console.error('Error fetching theme settings data:', error);
    return { error: 'Failed to fetch theme settings data.' };
  }
};

export const checkThemes = async (req, res) => {
 
  // Specify the name of the template the app will integrate with
  const APP_BLOCK_TEMPLATES = ['product',  'index'];
  const isSupported = {};

    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const themeId = req.query.theme;
    const sectionData =await getThemeSettingsSectionData(client, themeId)
  
    const settingsData = await getAppSettingsData(client, themeId);
    const appSettingData = settingsData.current.blocks;
    
    const {body:{themes}} = await client.get({
        path: 'themes.json'
    });

    
    // Find the published theme
    const selectedTheme = themes.find((theme) => theme.id == req.query.theme);
    // Retrieve a list of assets in the published theme
    const {body:{assets}} = await client.get({
      path: `themes/${selectedTheme.id}/assets`
    });
    // Check if JSON template files exist for the template specified in APP_BLOCK_TEMPLATES
    const templateJSONFiles = assets.filter((file) => {
      return APP_BLOCK_TEMPLATES.some(template => file.key === `templates/${template}.json`);
    })
    
    isSupported.theme = selectedTheme;

    if (templateJSONFiles.length > 0 && (templateJSONFiles.length === APP_BLOCK_TEMPLATES.length)) {
      isSupported.templates = {'status' : 1, 'msg': 'All desired templates support sections everywhere!'};
    } else if (templateJSONFiles.length) {
      isSupported.templates = {'status' : 0, 'msg': 'Only some of the desired templates support sections everywhere.'};
    }else{
      isSupported.templates = {'status' : 0, 'msg': 'Not supported'};
    }
    // Retrieve the body of JSON templates and find what section is set as `main`
    const templateMainSections = (await Promise.all(templateJSONFiles.map(async (file, index) => {
      const {body:{asset}} = await client.get({
        path: `themes/${selectedTheme.id}/assets`,
        query: { "asset[key]": file.key }
      })

      const json = JSON.parse(asset.value)
      const main = Object.entries(json.sections).find(([id, section]) => id === 'main' || section.type.startsWith("main-"))
      if (main) {
        return assets.find((file) => file.key === `sections/${main[1].type}.liquid`);
      }
    }))).filter((value) => value)

    // Request the content of each section and check if it has a schema that contains a
    // block of type '@app'
    const sectionsWithAppBlock = (await Promise.all(templateMainSections.map(async (file, index) => {
      let acceptsAppBlock = false;
   
      const {body:{asset}} = await client.get({
        path: `themes/${selectedTheme.id}/assets`,
        query: { "asset[key]": file.key }
      })

      const match = asset.value.match(/\{\%\s+schema\s+\%\}([\s\S]*?)\{\%\s+endschema\s+\%\}/m)
      const schema = JSON.parse(match[1]);

      if (schema && schema.blocks) {
        acceptsAppBlock = schema.blocks.some((b => b.type === '@app'));
      }
     
      return acceptsAppBlock ? file : null
    }))).filter((value) => value)
    if (templateJSONFiles.length > 0 && (templateJSONFiles.length === sectionsWithAppBlock.length)) {
      isSupported.sections = {'status' : 1, 'msg': 'All desired templates have main sections that support app blocks!'};
    } else if (sectionsWithAppBlock.length) {
      isSupported.sections = {'status' : 2, 'msg': 'Only some of the desired templates support app blocks.'};
    } else {
      isSupported.sections = {'status' : 0, 'msg': 'None of the desired templates support app blocks'};
    }
// Add settingsData to the response
    isSupported.sectionData = sectionData;
    isSupported.appSettingData = appSettingData;
    return isSupported;
};

// After app installtion setup theme
// return type JSON
export const setThemes = async (req, res) => {
  
    let liq = readFileSync(`${process.cwd()}/frontend/assets/oscp-quantity-break-info.txt`, 'utf8');  
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const snippetData = await client.put({
        path: 'themes/'+req.body.value+'/assets.json',
        query:{},
        type: 'application/json',
        data:{
            asset:{
                key : 'snippets/oscp-product-price-rule-info.liquid',
                //src : 'https://'+req.hostname+'/assets/oscp-quantity-break-info.liquid'
                //src : 'https://'+session.shop+'/apps/tier/assets/oscp-quantity-break-info.liquid'
                //src : 'https://'+req.hostname+'/assets/oscp-quantity-break-info.liquid'
                value: liq
            }
        }
    });
   
const themeData = await client.get({
    path: 'themes/'+req.body.value+'/assets.json',
    query: {
      'asset[key]' : 'layout/theme.liquid'
    }        
  });
 
   if(themeData.body.asset.value.search("oscp-product-price-rule-info") == -1){
        await client.put({
          path : 'themes/'+req.body.value+'/assets.json',
          query : {},
          // @ts-ignore
          type : 'application/json',
          data : {
            asset : {
              key : 'layout/theme.liquid',
              // @ts-ignore
              value : themeData.body.asset.value.replace("</head>","\n{% include 'oscp-product-price-rule-info' %}\n</head>")
            }
          }
        });
        return snippetData.body;
   }
   res.status(200).send(snippetData.body);
  }

  export const setScriptTag = async (shop, token) => {
    const client = new Shopify.Clients.Rest(shop, token);     
 
    
    const scriptData = await client.get({
      path : 'script_tags.json'      
    });

    if(JSON,stringify(scriptData).search("appjs") == -1){ // Hack to resolve re integrate script tag api.while uninstall hook triggering multiple times and flow goes to session recovery
      const scripta = await client.post({
        path : 'script_tags.json',
        query : {},
        // @ts-ignore
        type : 'application/json',
        data : {
          script_tag : {
            event : 'onload',
            //src : 'https://'+session.shop+'/apps/tier/assets/appjs.js'
            //src : 'https://custom-pricing-wholesale.fly.dev/appfront/appjs'
            src : `https://${Shopify.Context.HOST_NAME}/api/appfront/appjs`
          }
        }
      });
    }
      
  }