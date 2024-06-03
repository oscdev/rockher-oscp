import {useState, useCallback, useRef} from 'react';
import { Page,  Layout,  Card, List,Link, Modal, ButtonGroup, Button} from "@shopify/polaris";
import { EmailMajor, ConversationMinor } from '@shopify/polaris-icons';
import {Footer} from '../components/Footer';
import extension from "../assets/AppEmbeds.png";
import product from "../assets/productBlock.png";
import offerSetup from "../assets/offer-setup.png";
import appSetup from "../assets/app-setup.png";
import lineItemPriceTotal from "../assets/lineItemPriceTotal.png";
import lineItemPrice from "../assets/lineItemPrice.png";
import cartTotal from "../assets/cartTotal.png";
import cartContainer from "../assets/cartContainer.png";
import cartQuantityInput from "../assets/cartQuantityInput.png";
import RemoveButton from "../assets/RemoveButton.png";
import addToCartButton from "../assets/addToCartButton.png";
import checkoutButton from "../assets/checkoutButton.png";


export default function AppSetup() {
const [activeExt, setActiveExt] = useState(false);
const linkExt = useRef<HTMLDivElement>(null);  
const handleOpenExt = useCallback(() => setActiveExt(true), []);  
const handleCloseExt = useCallback(() => {
	setActiveExt(false);   
}, []);

const [activePro, setActivePro] = useState(false);
const linkPro = useRef<HTMLDivElement>(null);  
const handleOpenPro = useCallback(() => setActivePro(true), []);  
const handleClosePro = useCallback(() => {
	setActivePro(false);   
}, []);

const [activeOs, setActiveOs] = useState(false);
const linkOs = useRef<HTMLDivElement>(null);  
const handleOpenOs = useCallback(() => setActiveOs(true), []);  
const handleCloseOs = useCallback(() => {
	setActiveOs(false);   
}, []);

const [activeAs, setActiveAs] = useState(false);
const linkAs = useRef<HTMLDivElement>(null);  
const handleOpenAs = useCallback(() => setActiveAs(true), []);  
const handleCloseAs = useCallback(() => {
	setActiveAs(false);   
}, []);
	

const [activeLipt, setActiveLipt] = useState(false);
const linkLipt = useRef<HTMLDivElement>(null);  
const handleOpenLipt = useCallback(() => setActiveLipt(true), []);  
const handleCloseLipt = useCallback(() => {
	setActiveLipt(false);   
}, []);

const [activeLip, setActiveLip] = useState(false);
const linkLip = useRef<HTMLDivElement>(null);  
const handleOpenLip = useCallback(() => setActiveLip(true), []);  
const handleCloseLip = useCallback(() => {
	setActiveLip(false);   
}, []);

const [activeCt, setActiveCt] = useState(false);
const linkCt = useRef<HTMLDivElement>(null);  
const handleOpenCt = useCallback(() => setActiveCt(true), []);  
const handleCloseCt = useCallback(() => {
	setActiveCt(false);   
}, []);

const [activeCc, setActiveCc] = useState(false);
const linkCc = useRef<HTMLDivElement>(null);  
const handleOpenCc = useCallback(() => setActiveCc(true), []);  
const handleCloseCc = useCallback(() => {
	setActiveCc(false);   
}, []);

const [activeCqi, setActiveCqi] = useState(false);
const linkCqi = useRef<HTMLDivElement>(null);  
const handleOpenCqi = useCallback(() => setActiveCqi(true), []);  
const handleCloseCqi = useCallback(() => {
	setActiveCqi(false);   
}, []);

const [activeRb, setActiveRb] = useState(false);
const linkRb = useRef<HTMLDivElement>(null);  
const handleOpenRb = useCallback(() => setActiveRb(true), []);  
const handleCloseRb = useCallback(() => {
	setActiveRb(false);   
}, []);

const [activeAtcb, setActiveAtcb] = useState(false);
const linkAtcb = useRef<HTMLDivElement>(null);  
const handleOpenAtcb = useCallback(() => setActiveAtcb(true), []);  
const handleCloseAtcb = useCallback(() => {
	setActiveAtcb(false);   
}, []);

	const [active, setActive] = useState(false);
	const link = useRef<HTMLDivElement>(null);  
	const handleOpen = useCallback(() => setActive(true), []);  
	const handleClose = useCallback(() => {
	  setActive(false);   
	}, []);
return (
	<>
	
	<Page
	 title= {<>App Configuration<br/><small>Shopify 2.0 Themes</small></>}
	breadcrumbs={[
        {
		  url: "/"
        }
      ]}>

	<Layout sectioned>
	<hr style={{border: '1px solid #dfe3e8'}} />
	<Layout.AnnotatedSection
			  id="setup"
			  title="App Setup"
			>
			  <Card sectioned>
				<List type="number">
				<List.Item><b>App Setup:</b><br/><br/></List.Item>			
			  </List>
			  <iframe width="560" height="315" src="https://www.youtube.com/embed/R5o1GXYfQu4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
			  </Card>
			</Layout.AnnotatedSection>

			<br />
			<hr style={{border: '1px solid #dfe3e8'}}/>
	<Layout.AnnotatedSection
			  id="setup"
			  title="The Discount Table is not reflecting on the Product Page."
			>
			  <Card sectioned>
				<List type="number">

				<List.Item><b>Extension setup:</b><br />In Shopify admin, click Sales Channel &#61;&#62; Online Store &#61;&#62; Customization  &#61;&#62; App Embeds &#61;&#62; Enable Custom Price Grid<br/> <br/><div useref={linkExt}><b><Link onClick={handleOpenExt}>Extension setup</Link></b></div><Modal instant open={activeExt} onClose={handleCloseExt} title="Extension setup" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={extension}/></Modal.Section> </Modal></List.Item><br/>

				<List.Item><b>Block Setup:</b> <br />In Shopify admin, click Sales Channel &#61;&#62; Online Store &#61;&#62; Customization  &#61;&#62; In Home Page drop down select Products &#61;&#62; Click on Default Product &#61;&#62; In Product information click on Add block &#61;&#62; In APPS click on Custom Price Grid &#61;&#62; Drag and drop Custom Price Grid below Price (in Product information)<br/> <br/><div useref={linkPro}><b><Link onClick={handleOpenPro}>Block Setup</Link></b></div><Modal instant open={activePro} onClose={handleClosePro} title="Block Setup" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={product}/></Modal.Section> </Modal></List.Item><br/>

				<List.Item>Check Dashboard if App is Enabled (ON)<br/> <br/><div useref={linkAs}><b><Link onClick={handleOpenAs}>Check Dashboard if App is Enabled (ON)</Link></b></div><Modal instant open={activeAs} onClose={handleCloseAs} title="Check Dashboard if App is Enabled (ON)" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={appSetup}/></Modal.Section> </Modal></List.Item><br/>

				<List.Item>The Offer / Discount created is Enabled (ON)<br />On Offer List Page<br/> <br/><div useref={linkOs}><b><Link onClick={handleOpenOs}>The Offer / Discount created is Enabled (ON)</Link></b></div>
				<Modal instant open={activeOs} onClose={handleCloseOs} title="The Offer / Discount created is Enabled (ON)" large >
				<Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={offerSetup}/>
				</Modal.Section> </Modal></List.Item><br/>

				<List.Item>If any other Price related App is installed, it may conflict with our App. So you can disable other pricing related Apps in order to view the Wholesale Table on the product page.
				</List.Item>
			  </List>
			 
			  </Card>
			</Layout.AnnotatedSection>

			<br />
			<hr style={{border: '1px solid #dfe3e8'}}/>
			<Layout.AnnotatedSection
			  id="appDetails"
			  title="The Discount price is not reflecting on the Cart Page."
			>
			  <Card sectioned>
				<p><strong>If the discounts are not visible on the Cart page, follow below steps:</strong><br /><br/>In Shopify admin, click Sales Channel &#61;&#62; Online Store &#61;&#62; Customization  &#61;&#62; App Embeds &#61;&#62; Click on <b>Custom Price Grid</b></p><br/>
	  			<p><strong>Enter element ID or Class of the following Line Items:</strong></p>
			  <List type="number">
				<List.Item><b>For Product Total Price </b><br/>HTML reference for Total Discounted price of the product on the Cart page (ID or class) in <b>Line item price total</b> input box <br/><div useref={linkLipt}><b><Link onClick={handleOpenLipt}>Example: .price--end</Link></b></div><Modal instant open={activeLipt} onClose={handleCloseLipt} title="For Product Total Price" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={lineItemPriceTotal}/></Modal.Section> </Modal></List.Item>

				<List.Item><b>For Product Original price </b><br/>HTML reference for Original price of the product on the Cart page (ID or class) in <br/><b>Line Item Price</b> input box <br/><div useref={linkLip}><b><Link onClick={handleOpenLip}>Example: div.product-option</Link></b></div><Modal instant open={activeLip} onClose={handleCloseLip} title="For Product Original price" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={lineItemPrice}/></Modal.Section> </Modal></List.Item>

				<List.Item><b>For SubTotal Price </b><br/>HTML reference for Subtotal price (after discount) on the cart page (ID or class) in <br/><b>Cart Total</b> input box <br/><div useref={linkCt}><b><Link onClick={handleOpenCt}>Example: .totals__subtotal-value</Link></b></div><Modal instant open={activeCt} onClose={handleCloseCt} title="For SubTotal Price" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={cartTotal}/></Modal.Section> </Modal></List.Item>

				<List.Item><b>For Container of Cart Page </b><br/>HTML reference for main element of the Cart page (ID or class) in <br/><b>Cart container </b> input box <br/><div useref={linkCc}><b><Link onClick={handleOpenCc}>Example: .cart-item</Link></b></div><Modal instant open={activeCc} onClose={handleCloseCc} title="For Container of Cart Page" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={cartContainer}/></Modal.Section> </Modal></List.Item>

				<List.Item><b>For Product Quantity Input </b>(Optional)<br/>HTML reference for Quantity of product on the Cart page (ID or class) in <br/><b>Cart Quantity Input</b> box <br/><div useref={linkCqi}><b><Link onClick={handleOpenCqi}>Example: .quantity__input</Link></b></div><Modal instant open={activeCqi} onClose={handleCloseCqi} title="For Product Quantity Input" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={cartQuantityInput}/></Modal.Section> </Modal></List.Item>

				<List.Item><b>For Remove button </b>(Optional)<br/>HTML reference for Remove button of product on the Cart Page (ID or class) in <br/><b>Button - Remove from cart</b> input box <br/><div useref={linkRb}><b><Link onClick={handleOpenRb}>Example: .cart-remove-button</Link></b></div><Modal instant open={activeRb} onClose={handleCloseRb} title="For Remove button" large ><Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={RemoveButton}/></Modal.Section> </Modal> </List.Item>
			  </List>
			  </Card>
			</Layout.AnnotatedSection>

			<br />
			<hr style={{border: '1px solid #dfe3e8'}}/>
			<Layout.AnnotatedSection
			  id="create"
			  title="The Discount price is not reflecting when I click on the “Add to Cart” button."
			>
			  <Card sectioned>
				<p><strong>Follow the instructions below if the discount is not visible after you click "Add to Cart":<br/></strong>
				<br />In Shopify admin, click Sales Channel &#61;&#62; Online Store &#61;&#62; Customization  &#61;&#62; App Embeds &#61;&#62; Click on <b>Custom Price Grid</b></p><br/>
	  			<p><strong>Enter element ID or Class of the following Line Item:</strong></p>
			  <List type="bullet">
				<List.Item><b>For Add to Cart button </b><br/>HTML reference for Add to cart button on the Product page (ID or class) in <br/><b>Add To Cart button</b> input box <br/><div useref={linkAtcb}><b><Link onClick={handleOpenAtcb}>Example: .product-form__submit</Link></b></div>
				<Modal instant open={activeAtcb} onClose={handleCloseAtcb} title="For Add to Cart button" large >
				<Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={addToCartButton}/>
				</Modal.Section> </Modal></List.Item>
			  </List>

			  </Card>
			</Layout.AnnotatedSection>
			<br />
			<hr style={{border: '1px solid #dfe3e8'}}/>
			<Layout.AnnotatedSection
			  id="tiered"
			  title="The Discount price is not reflecting when I click on the “Checkout” button on cart page and Cart Drawer (Mini cart)."
			>
			  <Card sectioned>
				<p><strong>If the discounts are not visible on the Checkout page, follow below steps:<br/></strong>
				<br />In Shopify admin, click Sales Channel &#61;&#62; Online Store &#61;&#62; Customization  &#61;&#62; App Embeds &#61;&#62; Click on <b>Custom Price Grid</b></p><br/>
	  			<p><strong>Enter element ID or Class of the following Line Item:</strong></p>
			  <List type="bullet">
				<List.Item><b>For Checkout button on Cart Page and Cart Drawer </b><br/>HTML reference for Checkout button on the Cart Page and Cart Drawer (ID or class) in <br/><b>Checkout Button</b> input box <br/>
				<div useref={link}><b><Link onClick={handleOpen}>Example: #checkout , #CartDrawer-Checkout</Link></b></div>
				<Modal instant open={active} onClose={handleClose} title="For Checkout button on Cart Page and Cart Drawer" large >
				<Modal.Section> <img style={{border: '3px solid #dfe3e8'}} alt="App Enable"  width="100%" src={checkoutButton}/>
				</Modal.Section> </Modal>
				</List.Item>
			  </List>
			  </Card>
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
	<Footer/>
		</>
	  )
}