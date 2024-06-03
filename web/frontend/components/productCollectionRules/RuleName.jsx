import {
	TextField,
	Card,
	Stack,
	DatePicker,
	Popover,
	Button,
	Icon,
	Checkbox,
  } from "@shopify/polaris"; //polaris components
  import { React, useState, useCallback } from "react";
  import { ThemesMajor } from "@shopify/polaris-icons";

  export function RuleName(props) {
	const { campaignName } = props;

	return (
	  <Card title="Offer Name">
		<Card.Section>
		  <Stack>
		  <div className="customTextField">
			<TextField
				label="Offer Name mentioned here will not appear to the customers"
			  onChange={campaignName.onChange}
			  autoComplete="off"
			  value={campaignName.value}
			/>
			</div>
		  </Stack>
		</Card.Section>
	  </Card>
	);
  }