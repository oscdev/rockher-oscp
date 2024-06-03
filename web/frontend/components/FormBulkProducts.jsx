import { React, useState, useCallback } from "react";
import {  TextField, Button, Icon,Tooltip, TextStyle, Toast, Select, SkeletonBodyText, InlineError, Loading, Spinner, Badge } from '@shopify/polaris';
import {  QuestionMarkInverseMinor } from "@shopify/polaris-icons";
import { DeleteRule } from "./"
export function FormBulkProducts(props) {
    const {rules, storeCurrencies, defaultCurrency, currencyFormat, addItem, editItem, removeItem, moveItem } = props;
    //Configuration to handle error message in toast component
    const [toastMsg, setToastMsg] = useState(false);
  /** Determines the Delete confirm popup appear */
  const [confirmDelete, setConfirmDelete] = useState(false);
    /** Initialize the product row data target ID*/
  const [productRowId, setProductRowId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const numRows = 3; // Number of rows
  const numCols = 6; // Number of columns
    const skeletonRows = Array.from({ length: numRows }, (_, rowIndex) => (
      <>
      <tr className="skeletonrow" key={rowIndex}>
          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total" colSpan="6"><SkeletonBodyText lines={1} />
                        <span className="price" style={{ float: 'right' }}><SkeletonBodyText lines={1} /></span> </td> 
      </tr>
      <tr className="skeletonrow" key={rowIndex}>
        
        {Array.from({ length: numCols }, (_, colIndex) => (
          <td key={colIndex}>
            <SkeletonBodyText lines={1} />
          </td>
        ))}  
      </tr><tr className="skeletonrow" key={rowIndex}>
        
        {Array.from({ length: numCols }, (_, colIndex) => (
          <td key={colIndex}>
            <SkeletonBodyText lines={1} />
          </td>
        ))}  
      </tr><tr className="skeletonrow" key={rowIndex}>
        
        {Array.from({ length: numCols }, (_, colIndex) => (
          <td key={colIndex}>
            <SkeletonBodyText lines={1} />
          </td>
        ))}  
      </tr><tr className="skeletonrow" key={rowIndex}>
        
        {Array.from({ length: numCols }, (_, colIndex) => (
          <td key={colIndex}>
            <SkeletonBodyText lines={1} />
          </td>
        ))}  
      </tr><tr className="skeletonrow" key={rowIndex}>
          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total" colSpan="6"><br/> </td> 
      </tr></>
    ));
    
    function deleteRuleConfirm(id, rowIndex) {  //Display delete confirmation popup

      removeItem(rowIndex);
      setConfirmDelete(false);
      setProductRowId("");
    }
    function closeDeleteRule() {   //cancle delete rule
      setConfirmDelete(false);
      setProductRowId("");
    }

    //Configuration to handle action button in toast component
    const toggleToastMsgActive = useCallback(
      () => setToastMsg((toastMsg) => !toastMsg),
      []
    );
      //Configuration to hold validation msg
    const [toastMsgError, setToastMsgError] = useState(false);

    let number = /^[0-9]+$/; // check only int value
    let double = /^\d+(\.\d{1,2})?$/; // check only int and float value
    function notValidQty(index, qty, customer, variantId){
      //console.log('sssss', index + ' ' + qty + ' ' + customer + ' ' + variantId)
      let notValidate = false;
      for (let i = 0; i < rules.length; i++) {
        if(index !== i){
          if((rules[i].qty.value !== '') && (rules[i].qty.value == qty) && (rules[i].customer.value == customer) && (rules[i].variantId.value == variantId)){
            notValidate = true
          }
        }
      }
      return notValidate;
    } 

    return (
      <>
         {rules.length === 0 ? (
        <>
          <Toast
            content="Due to large data, it might take several minutes for loading."
            onDismiss={() => setShowToast(false)}
          />
          <Loading />
        </>
      ) : null}
        <div className='bulkEditForm'>
        <table className="Polaris-IndexTable__Table Polaris-IndexTable--tableStickyLast CustomTable" border="0"> 
        <thead className='CustomHeader'>
            <tr>             
              <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate"><Tooltip content="Tag assigned to each individual customer. The default value for customers who do not have a tag is 'All.'"><TextStyle variation="strong">Customer Tag<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle></Tooltip></th>
              {/* <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate"><Tooltip content="Currency in which you wish to link the rule."><TextStyle variation="strong">Currency Code<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle></Tooltip></th> */}
              <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric Polaris-DataTable--separate" data-index-table-heading="true"><Tooltip content="Minimum Quantity to apply Custom Price."><TextStyle variation="strong">Quantity<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle>
              </Tooltip></th>
              <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate" data-index-table-heading="true"><Tooltip content="Select a fixed-price discount or a percentage off.">  <TextStyle variation="strong">Discount<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle>
              </Tooltip></th>
              <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric Polaris-DataTable--separate" data-index-table-heading="true">
                <Tooltip content="Set the discount to a Final price or a percentage off.">
                  <TextStyle variation="strong">Value<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle>
                </Tooltip>
              </th>
              <th className="Polaris-DataTable__Cell customAction Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate" data-index-table-heading="true"><TextStyle variation="strong">Status</TextStyle></th>
            </tr>
          </thead>               
          <tbody className=' CustomBody'>
          {(!rules.length) ? (skeletonRows) : ""}
            {
              rules.map(
                ({ ruleIndex, status, rowType, productType, productId, productTitle, variantId, varianName, sku, price, ruleId, qty, type, value, uniqueRuleIdentifier, customer, currency }, index) => {                
                  return (
                    
                    <>
                      {(index == 0) ? <tr> 
                          <td colspan="4" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">{rules[index].productTitle.value} {rules[index].varianName.value === "Default Title" ? '' : `(${rules[index].varianName.value})`}</td>
                          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total"><span style={{ textAlign: 'right', right: '40px', position: 'absolute' }} class="Polaris-Text--root Polaris-Text--block Polaris-Text--end Polaris-Text--numeric">{currencyFormat.replace('{{amount}}', rules[index].price.value)} </span></td>
                        </tr> : ''}
                      {(rowType.value == 'data') ? <tr className='priceRow'>                        
                      <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                      <div className='customInput'>
                        <TextField
                            value={customer.value}
                            onChange={customer.onChange}
                            error={(customer.value == '') ? true : false}
                            autoComplete="off"
                            disabled={(status.value == 'disable') ? true : false}
                            placeholder="Customer Tag"
                        />  
                        {(customer.value == '') ? <InlineError message="Customer Tag is required" fieldID="myFieldID" /> : ''}                    
                        </div>
                        </td>
                        {/*<td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                         <TextField
                            value={defaultCurrency}
                            onChange={currency.onChange}
                            disabled={true}
                        /> 
                             <select
                                  placeholder="Select"
                                  defaultValue={(currency.value) ? currency.value : defaultCurrency}
                                  onChange={currency.onChange}
                                  className="inputCurrencyCode"
                                  disabled={(status.value == 'disable') ? true : false}
                                >
                                  {storeCurrencies.map((currencyOption) => (
                                  <option key={currencyOption} value={currencyOption}>
                                    {currencyOption}
                                  </option>
                                ))}
                                </select> 
                        </td>*/}
                        <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                        <div className='customInput'>
                        <TextField
                            value={qty.value}
                            onChange={qty.onChange}
                            error={(qty.value == '') ? true : false}
                            autoComplete="off"
                            disabled={(status.value == 'disable') ? true : false}
                            placeholder="Quantity"
                        />
                        {notValidQty(index, qty.value, customer.value, variantId.value) ? <InlineError message={(varianName.value === "Default Title") ? `${productTitle.value} have duplicate quantity for customer tag "${customer.value}"` : `${productTitle.value} (${varianName.value}) have duplicate quantity for customer tag "${customer.value}"`} fieldID="myFieldID" /> : (qty.value == '') ? <InlineError message="Quantity is required" fieldID="myFieldID" /> : (!number.test(qty.value)) ? <InlineError message="Quantity must be integer" fieldID="myFieldID" /> : (qty.value < 1) ? <InlineError message="Quantity must be greater than or equal to 1" fieldID="myFieldID" /> : ''}                       
                        </div>
                        </td>
                        <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                           <select
                                  placeholder="Select"
                                  defaultValue={type.value}
                                  className="customType"
                                  onChange={type.onChange}
                                  disabled={(status.value == 'disable') ? true : false}
                                >
                                  <option value="fixed">Fixed Price</option>
                                  <option value="percent">Percent OFF</option>
                                </select>
                        </td>
                        <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                        <div className='customInput'>
                        <TextField
                            value={value.value}
                            onChange={value.onChange}
                            error={(value.value == '') ? true : false}
                            autoComplete="off"
                            disabled={(status.value == 'disable') ? true : false}
                            placeholder="Price Value"
                        />
                      {(value.value == '') ? <InlineError message="Value is required" fieldID="myFieldID" /> : (!double.test(value.value)) ? <InlineError message="Value must be integer" fieldID="myFieldID" /> : (type.value == "percent" && value.value > 100) ? <InlineError message="Discount value must be less than 100" fieldID="myFieldID" /> : ((value.value*100) <= 0) ? <InlineError message="Value must be greater than 0" fieldID="myFieldID" /> : ''}
                        </div>
                        </td>
                        <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                          {(status.value == 'disable') ? <Button variant="tertiary" fullWidth onClick={(event) => {
                              status.onChange('')
                          }}> <Badge status={(status.value == 'disable') ? 'success' : ''}>{((status.value == 'disable')) ? 'Enable' : 'Disable'}</Badge></Button> : <Button variant="plain" fullWidth onClick={(event) => {
                            status.onChange('disable')
                        }}> <Badge status={(status.value == 'disable') ? 'success' : ''}>{((status.value == 'disable')) ? 'Enable' : 'Disable'}</Badge></Button>}
                       
                        </td>
                      </tr> : <>
                      {(ruleIndex.value <= 20) ? <tr className='priceRow'>
                       <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                          <input
                              name="ruleCustomer"
                              className="inputCustomer"
                              autoComplete="off"
                              placeholder="Customer Tag"
                          />
                          </td>
                          {/*<td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                          <input
                              name="ruleCurrency"
                              value={defaultCurrency}
                              className="inputCurrencyCode"
                              disabled={true}
                          />                                               
                             <select
                                  placeholder="Select"
                                  defaultValue={(currency.value) ? currency.value : defaultCurrency}
                                  onChange={currency.onChange}
                                  className="inputCurrencyCode"
                                >
                                  {storeCurrencies.map((currencyOption) => (
                                  <option key={currencyOption} value={currencyOption}>
                                    {currencyOption}
                                  </option>
                                ))}
                                </select> 
                          </td>*/}
                          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                          <input
                              name="ruleQty"
                              className="customQty"
                              autoComplete="off"
                              placeholder="Quantity"
                          />
                          </td>
                          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">                 
                                  <select
                                    placeholder="Select"
                                    defaultValue={type.value}
                                    className="customType"
                                  >
                                    <option value="fixed">Fixed Price</option>
                                    <option value="percent">Percent OFF</option>
                                  </select>
                          </td>
                          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                          <input
                            name="ruleValue"
                            className="customValue"
                            autoComplete="off"
                            placeholder="Price Value"
                          />
                          </td>
                          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total"> 
                           <Button
                              onClick={(e) => {
                                //if(isValidRule(e)){
                                  let priceQty = e.target.closest(".priceRow").getElementsByClassName("customQty")[0].value;
                                  let discountType = e.target.closest(".priceRow").getElementsByClassName("customType")[0].value;
                                  let discountValue = e.target.closest(".priceRow").getElementsByClassName("customValue")[0].value;
                                  let customer = e.target.closest(".priceRow").getElementsByClassName("inputCustomer")[0].value;
                                  //let currencyCode = e.target.closest(".priceRow").getElementsByClassName("inputCurrencyCode")[0].value;
                                  let currencyCode = defaultCurrency;                                  
                                 
                                  addItem({
                                    ruleIndex: ruleIndex.value,
                                    rowType: 'data',
                                    productId : productId.value,
                                    productTitle: productTitle.value,
                                    variantId: variantId.value,
                                    varianName: varianName.value,
                                    sku: sku.value,
                                    price: price.value,
                                    ruleId: ruleId.value,
                                    qty: priceQty,
                                    type: discountType,
                                    value: discountValue,
                                    uniqueRuleIdentifier: '',
                                    customer: (customer == '') ? 'All' : customer,
                                    currency: currencyCode
                                  })

                                  //ruleIndex.value = ruleIndex.value + 1;
                                  ruleIndex.onChange(ruleIndex.value + 1)

                                  //editItem({ruleIndex: ruleIndex.value + 1}, index)

                                  moveItem(rules.length, index)
                                //}                            
                            }}
                            fullWidth
                            >Add</Button> 
                          </td>
                        </tr>  : ''}  
                                        
                        {((index+1) < rules.length) ? <tr>                           
                          <td colSpan="4" className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">{rules[index+1].productTitle.value} {rules[index+1].varianName.value === "Default Title" ? '' : `(${rules[index+1].varianName.value})`}</td>
                          <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total"><span style={{ textAlign: 'right', right: '40px', position: 'absolute' }} class="Polaris-Text--root Polaris-Text--block Polaris-Text--end Polaris-Text--numeric">{currencyFormat.replace('{{amount}}', rules[index+1].price.value)}</span></td> 
                        </tr> : ''}
                        </> }
                      
                    </>
                  );
                }
              )
            }
          </tbody>
        </table>
        </div>
        <DeleteRule
                isActive={confirmDelete} //when we clicked the button delete Pop-up modal is Active
                onConfirm={deleteRuleConfirm}
                onCancel={closeDeleteRule}
                rowId={productRowId}
              />
        {toastMsg ? (
                <Toast
                  content={toastMsgError}
                  error
                  onDismiss={toggleToastMsgActive}
                />
              ) : (
                ""
              )}
      </>
    );
  }
