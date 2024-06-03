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

export default function UserInfo() {
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
            <Card>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card sectioned>
                  <Heading>Free</Heading><br />
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
                  </List><br />
                 
                  </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <Card sectioned>
                  <Heading>Advance</Heading><br />
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
                  </List><br />
                  <br />
                    <Button
                      primary
                      textAlign="left"
                      style={{ textDecoration: "none", color: "currentcolor" }}
                      onClick={saveThemes}                      
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
                      Upgrade
                    </Button>
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
