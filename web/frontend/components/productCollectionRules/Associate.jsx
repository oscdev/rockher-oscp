import { React, useState, useCallback } from "react"; //React hooks use
import { ButtonGroup, Button, Card, ChoiceList, ResourceList, ResourceItem, Avatar, Checkbox, Tag, Stack, Popover, ActionList, CalloutCard } from "@shopify/polaris"; //polaris components



import { ResourcePicker } from "@shopify/app-bridge-react";
import { Confirm } from "../";

export function Associate(props) {


  const { products, addProducts, editProducts, removeProducts, collections, addCollections, editCollections, removeCollections} = props;

  const [active, setActive] = useState(false);


  const handleResourcePickerClose = useCallback(() => setActive(false), []);

  const [activePop, setActivePop] = useState(false);
  const [resource, setReource] = useState('Product');
  const [filterResourceStr, setFilterResourceStr] = useState([]);

  const startPopover = useCallback(
    () => setActivePop((activePop) => !activePop),
    []
  );

  function setreource(type){
    const filterObj = [];
	if(type == 'Collection'){
		for(var i=0; i<collections.length; i++){
			var gqId = ''+collections[i].id.value;
			gqId = gqId.split('/');
			gqId = gqId[gqId.length-1];
			filterObj.push('NOT '+gqId);
		  }
		  setFilterResourceStr(filterObj);
	}else{
		for(var i=0; i<products.length; i++){
			var gqId = ''+products[i].id.value;
			gqId = gqId.split('/');
			gqId = gqId[gqId.length-1];
			filterObj.push('NOT '+gqId);
		  }
		  setFilterResourceStr(filterObj);
	}


    setActivePop(false);
    setReource(type);
    setActive(true);
  }

  const handleCollectionSelection = useCallback(
    (pickedResource) => {

        for (var i = 0; i < pickedResource.selection.length; i++) {
          var gqId = pickedResource.selection[i].id.split('/');
          gqId = gqId[gqId.length-1];

          addCollections({
            id: gqId,
            title: pickedResource.selection[i].title
          });
        }

      handleResourcePickerClose();
    },
    [handleResourcePickerClose]
  );

  const handleProductSelection = useCallback(
    (pickedResource) => {
        for (var i = 0; i < pickedResource.selection.length; i++) {
          var gqId = pickedResource.selection[i].id.split('/');
          gqId = gqId[gqId.length-1];

          addProducts({
            id: gqId,
            title: pickedResource.selection[i].title
          });
        }


      handleResourcePickerClose();
    },
    [handleResourcePickerClose]
  );

  const [isProductRemove, setIsProductRemove] = useState(false);
  const [isCollectionRemove, setCollectionRemove] = useState(false);
  const [confirmMsg, setIsConfirmMsg] = useState('');
  const [productIndex, setProductIndex] = useState();
  const [collectionIndex, setCollectionIndex] = useState();

  function removeResorce(index, title, type){
    setIsConfirmMsg('Are you sure you want to remove '+title)
    if(type == 'product'){
      setIsProductRemove(true);
      setProductIndex(index)
    }else{
      setCollectionRemove(true);
      setCollectionIndex(index)
    }

  }

  function onConfirmProductRemove(index){
    removeProducts(index)
    setIsProductRemove(false);
  }

  function onConfirmCollectionRemove(index){
    removeCollections(index)
    setCollectionRemove(false);
  }

  function onCancelRemove(){
    setIsProductRemove(false);
    setCollectionRemove(false);
  }




  return (
    <>

      <Card title="Apply Discount To" actions={[{content:
       <>
        {((collections.length) || (products.length)) ? <Popover
        active={activePop}
        activator={
            <Button
                onClick={startPopover}
                disclosure
            >
                + Add More
            </Button>
        }
        onClose={startPopover}
        >

       <ActionList items={[
        {content: 'As Product', onAction: (e) => {setreource('Product')}},
        {content: 'As Collection', onAction: (e) => { setreource('Collection') }}
                      ]} />
     </Popover> : ''}
       </>
      }]}>
        <Card.Section>


         {((collections.length) || (products.length)) ?

         <div className="Polaris-IndexTable-ScrollContainer">
            <table className="Polaris-IndexTable__Table Polaris-IndexTable--tableStickyLast CustomTable" border="0">
                <tbody className=' CustomBody'>
                {(products.length) ?
                <tr className='Polaris-IndexTable__TableRow priceRow'>
                  <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                  Selected Products</td>
                  <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                      <Stack spacing="tight">
                          {products.map(({ id, title}, index) => {
                              return (
                                  <Tag key={title.value} onRemove={(e) => {
                                    removeResorce(index, title.value, 'product')
                                    //removeProducts(index)
                                  }} >
                                      {title.value}
                                  </Tag>
                              );
                          })}
                      </Stack>
                  </td>
              </tr> : ''}

              {(collections.length) ?
              <tr className='Polaris-IndexTable__TableRow priceRow'>
                  <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                  Selected Collections</td>
                  <td className="Polaris-DataTable__Cell Polaris-DataTable__Cell--verticalAlignTop Polaris-DataTable__Cell--firstColumn Polaris-DataTable__Cell--total">
                      <Stack spacing="tight">
                          {collections.map(({ id, title}, index) => {
                              return (
                                  <Tag key={title.value} onRemove={(e) => {
                                    removeResorce(index, title.value, 'collection')
                                    //removeCollections(index)
                                  }} >
                                      {title.value}
                                  </Tag>
                              );
                          })}
                      </Stack>
                  </td>
              </tr> : ''}



		        </tbody>
            </table>
          </div>
          : <CalloutCard
          illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
          primaryAction={{content: <ButtonGroup>
            <Button onClick={(e) => {setreource('Product')}} primary>
              Select Product(s)
            </Button>
            <Button onClick={(e) => {setreource('Collection')}} primary>
              Select Collection(s)
            </Button>
            </ButtonGroup>}}
        >
          <p>Selected Products and Collections will have tiered pricing defined above..</p>
        </CalloutCard>}

          <>


          </>
        </Card.Section>
      </Card>

      <ResourcePicker
        // actionVerb={ResourcePicker.ActionVerb.select}
        resourceType={resource}
        showVariants={false}
        allowMultiple={true}
        open={active}
        onSelection={(resource == 'Product') ? handleProductSelection : handleCollectionSelection}
        onCancel={handleResourcePickerClose}
        initialQuery={filterResourceStr.join(' AND ')}
        // enctype="multipart/form-data"
      />

        <Confirm
          isConfirm={isProductRemove}
          confirmMsg={confirmMsg}
          onConfirm={onConfirmProductRemove}
          onCancel={onCancelRemove}
          returnData={productIndex}
        />
        <Confirm
          isConfirm={isCollectionRemove}
          confirmMsg={confirmMsg}
          onConfirm={onConfirmCollectionRemove}
          onCancel={onCancelRemove}
          returnData={collectionIndex}
        />

    </>
  );
}