import {React, useEffect} from 'react'
import { 
  Button, 
  ButtonGroup
} from "@shopify/polaris";

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

export function PriceGrid(gridProp) {
    const { id, rules, onEditRow, onUpdateRow, onDeleteRow } = gridProp; 
    
    //const [xhrLoading, setXhrLoading] = useState(false);

    useEffect(() => {
      //setXhrLoading(false)
    }, [rules]);
    /**
     * Event handling while edit rule
     * @param  
     *  e : Targeted element 
     *  id : Variant id
     *  rowIndex : row index
     * return Trigger
    */
    function editRow(e, id, rowIndex) {   
      onEditRow(id, rowIndex)
    }
    
    /**
     * Event handling while update rule
     * @param  
     *  event : Targeted element 
     *  id : Variant id
     *  rowIndex : row index
     * return Trigger
    */
    function updateRow(event, id, rowIndex) { 
      //setXhrLoading(true)
      onUpdateRow(event, id, rowIndex)
    }

    /**
     * Event handling while delete rule
     * @param 
     *  e : Targeted element 
     *  id : Variant id
     *  rowIndex : row index
     * return Trigger
    */
  
    function deleteRow(e, id, rowIndex) {   
      onDeleteRow(id, rowIndex)
    }

    function qtyChange(e) {   
      ///
    }
    
    return ( 
      <>
      
          {
            rules.map(
              ({qty, type, value, editable, xhrLoading, xhrDeleteLoading}, index) => {
                return (
                  <tr className="Polaris-IndexTable__TableRow priceRow">
                    <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">
                    
                      {editable
                        ? <input
                        defaultValue={qty}                      
                        type="text"                  
                        autoComplete="off"  
                        className='inputQty' 
                      />
                        : <span>{qty}</span>
                      }
                    </td>
                    <td className="Polaris-IndexTable__TableCell">
                      {editable
                          ? <select
                              placeholder="Select"                        
                              defaultValue={type}
                              className="selectType"
                            > 
                              <option value="percent">Percent OFF</option>
                              <option value="fixed">Fixed Price</option>
                            </select>                    
                          : <span>{(type == 'fixed') ? 'Fixed Price' : 'Percent OFF'}</span>
                      }
                      
                    </td>
                    <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">
                      {editable
                          ? <input
                          defaultValue={value}                      
                          type="text" 
                          autoComplete="off"    
                          className='inputValue'  
                        />
                          : <span>{value}</span>
                      }
                    </td>
    
                    <td className="Polaris-IndexTable__TableCell">
                      {editable
                          ? 
                          <ButtonGroup fullWidth={true}>
                            <span row-id={index} className="rowIndex" onClick={(e) => {                            
                                  updateRow(e, id, index);
                              }}>
                              <Button                          
                                loading={xhrLoading}
                             
                              >                          
                                Save
                              </Button>
                            </span>                      
                          </ButtonGroup>
                          : 
                          <ButtonGroup fullWidth={true}>
                            <span row-id={index} className="rowIndex">
                              <Button onClick={event => editRow(event, id, index)} >
                                Edit{/* Icon use for Edit data */}                          
                              </Button>
                            </span>
                            {/* Icon use for Delete data */}
                            <span className="rowIndex" row-id={index}>
                              <Button className="test" onClick={event => deleteRow(event, id, index)} loading={xhrDeleteLoading} >
                                Delete
                              </Button>
                            </span>
                          </ButtonGroup>
                      }                
                    </td>
                  </tr>         
                );
              }
            )
          }                   
      </>            
    );
}         
