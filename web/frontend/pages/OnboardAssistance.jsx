import { Page, Tabs, Button, Modal, MediaCard, Grid, Card, Layout, Banner, Link, PageActions, Heading, ChoiceList, Spinner} from '@shopify/polaris';
import {Footer} from '../components/Footer';
import {useState, useEffect, useCallback,useRef} from 'react';
import { useAuthenticatedFetch } from "../hooks";
import { ThemesMajor,  ExternalMinor } from "@shopify/polaris-icons";
import {Redirect} from '@shopify/app-bridge/actions';
import {useAppBridge} from '@shopify/app-bridge-react';
import logo from "../assets/osc_prof_logo_with_white.jpg";
import { cnf } from '../../cnf';
import AppEmbeds from "../assets/AppEmbeds.png";
import appSettingTheme from "../assets/app_setting_theme.png";
import productBlock from "../assets/wholesale_price.png";
import Theme_Setup from "../assets/Theme_Setup.png";
import appBlock from "../assets/app_block.png";
import appBlockTheme from "../assets/wholesale_price.png";
import appCancle from "../assets/add_discounted_price.png";
import productPage from "../assets/product_page.png";
import cancelPriceBlock from "../assets/discounted_price.png";


export default function OnboardAssistance() {
  const [active, setActive] = useState(false);
  const handleOpen = useCallback(() => setActive(true), []); 
  const handleClose = useCallback(() => {
    setActive(false);   
  }, []);

  const [activeCqi, setActiveCqi] = useState(false);
  const linkExt = useRef<HTMLDivElement>(null);  
  const handleOpenCqi = useCallback(() => setActiveCqi(true), []);  
  const handleCloseCqi = useCallback(() => {
   setActiveCqi(false);   
  }, []);


  const [activeBtn, setActiveBtn] = useState(false);
  const handleOpenBtn = useCallback(() => setActiveBtn(true), []); 
  const handleCloseBtn = useCallback(() => {
    setActiveBtn(false);   
  }, []);

    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [themeInfo, setThemeInfo] = useState([]);

    const [themeName, setThemeName] = useState();
    const [themeSectionStatus, setThemeSectionStatus] = useState(0);
    const [themeTemplateStatus, setThemeTemplateStatus] = useState(0);

    const [offerSelected, setOfferSelected] = useState(['offer-list']);
    const handleChange = useCallback((value) => setOfferSelected(value), []);
    const [selectedTheme, setSelectedTheme] = useState([]);
    const [showBanner, setShowBanner] = useState(false);

    const fetch = useAuthenticatedFetch();
    const app = useAppBridge();

    const redirect = Redirect.create(app);
    const handleTheme = useCallback((value) => {
      const selectedValue = value && value.length > 0 ? value[0] : null;
      const selectedThemeObject = themeInfo.find((theme) => theme.value === selectedValue);
      const selectedThemeData = {
        id: selectedValue,
        name: selectedThemeObject ? selectedThemeObject.label : null,
        role: selectedThemeObject.role || null,
      };
     
      const isLiveTheme = selectedThemeData.role === 'main';

      setSelectedTheme(value);
      setShowBanner(isLiveTheme);
    }, [themeInfo]);
     const [appCheckStatus, setAppCheckStatus] = useState();
     const [appSectionStatus, setAppSectionStatus] = useState();
    useEffect(() => {
        loadThemes();
      }, []);

    async function loadThemes() {   
      setLoading(true) ;
      let themeList = [];   
        const response = await fetch("/api/v1/theme/get").then((res) => res.json());
        for (var theme of response.themes) {
          themeList.push({
            label: theme.name + (theme.role == "main" ? " (Live Theme)" : ""),
            value: theme.id,
            role: theme.role,
          });
        }
        themeList.sort((a, b) => {
          if (a.role === "main" && b.role !== "main") {
            return -1;
          } else if (a.role !== "main" && b.role === "main") {
            return 1;
          } else {
            return 0;
          }
        });
        setThemeInfo(themeList);
        setLoading(false);
        console.log('themeList', themeList);
    }
    async function checkTheme() {  
      setLoading(true);
      const response = await fetch("/api/v1/theme/check?theme="+selectedTheme[0]).then((res) => res.json());
      if (response.sectionData) {
        const checkSectionRecord = response.sectionData ? Object.values(response.sectionData).find(record => record.type && record.type.includes(cnf.UUID)) : null;

        if(checkSectionRecord){
          const appSectionStatus = checkSectionRecord.disabled;
          setAppSectionStatus(appSectionStatus);
        }else {
          // If checkAppRecord is not found, execute specific code or set a default value
          console.log('No matching record found. Executing specific code or setting a default value.');
          // Your specific code or setting a default value goes here
        }
      }else {
        // Handle the case when response.appSettingData is undefined or null
        console.log('Response does not contain appCheckStatus.');
        // Your handling code goes here
      }


      if (response.appSettingData) {
        const checkAppRecord = Object.values(response.appSettingData).find(record => record.type.includes(cnf.UUID));
    
        // Check if a matching record was found
        if (checkAppRecord) {
          const appCheckStatus = checkAppRecord.disabled;
          setAppCheckStatus(appCheckStatus);
          // Use these properties as needed
        } else {
          // If checkAppRecord is not found, execute specific code or set a default value
          console.log('No matching record found. Executing specific code or setting a default value.');
          // Your specific code or setting a default value goes here
        }
      } else {
        // Handle the case when response.appSettingData is undefined or null
        console.log('Response does not contain appSettingData.');
        // Your handling code goes here
      }
      setThemeName(response.theme.name)
      setThemeSectionStatus(response.sections.status)
      setThemeTemplateStatus(response.templates.status);

      setSelected(selected+1);
      setLoading(false);
  }

    const tabs = [
        {
          id: 'welcome-1',
          content: 'Select Theme',
          panelID: 'welcome-1',
        },
        {
          id: 'theme-setup',
          content: 'Enable App Embeds',
          panelID: 'theme-setup',
        },
        {
          id: 'add-sections',
          content: 'App Block Setup',
          panelID: 'add-sections',
        },       
        {
          id: 'offer-setup',
          content: 'Add Tiered Pricing',
          panelID: 'offer-setup',
        }, 
      ];

  return (
    <div className='customAssistance'>
      <Page>
      {(selected == 0) ? <PageActions
        primaryAction={{content: 'Continue', disabled: (selectedTheme.length) ? false : true, icon: (loading) ? <Spinner
        accessibilityLabel="Spinner example"
        size="small"
      />: ThemesMajor, onAction: () => {
          checkTheme()
          //setSelected(selected+1)          
        }}}
        secondaryActions={[{content: 'Back', disabled: (selected == 0) ? true : false, onAction: () => {
          setSelected(selected-1)
        }}]}
      /> : <PageActions
        primaryAction={{content: (selected == tabs.length-1) ? 'Continue' : 'Continue', disabled: (!themeTemplateStatus) ? true : false,  icon: (loading) ? <Spinner
        accessibilityLabel="Spinner example"
        size="small"
      />: ThemesMajor, onAction: () => {
          if((selected == tabs.length-1)){
            redirect.dispatch(Redirect.Action.ADMIN_PATH, {
              path: '/apps/' +  cnf.APPNAME + '?action='+offerSelected[0],
              newContext: false,
            });
          }else{
            setSelected(selected+1)
          }
          
        },}}
        secondaryActions={[{content: 'Back', disabled: (selected == 0) ? true : false, onAction: () => {
          setSelected(selected-1)
        }}]}
      />}
        <Layout><Layout.Section>
        <Tabs tabs={tabs} selected={selected} onSelect={setSelected}>            
            {(selected == 0) ? <> <MediaCard
              title="Welcome To OSCP Wholesale App"  
            >
              <img
                alt=""
                width="80px"
                height="auto"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                src={logo}
              />
            </MediaCard>
            </>
             : ''}
            {(selected == 0) ? <Card sectioned title={
    <>
    
    <Heading>
  Theme Setup{' '} 
  <span onClick={handleOpenCqi} style={{ cursor: 'pointer', textDecoration: 'underline', display: 'inline-block', fontSize: '10px' , color: 'blue' }}>
    Need Help?
  </span>
</Heading>
    </>
  }><Modal instant open={activeCqi} onClose={handleCloseCqi} title="Enable App Embeds" large ><Modal.Section>  <Card.Section>
        <Heading>Step 1: Theme Setup</Heading>
        <br />
        <b>How to Setup A Theme</b>
        <ul>
          <li>Select a theme to set up the app and click on “Continue”</li>
          <li><Link url="https://www.oscprofessionals.com/custom-pricing-wholesale-app-contact-us">Contact Us</Link> for free installation assistance</li>
        </ul>
       
        <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={Theme_Setup} />
        <br /><br />
        <p>Then Click on Continue for the Next Step.</p>
        </Card.Section>
        <Card.Section>
        <Heading>Step 2: Enable App Embeds</Heading>
        <br />
        <p>Enable Wholesale Price in App Embeds.</p>
        
        <ol>
          <li>
            <b>Automated Setup</b> - Click on <b>Enable App Embeds</b> and click <b>Save</b>. Then Click on <b>Continue</b> for the Next Step.
            <br />
            <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={AppEmbeds} />
            <br />
            <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={appSettingTheme} />
            <br />
          </li><br /><br />
          <li>
            <b>Manual Setup</b> - Click on <b>Sales Channel</b> &#61;&#62;<b> Online Store</b> &#61;&#62;<b> Customize</b> &#61;&#62;<b> App Embeds</b> &#61;&#62; Click to the left column <b> Enable</b> Wholesale Price radio button on App Embeds. <b>Make sure to click the top right corner "Save" </b>Button.
            <br />
            <ul>
            <li>Then to proceed to the next step, you need to go back to the previous page.</li>
            </ul>
          </li>
        </ol>
        </Card.Section>
        <Card.Section>
        <Heading>Step 3: App Block Setup</Heading>
        <br />
        <p>Add Wholesale Price block in App Block Setup to start storefront Integration.</p>
        <br />
        <ol>
          <li>
            <b>Automated Setup</b> - Click on <b>Add Block</b> and then <b>Save</b>. Then Click on <b>Continue</b> for the Next Step.
            <br /><br />
            <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={appBlock} /><br />
            <br /><br />
            <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={appBlockTheme} /><br />
          </li>
          <br /><br />
          <li>
            <b>Manual Setup: </b>Click on <b>Sales Channel</b>  &#61;&#62; <b>Online Store</b>  &#61;&#62; <b>Customize</b>  &#61;&#62; In the top center <b>Home Page</b> drop down select <b>Products</b>  &#61;&#62; Click on <b>Default Product</b>  &#61;&#62; In Product information click on <b>Add block</b>  &#61;&#62; In APP Blocks click on <b>Wholesale Price Block</b>  &#61;&#62; Drag and drop <b>Wholesale Price Block</b> below the Price (in Product information). <b>Make sure to click top right corner “Save”</b> Button.
            <br />
            <li><p>Then to proceed to the next step, you need to go back to the previous page.</p></li>
          </li>
        </ol>
        </Card.Section>
        <Card.Section>
        <Heading>(Optional)</Heading>
        <br />
        <ol>
          <li>
            <b>Discount for Individual Item</b><br /><br /> To showcase the discounted price for a single quantity and eliminate the price grid<br /><br />
            <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={appCancle} />
          </li>
          <br />
          <b>Product Display Page:</b><br /><br />
          <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={productPage} />
         <br /><br />
          <li>
            <b>Manual Setup: </b>Click on <b>Sales Channel</b>  &#61;&#62; <b>Online Store</b>  &#61;&#62; <b>Customize</b>  &#61;&#62; In top center <b>Home Page</b> drop down select <b>Products</b>  &#61;&#62; Click on <b>Default Product</b>  &#61;&#62; In Product information click on <b>Add Discounted Price </b>  &#61;&#62; In APP Blocks click on <b>Discounted Price</b>  &#61;&#62; Drag and drop <b>Discounted Price</b> below the Price (in Product information). <b>Make sure to click top right corner “Save”</b> Button.
          </li><br />
          <img style={{ border: '10px solid #dfe3e8', width: '100%' }} alt="Theme Setup" src={productBlock} /><br />
          <li><p>Then to proceed to the next step, you need to go back to the previous page.</p></li>
        </ol>
        </Card.Section>
        <Card.Section>
        <Heading>Step 4: Add Tiered Pricing</Heading>
        <br />
        <p>Create Wholesale pricing for Products, Variants and Collections based on Customer Tags.</p>
        <br />
        <b>Create Tiered Pricing For:</b>
        <ul>
          <li>Products and Collections (Wholesale pricing for Products and Collections based on Customer Tags)</li>
          <li>Product Variants (Wholesale pricing for Products Variants based on Customer Tags)</li>
        </ul>
      </Card.Section></Modal.Section> </Modal> 
            <p className='page0'>(Step 1 of 4)</p>                   
            {selected === 0 && showBanner && (
                <Banner status="info">
                  <p>For the best practice, we recommend running the theme setup on a child theme before implementing it on your live site.</p>
                </Banner>
            )}
            <br/>
              <ChoiceList
                title="Select theme"
                choices={themeInfo}
                onChange={handleTheme}
                selected={selectedTheme}
              />        
     
              </Card> : '' }

              {(selected == 1) ? <Card sectioned title="App Embeds">
              <p className='page'>(Step 2 of 4)</p>
              {(!themeTemplateStatus) ? <><br/><Banner 
                title={themeName ? "Theme Not Supported" : "Theme not selected"}
                status="critical"
              >
                <p>
                {themeName ? (
          <>This Theme <i><u>{themeName}</u></i> is NOT supported. {' '}
          You can <Link url="https://www.oscprofessionals.com/custom-pricing-wholesale-app-contact-us">Contact Us</Link> for Manual Setup.</>
        ) : (
          <>Select theme for the modifications to be implemented. {' '}
          You can <Link url="https://www.oscprofessionals.com/custom-pricing-wholesale-app-contact-us">Contact Us</Link> for Manual Setup.</>
        )}
                </p>
              </Banner>
                <br /></> : ''}            
                {(themeTemplateStatus )? <>   
              <Card.Section>  
              <div className='customBanner'>
                 <Card sectioned>
                    <p><b>Automated Setup:</b>  Enable/Disable Wholesale Price on App Embeds.</p><br/>                 
                <Button
                      primary
                      disabled = {false}
                      onClick={event => {                        
                        redirect.dispatch(Redirect.Action.ADMIN_PATH, {
                          path: '/themes/'+selectedTheme[0]+'/editor?context=apps&template=index&activateAppId=' + cnf.UUID + '/app-embed',
                          newContext: true,
                        });
                      }}
                      icon={ ExternalMinor}
                    >
                    {appCheckStatus ? 'Enable App Embeds' : 'Disable App Embeds'}
                    </Button> 
                    </Card>   
                    </div>             
                 <br/>                  
              <Banner 
                status="info"
              >
                    <p className='customContent'><b>Manual Setup: </b>Click on <b>Sales Channel</b>  &#61;&#62; <b>Online Store</b>  &#61;&#62; <b>Customize</b>  &#61;&#62; <b>App Embeds</b> &#61;&#62; Click to left column <b>Enable</b> Wholesale Price radio button on App Embeds. <b>Make sure to click top right corner "Save"</b> Button.
                     </p>  
                     </Banner>                   
                    <br/>
                    <img
                      onClick={handleOpenBtn} style={{ border: '10px solid #dfe3e8', width: '100%' }}alt="App Enable" src={AppEmbeds}/>                   
              </Card.Section>
              </>:""}
            </Card> : ''}

            {(selected == 2) ? <Card sectioned title="App Block Setup">  
            <p className='page'>(Step 3 of 4)</p>           
                {(themeTemplateStatus )? <>                     
                 <Card.Section>                 
                 <div className='customBanner'>
                 <Card sectioned>
                    <p><b>Automated Setup:</b>  Add Wholesale Price block to start storefront Integration.</p><br/>     
                    <Button
                   primary
                    disabled = {((!themeTemplateStatus)) ? true : false}
                    onClick={event => {                      
                      redirect.dispatch(Redirect.Action.ADMIN_PATH, {
                        path: '/themes/'+selectedTheme[0]+'/editor?template=product&addAppBlockId='+ cnf.UUID + '/app-block&target=mainSection',
                        newContext: true,
                      });
                    }}
                    icon={ ExternalMinor}
                    >
                       {appSectionStatus ? 'Enable Block' : 'Disable Block'}
                    </Button> 
                    </Card>     
                    </div>        
                 <br/>
                <Banner 
                status="info"
              >                 
                    <p className='customContent'><b>Manual Setup: </b>Click on <b>Sales Channel</b>  &#61;&#62; <b>Online Store</b>  &#61;&#62; <b>Customize</b>  &#61;&#62; In top center <b>Home Page</b> drop down select <b>Products</b>  &#61;&#62; Click on <b>Default Product</b>  &#61;&#62; In Product information click on <b>Add block</b>  &#61;&#62; In APP Blocks click on <b>Wholesale Price Block</b>  &#61;&#62; Drag and drop <b>Wholesale Price Block</b> below the Price (in Product information). <b>Make sure to click top right corner “Save”</b> Button.
                     </p>
                    </Banner>
                   <br/>
                    <img
                      onClick={handleOpen} style={{ border: '10px solid #dfe3e8', width: '100%' }}alt="App Enable" src={productBlock}/>
                    <br/><br/>
                    <Heading>(Optional)</Heading>
                    <br />                 
                    <p> <b>&nbsp;&nbsp;&nbsp; 1. Discount for Individual Item</b><br /><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;  To showcase the discounted price for a single quantity and eliminate the price grid</p><br /><br /><br />
                    <div className='customBanner'>
                 <Card sectioned>
                    <p><b>Automated Setup:</b>  Add Discounted Price to showcase the discounted price for a single quantity.</p><br/>     
                    <Button
                   primary
                    disabled = {((!themeTemplateStatus)) ? true : false}
                    onClick={event => {                      
                      redirect.dispatch(Redirect.Action.ADMIN_PATH, {
                        path: '/themes/'+selectedTheme[0]+'/editor?template=product&addAppBlockId='+ cnf.UUID + '/cancelled-block&target=mainSection',
                        newContext: true,
                      });
                    }}
                    icon={ ExternalMinor}
                    >
                      Add Discounted Price 
                    </Button> 
                    </Card>
                    </div>
                   
                    <br/>
                <Banner 
                status="info"
              >                 
                    <p className='customContent'><b>Manual Setup: </b>Click on <b>Sales Channel</b>  &#61;&#62; <b>Online Store</b>  &#61;&#62; <b>Customize</b>  &#61;&#62; In top center <b>Home Page</b> drop down select <b>Products</b>  &#61;&#62; Click on <b>Default Product</b>  &#61;&#62; In Product information click on <b>Add Discounted Price</b>  &#61;&#62; In APP Blocks click on <b>Discounted Price </b>  &#61;&#62; Drag and drop <b>Discounted Price</b> below the Price (in Product information). <b>Make sure to click top right corner “Save”</b> Button.
                     </p>
                    </Banner>
                   <br/>
                    <img
                      onClick={handleOpen} style={{ border: '10px solid #dfe3e8', width: '100%' }}alt="App Enable" src={cancelPriceBlock}/>
              </Card.Section>
             </>:""}
              </Card>: ''}
          
            {(selected == 3) ? <Card sectioned title="Create Offer">
            <p className='page'>(Step 4 of 4)</p>
            <div className='customBanners'>
               <Heading>Let's get started to boost your sale!</Heading>
               </div>
              <Card.Section>
               
                <p>Create Wholesale pricing for Products and Collections based on Customer Tags. Discounts can have Tiered pricing in Percent Off or Fixed Price.</p>
                <br/>
                <ChoiceList
                  title="Create Tiered Pricing For"
                  choices={[                    
                    {label: 'Products and Collections', value: 'offer-list'},
                    {label: 'Product Variants', value: 'tiered-pricing'},
                  ]}
                  selected={offerSelected}
                  onChange={handleChange}
                />
              </Card.Section>
            </Card> : ''}
        </Tabs>        
      </Layout.Section></Layout>     
      </Page>
      <Footer />
    </div>
  );
}
