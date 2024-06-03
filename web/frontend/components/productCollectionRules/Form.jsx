import { React, useEffect, useState } from "react"; //React hooks use
import { Page, Layout, FormLayout, Frame, PageActions, Banner, Spinner} from "@shopify/polaris"; //polaris components



import { RuleName, Grid, Associate, MapCustomerGroup } from "../";

import { useForm, useField, useDynamicList, useList } from "@shopify/react-form";

import { useAuthenticatedFetch } from "../../hooks";

import { Confirm } from "../";

//Create the dashboard page Design
export function Form(props) {
  const { selectedRule, onShowForm, onCreateRule, onDeleteRule, refreshNotifier, selectedRuleIndex } = props;

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const defaultCampaignName = (selectedRule) ? selectedRule.campaignName : '';
  const defaultStartDate = (selectedRule) ? selectedRule.config.startDate : '';
  const defaultEndDate = (selectedRule) ? selectedRule.config.endDate : '';
  const defaultUserAccessibility = (selectedRule) ? selectedRule.config.userAccessibility : 'all';
  const defaultUserTags = (selectedRule) ? selectedRule.config.userTags : [];
  const defaultPriceTemplate = (selectedRule) ? selectedRule.config.priceTemplate : '';
  const defaultMirrorRules = (selectedRule) ? selectedRule.mirrorRules : [];
  const defaultProducts = (selectedRule) ? selectedRule.products : [];
  const defaultCollection = (selectedRule) ? selectedRule.collections : [];





//   useEffect(() => {
//     getVolumes()
//   }, []);

  const emptyCardFactory = (ruleArg) => ({
    qty: ruleArg.qty,
    type: ruleArg.type,
    value: ruleArg.value
  });
  const emptyProductsFactory = (productArg) => ({
    id: productArg.id,
    title: productArg.title,
    variants: productArg.variants
  });

  const emptyCollectionsFactory = (collectionsArg) => ({
    id: collectionsArg.id,
    title: collectionsArg.title
  });
  const emptyUserTags = (tagArg) => ({
    title: tagArg.title
  });

  const {
    submit,
    dirty,
    submitting,
    submitErrors,
    dynamicLists,
    reset,
    fields: { campaignName, startDate, endDate, userAccessibility, priceTemplate },
  } = useForm({
    fields: {
      campaignName: useField(defaultCampaignName),
      startDate: useField(defaultStartDate),
      endDate: useField(defaultEndDate),
      userAccessibility : useField(defaultUserAccessibility),
      //userTags : useField(defaultUserTags),
      priceTemplate : useField(defaultPriceTemplate),
    },
    dynamicLists: {
      mirrorRules: useDynamicList(defaultMirrorRules,
        emptyCardFactory
      ),
      products: useDynamicList(
        defaultProducts, // Default resource should be json object inside of []
        emptyProductsFactory
      ),
      collections: useDynamicList(
        defaultCollection, // Default resource should be json object inside of []
        emptyCollectionsFactory
      ),
	  userTags: useDynamicList(
        defaultUserTags, // Default resource should be json object inside of []
        emptyUserTags
      )
    },
    makeCleanAfterSubmit: false,
    onSubmit: async (fieldValues) => {


      const remoteErrors = [];
      if(!campaignName.value.length){
        remoteErrors.push('Offer Name is mandatory')
      }

      if(!rules.length){
        remoteErrors.push('Offer Details is mandatory')
      }

      if((!products.length) && (!collections.length)){
        remoteErrors.push('Products or collections is mandatory')
      }

	  if((userAccessibility.value == 'specific') && (!userTags.length)){
		remoteErrors.push('Customer tag is mandatory when customer group is selected as "Tagged Customers"')
	  }





      if(remoteErrors.length){
		setTimeout(function(){
			setIsFormSubmitting(false);
		  }, 200)
        return {status: 'fail', errors: remoteErrors};
      }else{
        onCreateRule(fieldValues)
        return { status: "success" };
      }

    },
  });

  const {
    mirrorRules: {
      addItem,
      editItem,
      removeItem,
	  moveItem,
      fields: rules,
    },
  } = dynamicLists;

  const {
    products: { addItem: addProducts, editItem: editProducts, removeItem: removeProducts, newDefaultValue, fields: products },
  } = dynamicLists;

  const {
    collections: { addItem: addCollections, editItem: editCollections, removeItem: removeCollections, fields: collections },
  } = dynamicLists;

  const {
    userTags: { addItem: addUserTag, editItem: editUserTag, removeItem: removeUserTag, fields: userTags },
  } = dynamicLists;

  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isConfirmExit, setIsConfirmExit] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(false);


  const fetch = useAuthenticatedFetch();

  function showDeleteConfirm(){
    setIsConfirmDelete(true);
    setConfirmMsg('Are you sure you want to delete this Offer')
  }

  function onConfirmDelete(){
    onDeleteRule();
  }

  function onConfirmCancel(){
    setIsConfirmDelete(false);
  }

  function confirmExit(){
    if(dirty){
      setIsConfirmExit(true)
      setConfirmMsg('Are you sure you want to exit without saving')
      /*if (confirm("Are you sure want to exit without save") == true) {
        onShowForm(false)
      }*/
    }else{
      onShowForm(false)
    }
  }

  function onConfirmExit(){
    onShowForm(false)
  }
  function onCancelExit(){
    setIsConfirmExit(false)
  }

  /*async function getVolumes(){
    await fetch("/api/volume").then(async (res) => {
      setVolumeData();
    })
  }*/



  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
      <Banner status="critical">
        <p>There were some issues with your form submission:</p>
        <ul>
            {submitErrors.map(({message}, index) => {
              return <li key={index}>{submitErrors[index]}</li>;
            })}
          </ul>
          </Banner>
      </Layout.Section>
    ) : null;

  async function updateRule(){
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    };

    await fetch("/api/v1/product/metafields?ids=", config).then(async (res) => {

    })
  }

  async function deleteRule(){
    const config = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedRule),
    };

    await fetch("/api/rule", config).then(async (res) => {
      refreshNotifier();
      onShowForm(false)
    })
  }


  function formSubmit(){
	if(!isFormSubmitting){
		submit();
		setIsFormSubmitting(true);
	}
  }


  return (
    <Page
    title="Create Offer"
      breadcrumbs={[
        {
          content: "Discounts",
          onAction: () => confirmExit(),
        },
      ]}
      primaryAction={{
        content: "Save",
        onAction: formSubmit,
        disabled: !dirty,
        loading: isFormSubmitting
      }}
	  secondaryActions={[
		{
		  content: "Delete",
		  destructive: true,
		  onAction: showDeleteConfirm,
		  disabled: (selectedRuleIndex == null) ? true : false
		},
	  ]}
    >


      <Frame>
        <Layout>

		  {errorBanner}

		  <Layout.Section>
            <FormLayout>
              <RuleName campaignName={campaignName} />

              <Grid
                rules={rules}
                addItem={addItem}
                editItem={editItem}
                removeItem={removeItem}
				moveItem={moveItem}
              />

              <Associate
                products={products}
                addProducts={addProducts}
                editProducts={editProducts}
                removeProducts={removeProducts}

                collections={collections}
                addCollections={addCollections}
                editCollections={editCollections}
                removeCollections={removeCollections}
              />
              <MapCustomerGroup
              userAccessibility={userAccessibility}
              userTags={userTags}
			  addUserTag={addUserTag}
			  editUserTag={editUserTag}
			  removeUserTag={removeUserTag}
              priceTemplate={priceTemplate}
              />
            </FormLayout>
          </Layout.Section>

        </Layout>
        <Confirm
                isConfirm={isConfirmDelete}
                confirmMsg={confirmMsg}
                onConfirm={onConfirmDelete}
                onCancel={onConfirmCancel}
                returnData={null}
              />

          <Confirm
                isConfirm={isConfirmExit}
                confirmMsg={confirmMsg}
                onConfirm={onConfirmExit}
                onCancel={onCancelExit}
                returnData={null}
              />


      </Frame>
    </Page>
  );
}
