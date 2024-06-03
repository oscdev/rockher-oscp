import { React, useEffect, useState } from "react"; //React hooks use
import { Page, Layout, FormLayout, Frame, PageActions } from "@shopify/polaris"; //polaris components
import { Dashboard, Form, RuleList } from "../components";

import {Footer} from "../components/Footer";

import { useAuthenticatedFetch } from "../hooks";

//Create the dashboard page Design
export default function HomePage() {


  const [ruleList, setRuleList] = useState([]);
  const [isAppActive, setIsAppActive] = useState(true);

  const [showRuleForm, onShowRuleForm] = useState(false);
  const [showRuleList, onShowRuleList] = useState(false);

  const [selectedRule, setSelectedRule] = useState();
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [appActivateloading, setAppActivateloading] = useState(false);

  const fetch = useAuthenticatedFetch();

  
  

  function refreshNotifier(){
    getRules()
  }

  function onBack(){
	onShowRuleList(false);
	onShowRuleForm(false);
  }
  function onShowForm(status, ruleIndex=null){
    onShowRuleForm(status);
    setSelectedRuleIndex(ruleIndex)

    if(ruleIndex !== null){
      setSelectedRule(ruleList[ruleIndex])
    }else{
      setSelectedRule(null)
    }
  }

  function onShowList(status){
    onShowRuleList(status);
  }

  async function onAppDeactivate(status){
	setAppActivateloading(true);
	const config = {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({appStatus: status}),
	};
    const setting = await fetch("/api/shop/setting", config).then(async (res) => res.json())
	setAppActivateloading(false);
	setIsAppActive((setting[0].value == 'true') ? true : false);
    //setRuleList(volumeData[0].value);
  }



  async function onCreateVolume(rule){
    const dataArrange = {
      campaignName: rule.campaignName,
      products: rule.products,
      collections: rule.collections,
      mirrorRules: rule.mirrorRules,
      config: {
        status: 1,
        startDate: rule.startDate,
        endDate: rule.endDate,
        userAccessibility : rule.userAccessibility,
        userTags: rule.userTags,
        priceTemplate: rule.priceTemplate
      }
    }

    let payLoad = (ruleList.length) ? ruleList : [];

    if(selectedRuleIndex == null) { // Add new volume
      payLoad.push(dataArrange);
    }else{ // update existing volume according to row index
      payLoad[selectedRuleIndex] = dataArrange
    }


    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payLoad),
    };

    await fetch("/api/rule", config).then(async (res) => {
      refreshNotifier();
      onShowForm(false);
      onShowList(false);
    })
  }

  async function onDeleteVolume(){
    let payLoad = ruleList
    payLoad.splice(selectedRuleIndex, 1);
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payLoad),
    };

    await fetch("/api/rule", config).then(async (res) => {
      refreshNotifier();
      onShowForm(false);
      onShowList(false);
    })
  }
  async function onChangeOrder(index, destination){
	let payLoad = (ruleList.length) ? ruleList : [];
	let sourceData = payLoad[index];
	let destinationData = payLoad[destination];

	payLoad[index] = destinationData;
	payLoad[destination] = sourceData;
	setLoading(true);
	const config = {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(payLoad),
	  };

	  await fetch("/api/rule", config).then(async (res) => {
		refreshNotifier();
		onShowForm(false);
		setLoading(false);
		//onShowList(false);
	  })

  }

  async function onActiveOffer(viewStatus, index){
	let payLoad = (ruleList.length) ? ruleList : [];
	payLoad[index].config.status = viewStatus;
	setLoading(true);
	const config = {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(payLoad),
	  };

	  await fetch("/api/rule", config).then(async (res) => {
		refreshNotifier();
		onShowForm(false);
		setLoading(false);
		//onShowList(false);
	  })
  }
  async function onDeleteOffer(index){
	let payLoad = (ruleList.length) ? ruleList : [];
	payLoad.splice(index, 1);
	setLoading(true);
	const config = {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(payLoad),
	  };

	  await fetch("/api/rule", config).then(async (res) => {
		refreshNotifier();
		onShowForm(false);
		setLoading(false);
		if(!ruleList.length){
			onShowList(false);
		}
		//onShowList(false);
	  })
  }

  async function onBulkAction(ids, actionType){
    let payLoad = (ruleList.length) ? ruleList : [];

    for(var i=0; i< ids.length; i++){
      if(actionType == 'delete'){
        payLoad.splice(ids[i], 1);
      }
      if(actionType == 'disable'){
        payLoad[ids[i]].config.activeStatus = 0
      }
    }

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payLoad),
    };

    await fetch("/api/rule", config).then(async (res) => {
      refreshNotifier();
      onShowForm(false);
      onShowList(false);
    })
  }

  async function getRules(){
    const ruleData = await fetch("/api/rule").then(async (res) => res.json())
    setRuleList(ruleData[0].value);
  }

  async function getAppSettings(){
	setAppActivateloading(true);
    const settings = await fetch("/api/shop/setting").then(async (res) => res.json());
	for(var i=0; i<settings.length; i++){
		if(settings[i].namespace == 'app_settings'){
			setIsAppActive((settings[i].value == 'true') ? true : false);
			setAppActivateloading(false);
		}
	}
  }

  useEffect(() => {
    getRules();
    const queryParameters = new URLSearchParams(window.location.search)
    const pageAction = queryParameters.get("action")
    if(pageAction == 'offer-list'){
      onShowRuleForm(true);
    }
    
	getAppSettings();
  }, []);

  return (
    <>
    {/* <pre>{JSON.stringify(ruleList, null, 2)}</pre> */}
      {(showRuleForm) ?
        <Form
        selectedRule={selectedRule}
          onShowForm={onShowForm}
          onCreateRule={onCreateVolume}
          onDeleteRule={onDeleteVolume}
          refreshNotifier={refreshNotifier}
          selectedRuleIndex={selectedRuleIndex}
        />
      : (showRuleList) ?
        <RuleList
          rules={ruleList}
          onShowForm={onShowForm}
		  onChangeOrder={onChangeOrder}
		  onActiveOffer={onActiveOffer}
		  onDeleteOffer={onDeleteOffer}
          onBulkAction={onBulkAction}
		  onBack={onBack}
		  loading={loading}
      /> :
        <Dashboard
          rules={ruleList}
		  isAppActive={isAppActive}
          onShowForm={onShowForm}
          onShowList={onShowList}
		  onAppDeactivate={onAppDeactivate}
		  appActivateloading={appActivateloading}
         />}
		 <Footer />
    </>

  );
}
