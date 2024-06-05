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
		  email
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
	APP_SETTING_GET_MUTATION: `query {
		currentAppInstallation{
			id
			metafields(first: 100) {
				nodes{
					namespace
					key
					type
					value
				}
			}
		}
	} `,
	APP_REGISTRATION_GET_MUTATION : `query {
		currentAppInstallation{
			id
			form: metafield(namespace: "app_settings", key: "registractionForm"){
				value
			}
		}
	}`,
	APP_NOTIFICATION_GET_MUTATION : `query {
		currentAppInstallation{
			id
			notifications: metafield(namespace: "app_settings", key: "notifications"){
				value
			}
		}
	}`,
	APP_SETTING_SET_MUTATION: `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
		metafieldsSet(metafields: $metafieldsSetInput) {
		  metafields {
			id
			namespace
			key,
			value
		  }
		  userErrors {
			field
			message
		  }
		}
	  }`,
	  CUSTOMER_SEGMENT_MEMBERS : `{
		customerSegmentMembers(first: 50, query: "$QUERY") {
		  edges {
			node {
			  id
			  firstName
			  lastName
			  email: defaultEmailAddress{
				emailAddress
			  }
			  metafield(namespace: "segment", key: "assigned"){
				id
			  }
			  status: metafield(namespace: "segment", key: "status"){
				  value
				  id
			  }
			}
		  }
		}
	  }`,

	  CUSTOMERS : `{
		customers(first: 200, query: "$QUERY") {
		  edges{
			node{
			  firstName
			  lastName
			  email
			  id
			  metafield(namespace: "segment", key: "assigned"){
				value
			  }
			}
		  }
		}
	  }`,

	  UPDATE_CUSTOMER_METAFIELDS : `mutation updateCustomerMetafields($input: CustomerInput!) {
		customerUpdate(input: $input) {
		  customer {
			id
			metafield(namespace: "segment", key: "assigned"){
				id
			}
		  }
		  userErrors {
			message
			field
		  }
		}
	  }`,
	  DELETE_CUSTOMER_METAFIELDS : `mutation metafieldDelete($input: MetafieldDeleteInput!) {
		metafieldDelete(input: $input) {
		  deletedId
		  userErrors {
			field
			message
		  }
		}
	  }`,
	  CREATE_METAFIELD_DEFINITION: `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
		metafieldDefinitionCreate(definition: $definition) {
		  createdDefinition {
			id
			name
			namespace
			key      
		  }
		  userErrors {
			field
			message
			code
		  }
		}
	  }`,
	  SET_CREATE_WEBHOOK_SUBSCRIPTION_CREATE: `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
		webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
		  webhookSubscription {
			id
			topic
			format
			endpoint {
			  __typename
			  ... on WebhookHttpEndpoint {
				callbackUrl
			  }
			}
		  }
		}
	  }`,
	  GET_WEBHOOK_SUBSCRIPTION: `query {
		webhookSubscriptions(first: 10) {
		  edges {
			node {
			  id
			  topic
			  endpoint {
				__typename
				... on WebhookHttpEndpoint {
				  callbackUrl
				}
				... on WebhookEventBridgeEndpoint {
				  arn
				}
				... on WebhookPubSubEndpoint {
				  pubSubProject
				  pubSubTopic
				}
			  }
			}
		  }
		}
	  }`,
	  SET_CREATE_CUSTOMER: `mutation customerCreate($input: CustomerInput!) {
		customerCreate(input: $input) {
		  userErrors {
			field
			message
		  }
		  customer {
			id
			email
			phone
			taxExempt
			acceptsMarketing
			firstName
			lastName
			smsMarketingConsent {
			  marketingState
			  marketingOptInLevel
			}
			addresses {
			  address1
			  city
			  country
			  phone
			  zip
			}
		  }
		}
	  }`,
	  BULK_QUERY_GET_COLLECTION: `mutation {
		bulkOperationRunQuery(
		  query: """
		  {
			collections {
			  edges {
				node {
				  id
				  title
				  handle
				  updatedAt
				  productsCount
				  products(first: 250) {
					edges {
					  node {
						id
						title
						handle
						vendor
						productType
						tags
						variants(first: 250) {
						  edges {
							node {
							  id
							  sku
							  price
							  compareAtPrice
							  inventoryQuantity
							  weight
							  weightUnit
							  requiresShipping
							  taxable
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
}