import { React, useState, useEffect, useCallback} from "react"; //React hooks use
import { Card,Button,Page,Layout,Spinner, Badge, Heading,List, Banner} from "@shopify/polaris"; //polaris components
import { AddProductMajor, ListMajor, AddMajor } from "@shopify/polaris-icons"; // icons used
import { Link } from "react-router-dom"; //Redirect page link used
import { ResourcePicker } from "@shopify/app-bridge-react";
import {Redirect} from '@shopify/app-bridge/actions';
import {useAppBridge} from '@shopify/app-bridge-react';
import logo from "../assets/osc_prof_logo_with_white.jpg";
import { Import, Export } from "./index"
import { cnf } from "../../cnf";


//Create the dashboard page Design
export function Dashboard(props) {
  const { rules, isAppActive, onShowForm, onShowList ,onBack, onAppDeactivate, appActivateloading} = props;
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [active, setActive] = useState(false);

  const handleResourcePickerClose = useCallback(() => setActive(false), []);
  const handleSelection = useCallback(
    (products) => {
		const selectedIds = []
		for(var product of products.selection){
			let pId = product['id'].split('/');
			pId = pId[pId.length-1];
			selectedIds.push("ids[]="+pId)
		}
      //const selectedId = product.selection[0]['id'].split('/');
      //const pId = selectedId[selectedId.length-1];
      const shop = new URL(location).searchParams.get("shop");
      redirect.dispatch(Redirect.Action.ADMIN_PATH, {
		path: '/apps/' + cnf.APPNAME +'/productbulkrules?'+selectedIds.join('&')+'&shop='+shop,

        newContext: false,
      });
      handleResourcePickerClose();
    },
    [handleResourcePickerClose],
  );

  const togglePicker = useCallback(() =>  setActive((active) => !active), []);

  useEffect(() => {    
    const queryParameters = new URLSearchParams(window.location.search)
    const pageAction = queryParameters.get("action")
    if(pageAction == 'tiered-pricing'){
		setActive(true);
    }
  }, []);

  return (

	<div className="oscDashboardPage">

			<Page>
		<Layout>
			<Layout.Section>
				<Card title={<div className="oscHeadingContent">

				<img
        alt=""
        width="100px"
        src={logo}
      />
	  <span className="cpwHeading"><Heading>OSCP Wholesale <Badge status={(isAppActive) ? 'success' : 'attention'}>{(isAppActive) ? 'ON' : 'OFF'}</Badge></Heading>
		</span></div>} actions={[{content: <>
					{(isAppActive) ?
						<div className="oscHeadingContent"><Button textAlign="left" icon={(appActivateloading) ? <Spinner  size="small" /> : <></>} onClick={(event) => {
							onAppDeactivate(false);
						}}>Disable</Button></div>
					:
					<div className="loadingBg oscHeadingContent"><Button primary textAlign="left" icon={(appActivateloading) ? <Spinner size="small" /> : <></>} onClick={(event) => {
						onAppDeactivate(true);
					}}>Enable</Button></div>
					}
				</>
      }]}>
<br />

			</Card>
			</Layout.Section>
		<Layout.Section oneHalf>
          <Card title="Tiered Pricing for Products and Collections">
            <Card.Section>
			<h2>Create Wholesale pricing for Products and Collections based on Customer Groups / Tags using this App.</h2>
			<br/><br/>
			<div className="dashboardBtn" style={{ textAlign: 'right' }}>
			<Button primary textAlign="left" icon={AddMajor} onClick={(event) => {
                    onShowForm(true);
                  }} >Create Offer</Button>

			</div>

            </Card.Section>
			</Card>
			</Layout.Section>
		  <Layout.Section oneHalf>
          <Card title="Offer List">
            <Card.Section>
			<h2>Offer list includes list of already-created offers. Click on Manage List to Add, Edit, Delete, Enable / Disable the Offer List.</h2><br/>
			<p>Total Offers : {rules.length}</p>
			<div className="dashboardBtn" style={{ textAlign: 'right' }}>
			<Button disabled={(!rules.length) ? true : false} primary textAlign="left" icon={ListMajor} onClick={(event) => {
                    onShowList(true);
                  }} >Manage List</Button>
</div>
            </Card.Section>

			</Card>
			</Layout.Section>

			</Layout>

			<br></br>
			<Layout>
		  <Layout.Section oneHalf>
          <Card title="Tiered Pricing for Variants">
            <Card.Section>
			<h2>Add or update tiered pricing for product variants based on Customer Groups / Tags using this App. </h2>
			<br/><br/>
			<br/>
			<div className="dashboardBtn" style={{ textAlign: 'right' }}>
			<Button primary textAlign="left" icon={AddProductMajor} onClick={togglePicker} >Tiered Pricing</Button>
			</div>
			
			<ResourcePicker
                    // actionVerb={ResourcePicker.ActionVerb.select}
                    resourceType="Product"
                    showVariants={false}
                    allowMultiple={true}
                    open={active}
                    onSelection={handleSelection}
                    onCancel={handleResourcePickerClose}
                    // enctype="multipart/form-data"
                  />
            </Card.Section>
			</Card>
			</Layout.Section>
			<Layout.Section oneHalf>
          <Card title="About App">
            <Card.Section>
			<h2>
			Get started with Wholesale pricing on Collections, Products and its Variants.
			</h2><br/>
			<List type="bullet">
				<List.Item><b><Link to="/aboutcustompricing" style={{  color: '#2463bc' }}>About App</Link></b></List.Item>
				<List.Item><b><Link to="/appSetup" style={{  color: '#2463bc' }}>App Setup</Link></b></List.Item>
				<List.Item><b><Link to="/faqs" style={{  color: '#2463bc' }}>FAQs</Link></b></List.Item>
			  </List>

            </Card.Section>
			</Card>
			</Layout.Section>		
		</Layout>
		<br/>
		{<div className="customExport">		
		<Layout>
			<Layout.Section oneHalf>
				<Import/>
			</Layout.Section>
			<Layout.Section oneHalf>
				<Export/>
			</Layout.Section>
		</Layout> 
		</div>}
		</Page>
		</div>

  );
}