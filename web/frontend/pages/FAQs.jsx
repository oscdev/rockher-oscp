import { useState, useEffect, useCallback } from 'react';
import { Page, Layout, Card, List, Collapsible, Link ,ButtonGroup,Button,Modal, Heading} from '@shopify/polaris';
import { EmailMajor, ConversationMinor } from '@shopify/polaris-icons';
import {Footer} from '../components/Footer';
import csvFormat from "../assets/csvFormat.png";
import offerRule from "../assets/offerRule.png"

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [active, setActive] = useState(false);
	const handleOpen = useCallback(() => setActive(true), []);  
	const handleClose = useCallback(() => {
	  setActive(false);   
	}, []);

	const [activeOffer, setActiveOffer] = useState(false);
	const handleOpenOffer = useCallback(() => setActiveOffer(true), []);  
	const handleCloseOffer = useCallback(() => {
	  setActiveOffer(false);   
	}, []);
			const faqsObj = [
				{
				title: 'Theme Version compatibility', 	
				topic: 'Does this App support Shopify 2.0 themes?',
				description: 'Yes, App supports Shopify 2.0 Themes. In case there are some custom changes on your store, you can make App compatible with simple changes in App embeds.',
				expand: false
				},
				{
				  title: '', 
				  topic: 'Does this App support Shopify Vintage themes?',
				  description: "No, we need to add code fixes to make the App compatible with your store. <br/><b><a class='customLink'  href='https://www.oscprofessionals.com/custom-pricing-wholesale-app-contact-us/'>Contact Us</a></b>",
				  expand: false
				},
				{
					title: '',
					topic: 'What happens to a store when theme is updated?',
					description: "Tier pricing will be affected if we have done custom changes on your store's App. You might need to re-configure the app only if the theme is changed.",
					expand: false
				},
				{
				  title: 'Tired Pricing guide',
				  topic: 'Can I apply tiered pricing at collection level?',
				  description: 'Yes, you can apply discount at collection level based on customer tag. <br/>Example: Products in "New collection" can be offered Tier Price - Buy 2 for 10% off and assign this to customers with Tag (VIP).',
				  expand: false
				},
				{
				  title: '',
				  topic: 'Can I apply tiered pricing at product level?',
				  description: 'Yes, you can apply discount at product level based on customer tag. <br/>Example: Selected Products can be offered Tier Price - Buy 10 for 50% Off and assign to <b>Wholesale</b> customer Tag.',
				  expand: false
				},
				{
				  title: '',
				  topic: 'Can I apply tiered pricing for Product variants?',
				  description: 'Yes, tiered pricing for Product variants is available with Customer Tags.',
				  expand: false
				},				
				{
					title: '',
					topic: "When placing a Order through Shopify's admin, will the tier pricing apply?",
					description: 'No, Orders placed by Shopify Admin are not currently eligible for Tiered discounts.',
					expand: false
				},
				{
				title: '',
				topic: "Will Tier pricing apply on product's original price or Sale price?",
				description: 'Tier pricing is calculated on the product"s "Sale Price" (not the​ compare-at-price).',
				expand: false
				},
				{
					title: '',
					topic: 'Can I disable an offer and enable it later?',
					description: 'Yes, you can disable Offers on Products and Collections.',
					expand: false
				  },
				  {
					title: '',
					topic: 'How can I disable all the offers on my store?',
					description: 'Yes, you can disable the App from Dashboard',
					 expand: false
				  },
				  {
					title: '',
					topic: 'Does this App works with Shopify Bundles?',
					description: 'No, currently tiered pricing does not work with Shopify Bundles.',
					expand: false
				  },
				  {
					title: '',
					topic: 'Tier Pricing is not working when I selected 5 quantities of same product variants?',
					description: 'If you have applied an offer at variant level and selected 5 quantities of multiple variants, the offer will not work. It works on 5 quantities of the same variant .',
					expand: false
				  },
				{
				  title: 'Priority of the Offers',
				  topic: 'What if an Offer Rule is disabled in the "List of Offers" then which offer will apply?',
				  description: 'If an Offer Rule is disabled then the next Offer which is in the "List of Offers" will be applied.',
				  expand: false
				},
				{
					title: '',
					topic: 'What if I have tier price at variant level, Product level and Collection level?',
					description: 'In this case Variant will have the highest priorty over product and collection. That means Tier price offered at variant level will be displayed on Product Page.<br\/>Example: Offer 1: Buy 2 for 5% off - White Floral Top (Variant offer)<br\/>Offer 2: Buy 5 for 5% off - Floral Top (Product offer)<br\/>Offer 3: Buy 10 for 5% off - Tops collection (Collection offer)<br\/>Offer 1 will be applied as its Variant level offer which has highest priority.',
					expand: false
				  },
				  {
					title: '',
					topic: "Offer is not visible for all variants, it's visible only for one variant, why?",
					description: 'If there are two offers applied, one from Product and one from Variant tier pricing then Variant tier pricing will be displayed.',
					expand: false
				  },
				  {
					title: '',
					topic: 'What if a product is in two collections and both collections have different tier price rules?',
					description: 'The Collection with Offer which is displayed on Top in \"List of Offers\" will be applied. Then the next Collection Offer that is in the list will be applied.<br\/>\r\nExample: Silk Summer Top is in collection \"New Collection\" (Buy 2 for 5% Off) and \"Clearance Sale\" Collection (Buy 2 for 10% Off).<br\/>If \"New Collection\" is displayed first in \"Offer List\" then Silk Summer Top will display (Buy 2 for 5% Off) on the product page.<br\/>\r\nYou can simply drag and drop \"Clearance sale\" on Top of the offer list and (Buy 2 for 10% Off) will be displayed on the Product page.',
					expand: false
				  },				
				{
				  title: '',
				  topic: 'I created an offer on Custom Collection but the tiered pricing displayed on the product page is different.',
				  description: 'If a Tiered Pricing for Variant level is applied, that is displayed on priority. Delete the offer at Variant level so that Collection level tier pricing will be displayed.',
				  expand: false
				},
				{
				  title: ' Discount codes',
				  topic: 'Will the discount codes of Shopify work with tier pricing?',
				  description: 'No, When cart contains a tier priced product then Shopify discount code cannot be applied on Cart and Checkout. In case cart do not have tier pricing products then Shopify discount code can be applied on Cart and Checkout.',
				  expand: false
				},
				{
				  title: 'Product and Collection Page Integration',
				  topic: 'Does this App work with the BUY NOW button on the product page?',
				  description: 'Yes, "BUY NOW" or "Buy it now" button is supported.',
				  expand: false
				},				
				{
					title: '',
					topic: 'Can I showcase the discounted price next to the original price instead of using a pricing grid?',
					description: 'Yes, you have the option to showcase the discounted price for a single quantity and eliminate the price grid.',
					expand: false
				  },
				  {
					title: '',
					topic: 'Is this app compatible with Shop Now?',
					description: 'No, the app does not support Shop Now but you can Contact us for customization.',
					expand: false
				  },
				{ 
					title: '',
					topic: 'Can the discounted price be displayed on the product collection page?',
					description: 'No, currently tiered pricing is not displayed on Collection page.',
					expand: false
				  },
				  { 
					title: 'B2B Feature',
					topic: 'Does this app allow customers to request a wholesale account where they can see the wholesale prices?',
					description: 'No, wholesale account  form is not available on the website. However, you can offer tier pricing to customer groups / tags using App.',
					expand: false
				  },
				  { 
					title: '',
					topic: 'Can I apply multiple Tags to the same customer and offer different pricing on products?',
					description: 'One Customer, one Tag: Only one Tag (Ex: VIP) can be applied to one customer. If you associate two tags with the same customer then the app may not perform as expected.',
					expand: false
				  },
				  { 
					title: 'Currency compatibility',
					topic: 'Does your app support multi-currency functionality?',
					description: 'Currently, our app does not support multi-currency functionality. You can contact us for any custom requirement.',
					expand: false
				  },
				  { 
					title: 'Manual custom changes for theme compatibility',
					topic: 'To change color of discount grid on frontend?',
					description: 'Go to Sales Channel => Online Store => Edit Code => Assets => Theme CSS file <br\/> Add the below code at the bottom of .css file: <br\/> #oscpPriceGrid th <br\/>{ <br\/> color: white !important; <br\/> background-color: #557b97 !important; <br\/> }',
					expand: false
				  },
				  { 
					title: '',
					topic: 'How to create offer for Product and its Variants based on Customer Tags?',
					description: 'On App Dashboard, Click on Tiered Pricing for Variants, New tab will open to select product, Select products and click on Add button, Here you can apply Wholesale pricing to each Variants based on Customer Tags',
					expand: false
				  },
				  { 
					title: '',
					topic: 'How to create offer for Products and Collections based on Customers Groups?',
					description: 'On App Dashboard, Click on Create Offer Tab Mention Offer Name, Offer Details (Wholesale Pricing) Apply discount to Selected Products or Selected Collections Assign discount to Customer Groups <br\/>1)All Customers <br\/>2)Logged in Customers <br\/>3)Customers with Specific Tags',
					expand: false
				  },
				  { 
					title: '',
					topic: 'The Discount Table is not reflecting on the Product Page?',
					description: '1)<b>Extension setup:</b><br\/>In Shopify admin, click Sales Channel => Online Store => Customization => App Embeds => Enable Custom Price Grid<br\/>2) <b>Block Setup:</b> <br\/>In Shopify admin, click Sales Channel => Online Store => Customization => In Home Page drop down select Products => Click on Default Product => In Product information click on Add block => In APPS click on Custom Price Grid => Drag and drop Custom Price Grid below Price (in Product information)<br\/>3)Check Dashboard if App is Enabled (ON) <br\/>4) The Offer / Discount created is Enabled (ON) On Offer List Page <br\/>5) If any other Price related App is installed, it may conflict with our App. So you can disable other pricing related Apps in order to view the Wholesale Table on the product page.',
					expand: false
				  },
				  { 
					title: '',
					topic: 'The Discount price is not reflecting on the Cart Page?',
					description: 'In Shopify admin, click Sales Channel => Online Store => Customization => App Embeds => Click on <b>Wholesale Price </b> <br\/><b>Enter element ID or Class of the following Input boxes:</b>',
					expand: false
				  },
				  { 
					title: '',
					topic: 'The Discount price is not reflecting in the Mini Cart?',
					description: 'In Shopify admin, click Sales Channel => Online Store => Customization => App Embeds => Click on <b>Wholesale Price </b> <br\/><b>Enter element ID or Class of the following Input boxes:</b>',
					expand: false
				  },
				  { 
					title: '',
					topic: 'The Discount price is not reflecting when I click on the “Checkout” button on cart page and Cart Drawer (Mini cart)?',
					description: 'In Shopify admin, click Sales Channel => Online Store => Customization => App Embeds => Click on <b>Wholesale Price </b> <br\/><b>Enter element ID or Class of the following Line Item:</b><br\/>For Checkout button on Cart Page and Cart Drawer <br\/> HTML reference for Checkout button on the Cart Page and Cart Drawer (ID or class) in Checkout Button input box',
					expand: false
				  },
				  { 
					title: '',
					topic: 'The Discount price is not reflecting when I click on the “Add to Cart” button?',
					description: 'In Shopify admin, click Sales Channel => Online Store => Customization => App Embeds => Click on <b>Wholesale Price </b> <br\/><b>Enter element ID or Class of the following Line Item:</b><br\/>For Add to Cart button <br\/>HTML reference for Add to cart button on the Product page (ID or class) in Add To Cart button input box',
					expand: false
				  },
				  { 
					title: '',
					topic: 'How can I display discounted price for single quantity on product page?',
					description: 'To avoid pricing grid on product page and directly display discounted price,<br/>follow these steps:<br/>Theme Setup (Left Navigation in App) => Select Theme (click on Continue) => App Block Setup => Click on Add Discounted Price => Move Discounted Price below default Price block  => Disable Wholesale Price (Grid) => Save changes ',
					expand: false
				  }
			  ]

  const toggleDropdown = (index) => {
    setFaqs((prevFaqs) => {
      const updatedFaqs = [...prevFaqs];
      updatedFaqs[index] = {
        ...updatedFaqs[index],
        expand: !updatedFaqs[index].expand
      };
      return updatedFaqs;
    });
  };

  useEffect(() => {
    setFaqs(faqsObj);
  }, []);

  return (
    <>
      <Page
        title="FAQs"
        breadcrumbs={[
          {
            url: '/'
          }
        ]}
      >
        <Layout sectioned>
          <hr style={{ border: '1px solid #dfe3e8' }} />
          <Layout.AnnotatedSection
            id="storeDetails"
            title="Frequently Asked Questions"
            description="Get answers to your questions"
          >
			<div className='faqs'>
			  <Card sectioned>
                {faqs.map((item, index) => (
					<div key={index}>
						<b className='titleFaq'>{item.title}</b>
						<List type='bullet'>
						<List.Item>
                    <Link
                      onClick={() => toggleDropdown(index)}
                      ariaExpanded={item.expand}
                      ariaControls={`collapsible-${index}`}
                    >
						<b>{item.topic}</b>
                    </Link>
                    <Collapsible
                      open={item.expand}
                      id={`collapsible-${index}`}
                      transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: item.description }} />
                    </Collapsible>
					</List.Item>	
					</List>	              
			</div>
                ))}
				</Card>
				</div>
          </Layout.AnnotatedSection>
	 
		  <br />
          <hr style={{ border: '1px solid #dfe3e8' }} />
          <Layout.AnnotatedSection
            id="help"
            title="Need Help?"
            description="Contact Us or click on Chat"
          >
            <Card sectioned>
              <p>
                <b>For any query, feature requirement, or any assistance - do let us know!</b>
                <br />
                We are just a click away!
              </p>
              <br />
			  <ButtonGroup>
				<a style={{ textDecoration: 'none' }} target='blank' href='https://www.oscprofessionals.com/custom-pricing-wholesale-app-contact-us/'><Button icon={ConversationMinor}>Contact Us</Button></a>
				<a style={{ textDecoration: 'none' }} target='blank' href='mailto:support@oscprofessionals.com'><Button icon={EmailMajor}>Email Us</Button></a>
			</ButtonGroup>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
      <Footer />
    </>
  );
}
