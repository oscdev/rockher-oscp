export const QL = {
	// Define the specific mutation for creating products
	CREATE_PRODUCT_MUTATION : `mutation call($metafields: [MetafieldsSetInput!]!) {
		metafieldsSet(metafields: $metafields) {
			metafields {
			  id
			}
			userErrors {
			  field
			  message
			}
		  }
	}`,
	// Define the bulk operation mutation query
	BULK_OPERATION_RUN_MUTATION: `mutation bulkOperationRunMutation($mutation: String!, $stagedUploadPath: String!) {
		bulkOperationRunMutation(mutation: $mutation, stagedUploadPath: $stagedUploadPath) {
		  userErrors {
			field
			message
		  }
		}
	}`,
	// GraphQL mutation to run a bulk operation query
	BULK_UPLOAD_STAGE_MUTATION : `mutation stagedUploadCreate($input:[StagedUploadInput!]!) {
		stagedUploadsCreate(input: $input){
		  stagedTargets{
			url
			resourceUrl
			parameters{
			  name
			  value
			}
		  }
		}
	}`,
	// GraphQL mutation to run a bulk operation query
	PRODUCT_BULK_MUTATION : `mutation {
		bulkOperationRunQuery(
		 query: """
		  {
			products {
			  edges {
				node {
				  id
				  title,
				  variants {
					edges {
					  node {
						id
						title
						inventoryQuantity
						price
						sku
						metafields(first: 250) {
							edges {
							  node {
								id
								key
								value
								namespace
							  }
							}
						  }
					  }
					}
				  }
				}
			  }
			}
		  }
		  """
		) {
		  bulkOperation {
			id
			status
		  }
		  userErrors {
			field
			message
		  }
		}
	}`,
	// GraphQL mutation to fetch specific products
	SPECIFIED_PRODUCTS_BULK_MUTATION : `mutation {
		bulkOperationRunQuery(
		 query: """
		  {
			products(query: "$ids") {
			  edges {
				node {
				  id
				  title,
				  variants {
					edges {
					  node {
						id
						title
						price
						sku
						metafields(first: 250) {
							edges {
							  node {
								id
								key
								value
								namespace
							  }
							}
						  }
					  }
					}
				  }
				}
			  }
			}
		  }
		  """
		) {
		  bulkOperation {
			id
			status
		  }
		  userErrors {
			field
			message
		  }
		}
	}`,	
	SHOP_TIMEZONE : `query {
		shop {
		  name
		  ianaTimezone
		}
	}`,
	POLL_ERROR : `query {
		currentBulkOperation(type: MUTATION) {
			id
			status
			errorCode
			createdAt
			completedAt
			objectCount
			fileSize
			url
			partialDataUrl
			type
			query
			rootObjectCount
		}   
	}`,
	BULK_PRODUCTS_RULE: `query GetProductData($productId: ID!) {
		product(id: $productId) {
		  id
		  title
		  variants(first:15) {
			edges {
			  node {
				id
				title
				sku
				price
				inventoryQuantity
				metafields(first:50) {
				  edges {
					node {
					  key
					  value
					  type
					}
				  }
				}
			  }
			}
		  }
		}
		shop {
		  name
		  id
		  ianaTimezone
		  currencyCode
		}
	  }`,
	METAFIELDS_SET: `mutation SetMetafield($ownerId: ID!, $namespace: String!, $key: String!, $value: String!, $type: String!) {
		metafieldsSet(
		  metafields: {
			ownerId: $ownerId,
			namespace: $namespace,
			key: $key,
			value: $value,
			type: $type
		  }
		) {
		  metafields {
			id
			namespace
			value
		  }
		}
	  }`,
	  SHOP_MARKETS : `query {
		markets(first: 100) {
			nodes {
			id
			name  
			currencySettings {
				baseCurrency {
				currencyCode
				}
			}
			}
		}
		}`,
	  SHOP_CURRENCY : `query {
		shop {
			name
			currencyCode
			currencyFormats {
				moneyInEmailsFormat
				moneyWithCurrencyInEmailsFormat
			}
		}
	}`,
}