import axios from "axios";
import { writeFile, promises, createReadStream, createWriteStream, readdir, readFile, statSync, rename } from "fs";
import path from "path"
import { modelExport, modelCronLock } from "../models/index.js";
import { exec, spawn } from 'child_process';
//import util from "util"
import { EventEmitter } from "events";
import mysql from "mysql2";
import { cnf } from "../cnf.js";
import { globalSession } from "../helpers/global-session.js"
import { writeToPath } from "fast-csv";
import { Shopify } from "@shopify/shopify-api";


export const exportVariantRuleData = {

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
			const bulkrunnerData = await modelExport.insertRunnerData(data, req, res).then(function (rows) {return rows	});
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
	processOperationsIDToSqlFile: async function(){
		const cron = await modelCronLock.checkLock('prepare-incomplete-operations');
		console.log(cron)
		if(cron.status == 'busy'){
			return;
		}
		console.log('-------Start - prepare-incomplete-operations------');

		await modelCronLock.acquireLock('prepare-incomplete-operations');
		//const bulkData = await modelExport.getBulkDataFileUrl(session, data)
		const incompleteOperations = await modelExport.processOperationsIDToSqlFile().then(function (rows) {	return rows	});
		const filesToProcess = [];
		for(let operation of incompleteOperations){
			try {
				const shOperation = await modelExport.checkOperationStatus(operation)
				if ((shOperation.url == null) && (shOperation.status == 'COMPLETED')) { //No data available in shop
					modelExport.operationStatusUpdate(operation.sh_operation_id, operation.sh_shop);
				}else if (shOperation.url !== null) {
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
		if(filesToProcess.length){
			await this.processRawFiles(filesToProcess);
			await this.processSQLFiles(filesToProcess);
		}else{
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
	processRawFiles: async function(fileList){
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
	processSQLFiles: async function(fileList){
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
	saveRawDataFileInDrive: async function(operation, shOperation) {
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
	 createAndSaveSQLFileInDrive: async function(operation, shOperation){
		// Create a readable stream to read the large data file
		let operationId = operation.sh_operation_id;
		operationId = operationId.split('/');
		operationId = operationId[operationId.length - 1];
		const dataFile = `${process.cwd()}/storage/raw/${operationId}-o-${operation.sh_shop}.jsonl`;
		const dataSQLFile = `${process.cwd()}/storage/sql/${operationId}-o-${operation.sh_shop}.sql`;
		const dataErrorFile = `${process.cwd()}/storage/line-parse-error/${operationId}-o-${operation.sh_shop}.sql`;

		// Create a readable stream to read from the source file
		const dataReadableStream = createReadStream(dataFile, { encoding: 'utf8' });
		// Create a writable stream to write to the destination file
		const dataWritableStream = createWriteStream(dataSQLFile, { encoding: 'utf8' });
		// Create a writable stream to write to the destination file
		const lineErrorWritableStream = createWriteStream(dataErrorFile, { encoding: 'utf8' });

		let incompleteLine = '';

		dataReadableStream.on('data', (chunk) => {
			const lines = (incompleteLine + chunk).split(/[\r\n]+/);
			incompleteLine = lines.pop();
			for (const line of lines) {
				if (line.trim() !== '') {
					try {
						const jsonData = JSON.parse(line);
						// Extract values from JSON
						const { id, title, key, namespace, __parentId ,value, sku, price } = jsonData;

						// Add row to Product Buffer
						if (id.search("Product/") > -1) {
							dataWritableStream.write("INSERT INTO `products` (`shop`, `operation_id`, `product_id`, `title`) VALUES ("+ mysql.escape(operation.sh_shop) +", "+ mysql.escape(operation.sh_operation_id) +", "+ mysql.escape(id) +", "+ mysql.escape(title)+");" + '\n');
						}

						// Add row to Product Buffer
						if (id.search("ProductVariant") > -1) {
							dataWritableStream.write("INSERT INTO `variants` (`sh_shop`, `sh_operation_id`, `sh_variant_id`, `sh_parent_id`, `title`, `price`, `sku`) VALUES ("+ mysql.escape(operation.sh_shop) +", "+ mysql.escape(operation.sh_operation_id) +", "+mysql.escape(id)+", "+ mysql.escape(__parentId) +", "+ mysql.escape(title)+", "+ mysql.escape(price)+", "+mysql.escape(sku)+");" + '\n');
						}

						// Add row to metafield Buffer
						if ((id.search("Metafield") > -1) && (namespace == 'oscpPriceRule')) {
							dataWritableStream.write("INSERT INTO `metafields` (`shop`, `operation_id`, `metafield_id`, `parent_id`, `key_name`, `namespace`, `meta_value`) VALUES ("+ mysql.escape(operation.sh_shop) +", "+ mysql.escape(operation.sh_operation_id) +", "+ mysql.escape(id) +", "+ mysql.escape(__parentId)+", "+ mysql.escape(key)+", "+ mysql.escape(namespace)+", "+ mysql.escape(value)+");" + '\n');
						}
					} catch (error) {
						lineErrorWritableStream.write(line + '\n');
						console.error("Line Parsing Error ", line)
						console.error("Line Parsing Error ", error)
					}

				}
			}
		}).on('end', async () => {}).on('error', (err) => {
			console.error('Error reading data:', err);
		});
	},

	/**
	 * Purpose: Get SQL file list and path from app directory 
	 * call the dumpVariantSqlFile function 
	 * 
	 * @returns Void
	 */
	ProcessSqlFileToDB: async function(){
		const cron = await modelCronLock.checkLock('upload-incomplete-operations');
		console.log(cron)
		if(cron.status == 'busy'){
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
				.slice(0, 5);

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
	dumpVariantSqlFile: async function(sqlFile) {
		return new Promise((resolve, reject) => {

		//   const sqlDirectory = 'D:/xampp/mysql/bin'
		  //const command = "D:/xampp/mysql/bin/mysqldump -u root -h localhost custom_price_wholesale > "+sqlFile.path;
		  //const command = `mysql -u root -h localhost -pensyspass0101 custom_price_wholesale < ${sqlFile.path}`;
		  let command = ``;
		  if(process.env.NODE_ENV === "production"){
			 command = `mysql -u ${process.env.DB_USER} -h ${process.env.DB_HOST} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ${sqlFile.path}`;
		  }else{
			const pass = (cnf.dev.PASSWORD == "") ? `` : `-p${cnf.dev.PASSWORD}`
			 command = `mysql -u ${cnf.dev.USER} -h ${cnf.dev.HOST} ${pass} ${cnf.dev.DB} < ${sqlFile.path}`;
		  }

		  exec(command, (error, stdout, stderr) => {
			const fileName = sqlFile.name;
			const fileDetails = fileName.split('-o-');
			const operationId = fileDetails[0];
			const shopName = fileDetails[1].replace('.sql', '');
			
			if (error) {
				rename(sqlFile.path,`${process.cwd()}/storage/sql/error-o-${sqlFile.name}`, () => {
					modelExport.operationErrorStatusUpdate('gid://shopify/BulkOperation/'+operationId, shopName);
					console.log("\nFile Renamed!\n");})
			  reject(`Error executing command: `);
			  return;
			}

			// commented out because this method execute with returning warning too
			// if (stderr) {
			// 	rename(sqlFile.path, `${process.cwd()}/storage/sql/error-${sqlFile.name}`, () => {
			// 		console.log("\nFile Renamed!\n");})
			//   reject(`Command stderr: ${stderr}`);
			//   return;
			// }

			rename(sqlFile.path, `${process.cwd()}/storage/sql/processed-o-${sqlFile.name}`, () => {
				console.log("\nFile Renamed!\n");})

			modelExport.operationStatusUpdate('gid://shopify/BulkOperation/'+operationId, shopName);
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
			const exportOperationList = await modelExport.getExportOperationList(req, res).then(function (rows) {return rows});
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
		const resourceId =	"gid://shopify/BulkOperation/" + req.query.resource_id;
		const CSVMetaValue = await modelExport.getCSVMetaValue(resourceId, req, res).then(function (rows) {	return rows	});
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

			return {'path': datafilePath, 'data': csvData}; // Return the path to the generated data file
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
				"Variant SKU (Ref)" : this.replacecharacters(variant.sku),
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
	replacecharacters: function(char) {
		if (char === null) {
			char = ''; // Set char to an empty string if it is null
		} else {
			char = char.toString().replace("\r", "").replace("/", "").trim();
		}
		return char;
	}
	
};
