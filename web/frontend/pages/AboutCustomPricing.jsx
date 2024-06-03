import React from 'react'
import { Page,  Layout,  Heading, Card, List, Icon, Button ,ButtonGroup} from "@shopify/polaris";
import { EmailMajor ,ConversationMinor } from '@shopify/polaris-icons';
import {Footer} from '../components/Footer';
export default function AboutCustomPricing() {

	return (
		<>
	<Page
	 title= {<>About Wholesale App<br/><small>Supports Shopify Version 2.0</small></>}
	breadcrumbs={[
        {
		  url: "/"
        }
      ]}>

	<Layout sectioned>
	<hr style={{border: '1px solid #dfe3e8'}}/>

			<Layout.AnnotatedSection
			  id="appDetails"
			  title="About App"
			  description="Tiered Pricing based on Customer Tags"
			>
			  <Card sectioned>
			  <p><b>Wholesale App allows you to define wholesale discount on Products, Collections and its Variants based on Customer Groups</b></p><br />
			  <List type="bullet">
				<List.Item>You can Add, Edit or Delete Wholesale Price</List.Item>
				<List.Item>Available Discounts Types are:
				<List type="number">
				<List.Item><b>Percent Off</b> discount offers Custom Pricing in Percentage <br />Example: Percentage Off &#61;&#62; 10%OFF</List.Item>
				<List.Item><b>Fixed Price</b> discount is the Final price offered <br />Example: Fixed Price &#61;&#62; Set Final Price $70 USD</List.Item>
			  </List><br />
				</List.Item>
			  </List>
			  </Card>
			</Layout.AnnotatedSection>

			<br />
			<hr style={{border: '1px solid #dfe3e8'}}/>
			<Layout.AnnotatedSection
			  id="createOfferDetails"
			  title="Create Offer"
			  description="For Products and Collections based on Customers Groups"
			>
			  <Card sectioned>
			  <List type="bullet">
				<List.Item>On <b>Dashboard</b>, Click on <b>Create Offer</b> Tab</List.Item>
				<List.Item>Mention Offer Name, Offer Details (Tiered Pricing)</List.Item>
				<List.Item>Apply discount to Selected Products or Selected Collections</List.Item>
				<List.Item>Assign discount to Customer Group:
				<List type="number">
				<List.Item><b>All Customers</b></List.Item>
				<List.Item><b>Logged in Customers</b></List.Item>
				<List.Item><b>Customers with Specific Tags</b></List.Item>
			  </List>
				</List.Item>
			  </List>
			  <br />
			  <iframe width="560" height="315" src="https://www.youtube.com/embed/y08cUORSIjM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
			  </Card>
			</Layout.AnnotatedSection>
			<br />
			<hr style={{border: '1px solid #dfe3e8'}}/>
			<Layout.AnnotatedSection
			  id="tieredOfferDetails"
			  title="Tiered Pricing for Variants"
			  description="For Product and its Variants based on Customer Tags"
			>
				<Card sectioned>
			  <List type="bullet">
				<List.Item>On <b>Dashboard</b>, Click on <b>Tiered Pricing</b></List.Item>
				<List.Item>New tab will open to select product</List.Item>
				<List.Item>Select products and click on <b>Add </b>button</List.Item>
				<List.Item>Here you can apply Wholesale pricing to each Variant</List.Item>
			  </List>
			  <br/>
			  <iframe width="560" height="315" src="https://www.youtube.com/embed/LSNGjp3y3SA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
			  </Card>

			</Layout.AnnotatedSection>
			<br />
			<hr style={{border: '1px solid #dfe3e8'}}/>
			<Layout.AnnotatedSection
			  id="tiered"
			  title="To Change Color of Discount Grid on Frontend"
			  description="Match the color of discount Table with your brand on Product Display Page"
			>
				<Card sectioned>
				<p><b>To change the Price Grid on Product Page</b><br/><br/>Go to Sales Channel &#61;&#62; Online Store &#61;&#62; Edit Code &#61;&#62; Assets &#61;&#62; Theme CSS file <br/><b>( Example base.css in Dawn theme ) </b></p>
			  <p>
				<br/><b>Add the below code at the bottom of .css file: </b><br /> #oscpPriceGrid th <br /> &#123;<br />color: white !important; <br />background-color: #557b97 !important;<br />&#125;
			  </p>
			  </Card>

			</Layout.AnnotatedSection>
			<br />

			<hr style={{border: '1px solid #dfe3e8'}}/>
			<Layout.AnnotatedSection
			  id="help"
			  title="Need Help?"
			  description="Contact Us or click on Chat"
			>
				<Card sectioned>
			  <List type="bullet">
				<p><b>For any query, feature requirement or any assistance - do let us know!
				<br />We are just a click away!</b></p><br />
				 <ButtonGroup>
				 <a style={{ textDecoration: 'none' }} target='blank' href='https://www.oscprofessionals.com/custom-pricing-wholesale-app-contact-us/'><Button icon={ConversationMinor}>Contact Us</Button></a>
				 <a style={{ textDecoration: 'none' }} target='blank' href='mailto:support@oscprofessionals.com'><Button icon={EmailMajor}>Email Us</Button></a>
			</ButtonGroup>
				</List>
			  </Card>

			</Layout.AnnotatedSection>
		  </Layout>
	</Page>
	<Footer/>
		</>
	  )
}