import React from 'react'
import { Modal} from "@shopify/polaris";

export function DeleteRule(props) {
  //Variables performing onClick Actions
  const { isActive, onConfirm, rowId, variantId, onCancel} = props;//Elements call from product rule component
  const toggleActive = onCancel;

  function deleteRule() {
    onConfirm(variantId, rowId);
  }
  return (
    //Onclick delete button open modal for confirmation dialog box
    <Modal
      open={isActive}
      onClose={toggleActive}
      small      
      title="Are you sure you want to delete"
      primaryAction={{
        content: "Confirm",
        destructive: true,
        onAction: deleteRule, //on click confirm button Id deleted
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onCancel,  //on click cancel button back to the same page
        },
      ]}
    ></Modal>
  )
}
