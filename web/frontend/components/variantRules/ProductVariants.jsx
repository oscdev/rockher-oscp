import React from 'react'
import {
  Tooltip, TextStyle, Icon
} from "@shopify/polaris";
import { QuestionMarkInverseMinor } from "@shopify/polaris-icons";
import { PriceGrid } from ".."; //component call table data
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

export function ProductVariants(variants) {
  const { productVariants, onAddNewRow, onEditRow, onUpdateRow, onDeleteRow, currencyCode } = variants;   //Elements call from product rule component

  /**
   * Event handling while add rule
   * @param 
   *  e : Targeted element
   *  id : Variant id
   * return Trigger
  */

  function addNewRow(e, id) {
    onAddNewRow(id)
  }

  /**
   * Event handling while edit rule
   * @param  
   *  id : Variant id
   *  rowIndex : row index
   * return Trigger
  */

  function editRow(id, rowIndex) {
    onEditRow(id, rowIndex)
  }

  /**
   * Event handling while update rule
   * @param  
   *  e : Targeted element 
   *  id : Variant id
   *  rowIndex : row index
   * return Trigger
  */

  function updateRow(e, id, rowIndex) {    
    onUpdateRow(e, id, rowIndex)
  }

  /**
   * Event handling while delete rule
   * @param 
   *  id : Variant id
   *  rowIndex : row index
   * return Trigger
  */
  function deleteRow(id, rowIndex) {
    onDeleteRow(id, rowIndex)
  }

  return (
    <>
      <div className='priceRowHeader'>
      <div className="Polaris-IndexTable-ScrollContainer">
        <table className="Polaris-IndexTable__Table Polaris-IndexTable--tableStickyLast CustomTable" border="0">
          <thead className='CustomHeader'>
            <tr>
              <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric Polaris-DataTable--separate" data-index-table-heading="true"><Tooltip content="Minimum Quantity to apply Custom Price."><TextStyle variation="strong">Quantity<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle>
              </Tooltip></th>
              <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate" data-index-table-heading="true"><Tooltip content="Select a fixed-price discount or a percentage off.">  <TextStyle variation="strong">Discount<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle>
              </Tooltip></th>
              <th className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric Polaris-DataTable--separate" data-index-table-heading="true">
                <Tooltip content="Set the discount to a Final price or a percentage off.">
                  <TextStyle variation="strong">Value<Icon source={QuestionMarkInverseMinor} color="base" /></TextStyle>
                </Tooltip>
              </th>
              <th className="Polaris-DataTable__Cell customAction Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate" data-index-table-heading="true"><TextStyle variation="strong">Actions</TextStyle></th>
            </tr>
          </thead>
          <tbody className=' CustomBody'>
            {
              productVariants.map(
                ({ id, price, title, sku, position, rules }, index) => {
                  return (
                    <>
                      {(productVariants.length > 1) ? <tr className='Polaris-IndexTable__TableRow priceRow'>
                        <td colSpan={4} className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                          {(sku) ? title + " " + "(" + sku + ")" : title} <span style={{ float: 'right' }}>{currencyCode.replace('{{amount}}', price)}</span>
                        </td>
                      </tr> : ''}

                      {/*
                      * This Component will show price grid of each variant.
                      * @param  
                        *  id : Variant id
                        *  rules: Product's default rule data
                        *  onEditRow: To handle callback after edit rule button press
                        *  onUpdateRow : To handle callback after update rule button press
                        *  onDeleteRow : To handle callback after delete rule button press
                      * return UI
                    */}

                      <PriceGrid
                        id={id}
                        /*rules={ (rules.length) ? rules : [{qty: '', type: '', value: '', editable: true}]}*/
                        rules={rules}
                        onEditRow={editRow}
                        onUpdateRow={updateRow}
                        onDeleteRow={deleteRow}
                      />
                    </>
                  );
                }
              )
            }
          </tbody>
        </table>
      </div>
      </div>
    </>

  )
}