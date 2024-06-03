import {
  Spinner,
  ChoiceList,
  Page,
  Banner,
  List,
  Card,
  Button,
  Heading,
  Layout,
  Frame,
  Toast,
  Checkbox,
  Grid
} from "@shopify/polaris"; //polaris components

import { useEffect, useState, useCallback } from "react";
import { ThemesMajor } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../hooks";
import {Footer} from '../components/Footer';

export default function ThemeSetupInfo() {
  const [themes, setThemes] = useState([]);
  const [xhrLoadin, setXhrLoadin] = useState(false);
  const [xhrDone, setXhrDone] = useState(false);
  const [selected, setSelected] = useState([]);
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    loadThemes();
  }, []);

  /*
  *  This function load the themes list on store
  */
  async function loadThemes() {
    let themeList = [];
    const response = await fetch("/api/v1/theme/get").then((res) => res.json());
    for (var theme of response.themes) {
      themeList.push({
        label: theme.name + (theme.role == "main" ? " (Live Theme)" : ""),
        value: theme.id,
      });
    }
    setThemes(themeList);
  }

  /*
  *  This function save selected theme and inject the liquid file 
  */
  async function saveThemes() {
    setXhrLoadin(true);

    for (var selectedTheme of themes) {
      if (selectedTheme.value == selected[0]) {
        const config = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: selectedTheme.label,
            value: selectedTheme.value,
          }),
        };

        const response = await fetch("/api/v1/theme/set", config).then((res) => {
          setXhrLoadin(false);
          setXhrDone(true);
        });
      }
    }   
  }

  function hideToast() {
    setXhrDone(false);
  }

  const handleTheme = useCallback((value) => {
    setSelected(value);
  }, []);

  const toastMarkup = xhrDone ? (
    <Toast content="Theme setup done" onDismiss={hideToast} duration={4500} />
  ) : null;
  return (
    //Add steps to apply the connection of App With theme
    <>
      <Page icon={ThemesMajor}>
        <Layout>
          <Layout.Section>
            <Card sectioned>
            <Heading>Let’s Setup Theme</Heading><br />
            <p>This setup involves minor changes to your theme's code.</p>
            <br /> <Heading>Set App block</Heading><br />
              <List type="number">
                <List.Item>In Shopify store Admin click on <b>Sales Channels</b></List.Item>
                <List.Item>Go to <b>Online Store</b> &#61;&#62; <b>Customize</b></List.Item>
                <List.Item>
                  From <b>Home Page</b> dropdown &#61;&#62; <b>Product</b> &#61;&#62; <b>Default
                    Product</b>
                </List.Item>
                <List.Item>
                  In <b>Product Information</b>, click on <b>Add Block</b> &#61;&#62; Select <b>Custom Price Grid</b>
                </List.Item>
                <List.Item>
                  Drag <b>Custom Price Grid</b> block below <b>Price</b> or place where you want the Custom Price Grid to display the Product Page on Frontend
                </List.Item>
                <List.Item>
                  Click on <b>App Embeds</b> (from left navigation) &#61;&#62; Enable the <b>Custom Price Grid</b>
                </List.Item>
                <List.Item>Click on <b>Save</b></List.Item>
              </List>
              <br />
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card sectioned>
                  <Heading>Setup Your Theme (Automation)</Heading><br />
                  <p>
                    Setup Wholesale App in order to offer
                    discount to your customer. The setup involves minor changes
                    to your theme's code.
                  </p>
                  <br />
                  <Banner title="Note:">
                    <List type="bullet">
                      <List.Item>
                       Wholesale App is not compatible with other
                        apps that modify product pricing.
                      </List.Item>
                      <List.Item>
                        You can ignore this step if your theme is compatible
                        with <b>shopify 2.0</b>.
                      </List.Item>
                    </List>
                  </Banner>
                  <Card sectioned>
                    <ChoiceList
                      title="Select theme"
                      choices={themes}
                      onChange={handleTheme}
                      selected={selected}
                    />
                    <br />
                    <Checkbox
                      label="We strongly recommend NOT to run theme setup on your live theme without testing on development theme."
                      checked={checked}
                      onChange={handleChange}
                    />
                    <br />
                    <br />
                    <Button
                      primary
                      textAlign="left"
                      style={{ textDecoration: "none", color: "currentcolor" }}
                      onClick={saveThemes}
                      disabled={(selected.length && checked) ? false : true}
                      icon={
                        !themes.length || xhrLoadin ? (
                          <Spinner
                            accessibilityLabel="Spinner example"
                            size="small"
                          />
                        ) : (
                          ThemesMajor
                        )
                      }
                    >
                      Run theme Setup
                    </Button>
                  </Card>
                </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card sectioned>
                  <Heading>Steps to reverse installation</Heading><br />
                  <p>                    
                  </p>
                  <br />

                  <List type="number">
                    <List.Item>
                      In Shopify store Admin click on <b>Sales Channels</b>
                    </List.Item>
                    <List.Item>
                      Go to <b>Online Store</b>
                    </List.Item>
                    <List.Item>
                    In Theme,click on<b> 3 dots </b>and select <b>Edit code</b>
                    </List.Item>
                    <List.Item>In <b>Layout </b>, select <b>theme.liquid </b>file</List.Item>
                    <List.Item>
                      Remove below code before closing <b>Head</b> tag 
                      
                      <br />
                      <b>
                        &#123;&#37; include
                        &#39;oscp&#45;product&#45;price&#45;rule&#45;info&#39;
                        &#37;&#125;{" "}
                      </b>
                      <br />{" "}
                    </List.Item>
                    <List.Item>In <b>Snippets</b> Remove Snippet file
                     <b> Oscp-product-price-rule-info.liquid </b></List.Item>
                  </List><br />
                 
                  </Card>
              </Grid.Cell>
            </Grid>
          </Card>
          <Footer/>
          </Layout.Section>
          
        </Layout>
        <Frame>{toastMarkup}</Frame>      
      </Page>
    </>
  );
}
