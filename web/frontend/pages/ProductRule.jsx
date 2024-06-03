import { Card, Page, Toast, Frame, Banner, Spinner } from "@shopify/polaris";
import { React, useState, useEffect, useCallback } from "react";

//import { useQuery, gql } from "@apollo/client";
import { Loading } from "@shopify/app-bridge-react";

import { ProductVariants, DeleteRule } from "../components";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function ProductRule() {
  /** Determines the Delete confirm popup appear */
  const [confirmDelete, setConfirmDelete] = useState(false);

  /** Initialize the product row data target ID*/
  const [productRowId, setProductRowId] = useState("");

  /** */
  const [productData, setProductData] = useState();

  /** */
  const [shopData, setShopData] = useState();

  /** Initialize the product row data target variant ID*/
  const [productVariantId, setProductVariantId] = useState();

  /** Initialize the list of all variants of product*/
  const [variants, setVariants] = useState([]);

  //Configuration to handle error message in toast component
  const [toastMsg, setToastMsg] = useState(false);

  //Configuration to handle action button in toast component
  const toggleToastMsgActive = useCallback(
    () => setToastMsg((toastMsg) => !toastMsg),
    []
  );

  //Configuration to hold validation msg
  const [toastMsgError, setToastMsgError] = useState(false);

  //Collect current product id from URL
  const productId = new URL(location).searchParams.get("id");

  //Collect current shop name from URL
  const shop = new URL(location).searchParams.get("shop");

  const fetch = useAuthenticatedFetch();

  /** Load the selected product data */

  /*const {
    data,
    loading,
    error,
  } = useAppQuery({
    url: "/api/product?ids="+productId,
    reactQueryOptions: {
      onSuccess: () => {
      },
    },
  });*/

  /** Configuration to hold empty row while add rule button pressed*/
  const emptyRow = { qty: "", type: "", value: "", editable: true };

  /** Fetch needed data from server while page load*/
  /*test*/


  useEffect(() => {
    // set isMounted to true
    let isMounted = true;

    async function fetchData() {
      let productResult = await fetch("/api/v1/product?ids="+productId).then((res) => res.json());
      let shopResult = await fetch("/api/shop").then((res) => res.json());
      let variantResult = await updateRuleGrid();
      // only update state if component is mounted
      if (isMounted) {
        setProductData(productResult.products[0]);
        setShopData(shopResult);
        setVariants(variantResult);
      }
    }

    fetchData();

    return () => {
      // when component unmounts, set isMounted to false
      isMounted = false;
    };
  }, []);

  /** Fetch needed data from server */

  const updateRuleGrid = async () => {
    let variantResult = await fetch("/api/v1/product/variants?ids="+productId).then((res) => res.json());
    let priceRule = await fetch("/api/v1/product/metafields?ids="+productId).then((res) => res.json());
    variantResult = variantResult.variants;
    for(var key in variantResult){
      variantResult[key].rules = [];
      for(var rule in priceRule){
        if(variantResult[key].id == priceRule[rule].id){
          //variantResult[key].rules.push(priceRule[rule].rules)
          variantResult[key].rules = priceRule[rule].rules;
        }
      }
      variantResult[key].rules.push({qty: '', type: '', value: '', editable: true, xhrLoading: false, xhrDeleteLoading: false}) //Set last default empty row
    }

    variantResult = variantResult.sort(function (a, b) {
      return a.position - b.position;
    });

    return variantResult;
  }

  /** Sort tier price rule  */
  function sortRule(rule) {
    const sorted = rule.sort((a, b) => {
      return a.qty - b.qty;
    });

    return sorted;
  }

  /*** Variant START */

  /*
   * Provission to add new rule.
   * @param
   *  id : variant id
   * return NULL
   */
  function addNewRow(id) {
    var rowModifiedVariant = [];
    for (var i = 0; i < variants.length; i++) {
      rowModifiedVariant.push(variants[i]);
      if (rowModifiedVariant[i]["id"] == id) {
        rowModifiedVariant[i]["rules"].push(emptyRow);
      }
    }
    setVariants(rowModifiedVariant);
  }

  /*
   * Provission to edit new rule.
   * @param
   *  id : variant id
   *  rowIndex : selected / targeted row index
   * return NULL
   */

  function editRow(id, rowIndex) {
    var rowModifiedVariant = [];
    for (var i = 0; i < variants.length; i++) {
      rowModifiedVariant.push(variants[i]);
      if (rowModifiedVariant[i]["id"] == id) {
        rowModifiedVariant[i]["rules"][rowIndex]["editable"] = true;
      }
    }
    setVariants(rowModifiedVariant);
  }

  /*
   * Provission to save updated rule.
   * @param
   *  e : event of targeted element
   *  id : variant id
   *  rowIndex : selected / targeted row index
   * return NULL
   */

  function updateRow(e, id, rowIndex) {
    let priceQty = e.target
      .closest(".priceRow")
      .getElementsByClassName("inputQty")[0].value;
    let discountType = e.target
      .closest(".priceRow")
      .getElementsByClassName("selectType")[0].value;
    let discountValue = e.target
      .closest(".priceRow")
      .getElementsByClassName("inputValue")[0].value;

    if (isValid(priceQty, discountType, discountValue, id, rowIndex)) {
      var rowModifiedVariant = [];
      for (var i = 0; i < variants.length; i++) {
        rowModifiedVariant.push(variants[i]);
        if (rowModifiedVariant[i]["id"] === id) {
          //rowModifiedVariant[i]['rules'][rowIndex]['editable'] = false;
          rowModifiedVariant[i]["rules"][rowIndex]["xhrLoading"] = true;
          rowModifiedVariant[i]["rules"][rowIndex]["qty"] = priceQty;
          rowModifiedVariant[i]["rules"][rowIndex]["type"] = discountType;
          rowModifiedVariant[i]["rules"][rowIndex]["value"] = discountValue;
        }
      }
      setVariants(rowModifiedVariant);
      saveAllRules();
    } else {
      setToastMsg(true);
    }
  }

  /*
   * Provission to handle rule validation while add or update.
   * @param
   *  priceQty : Product quantity
   *  discountType : value type
   *  discountValue : price value
   * return true/false
   */

  function isValid(priceQty, discountType, discountValue, id, rowIndex) {
    //var isValid = true;
    var number = /^[0-9]+$/; // check only int value
    var double = /^\d+(\.\d{1,2})?$/; // check only int and float value
    var compareVariant = null;

    for (var i = 0; i < variants.length; i++) {
      if (variants[i]["id"] === id) {
        compareVariant = variants[i];
      }
    }

    // if (!quantity || !discountType || !discountValue) {
    if (!discountType) {
      // check blank field validation discountType
      setToastMsgError("Type field is mandatory");
      return false;
    }

    if (!priceQty) {
      // check blank field validation quantity
      setToastMsgError("Quantity field is mandatory");
      return false;
    }

    if (priceQty < 1) {
      // check quantity greater than 1
      setToastMsgError("Quantity must be greater than or equal to 1");
      return false;
    }
    if (!number.test(priceQty)) {
      // check quantity is numeric
      setToastMsgError("Quantity must be integer");
      return false;
    }

    for (var i = 0; i < compareVariant["rules"].length; i++) {
      // check quantity is numeric
      if (compareVariant["rules"][i]["qty"] == priceQty && rowIndex !== i) {
        setToastMsgError("Quantity " + priceQty + " already exists");
        return false;
      }
    }

    if (!discountValue) {
      // check blank field validation discountType
      setToastMsgError("Value field is mandatory");
      return false;
    }

    if (!double.test(discountValue)) {
      // check price is double
      setToastMsgError("Value must be integer");
      return false;
    }

    if ((discountValue*100) <= 0) {
      // check discountValue greater than 0
      setToastMsgError("Value must be greater than 0");
      return false;
    }

    if (
      discountType == "fixed" &&
      parseFloat(discountValue) > parseFloat(compareVariant["price"])
    ) {
      // Fixed Value/Price must be less than original price
      setToastMsgError("Fixed Value/Price must be less than original price");
      return false;
    }

    if (discountType == "percent" && discountValue > 100) {
      // Discount value must be less than 100
      setToastMsgError("Discount value must be less than 100");
      return false;
    }

    return true;
  }

  /*
   * Provission to show confirm dialog.
   * @param
   *  id : variant ID to send as it is to onConfirm method
   *  rowIndex : row  index to send as it is to onConfirm method
   * return NULL
   */

  function deleteRow(id, rowIndex) {
    setConfirmDelete(true);
    setProductRowId(rowIndex);
    setProductVariantId(id);
  }

  /*
   * Provission to delete rule from server.
   * @param
   *  id : variant ID
   *  rowIndex : row index
   * return NULL
   */
  function deleteRuleConfirm(id, rowIndex) {
    var rowModifiedVariant = [];
    setVariants((prevVariants) => {
      rowModifiedVariant = prevVariants;
      for (var i = 0; i < rowModifiedVariant.length; i++) {
        if (rowModifiedVariant[i]["id"] == id) {
          rowModifiedVariant[i]["rules"][rowIndex]["xhrDeleteLoading"] = true;
        }
      }
      return rowModifiedVariant;
    });

    setConfirmDelete(false);
    setProductVariantId("");
    setProductRowId("");
    saveAllRules();
  }

  /*
   * Hide modal form after click on cancel button.
   * @param
   * return NULL
   */
  function closeDeleteRule() {
    setConfirmDelete(false);
    setProductVariantId("");
    setProductRowId("");
  }

  /*
   * Provission to save rule on server side.
   * @param
   * return NULL
   */

  async function saveAllRules() {
    let filerVariants = {};
    let updatedProduct = {};

    for (var i = 0; i < variants.length; i++) {
      if (variants[i]["rules"].length) {
        let ruleLines = [];
        for (var rule of variants[i]["rules"]) {
          if (typeof rule !== "undefined") {
            if (rule.qty !== "" && !rule.xhrDeleteLoading) {
              ruleLines.push({
                qty: rule.qty,
                type: rule.type,
                value:
                  rule.type == "fixed"
                    ? parseFloat(rule.value).toFixed(2)
                    : parseFloat(rule.value),
              });
            }
          }
        }

        filerVariants[variants[i]["id"]] = {
          sku: variants[i]["sku"],
          name: variants[i]["title"],
          price: variants[i]["price"],
          rules: sortRule(ruleLines),
          position: variants[i]["position"],
        };
      }
    }
    updatedProduct[productId] = {
      product_id: productId,
      title: productData.title,
      image: "",
      shop: shop,
      customer_tags: "",
      variants: filerVariants,
    };

    updatedProduct[productId]["variants"] = filerVariants;

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    };

    await fetch("/api/v1/product/metafields?ids="+productId, config).then(async (res) => {
      //updateRuleGrid();
      let variantResult = await updateRuleGrid();
      setVariants(variantResult);
    })
  }

  return (
    <Page>
      <Frame>
        {!variants.length ? (
          <center>
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </center>
        ) : (
          <Card
            title={
              productData.variants[0].sku
                ? productData.title +
                  " " +
                  "(" +
                  productData.variants[0].sku +
                  ")"
                : productData.title
            }
            actions={[
              {
                content:
                  variants.length == 1
                    ? "Price: " +
                    shopData.money_format.replace('{{amount}}', productData.variants[0].price)
                    : "",
              },
            ]}
          >
            {/*
             * This Component will show validation error msg in toast.
             * @param
             *  content : validation error msg
             *  onDismiss: To handle callback after close button press
             * return UI with toast msg
             */}
            {toastMsg ? (
              <Toast
                content={toastMsgError}
                error
                onDismiss={toggleToastMsgActive}
              />
            ) : (
              ""
            )}

            {/*
             * This Component will Manage product rules.
             * In this Component we handling rules add, edit, delete, validation.
             * @param
             *  productVariants : Product default variant's data
             *  onAddNewRow: To handle callback after add new rule button press
             *  onEditRow: To handle callback after edit rule button press
             *  onUpdateRow : To handle callback after update rule button press
             *  onDeleteRow : To handle callback after delete rule button press
             *  currencyCode : Hold currency symbol to show variant price with currency code
             * return UI
             */}

            <ProductVariants
              productVariants={variants}
              onAddNewRow={addNewRow}


              
              onEditRow={editRow}
              onUpdateRow={updateRow}
              onDeleteRow={deleteRow}
              currencyCode={shopData.money_format}
            />

            {/*
             * This Component will show confirm dialog while rule delete.
             * @param
             *  isActive : to handle show and hide
             *  onConfirm: To handle callback after confirm
             *  onCancel: To handle callback after cancle
             *  rowId : Hold row ID / index and send as it is to onConfirm method
             *  variantId : Hold variant ID  and send as it is to onConfirm method
             * return UI
             */}
            <DeleteRule
              isActive={confirmDelete} //when we clicked the button delete Pop-up modal is Active
              onConfirm={deleteRuleConfirm}
              onCancel={closeDeleteRule}
              rowId={productRowId}
              variantId={productVariantId}
            />
          </Card>
        )}
      </Frame>
    </Page>
  );
}
