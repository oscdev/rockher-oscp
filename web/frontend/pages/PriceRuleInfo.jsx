import { Card, Page, Layout, Heading, List} from "@shopify/polaris";
import {Footer} from '../components/Footer';

export default function PriceRuleInfo() {
  return (
    <>
      <Page>
      
      <Card sectioned>
      <Heading>Add Custom Price Rule</Heading><br />
      <Layout>
        <Layout.Section>
         
          <p>Create Custom Price for products as per quantity, it can be modified or deleted if required.</p>
          <br />
         
          <List type="bullet">
            <List.Item>From your Shopify Admin, click <b>Products </b></List.Item>
            <List.Item>Go to the Product page</List.Item>
            <List.Item>On Product page click on <b>More actions </b></List.Item>
            <List.Item>Select <b>Wholesale</b> App</List.Item>
            <List.Item>Add Custom Price Rule to individual product </List.Item>
          </List><br />        
        </Layout.Section>        
      </Layout> 
      </Card>   
      <Footer/>
    </Page>
    </>
  );
}
