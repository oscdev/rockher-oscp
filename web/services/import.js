import { Shopify } from "@shopify/shopify-api";
import { QL } from "../helpers/graph-ql.js"
import { readFile, writeFile, promises } from "fs";
import fs from "fs";
import csv from "csv-parser";
import { execFile } from 'child_process';
import { parseString } from "xml2js";
import { modelImport } from "../models/index.js";

export const importVariantRuleData = {
    requestOperationViaBulkForm: async function (req, res) {
		const $this = this;
		const session = await Shopify.Utils.loadCurrentSession(req, res, false);
		const Rules = req.body;

		const sortedRules = Rules.slice(); // Create a copy of the original array
		sortedRules.sort((a, b) => {
		  const qtyA = parseInt(a.qty, 10);
		  const qtyB = parseInt(b.qty, 10);
		  return qtyA - qtyB;
		});
		const formRuleData = sortedRules.filter((rule) => {
			// Check if status is 'disable' and uniqueRuleIdentifier is blank
			return !(rule.status === 'disable' && rule.uniqueRuleIdentifier === '');
		  }).map((rule) => {
			// Create a new object with qty, type, value, and customer fields set to empty strings
			if (rule.status === 'disable') {
			  //rule.qty = '';
			//   rule.type = '';
			  //rule.value = '';
			//   rule.customer = '';
			//   rule.currency = '';
			}
			return rule;
		  });  
		  
		  const groupedData = {};
		  const uniqueRule = Array.from({ length: 20 }, (_, i) => `rule${i + 1}`);
		  
		  formRuleData.forEach((item) => {
			const key = `${item.variantId}_${item.varianName}`;
			if (!groupedData[key]) {
			  groupedData[key] = [];
			}
			groupedData[key].push(item);
		  });
		  
		  const output = Object.values(groupedData).map((group) => {
			group.sort((a, b) => parseFloat(a.qty) - parseFloat(b.qty));
			let missingRuleIndex = 0;
		  
			const result = group.map((item) => {
			  item.uniqueRuleIdentifier = uniqueRule[missingRuleIndex];
			  missingRuleIndex = (missingRuleIndex + 1) % 20;
			  return item;
			});
		  
			return result;
		  });
		const formRules = output.flat();

		$this.bulkFormOperation(formRules, session, req, res);
	  },	  
	bulkFormOperation: async function (formRules, session, req, res) {
		const jsonlData = [];

		// Iterate over each line starting from index 1 (skipping the header)
		for (let i = 0; i < formRules.length; i++) {
			jsonlData.push({
				"metafields": [
					{
						"key": `${formRules[i].uniqueRuleIdentifier}`,
						"namespace": "oscp",
						"ownerId": `gid://shopify/ProductVariant/${formRules[i].variantId}`,
						"type": "json",
						"value": JSON.stringify({
							'qty': formRules[i].qty,
							'type': formRules[i].type,
							'value': formRules[i].value,
							'customer': formRules[i].customer,
							'currency': formRules[i].currency,
							'status': formRules[i].status
						})
					}
				]
			})

		}
		// Convert each JSONL object to a string and join them with newlines
		const formRulesJSONL =  jsonlData.map((obj) => JSON.stringify(obj)).join('\n');

		writeFile(`${process.cwd()}/storage/upload/bulkform/${session.shop}.jsonl`, formRulesJSONL, async (err) => {
			if (err) {
				console.error('Error saving Data:', err);
				return { status: "failed", msg: "Data could not be saved" };
			}
			const stageInfo = await this.stagedUploadCreate(req, res); // get the url of shopify storage.googleapis.com
			await this.sendAttachmentToStage(stageInfo, `${process.cwd()}/storage/upload/bulkform/${session.shop}.jsonl`, req, res);			
			return { status: "ok", msg: "data saved" };
		})
	},

	/**
	 * Purpose: Save the uploaded CSV file in app Upload folder
	 * Validate the header of csv file 
	 * Call the convertToJSONL function and create the jsonl file in app upload folder
	 * call the stagedUploadCreate and sendAttachmentToStage function
	 * 
	 * 
	  @param {} req object (csv file get)
	  @param {} res 
	 * @returns object
	 */
	  requestOperation: async function (req, res) {
		const $this = this;
		const attachmentFile = req.files.attachment;
		// Save the file using the data buffer
		// Create stage to Upload data in shopify
		// Using stage credencial sent another request to shopify with attachment
		// Run graphQL mutation to process data
		// Save the file using the data buffer
		try {
			const session = await Shopify.Utils.loadCurrentSession(req, res, false);
			const currentTimestamp = new Date().getTime(); // This will output the current timestamp in milliseconds
			const initialCSV = `${currentTimestamp}-${session.shop}-${attachmentFile.name}`;

			await promises.writeFile(`${process.cwd()}/storage/upload/${attachmentFile.name}`, attachmentFile.data);
			writeFile(`${process.cwd()}/storage/upload/import-files/${initialCSV}`, attachmentFile.data, (err) => {
				if (err) {
					console.error('Error saving file:', err);
					//return res.status(500).json({ error: "File could not be saved" });
				}
			});
			
			const data = await promises.readFile(`${process.cwd()}/storage/upload/${attachmentFile.name}`, 'utf8');

			// const lines = data.trim().split('\n');
			const lines = data.trim().split(/\r?\n/);
			const fileHeader = lines[0].split(',');
			const header = this.getHeaderIndex(fileHeader);


			if (!this.isValidHeader(header)) {
			  return {'status': 'error', 'msg' : 'Invalid Header'}
			}

			const jsonlData = this.convertToJSONL(lines, header);
			const outputFilePath = `${process.cwd()}/storage/upload/${attachmentFile.name}.jsonl`;

			await promises.writeFile(outputFilePath, jsonlData, 'utf8');

			const stageInfo = await this.stagedUploadCreate(req, res); // get the url of shopify storage.googleapis.com
			this.sendAttachmentToStage(stageInfo, outputFilePath, req, res);
			
			const filePath = attachmentFile.name;
			const imporStatus = await modelImport.insertImportStatus(req, res, filePath, initialCSV);
			if(imporStatus){
				const countcsvRecord =  $this.csvCountUpdate(session.shop,initialCSV);
			}
			return {'status': 'success', 'msg' : 'Request submitted'}

		} catch (error) {
			return {'status': 'error', 'msg' : error}
		}

	},

	/**
	 * Purpose: Create nested objects to store product data
	 * Convert each JSONL object to a string and join them with newlines
	 *  
	  @param {} lines Object (CSV file data rule)
	  @param {} header object (header index position)
	 * @returns object (metafields rules)
	 */
	convertToJSONL: function (lines, header) {
		// Split the CSV data into lines and trim any whitespace
		//const lines = csvData.trim().split('\n');

		// Initialize variables to store the JSONL data
		const jsonlData = [];

		// Iterate over each line starting from index 1 (skipping the header)
		for (let i = 1; i < lines.length; i++) {
			const currentLine = lines[i].split(',');

			if(!this.isValidLine(currentLine, header)){
				continue;
			}
			// Create nested objects to store product data
			if(!currentLine[header.offerQtyIndex] && !currentLine[header.offerTypeIndex] && !currentLine[header.offerValueIndex]){
			jsonlData.push({
				"metafields": [
					{
						"key": `${currentLine[header.ruleIdentifierIndex]}`,
						"namespace": "oscpPriceRule",
						"ownerId": 'gid://shopify/ProductVariant/' + currentLine[header.variantIdIndex],
						"type": "json",
						"value": JSON.stringify({
							'qty': currentLine[header.offerQtyIndex],
							'type': currentLine[header.offerTypeIndex],
							'value': currentLine[header.offerValueIndex],
							'customer':currentLine[header.customerTagIndex] !== '' ? currentLine[header.customerTagIndex] : 'All',
							'currency': currentLine[header.currencyCodeIndex]
						})
					}
				]
			})
		}else{
			jsonlData.push({
					"metafields": [
						{
							"key": `${currentLine[header.ruleIdentifierIndex]}`,
							"namespace": "oscpPriceRule",
							"ownerId": 'gid://shopify/ProductVariant/' + currentLine[header.variantIdIndex],
							"type": "json",
							"value": JSON.stringify({
								'qty': currentLine[header.offerQtyIndex] !== '' ? currentLine[header.offerQtyIndex] : '1',
								'type': currentLine[header.offerTypeIndex],
								'value': currentLine[header.offerValueIndex],
								'customer':currentLine[header.customerTagIndex] !== '' ? currentLine[header.customerTagIndex] : 'All',
								'currency': currentLine[header.currencyCodeIndex]
							})
						}
					]
				})
			}
	}
		// Convert each JSONL object to a string and join them with newlines
		return jsonlData.map((obj) => JSON.stringify(obj)).join('\n');
	},

	/**
	 * Purpose: This function is to validate a line of data by checking if specific elements in the line
	 * 
	  @param {} line array
	  @param {} header object
	 * @returns true or false
	 */
	isValidLine: function (line, header) {
		if((line[header.variantIdIndex] == '') || (line[header.ruleIdentifierIndex] == '')){
			return false;
		}
		
		return true;
	},

	/**
	 * Purpose: This function is to validate the header object by checking if specific properties are defined
	 * 
	  @param {} header object
	 * @returns true or false
	 */
	isValidHeader: function (header) {
		if(typeof(header.variantIdIndex) == 'undefined'){
			return false;
		}

		if(typeof(header.customerTagIndex) == 'undefined'){
			return false;
		}

		if(typeof(header.currencyCodeIndex) == 'undefined'){
			return false;
		}

		if(typeof(header.ruleIdentifierIndex) == 'undefined'){
			return false;
		}

		if(typeof(header.offerQtyIndex) == 'undefined'){
			return false;
		}

		if(typeof(header.offerTypeIndex) == 'undefined'){
			return false;
		}

		if(typeof(header.offerValueIndex) == 'undefined'){
			return false;
		}

		return true;
	},

	/**
	 * Purpose: This function is to find the index of specific headers in the fileHeader array 
	 * 
	  @param {} fileHeader array
	 * @returns object (header)
	 */
	getHeaderIndex: function (fileHeader) {
		let variantIdIndex, customerTagIndex, currencyCodeIndex, ruleIdentifierIndex, offerQtyIndex, offerTypeIndex, offerValueIndex;

		for (let h = 0; h < fileHeader.length; h++) {

			if(fileHeader[h].indexOf("Variant ID") > -1){
				variantIdIndex = h;
			}

			if(fileHeader[h].indexOf("Currency Code") > -1){
				currencyCodeIndex = h;
			}

			if(fileHeader[h].indexOf("Customer Tag") > -1){
				customerTagIndex = h;
			}

			if(fileHeader[h].indexOf("Unique Rule Identifier") > -1){
				ruleIdentifierIndex = h;
			}

			if(fileHeader[h].indexOf("Offer Quantity") > -1){
				offerQtyIndex = h;
			}

			if(fileHeader[h].indexOf("Offer Type") > -1){
				offerTypeIndex = h;
			}

			if(fileHeader[h].indexOf("Offer Value") > -1){
				offerValueIndex = h;
			}
		}

		return {
			variantIdIndex: variantIdIndex,
			customerTagIndex: customerTagIndex,
			currencyCodeIndex: currencyCodeIndex,
			ruleIdentifierIndex: ruleIdentifierIndex,
			offerQtyIndex: offerQtyIndex,
			offerTypeIndex: offerTypeIndex,
			offerValueIndex: offerValueIndex
		}
	},
	
	delay: function (time) {
		return new Promise(resolve => setTimeout(resolve, time));
	},
	bulkImportMutation: async function (stagePath, req, res) {
		return await modelImport.bulkImportMutation(stagePath, req, res)
	},

	/**
	 * Purpose: This function is used to get the stage of storage googleapis
	 * 
	  @param {} req 
	  @param {} res 
	 * @returns object (EX: https://shopify-staged-uploads.storage.googleapis.com)
	 */
	stagedUploadCreate: async function(req, res) {
		return await modelImport.stagedUploadCreate(req, res)
	},

	/**
	 * Purpose: Add the file to be sent as an attachment to curl arguments and execute the curl command with the constructed arguments
	 * Call the bulkImportMutation function with the parsed data
	 * 
	  @param {} stageInfo object (Get the url of shopify storage.googleapis.com)
	  @param {} outputFilePath  (JsonL file path)
	  @param {} req object
	  @param {} res object
	 * @returns Void
	 */
	sendAttachmentToStage: async function (stageInfo, outputFilePath, req, res) {
		const $this = this;
		const curlCommand = 'curl';
		let curlArgs = []
		// Add verbose flag to curl arguments for debugging
		curlArgs.push('-v')

		// Add location and POST request options to curl arguments
		curlArgs.push('--location')
		curlArgs.push('--request')
		curlArgs.push('POST')
		curlArgs.push(stageInfo[0].url)

		// Add parameters to curl arguments
		for (var field of stageInfo[0].parameters) {
			curlArgs.push('-F')
			curlArgs.push(`${field.name}=${field.value}`)
		}

		// Add the file to be sent as an attachment to curl arguments
		curlArgs.push('-F')
		curlArgs.push(`file=@${outputFilePath}`)

		// Execute the curl command with the constructed arguments
		execFile(curlCommand, curlArgs, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing shell script: ${error}`);
				return;
			}

			// Process the XML output received from the curl command
			const xmlOutput = stdout;
			// Parse the XML output into a JavaScript object
			parseString(xmlOutput, async (error, result) => {
				if (error) {
					console.error(`Error parsing XML: ${error.message}`);
					return;
				}
				// Access the parsed XML data in the JavaScript object format
				const parsedData = result;
				
				// Call the bulkImportMutation function with the parsed data
				const bulkImportMutationData = await $this.bulkImportMutation(parsedData.PostResponse.Key, req, res);
				
				console.log('bulkImportMutationData' , JSON.stringify(bulkImportMutationData));
			});
		});
	},
	importCSVList: async function (req, res) {
		try {
			const shopData = await modelImport.getImportFileList(req, res);
			return shopData;
		} catch (error) {
			throw new Error("Error : " + error);
		}
	},
	csvCountUpdate: async function (shop,filename){
		const filePath = `storage/upload/import-files/${filename}`
		let recordCount = 0;

		const results = [];
		fs.createReadStream(filePath)
		  .pipe(csv())
		  .on('data', (data) => {
		  // Process each row of data here
		recordCount++;
	  })
	.on('end',async () => {
	// All data has been read and processed
	await modelImport.updateCountCSVData(shop,recordCount);
	})
	.on('error', (error) => {
	console.error('An error occurred:', error);
	});
	},
    getPollRecords: async function(req, res) {
		const cron = await modelCronLock.checkLock('poll-request');
		console.log("cron start",cron);
		if(cron.status == 'busy'){
			return;
		}
		console.log('-------Start - poll-request------');

		const $this = this;

		await modelCronLock.acquireLock('poll-request');
        console.log("cron is running");

		const importbulkdetails = await modelImport.getBulkImportData(req, res);

		console.log("importbulkdetails", importbulkdetails);
		importbulkdetails.forEach(async data => {	
			console.log("data12345==================",data)
			// await $this.csvCountUpdate(data);
		  try {
			const pollResult = await modelImport.getPollRecords(req, res, data);
			
			const response = await axios.get(pollResult[0].pollStatus.url);
			// console.log('----------axios------------',response)
			// Define the path and filename for saving the file

			let operationId = pollResult[0].pollStatus.id;

			operationId = operationId.split('/');
			operationId = operationId[operationId.length - 1];
			const dataFile = `${process.cwd()}/storage/upload/pollfile/${operationId}-o-${pollResult[0].shop}.jsonl`;
			const jsonData = JSON.stringify(response.data);
			await promises.writeFile(dataFile, jsonData, { encoding: "utf8", flag: "w", mode: 0o666 });
			

			if(pollResult[0].pollStatus){
			
			const dataReadableStream = createReadStream(dataFile, { encoding: 'utf8' });			

			let incompleteLine = '';
			dataReadableStream.on('data',async (chunk) => {
				let pollcount =0;
				const lines = (incompleteLine + chunk).split(/[\r\n]+/);
				incompleteLine = lines.pop();
				for (const line of lines) {
					const jsonObject = JSON.parse(line);
					const usererror = jsonObject.data.metafieldsSet.userErrors[0];
					if(usererror){
						pollcount ++;
					}
				}
			await modelImport.updateBulkImportData(req, res, pollResult,pollcount);

			console.log("pollcount",pollcount)
			}).on('end', async () => {}).on('error', (err) => {
				console.error('Error reading data:', err);
			});
		}else{
			console.log("No bulk operation performed")
		}
	  } catch (error) {
		console.error('Error while processing pollResult:', error);
	  }
	});
		await modelCronLock.releaseLock('poll-request');
		console.log("cron is release");
		return "pollResult";
	},
}