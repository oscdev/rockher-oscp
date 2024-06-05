import axios from "axios";
import { writeFile, promises, createReadStream, createWriteStream, readdir, readFile, statSync, rename } from "fs";
import path from "path"
import { modelExport, modelCronLock } from "../models/index.js";
import { exec, spawn } from 'child_process';
import { EventEmitter } from "events";
import mysql from "mysql2";
import { cnf } from "../cnf.js";
import { writeToPath } from "fast-csv";
import { Shopify } from "@shopify/shopify-api";
const USE_ONLINE_TOKENS = false;
import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const exportVariantRuleData = {


	/* Purpose: This Function is used to the get all the product collection data with metafields sku */
	generateCollectionsCSV: async function (req, res) {
		const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

		const fetchCollectionsQuery = `
			{
				collections(first: 250) {
					edges {
						node {
							id
						}
					}
				}
			}
		`;

		const fetchCollectionsResponse = await client.query({
			data: {
				query: fetchCollectionsQuery
			}
		});

		const allCollectionIds = fetchCollectionsResponse.body.data.collections.edges.map(edge => edge.node.id);
		console.log('All Collection IDs:', allCollectionIds);

		for (const collectionId of allCollectionIds) {
			try {
				// Build the GraphQL query for the current collection
				const bulkQuery = `
					{
						collection(id: "${collectionId}") {
							id
							title
							products(first: 250) {
								edges {
									node {
										id
										title
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
				`;

				// Execute the bulk operation for this collection
				const startBulkOperation = await client.query({
					data: {
						query: `mutation {
							bulkOperationRunQuery(
								query: """
								${bulkQuery}
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
						}`
					},
				});
				const startBulkOperationResponse = startBulkOperation.body.data.bulkOperationRunQuery;
				console.log("startBulkOperationResponse", startBulkOperationResponse)
				if (startBulkOperationResponse.userErrors.length > 0) {
					throw new Error(`Bulk operation initiation failed for collection: ${collectionId}`);
				}

				const bulkOperationId = startBulkOperationResponse.bulkOperation.id;

				// Polling the status of the bulk operation
				let bulkOperationStatus = { status: 'RUNNING' };
				while (bulkOperationStatus.status === 'RUNNING' || bulkOperationStatus.status === 'CREATED') {
					await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before polling again

					const statusResponse = await client.query({
						data: {
							query: `
								{
									node(id: "${bulkOperationId}") {
										... on BulkOperation {
											status
											errorCode
											createdAt
											completedAt
											objectCount
											fileSize
											url
										}
									}
								}
							`,
						},
					});

					bulkOperationStatus = statusResponse.body.data.node;
				}

				if (bulkOperationStatus.status !== 'COMPLETED') {
					console.error(`Bulk operation failed for collection: ${collectionId}`);
					continue; // Skip to the next collection if this one fails
				}

				// Download the result file and parse the data
				const response = await fetch(bulkOperationStatus.url);
				const jsonlData = await response.text();

				// Split the JSONL data into individual lines and parse each line to JSON
				const jsonlLines = jsonlData.split('\n').filter(line => line.trim().length > 0);
				const updatedJsonlLines = [];
				updatedJsonlLines.push(JSON.stringify({ id: collectionId })); // Add the collection ID as the first entry

				jsonlLines.forEach(line => {
					const jsonObject = JSON.parse(line);
					jsonObject.collectionId = collectionId; // Add the collection ID to the JSON object
					updatedJsonlLines.push(JSON.stringify(jsonObject));
				});
				const updatedJsonlData = updatedJsonlLines.join('\n');

				const sanitizedCollectionId = collectionId.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize collection ID for filenames
				const fileName = `collection-${sanitizedCollectionId}.jsonl`;
				const logFilePath = path.join(__dirname, '..', 'storage', 'raw', fileName);

				// Ensure directory exists before writing file
				const logDir = path.dirname(logFilePath);
				if (!fs.existsSync(logDir)) {
					fs.mkdirSync(logDir, { recursive: true });
				}

				fs.writeFileSync(logFilePath, updatedJsonlData);

				const dataFile = logFilePath;
				const dataSQLFile = `${process.cwd()}/storage/sql/${fileName}.sql`;
				const dataErrorFile = `${process.cwd()}/storage/line-parse-error.sql`;

				const dataReadableStream = createReadStream(dataFile, { encoding: 'utf8' });
				// Create a writable stream to write to the destination file
				const dataWritableStream = createWriteStream(dataSQLFile, { encoding: 'utf8' });
				// Create a writable stream to write to the destination file
				const lineErrorWritableStream = createWriteStream(dataErrorFile, { encoding: 'utf8' });
				const status = "PENDING"
				let incompleteLine = '';
				// const timestamp = 1234567890;
				const timestamp = Date.now();
				dataReadableStream.on('data', (chunk) => {
					const lines = (incompleteLine + chunk).split(/[\r\n]+/);
					incompleteLine = lines.pop();
					// const currentTimestamp = new Date().toISOString();

					for (const line of lines) {
						if (line.trim() !== '') {
							try {
								const jsonData = JSON.parse(line);
								// Extract values from JSON
								const { id, title, productsCount, key, namespace, __parentId, value, sku, price, collectionId } = jsonData;

								// Add row to collection Buffer
								if (id.search("Collection") > -1) {
									dataWritableStream.write("INSERT INTO `collections` (`collection_id`, `timestamp`,`shop`,`status`) VALUES (" + mysql.escape(id) + ", " + mysql.escape(timestamp) + "," + mysql.escape(session.shop) + "," + mysql.escape(status) + ");" + '\n');
								}
								// Add row to Product Buffer
								if (id.search("Product") > -1) {
									dataWritableStream.write("INSERT INTO `products` (`prod_id`,`shop`, `collection_id`, `timestamp`) VALUES (" + mysql.escape(id) + ", " + mysql.escape(session.shop) + "," + mysql.escape(collectionId) + "," + mysql.escape(timestamp) + ");" + '\n');
								}

								// Add row to Metafield Buffer
								if ((id.search("Metafield") > -1) && (key.search("full_sku") > -1)) {
									dataWritableStream.write("INSERT INTO `metafields` (`metafield_id`,`product_id`,`shop`, `sku`, `collection_id`,`timestamp`) VALUES (" + mysql.escape(id) + "," + mysql.escape(__parentId) + "," + mysql.escape(session.shop) + ", " + mysql.escape(value) + ", " + mysql.escape(collectionId) + "," + mysql.escape(timestamp) + ");" + '\n');
								}
							} catch (error) {
								lineErrorWritableStream.write(line + '\n');
							}
						}
					}
				}).on('end', async () => { }).on('error', (err) => {
					console.error('Error reading data:', err);
				});

				await this.ProcessSqlFileToDB();

				console.log(`JSONL file created at ${logFilePath} for collection ${collectionId}`);
			} catch (error) {
				console.error(`Error generating JSONL for collection ${collectionId}:`, error);
			}
		}
		return 'JSONL files generated for all collections (if successful)';
	},
	
	/* Purpose: This Function is used to the get collection vise product
	* 	Arrage the collection product as per the sku 
	*/
	getCollection: async function (req, res) {
		try {
			// const bulkrunnerData = await modelExport.insertRunnerData(data, req, res).then(function (rows) {return rows	});
			const get_collection_ids = await modelExport.getCollectionID(req, res);
			console.log("get_collection-----", get_collection_ids)
			for (const collectionId of get_collection_ids) {
				const get_collection = await modelExport.getCollectionData(collectionId);
				const updateStatus = await modelExport.collectionStatusUpdate(collectionId.collection_id, "RUNNING");
				if (get_collection.length > 0) {
					await this.separateData(req, res, get_collection);
				}
			}
			return "collection Update Successfully";
		} catch (error) {
			throw new Error("Error : " + error);
		}
	},
	separateData: async function (req, res, records) {
		const skuCount = {};
		const nonrepeat_data = [];
		const repeat_data = [];

		// First pass: count the occurrences of each SKU
		records.forEach(record => {
			skuCount[record.sku] = (skuCount[record.sku] || 0) + 1;
		});

		// Second pass: separate records based on SKU counts
		records.forEach(record => {
			if (skuCount[record.sku] === 1) {
				nonrepeat_data.push(record);
			} else {
				repeat_data.push(record);
			}
		});

		const interval = Math.ceil(nonrepeat_data.length / repeat_data.length);
		let result = [...nonrepeat_data]; // Clone nonrepeatdata to result
		let repeatIndex = 0;

		for (let i = interval; i <= result.length && repeatIndex < repeat_data.length; i += interval + 1) {
			result.splice(i, 0, repeat_data[repeatIndex]);
			repeatIndex++;
		}

		// If there are remaining items in Repeatdata, append them to the end
		if (repeatIndex < repeat_data.length) {
			result = result.concat(repeat_data.slice(repeatIndex));
		}

		// console.log("result", result)
		const output = {
			id: result[0].collection_id,
			moves: result.map((item, index) => ({
				id: item.prod_id,
				newPosition: index.toString()
			}))
		};

		console.log("Product Sort ----", output);
		await this.collectionProductUpdate(req, res, output)
		return "collection move successfully";
	},
	collectionProductUpdate: async function (req, res, output) {
		console.log("---------collectionProductUpdate----------")
		const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

		// Step 1: Update the collection sort order to 'MANUAL'
		const updateCollectionSortOrder = `mutation collectionUpdate($input: CollectionInput!) {
			collectionUpdate(input: $input) {
			collection {
				id
				sortOrder
			}
			userErrors {
				field
				message
				}
				}
			}`;

		const sortOrderVariables = {
			input: {
				id: output.id,
				sortOrder: 'MANUAL'
			}
		};
		const updateSortOrderResponse = await client.query({
			data: {
				query: updateCollectionSortOrder,
				variables: sortOrderVariables
			},
		});


		if (updateSortOrderResponse.body.data.collectionUpdate.userErrors.length > 0) {
			const updateStatus = await modelExport.collectionStatusUpdate(output.id, "RUNNING");

			console.error('Error updating sort order:', updateSortOrderResponse.body.data.collectionUpdate.userErrors);
			return;
		}

		// Step 2: Reorder the products in the collection
		const collectionUpdate = `mutation collectionReorderProducts($id: ID!, $moves: [MoveInput!]!) {
		collectionReorderProducts(id: $id, moves: $moves) {
			job {
				id
			}
			userErrors {
				field
				message
			}
			}
		}`;

		const variables = output;

		const collectionData = await client.query({
			data: {
				query: collectionUpdate,
				variables
			},
		});
		const collectionStatusUpdate = await modelExport.collectionStatusUpdate(output.id, "COMPLETE");

		console.log("-----customersData----", JSON.stringify(collectionData.body))
		return "Collection Update successfully";
	},


	generateCollectionsCSVBackup: async function (req, res) {
		const session = await Shopify.Utils.loadCurrentSession(req, res, USE_ONLINE_TOKENS);
		const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

		const fetchCollectionsQuery = `
			{
				collections(first: 250) {
					edges {
						node {
							id
						}
					}
				}
			}
		`;

		const fetchCollectionsResponse = await client.query({
			data: {
				query: fetchCollectionsQuery
			}
		});

		const allCollectionIds = fetchCollectionsResponse.body.data.collections.edges.map(edge => edge.node.id);
		console.log('All Collection IDs:', allCollectionIds);

		for (const collectionId of allCollectionIds) {
			try {
				// Build the GraphQL query for the current collection
				const bulkQuery = `
					{
						collection(id: "${collectionId}") {
							id
							title
							products(first: 250) {
								edges {
									node {
										id
										title
									}
								}
							}
						}
					}
				`;

				// Execute the bulk operation for this collection
				const startBulkOperation = await client.query({
					data: {
						query: `mutation {
							bulkOperationRunQuery(
								query: """
								${bulkQuery}
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
						}`
					},
				});
				const startBulkOperationResponse = startBulkOperation.body.data.bulkOperationRunQuery;
				console.log("startBulkOperationResponse", startBulkOperationResponse)
				if (startBulkOperationResponse.userErrors.length > 0) {
					throw new Error(`Bulk operation initiation failed for collection: ${collectionId}`);
				}

				const bulkOperationId = startBulkOperationResponse.bulkOperation.id;

				// Polling the status of the bulk operation
				let bulkOperationStatus = { status: 'RUNNING' };
				while (bulkOperationStatus.status === 'RUNNING' || bulkOperationStatus.status === 'CREATED') {
					await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before polling again

					const statusResponse = await client.query({
						data: {
							query: `
								{
									node(id: "${bulkOperationId}") {
										... on BulkOperation {
											status
											errorCode
											createdAt
											completedAt
											objectCount
											fileSize
											url
										}
									}
								}
							`,
						},
					});

					bulkOperationStatus = statusResponse.body.data.node;
				}

				if (bulkOperationStatus.status !== 'COMPLETED') {
					console.error(`Bulk operation failed for collection: ${collectionId}`);
					continue; // Skip to the next collection if this one fails
				}

				// Download the result file and parse the data
				const response = await fetch(bulkOperationStatus.url);
				const jsonlData = await response.text();

				// Split the JSONL data into individual lines and parse each line to JSON
				const jsonlLines = jsonlData.split('\n').filter(line => line.trim().length > 0);
				const updatedJsonlLines = [];
				updatedJsonlLines.push(JSON.stringify({ id: collectionId })); // Add the collection ID as the first entry

				jsonlLines.forEach(line => {
					const jsonObject = JSON.parse(line);
					jsonObject.collectionId = collectionId; // Add the collection ID to the JSON object
					updatedJsonlLines.push(JSON.stringify(jsonObject));
				});
				const updatedJsonlData = updatedJsonlLines.join('\n');

				const sanitizedCollectionId = collectionId.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // Sanitize collection ID for filenames
				const fileName = `collection-${sanitizedCollectionId}.jsonl`;
				const logFilePath = path.join(__dirname, '..', 'storage', 'backupraw', fileName);

				// Ensure directory exists before writing file
				const logDir = path.dirname(logFilePath);
				if (!fs.existsSync(logDir)) {
					fs.mkdirSync(logDir, { recursive: true });
				}

				fs.writeFileSync(logFilePath, updatedJsonlData);

				const dataFile = logFilePath;
				const dataSQLFile = `${process.cwd()}/storage/backupsql/${fileName}.sql`;
				const dataErrorFile = `${process.cwd()}/storage/line-parse-error.sql`;

				const dataReadableStream = createReadStream(dataFile, { encoding: 'utf8' });
				// Create a writable stream to write to the destination file
				const dataWritableStream = createWriteStream(dataSQLFile, { encoding: 'utf8' });
				// Create a writable stream to write to the destination file
				const lineErrorWritableStream = createWriteStream(dataErrorFile, { encoding: 'utf8' });
				const status = "PENDING"
				let incompleteLine = '';
				// const timestamp = 1234567890;
				const timestamp = Date.now();
				dataReadableStream.on('data', (chunk) => {
					const lines = (incompleteLine + chunk).split(/[\r\n]+/);
					incompleteLine = lines.pop();
					// const currentTimestamp = new Date().toISOString();
					for (const line of lines) {
						if (line.trim() !== '') {
							try {
								const jsonData = JSON.parse(line);
								// Extract values from JSON
								const { id, title, productsCount, key, namespace, __parentId, value, sku, price, collectionId } = jsonData;

								// Add row to collection Buffer
								if (id.search("Collection") > -1) {
									dataWritableStream.write("INSERT INTO `collections` (`collection_id`, `timestamp`,`shop`,`status`) VALUES (" + mysql.escape(id) + ", " + mysql.escape(timestamp) + "," + mysql.escape(session.shop) + "," + mysql.escape(status) + ");" + '\n');
								}
								// Add row to Product Buffer
								if (id.search("Product") > -1) {
									dataWritableStream.write("INSERT INTO `productsbackup` (`prod_id`,`shop`, `collection_id`, `timestamp`) VALUES (" + mysql.escape(id) + ", " + mysql.escape(session.shop) + "," + mysql.escape(collectionId) + "," + mysql.escape(timestamp) + ");" + '\n');
								}
							} catch (error) {
								lineErrorWritableStream.write(line + '\n');
							}
						}
					}
				}).on('end', async () => { }).on('error', (err) => {
					console.error('Error reading data:', err);
				});

				// await this.ProcessSqlFileToDB();

				console.log(`JSONL file created at ${logFilePath} for collection ${collectionId}`);
			} catch (error) {
				console.error(`Error generating JSONL for collection ${collectionId}:`, error);
			}
		}
		return 'JSONL files generated for all collections (if successful)';
	},
	getCollectionBackup: async function (req, res) {
		try {
			// const bulkrunnerData = await modelExport.insertRunnerData(data, req, res).then(function (rows) {return rows	});
			const get_collection_ids = await modelExport.getCollectionID(req, res);
			console.log("get_collection-----", get_collection_ids)
			for (const collectionId of get_collection_ids) {
				const get_collection = await modelExport.getCollectionDataBackup(collectionId);
				const updateStatus = await modelExport.collectionStatusUpdate(collectionId.collection_id, "RUNNING");
				if (get_collection.length > 0) {
					await this.separateDataBackup(req, res, get_collection);
				}
			}
			return "collection Update Successfully";
		} catch (error) {
			throw new Error("Error : " + error);
		}
	},
	separateDataBackup: async function (req, res, records) {
		// const skuCount = {};
		// const nonrepeat_data = [];
		// const repeat_data = [];

		// // First pass: count the occurrences of each SKU
		// records.forEach(record => {
		// 	skuCount[record.sku] = (skuCount[record.sku] || 0) + 1;
		// });

		// // Second pass: separate records based on SKU counts
		// records.forEach(record => {
		// 	if (skuCount[record.sku] === 1) {
		// 		nonrepeat_data.push(record);
		// 	} else {
		// 		repeat_data.push(record);
		// 	}
		// });

		// const interval = Math.ceil(nonrepeat_data.length / repeat_data.length);
		// let result = [...nonrepeat_data]; // Clone nonrepeatdata to result
		// let repeatIndex = 0;

		// for (let i = interval; i <= result.length && repeatIndex < repeat_data.length; i += interval + 1) {
		// 	result.splice(i, 0, repeat_data[repeatIndex]);
		// 	repeatIndex++;
		// }

		// // If there are remaining items in Repeatdata, append them to the end
		// if (repeatIndex < repeat_data.length) {
		// 	result = result.concat(repeat_data.slice(repeatIndex));
		// }

		// console.log("result", result)
		const output = {
			id: records[0].collection_id,
			moves: records.map((item, index) => ({
				id: item.prod_id,
				newPosition: index.toString()
			}))
		};

		console.log("Product Sort ----", output);
		await this.collectionProductUpdate(req, res, output)
		return "collection move successfully";
	},
	/**
	 * Purpose : Start point for export processing.
	 * Get and Insert the operation ID into the database 
	 * 
	 * @param {*} req Object
	 * @param {*} res 
	 * @returns the object ( Affected rows and inserted row count)
	 */
	requestOperation: async function (req, res) {
		try {
			const data = await modelExport.runBulkOperation(req, res);
			const bulkrunnerData = await modelExport.insertRunnerData(data, req, res).then(function (rows) { return rows });
			return bulkrunnerData;
		} catch (error) {
			throw new Error("Error : " + error);
		}
	},

	/**
	 * Purpose: Using cron get incomplete operations.
	 * Get shop name, operation id and accesstoken 
	 * Get the url, status and createdAT
	 * call the processRawFiles and processSQLFiles function
	 * 
	 * @returns Void
	 */
	processOperationsIDToSqlFile: async function () {
		const cron = await modelCronLock.checkLock('prepare-incomplete-operations');
		console.log(cron)
		if (cron.status == 'busy') {
			return;
		}
		console.log('-------Start - prepare-incomplete-operations------');

		await modelCronLock.acquireLock('prepare-incomplete-operations');
		//const bulkData = await modelExport.getBulkDataFileUrl(session, data)
		const incompleteOperations = await modelExport.processOperationsIDToSqlFile().then(function (rows) { return rows });
		const filesToProcess = [];
		for (let operation of incompleteOperations) {
			try {
				const shOperation = await modelExport.checkOperationStatus(operation)
				if ((shOperation.url == null) && (shOperation.status == 'COMPLETED')) { //No data available in shop
					modelExport.operationStatusUpdate(operation.sh_operation_id, operation.sh_shop);
				} else if (shOperation.url !== null) {
					//this.saveRawDataFileInDrive(operation, shOperation)
					filesToProcess.push({
						operation: operation,
						shOperation: shOperation
					})
				}
			} catch (error) {
				console.error('Error occurred:', error);
			}
		}
		if (filesToProcess.length) {
			await this.processRawFiles(filesToProcess);
			await this.processSQLFiles(filesToProcess);
		} else {
			console.log('No Data')
		}
		await modelCronLock.releaseLock('prepare-incomplete-operations');
	},

	/**
	 * Purpose: This function is used to map the filelist object and wait till all the Json file get 
	 * call the saveRawDataFileInDrive function
	 * 
	 * @param {*} fileList Object
	 * @returns Void
	 */
	processRawFiles: async function (fileList) {
		const filePromises = fileList.map(fileData => this.saveRawDataFileInDrive(fileData.operation, fileData.shOperation));
		try {
			await Promise.all(filePromises);
			console.log('All Raw files processed successfully.');
		} catch (error) {
			console.error('Error occurred during raw file processing:', error);
		}
	},

	/**
	 * Purpose: This function is used to map the filelist object and wait till all the SQL file created
	 * 
	 * @param {*} fileList Object
	 * @returns Void
	 */
	processSQLFiles: async function (fileList) {
		const filePromises = fileList.map(fileData => this.createAndSaveSQLFileInDrive(fileData.operation, fileData.shOperation));
		try {
			await Promise.all(filePromises);
			console.log('All SQL files processed successfully.');
		} catch (error) {
			console.error('Error occurred during SQL file processing:', error);
		}
	},

	/**
	 * Purpose: Save the jsonl file into the app folder
	 * 
	 * @param {*} operation object
	 * @param {*} shOperation object
	 * @returns Void
	 */
	saveRawDataFileInDrive: async function (operation, shOperation) {
		try {
			console.log('----------saveRawDataFileInDrive------------')
			// Make a GET request to fetch the file from the provided URL
			//const writeFile = util.promisify(writeFile);
			const response = await axios.get(shOperation.url);
			console.log('----------axios------------')
			// Define the path and filename for saving the file

			let operationId = operation.sh_operation_id;
			operationId = operationId.split('/');
			operationId = operationId[operationId.length - 1];
			const dataFile = `${process.cwd()}/storage/raw/${operationId}-o-${operation.sh_shop}.jsonl`;
			await promises.writeFile(dataFile, response.data, { encoding: "utf8", flag: "w", mode: 0o666 });

		} catch (error) {
			console.error('Error occurred while saving file:', error);
		}
	},
	/**
	* Purpose: Create sql file and save into the app folder
	* In sql file, products and metafields and variants insert query written
	* 
	* @param {*} operation 
	* @param {*} shOperation 
	* @returns Void
	*/
	createBackupProductCollectionSQL: async function (req, res) {
		// Create a readable stream to read the large data file
		const dataFile = `${process.cwd()}/storage/backupraw/collection-gid___shopify_collection_479774671127.jsonl`
		console.log(dataFile)
		const dataSQLFile = `${process.cwd()}/storage/backupsql/collection-gid___shopify_collection_479774671127.jsonl.sql`;

		const dataErrorFile = `${process.cwd()}/storage/line-parse-error.sql`;

		const dataReadableStream = createReadStream(dataFile, { encoding: 'utf8' });
		// Create a writable stream to write to the destination file
		const dataWritableStream = createWriteStream(dataSQLFile, { encoding: 'utf8' });
		// Create a writable stream to write to the destination file
		const lineErrorWritableStream = createWriteStream(dataErrorFile, { encoding: 'utf8' });
		const status = "PENDING"
		let incompleteLine = '';
		const timestamp = Date.now();
		dataReadableStream.on('data', (chunk) => {
			const lines = (incompleteLine + chunk).split(/[\r\n]+/);
			incompleteLine = lines.pop();
			for (const line of lines) {
				if (line.trim() !== '') {
					try {
						const jsonData = JSON.parse(line);
						// Extract values from JSON
						const { id, title, productsCount, key, namespace, __parentId, value, sku, price, collectionId } = jsonData;

						// Add row to collection Buffer
						if (id.search("Collection") > -1) {
							dataWritableStream.write("INSERT INTO `collections` (`collection_id`, `timestamp`,`shop`,`status`) VALUES (" + mysql.escape(id) + ", " + mysql.escape(timestamp) + "," + mysql.escape("anuragoscp.myshopify.com") + "," + mysql.escape(status) + ");" + '\n');
						}
						// Add row to Product Buffer
						if (id.search("Product") > -1) {
							dataWritableStream.write("INSERT INTO `products` (`prod_id`,`shop`, `collection_id`, `timestamp`) VALUES (" + mysql.escape(id) + ", " + mysql.escape("anuragoscp.myshopify.com") + "," + mysql.escape(collectionId) + "," + mysql.escape(timestamp) + ");" + '\n');
						}
					} catch (error) {
						lineErrorWritableStream.write(line + '\n');
					}
				}
			}
		}).on('end', async () => { }).on('error', (err) => {
			console.error('Error reading data:', err);
		});
	},

	/**
	 * Purpose: Get SQL file list and path from app directory 
	 * call the dumpVariantSqlFile function 
	 * 
	 * @returns Void
	 */
	ProcessSqlFileToDB: async function () {
		const cron = await modelCronLock.checkLock('upload-incomplete-operations');
		console.log(cron)
		if (cron.status == 'busy') {
			return;
		}
		console.log('-------Start - upload-incomplete-operations------');

		await modelCronLock.acquireLock('upload-incomplete-operations');
		//upload-incomplete-operations

		const directoryPath = `${process.cwd()}/storage/sql`;
		// Step 1: Get file list from directory
		readdir(directoryPath, (err, files) => {
			if (err) {
				console.error('Error reading directory:', err);
				return;
			}

			// Step 2: Select first 5 last modified files
			const sortedFiles = files
				.filter((file) => !file.startsWith('processed-'))
				.filter((file) => !file.startsWith('error-'))
				.map((file) => ({
					name: file,
					path: path.join(directoryPath, file),
					lastModified: statSync(path.join(directoryPath, file)).mtime.getTime(),
				}))
				.sort((a, b) => b.lastModified - a.lastModified)
				.slice(0, 1);

			// Step 3: Read each file's contents
			sortedFiles.forEach(async (file) => {
				try {
					console.log(file)
					await this.dumpVariantSqlFile(file)
				} catch (error) {
					console.error(error);
				}
			});
		});
		await modelCronLock.releaseLock('upload-incomplete-operations');
	},

	/**
	 * Purpose: This function is used to  dump the data into database using command 
	 * Rename the file in same path when execution complete or incomplete
	 * update the bulk operation status (Complete)
	 * 
	 * @param {*} sqlFile file .sql
	 * @returns Void
	 */
	dumpVariantSqlFile: async function (sqlFile) {
		return new Promise((resolve, reject) => {

			//   const sqlDirectory = 'D:/xampp/mysql/bin'
			//const command = "D:/xampp/mysql/bin/mysqldump -u root -h localhost custom_price_wholesale > "+sqlFile.path;
			//const command = `mysql -u root -h localhost -pensyspass0101 custom_price_wholesale < ${sqlFile.path}`;
			let command = ``;
			if (process.env.NODE_ENV === "production") {
				command = `mysql -u ${process.env.DB_USER} -h ${process.env.DB_HOST} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ${sqlFile.path}`;
			} else {
				const pass = (cnf.dev.PASSWORD == "") ? `` : `-p${cnf.dev.PASSWORD}`
				command = `mysql -u ${cnf.dev.USER} -h ${cnf.dev.HOST} ${pass} ${cnf.dev.DB} < ${sqlFile.path}`;
			}
			exec(command, (error, stdout, stderr) => {
				const fileName = sqlFile.name;

				if (error) {
					rename(sqlFile.path, `${process.cwd()}/storage/sql/error-o-${sqlFile.name}`, () => {
						modelExport.operationErrorStatusUpdate('gid://shopify/BulkOperation/error.json');
						console.log("\nFile Renamed!\n");
					})
					reject(`Error executing command: `);
					return;
				}

				rename(sqlFile.path, `${process.cwd()}/storage/sql/processed-o-${sqlFile.name}`, () => {
					console.log("\nFile Renamed!\n");
				})

				resolve(`SQL file '${sqlFile}' dumped into the database successfully.`);
			});
		});
	},

	/**
	 * Purpose: Retrieves the shop's timezone information.
	 * fetch the export operation list for the specific shop from the database.
	 * 
	 * @param {*} req object
	 * @param {*} res object
	 * @returns object
	 */
	operationList: async function (req, res) {
		try {
			const shopData = await modelExport.getShopDetails(req, res);
			console.log('shopData ==============', shopData)
			//return shopData;
			const timezone_location = shopData.ianaTimezone;
			const exportOperationList = await modelExport.getExportOperationList(req, res).then(function (rows) { return rows });
			const modifiedExportOperationList = exportOperationList.map((item) => {
				return {
					...item,
					timezone_location,
				};
			});
			return modifiedExportOperationList;
		} catch (error) {
			throw new Error("Error : " + error);
		}
	},

	/**
	 * Retrieves CSV data from the database based on the provided req.query.resource_id.
	 * Formatting it as CSV,and returning the csv.
	 * call the createRuleCSV function to create the csv file
	 *
	 * @param req
	 *
	 * @output Return the path to the generated data file (get the csv file)
	 */
	getCsvData: async function (req, res) {
		const resourceId = "gid://shopify/BulkOperation/" + req.query.resource_id;
		const CSVMetaValue = await modelExport.getCSVMetaValue(resourceId, req, res).then(function (rows) { return rows });
		const csv = await this.createRuleCSV(
			//JSON.parse(JSON.stringify(CSVMetaValue)),
			CSVMetaValue,
			req,
			res
		);
		return csv;
	},

	/**
	 * Purpose: This function is responsible for converting the product and variant data into a createCsvRule file.
	 * call the convertJSONToCSV function
	 * 
	 * @param {*} variantLevelData object (product and variant data)
	 * @param {*} req object
	 * @param {*} res object
	 * @returns Return the path to the generated data file
	 */
	createRuleCSV: async function (variantLevelData, req, res) {
		try {
			const resource_id = req.query.resource_id;
			// Convert variantLevelData to CSV format
			let csvData = this.convertJSONToCSV(variantLevelData);

			//const session = globalSession.get();
			const session = await Shopify.Utils.loadCurrentSession(req, res, false);

			// Generate a filename based on the resource_id and session.shop
			const filename = resource_id + "-" + session.shop;

			// Define the path to the data file
			//let datafile = `${process.cwd()}/storage/${filename}.csv`;

			let datafilePath = `${process.cwd()}/storage/download/${filename}.csv`;

			writeToPath(datafilePath, csvData, {
				headers: true
			})

			return { 'path': datafilePath, 'data': csvData }; // Return the path to the generated data file
		} catch (error) {
			console.error(error);
		}
	},

	/**
	 * Purpose : This function converts the product and variant data from JSON format to CSV format.
	 * 
	 * @param {*} products Object (product and variant data)
	 * @returns Return the rule of the variant data object (add the header for csv file )
	 */
	convertJSONToCSV: function (variants) {
		const rowData = []; // Array to store the converted CSV rows
		let variantId = "";

		// Loop through each product
		for (var variant of variants) {
			// Parse the meta_value as JSON to get productVariants
			var variantRule = JSON.parse(variant.meta_value);
			const { qty, type, value, customer, currency } = variantRule;


			// Extract the productId from the parent_id
			variantId = variant.sh_variant_id.split("/");
			variantId = variantId[variantId.length - 1];
			// Loop through each variant of the product

			rowData.push({
				"Variant ID": variantId,
				"Product Title (Ref)": this.replacecharacters(variant.product_name),
				"Variant Name (Ref)": this.replacecharacters(variant.title),
				"Variant SKU (Ref)": this.replacecharacters(variant.sku),
				"Variant Price default currency (Ref)": variant.price,
				"Customer Tag": customer,
				"Currency Code": currency,
				"Unique Rule Identifier": variant.key_name,
				"Offer Quantity": qty,
				"Offer Type": type,
				"Offer Value": value,
			});
		}

		return rowData;
	},

	/**
	 *Purpose:  this function removes carriage returns ("\r"), forward slashes ("/"), and leading/trailing whitespace from the 	input string and returns the modified string. 
	 * 
	 * @param {*} char (string and integer)
	 * @returns char (string is cleaned up and ready for further processing)
	 */
	replacecharacters: function (char) {
		if (char === null) {
			char = ''; // Set char to an empty string if it is null
		} else {
			char = char.toString().replace("\r", "").replace("/", "").trim();
		}
		return char;
	}

};
