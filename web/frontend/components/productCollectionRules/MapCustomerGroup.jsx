import {
    TextField,
    Card,
    ChoiceList,
	Tag, Stack, Button
  } from "@shopify/polaris"; //polaris components
  import { React, useState, useCallback } from "react";

  import { Confirm } from "../";

  export function MapCustomerGroup(props) {
    const { userAccessibility, userTags, addUserTag, removeUserTag} = props;
// Add the tag value in variable
	const [textTagValue, setTextTagValue] = useState('');
  // Remove tag variable is set true
	const [isTagRemove, setIsTagRemove] = useState(false);
  // Set the no of tag index
	const [tagIndex, setTagIndex] = useState();

	function addNewTag(event){
		if (textTagValue.trim() == '') return;
		addUserTag({
            title: textTagValue
        })
		 setTextTagValue('')
	}
	const handleTextFieldChange = useCallback(
		(value) => setTextTagValue(value),
		[],
	);

	function onCancelRemove(){
		setIsTagRemove(false);
	}

	function onConfirm(index){
		removeUserTag(index)
		setIsTagRemove(false);
	  }

    return (
      <Card title="Customer Group">
        <Card.Section>
            <ChoiceList
                title="Customer Type"
                selected={userAccessibility.value}
                choices={[
                { label: "All Customers", value: "all" },
                { label: "Logged In Customers", value: "loggedin" },
                { label: "Tagged Customers", value: "specific" }
                ]}
                onChange={userAccessibility.onChange}
            />
		</Card.Section>
            {(userAccessibility.value == 'specific') ? <Card.Section><br/>

			<Stack>
		  <div className="customTextField"><TextField
				label="Enter Customer Tag"
				type="text"
				value={textTagValue}
				onChange={handleTextFieldChange}
				autoComplete="off"
				connectedRight={<Button
					onClick={addNewTag}
				>Add</Button>}
			/></div>
			</Stack>
			<br />
			<Stack spacing="tight">
				{userTags.map(({title}, index) => {
					return <Tag onRemove={(e) => {
						setIsTagRemove(true);
						setTagIndex(index)
						//removeUserTag(index)
					}}>
					{title.value}
				</Tag>;
				})}
			</Stack>

		
			</Card.Section> : ''}

          
		<Confirm
          isConfirm={isTagRemove}
          confirmMsg='Are you sure you want to remove this tag'
          onConfirm={onConfirm}
          onCancel={onCancelRemove}
          returnData={tagIndex}
        />
      </Card>
    );
  }