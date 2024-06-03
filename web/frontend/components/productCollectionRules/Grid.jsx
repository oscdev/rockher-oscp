import {
    Button,
    Tooltip,
    TextStyle,
    Icon,
    ButtonGroup,
    Toast,
    Card
  } from "@shopify/polaris"; //polaris components

  import {
    QuestionMarkInverseMinor,
  } from "@shopify/polaris-icons"; // icons used

  import { React, useState, useCallback } from "react"; //React hooks use

import { DeleteRule } from "../";

export function Grid(props) {
  const {rules, addItem, editItem, removeItem, moveItem } = props;
  const [editableIndex, setEditableIndex] = useState();
  /** Determines the Delete confirm popup appear */
  const [confirmDelete, setConfirmDelete] = useState(false);
    /** Initialize the product row data target ID*/
  const [productRowId, setProductRowId] = useState("");

  //Configuration to hold validation msg error
  const [toastMsgError, setToastMsgError] = useState(false);
  //Configuration to hold validation msg
  const [toastMsg, setToastMsg] = useState(false);

  //Configuration to handle action button in toast component
  const toggleToastMsgActive = useCallback(
    () => setToastMsg((toastMsg) => !toastMsg),
    []
  );

  function deleteRuleConfirm(id, rowIndex) {  //Display delete confirmation popup
    removeItem(rowIndex);
    setConfirmDelete(false);
    setProductRowId("");
  }
  function closeDeleteRule() {   //cancle delete rule
    setConfirmDelete(false);
    setProductRowId("");
  }
  function sortQty() { //sort quantity
	for(var i=0; i<document.getElementsByClassName("volumQty").length; i++){
		if((i+1) < document.getElementsByClassName("volumQty").length){
			if(parseInt(document.getElementsByClassName("volumQty")[i+1].innerHTML) < parseInt(document.getElementsByClassName("volumQty")[i].innerHTML)){
				moveItem(i+1, i);
				sortQty();
				break;
			}
		}
	}
  }

  function isValid(priceQty, discountType, discountValue, rowIndex) {
    //var isValid = true;
    var number = /^[0-9]+$/; // check only int value
    var double = /^\d+(\.\d{1,2})?$/; // check only int and float value

    if (!discountType) {
      // check blank field validation discountType
      setToastMsgError("Type field is mandatory");
      setToastMsg(true);
      return false;
    }

    if (!priceQty) {
      // check blank field validation quantity
      setToastMsgError("Quantity field is mandatory");
      setToastMsg(true);
      return false;
    }

    if (priceQty < 1) {
      // check quantity greater than 1
      setToastMsgError("Quantity must be greater than or equal to 1");
      setToastMsg(true);
      return false;
    }
    if (!number.test(priceQty)) {
      // check quantity is numeric
      setToastMsgError("Quantity must be integer");
      setToastMsg(true);
      return false;
    }

    for (var i = 0; i < rules.length; i++) {
      // check duplicate quantity
       if ((rules[i]['qty']['value'] === priceQty) && rowIndex !==i ) {
		setToastMsgError("Quantity " + priceQty + " already exists");
		setToastMsg(true);
		return false;
       }
     }

    if (!discountValue) {
      // check blank field validation discountType
      setToastMsgError("Value field is mandatory");
      setToastMsg(true);
      return false;
    }

    if (!double.test(discountValue)) {
      // check price is double
      setToastMsgError("Value must be integer");
      setToastMsg(true);
      return false;
    }

    if ((discountValue*100) <= 0) {
      // check discountValue greater than 0
      setToastMsgError("Value must be greater than 0");
      setToastMsg(true);
      return false;
    }

    if (discountType == "percent" && discountValue > 100) {
      // Discount value must be less than 100
      setToastMsgError("Discount value must be less than 100");
      setToastMsg(true);
      return false;
    }

    return true;
  }
  return (
    <Card  title="Offer Details">
            <Card.Section>
            <div className='priceRowHeader'>
            <div className="Polaris-IndexTable-ScrollContainer">
              <table
                className="Polaris-IndexTable__Table Polaris-IndexTable--tableStickyLast CustomTable"
                border="0"
              >
                <thead className="CustomHeader">
                  <tr>
                    <th
                      className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric Polaris-DataTable--separate"
                      data-index-table-heading="true"
                    >
                      <Tooltip content="Minimum Quantity to apply Custom Price.">
                        <TextStyle variation="strong">
                          Quantity
                          <Icon
                            source={QuestionMarkInverseMinor}
                            color="base"
                          />
                        </TextStyle>
                      </Tooltip>
                    </th>
                    <th
                      className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate"
                      data-index-table-heading="true"
                    >
                      <Tooltip content="Select a fixed-price discount or a percentage off.">
                        {" "}
                        <TextStyle variation="strong">
                          Discount Type
                          <Icon
                            source={QuestionMarkInverseMinor}
                            color="base"
                          />
                        </TextStyle>
                      </Tooltip>
                    </th>
                    <th
                      className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable__Cell--numeric Polaris-DataTable--separate"
                      data-index-table-heading="true"
                    >
                      <Tooltip content="Set the discount to a Final price or a percentage off.">
                        <TextStyle variation="strong">
                        Value
                          <Icon
                            source={QuestionMarkInverseMinor}
                            color="base"
                          />
                        </TextStyle>
                      </Tooltip>
                    </th>
                    <th
                      className="Polaris-DataTable__Cell customAction Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--header Polaris-DataTable--separate"
                      data-index-table-heading="true"
                    >
                      <TextStyle variation="strong">Actions</TextStyle>
                    </th>
                  </tr>
                </thead>
                <tbody className=" CustomBody">
                  {rules.map(
                    (
                      {
                        qty,
                        type,
                        value,
                        editable
                      },
                      index
                    ) => {
                      return (
                        <>
                          <tr className="Polaris-IndexTable__TableRow priceRow">
                            <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">
                              {editableIndex == index ? (
                                <input
                                  defaultValue={qty.value}
                                  type="text"
                                  autoComplete="off"
                                  className="inputQty"
                                />
                              ) : (
                                <span className="volumQty">{qty.value}</span>
                              )}
                            </td>
                            <td className="Polaris-IndexTable__TableCell">
                              {editableIndex == index ? (
                                <select
                                  placeholder="Select"
                                  defaultValue={type.value}
                                  className="selectType"
                                >
                                  <option value="fixed">Fixed Price</option>
                                  <option value="percent">Percent OFF</option>
                                </select>
                              ) : (
                                <span>
                                  {type.value == "fixed"
                                    ? "Fixed Price"
                                    : "Percent OFF"}
                                </span>
                              )}
                            </td>
                            <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">
                              {editableIndex == index ? (
                                <input
                                  defaultValue={value.value}
                                  type="text"
                                  autoComplete="off"
                                  className="inputValue"
                                />
                              ) : (
                                <span>{value.value}</span>
                              )}
                            </td>

                            <td className="Polaris-IndexTable__TableCell">
                              {editableIndex == index ? (
                                <ButtonGroup fullWidth={true}>
                                  <span
                                    row-id={index}
                                    className="rowIndex"
                                    onClick={(e) => {
                                      let priceQty = e.target
                                        .closest(".priceRow")
                                        .getElementsByClassName(
                                          "inputQty"
                                        )[0].value;
                                      let discountType = e.target
                                        .closest(".priceRow")
                                        .getElementsByClassName(
                                          "selectType"
                                        )[0].value;
                                      let discountValue = e.target
                                        .closest(".priceRow")
                                        .getElementsByClassName(
                                          "inputValue"
                                        )[0].value;

                                      if (isValid(priceQty, discountType, discountValue, index)) {
                                        removeItem(index);
                                        addItem({
                                          qty: priceQty,
                                          type: discountType,
                                          value: discountValue,
                                          editable: false
                                        });


										setTimeout(function(){
											sortQty();
										}, 1000);


                                        setEditableIndex(null);
                                      }


                                      //editItem({editable: false}, index)
                                      //editable.value = false;
                                      //value.value = discountValue;
                                      //editable.onChange()
                                      //value.onChange()
                                    }}
                                  >
                                    <Button>
                                      Save
                                    </Button>
                                  </span>
                                </ButtonGroup>
                              ) : (
                                <ButtonGroup fullWidth={true}>
                                  <span row-id={index} className="rowIndex">
                                    <Button
                                      onClick={(event) => {
                                        setEditableIndex(index);
                                      }}
                                    >
                                      Edit{/* Icon use for Edit data */}
                                    </Button>
                                  </span>
                                  {/* Icon use for Delete data */}
                                  <span className="rowIndex" row-id={index}>
                                    <Button
                                      className="test"
                                      onClick={(event) => {
                                        setConfirmDelete(true);
                                        setProductRowId(index);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </span>
                                </ButtonGroup>
                              )}
                            </td>
                          </tr>
                        </>
                      );
                    }
                  )}

                  <tr className="Polaris-IndexTable__TableRow priceRow">
                    <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">
                      <input
                        defaultValue=""
                        type="text"
                        autoComplete="off"
                        className="inputQty"
                      />
                    </td>
                    <td className="Polaris-IndexTable__TableCell">
                      <select
                        placeholder="Select"
                        defaultValue="percent"
                        className="selectType"
                      >
                        <option value="fixed">Fixed Price</option>
                        <option value="percent">Percent OFF</option>
                      </select>
                    </td>
                    <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--numeric">
                      <input
                        defaultValue=""
                        type="text"
                        autoComplete="off"
                        className="inputValue"
                      />
                    </td>

                    <td className="Polaris-IndexTable__TableCell">
                      <ButtonGroup fullWidth={true}>
                        <span
                          className="rowIndex"
                          onClick={(e) => {
                            let priceQty = e.target
                              .closest(".priceRow")
                              .getElementsByClassName("inputQty")[0];
                            let discountType = e.target
                              .closest(".priceRow")
                              .getElementsByClassName("selectType")[0];
                            let discountValue = e.target
                              .closest(".priceRow")
                              .getElementsByClassName("inputValue")[0];

                            if (isValid(priceQty.value, discountType.value, discountValue.value, null)) {
                              addItem({
                                qty: priceQty.value,
                                type: discountType.value,
                                value: discountValue.value,
                                editable: false
                              });
                              priceQty.value = "";
                              discountType.value = "percent";
                              discountValue.value = "";
							  setEditableIndex(null);
							  setTimeout(function(){
								sortQty();
							  }, 1000);
                            }
                          }}
                        >
                          <Button loading={false}>Add New</Button>
                        </span>
                      </ButtonGroup>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
            </Card.Section>
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
          </Card>

  )
}