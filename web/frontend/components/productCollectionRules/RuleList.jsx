import { React, useState, useCallback, useEffect} from "react"; //React hooks use
import {
  Card,
  Page,
  ButtonGroup,
  Button,
  Icon,
  Tooltip, Frame, Loading, Badge
} from "@shopify/polaris"; //polaris components

import { DragHandleMinor, ViewMinor, EditMinor, DeleteMinor, SortMinor, HideMinor } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Confirm } from "../";

export function RuleList(props) {
	const { rules, onShowForm, onChangeOrder, onActiveOffer, onDeleteOffer, onBulkAction, onBack, loading} = props;
	//Determines the delete offer
	const [isDeleteOffer, setIsDeleteOffer] = useState(false);
	//Determines the offer index
	const [offerIndex, setOfferIndex] = useState();

	function onCancelRemove(){
		setIsDeleteOffer(false);
	}

	function onConfirm(index){
		onDeleteOffer(index);
		setIsDeleteOffer(false);
	}

  /** */
	// a little function to help us with reordering the result
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};


	const getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: "none",

		// change background colour if dragging
		background: isDragging ? "lightgreen" : "",

		// styles we need to apply on draggables
		...draggableStyle
	});


	function onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
		  return;
		}

		onChangeOrder(result.source.index, result.destination.index)

		/*const items = reorder(
		  this.state.items,
		  result.source.index,
		  result.destination.index
		);

		this.setState({
		  items
		});*/
	  }
	/** */


  //Because IndexTable must have unique id with each row
  for(var i=0; i<rules.length; i++ ){
    rules[i].id = ""+i;
  }

  function confirmDeleteOffer(index){

  }

  function List() {
	const [items, setItems] = useState(rules);
	return (
	  <DragDropContext onDragEnd={onDragEnd}>
		<Droppable droppableId="root">
		  {(provided, snapshot) => {
			return (
				<div className='customTable'>
				<div className="Polaris-IndexTable"><div className="Polaris-IndexTable-ScrollContainer Polaris-IndexTable__Table">
					<table style={{width: '100%'}}
					ref={provided.innerRef}
				>
					<thead>
					<tr>
						<th className="Polaris-IndexTable__TableCell"><Icon source={SortMinor} color="base" /></th>
						<th className="Polaris-IndexTable__TableCell" style={{textAlign:'justify',color:'var(--p-text)',fontSize:'revert',paddingLeft: '0'}} >Offer Name</th>
						<th className="Polaris-IndexTable__TableCell">Offer Type</th>
						<th className="Polaris-IndexTable__TableCell">Customer Group</th>
						<th className="Polaris-IndexTable__TableCell" style={{width : '180px'}}>Action</th>
					</tr>
					</thead>
					<tbody>
					{items.map((item, index) => (
						<Draggable key={item.id} draggableId={item.id} index={index}>
							{(provided, snapshot) => (
							<tr
								ref={provided.innerRef}
								{...provided.draggableProps}

								style={getItemStyle(
								snapshot.isDragging,
								provided.draggableProps.style
								)}
							>
								<td className="Polaris-IndexTable__TableCell">
								<div {...provided.dragHandleProps}>
									<Tooltip content="Drag to reorder list items">
									<Icon source={DragHandleMinor} color="inkLightest" />
									</Tooltip>
								</div>
								</td>
								<td className="Polaris-IndexTable__TableCell campaign"><span className="customCampaign">{item.campaignName} <Badge status={(item.config.status) ? 'success' : 'attention'}>{(item.config.status) ? 'ON' : 'OFF'}</Badge></span></td>
								<td className="Polaris-IndexTable__TableCell">{(item.products.length && item.collections.length) ? 'Product/Collections' : ((item.products.length) ? 'Product' : 'Collections')}</td>
								<td className="Polaris-IndexTable__TableCell">{(item.config.userAccessibility == 'all') ? 'All Customers' : (item.config.userAccessibility == 'loggedin') ? 'Logged In Customers' : 'Tagged Customers'}</td>
								<td className="Polaris-IndexTable__TableCell" style={{width : '180px'}}>
								<ButtonGroup>
									<Button
										onClick={(event) => {
											let viewStatus = (item.config.status) ? 0 : 1;
											onActiveOffer(viewStatus, index);
										}}
										primary={(item.config.status) ? false : true}
										icon={(item.config.status) ? <Icon source={ViewMinor} color="base" /> : <Icon source={ViewMinor} color="base" />}
									></Button>
									<Button
										onClick={(event) => {
											onShowForm(true, index);
										}}
										icon={<Icon source={EditMinor} color="base" />}
									></Button>
									<Button
										onClick={(event) => {
											setIsDeleteOffer(true);
											setOfferIndex(index)

											//confirmDeleteOffer(index);
											//onDeleteOffer(index);
										}}
										icon={<Icon source={DeleteMinor} color="base" />}
									></Button>
								</ButtonGroup>



		  						</td>
							</tr>
							)}
						</Draggable>
						))}
						{provided.placeholder}
					</tbody>
            	</table></div></div>
				</div>
			);
		  }}
		</Droppable>
	  </DragDropContext>
	);
  }
  return (
    <>
		<Page
			title="Offer List"
			breadcrumbs={[
			{
			content: "Discounts",
			onAction: () => onBack()
			}
		]}
		>

		<div className="offerList">
		<Card sectioned actions={[{content: <Button onClick={(e) => {onShowForm(true)}} >
				+ New Offer
				</Button>}]}>
			<div className="customHeading">

			<List />



			</div>
		</Card>
		</div>
		<Confirm
			isConfirm={isDeleteOffer}
			confirmMsg='Are you sure want to remove this offer list'
			onConfirm={onConfirm}
			onCancel={onCancelRemove}
			returnData={offerIndex}
			/>
		</Page>
		{(loading) ? <div style={{height: '5px'}}>
				<Frame>
					<Loading />
				</Frame>
			</div> : <div style={{height: '5px'}}>

			</div>}
	</>
  );
}