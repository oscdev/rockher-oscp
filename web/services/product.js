import { Shopify } from "@shopify/shopify-api";

const USE_ONLINE_TOKENS = false;

// get product data
// return type JSON
export const getProduct = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const productData = await client.get({
        //path: 'products/'+req.query.ids+'.json'
        //path: 'products.json?ids=7900034826468,'+req.query.ids+'.json'
        path: 'products.json?ids='+req.query.ids+'.json'
    });
    return productData.body;
};

// get product variant data
// return type JSON
export const getProductVariantORG = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const productData = await client.get({
        path: 'products/'+req.query.ids+'/variants.json'
    });
    return productData.body; 
};

export const getProductVariant = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
    const productData = await client.query({
        data: `query {
            product(id: "gid://shopify/Product/${req.query.ids}") {
                variants(first:100) {
              edges {
                node {
                  id
                  title
                  price
                  sku
                }
              }
            }
        }
          }`,
      });      
      let variantData = [];
      for(var i=0; i<productData.body.data.product.variants.edges.length; i++){
        var variantId = productData.body.data.product.variants.edges[i].node.id
        variantId = variantId.split('/');        
        variantData.push({
            id : variantId[variantId.length-1],
            title : productData.body.data.product.variants.edges[i].node.title,
            price : productData.body.data.product.variants.edges[i].node.price,
            sku : productData.body.data.product.variants.edges[i].node.sku
        });

        //variantData.push(productData.body.data.product.variants.edges[i].node);
      }
      return { variants:  variantData}; 
};

// get product metafields data
// return type JSON
export const getProductMetafields = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);    
    const productData = await client.get({
        path: 'products/'+req.query.ids+'/metafields.json',
        query: { namespace : 'oscpPriceRule', key : 'customPrice'}
    });
    //return JSON.parse(productData.body.metafields.value);  
    return (productData.body.metafields.length) ? productData.body.metafields[0].value : []; 
};

// To do work 
/*export const deleteProductMetafields = async (req, res, isOnlineToken) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, isOnlineToken);
    // @ts-ignore
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const oscpPriceRule = await client.get({
        path: 'products/'+req.query.ids+'/metafields.json',
        body: { namespace : 'oscpPriceRule'}
    });

    const del = await client.delete({
        path: 'products/'+req.query.ids+'/metafields/'+oscpPriceRule.body.metafields[0].id+'.json'
    });
    return del;
}*/

// save product metafields data
// return type JSON

export const saveProductMetafields = async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
    // @ts-ignore
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    let metafieldData = [];
    for (const [key, value] of Object.entries(req.body[req.query.ids].variants)) {        
        let lines = value;
        lines.id = key;
        metafieldData.push(lines)
    }
    const oscpPriceRule = await client.get({
        path: 'products/'+req.query.ids+'/metafields.json',
        query: { namespace : 'oscpPriceRule', key : 'customPrice'}
    });
    if(oscpPriceRule.body.metafields.length){ //update
        await client.put({
            path : 'products/'+req.query.ids+'/metafields/'+oscpPriceRule.body.metafields[0].id+'.json',
            query : {},           
            type : 'application/json',
            data : {
                metafield : {
                    id : oscpPriceRule.body.metafields[0].id,
                    value : JSON.stringify(metafieldData)
              }
            }
        });
    }else{ // Create        
        await client.post({
            path : 'products/'+req.query.ids+'/metafields.json',
            query : {},
            type : 'application/json',
            data : {
                metafield : {
                    namespace : 'oscpPriceRule',
                    key : 'customPrice',
                    type : 'json',
                    value : JSON.stringify(metafieldData)
              }
            }
          });
    }
    return {}; 
};