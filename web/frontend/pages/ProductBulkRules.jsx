import { React, useState, useEffect } from "react";
import { Card, Page, Toast, Frame, Banner, Button, Popover, ActionList, Icon} from "@shopify/polaris";
import { FormBulkProducts } from "../components";
import { useAuthenticatedFetch } from "../hooks";
import { useForm, useDynamicList } from "@shopify/react-form";
import { Confirm } from "../components/Confirm";
import { cnf } from '../../cnf';
import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';
import { ChevronDownMinor, } from "@shopify/polaris-icons";

export default function ProductBulkRules() {  
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [isConfirmExit, setIsConfirmExit] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(false);
  const productIds = new URL(location).searchParams.getAll("ids[]");
  const fetch = useAuthenticatedFetch();
  
  const [bulkRulesData, setBulkRules] = useState({
    "rules" : [],
    "defaultCurrency": "",
    "storeCurrencies": [],
    "currencyFormat": ""
  });

  const [toastMessage, setToastMessage] = useState(null);
  function onShowForm(){
    redirect.dispatch(Redirect.Action.ADMIN_PATH, {
      path: '/apps/' +  cnf.APPNAME,
    });
  }
  
  useEffect(() => {
    // set isMounted to true
    let isMounted = true;
    async function fetchData() {      
      const rulesObj = {
        "rules" : [],
        "defaultCurrency": "",
        "storeCurrencies": [],
        "currencyFormat": ""
      }
      let productResult = await fetch("/api/bulk-products?ids="+productIds).then((res) => res.json());
      
      for(var product of productResult.products){   
        for(var variant of product.variants){
          var rulesLen =  variant.rules.length;
          if(variant.rules.length){
            for(var [ruleIndex, rule] of variant.rules.entries()){
              rulesObj.rules.push({ruleIndex: (ruleIndex+1), status: (rule.hasOwnProperty('status')) ? rule.status : '', rowType: 'data', productType: (product.variants.length == 1) ? 'simple' : 'variable', productId : product.id, productTitle: product.title, variantId: variant.id, varianName: variant.name, sku: variant.sku, price: variant.price, ruleId: rule.id, qty: rule.qty, type: rule.type, value: rule.value, uniqueRuleIdentifier: rule.uniqueRuleIdentifier, customer: rule.customer, currency: rule.currency})
            }
            rulesObj.rules.push({ruleIndex: (variant.rules.length+1), status: '', rowType: 'empty', productType: (product.variants.length == 1) ? 'simple' : 'variable', productId : product.id, productTitle: product.title, variantId: variant.id, varianName: variant.name, sku: variant.sku, price: variant.price, ruleId: '', qty: '', type: '', value: '', uniqueRuleIdentifier: '', customer: '', currency: ''})
          }else{
            rulesObj.rules.push({ruleIndex: 1, status: '', rowType: 'empty', productType: (product.variants.length == 1) ? 'simple' : 'variable', productId : product.id, productTitle: product.title, variantId: variant.id, varianName: variant.name, sku: variant.sku, price: variant.price, ruleId: '', qty: '', type: '', value: '', uniqueRuleIdentifier: '', customer: '', currency: ''})
          }
        }
      }

      rulesObj.storeCurrencies = productResult.storeCurrencies;
      rulesObj.defaultCurrency = productResult.defaultCurrency;
      rulesObj.currencyFormat = productResult.currencyFormat;

      setBulkRules(rulesObj)
    }
    fetchData();
    return () => {
      // when component unmounts, set isMounted to false
      isMounted = false;
    };
  }, []);  
 
  const emptyCardFactory = (ruleArg) => ({
    ruleIndex: ruleArg.ruleIndex,
    status: ruleArg.status,
    rowType: ruleArg.rowType,
    productType: ruleArg.productType,
    productId: ruleArg.productId,
    productTitle: ruleArg.productTitle,
    variantId: ruleArg.variantId,
    varianName: ruleArg.varianName,
    sku: ruleArg.sku,
    price: ruleArg.price,
    ruleId: ruleArg.ruleId, 
    qty: ruleArg.qty,
    type: ruleArg.type,
    value: ruleArg.value,
    uniqueRuleIdentifier: ruleArg.uniqueRuleIdentifier,
    customer: ruleArg.customer,
    currency: ruleArg.currency
  });

    // Initialize the form with the provided data
    const { fields, submit, submitting, submitErrors, reset, dirty, dynamicLists } = useForm({
      dynamicLists: {
        bulkRules: useDynamicList(bulkRulesData.rules,
          emptyCardFactory
        )
      },
      onSubmit: async (fieldValues) => {       
        // Use the filter() method to filter objects with non-empty rowType
        const filteredData = fieldValues.bulkRules.filter(rule => rule.rowType !== "empty");
        // const remoteErrors = [];  
        const remoteErrors = new Set(); // Use a Set to store unique error messages   
        if(document.getElementsByClassName("Polaris-InlineError").length){
          remoteErrors.add('Something went wrong');
        }

        if (remoteErrors.size > 0) {
          // Convert the Set of unique error messages to an array
          const errors = [...remoteErrors];
          return { status: 'fail', errors };
        } else {
          const config = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(filteredData),
          };
      
          await fetch("/api/bulk-products", config).then(async (res) => {
            setToastMessage({
              content: "Successfully data saved.",
              error: false,
            });
            redirect.dispatch(Redirect.Action.ADMIN_PATH, {
              path: '/apps/' +  cnf.APPNAME 
              // path: '/apps/' +  cnf.APPNAME +'/productbulkrules?'+selectedIds.join('&')+'&shop='+shop,
            });
          });
          return { status: "success" };
        }
        //return {status: 'fail', errors: [{message: 'bad form data'}]};
      },
    });
    const {
      bulkRules: {
        addItem,
        editItem,
        removeItem,
        moveItem,
        fields: rules,
      },
    } = dynamicLists;

    const errorBanner =
    submitErrors.length > 0 ? (
      
      <Banner status="critical">
        <p>There were some issues with your form submission:</p>            
          </Banner>
    ) : null;

    function confirmExit(){
      if(dirty){
        setIsConfirmExit(true)
        setConfirmMsg('Are you sure you want to exit without saving');
      }else{
        onShowForm()
      }
    }
  
    function onConfirmExit(){
      onShowForm()
    }
    function onCancelExit(){
      setIsConfirmExit(false)
    }

  return (
    <Page 
    title="Bulk Product Offers"
    primaryAction={{
      content: "Save",
      disabled: !dirty,
      onAction: submit,
      loading: submitting
    }} 
    breadcrumbs={[
      {
        onAction: () => confirmExit(),
      },
    ]}
    >
     
      <Frame>
      {errorBanner}
      <br/>
        <Card>
          <FormBulkProducts 
            rules={rules}
            addItem={addItem}
            editItem={editItem}
            removeItem={removeItem}
            moveItem={moveItem}
            storeCurrencies={bulkRulesData.storeCurrencies}
            defaultCurrency={bulkRulesData.defaultCurrency}
            currencyFormat={bulkRulesData.currencyFormat}
          />
            <Confirm
                isConfirm={isConfirmExit}
                confirmMsg={confirmMsg}
                onConfirm={onConfirmExit}
                onCancel={onCancelExit}
                returnData={null}
              />
        </Card>
        {toastMessage && (
      <Toast
        content={toastMessage.content}
        onDismiss={() => setToastMessage(null)}
        error={toastMessage.error}
      />
    )}
      </Frame>
      
    </Page>
  );
}
