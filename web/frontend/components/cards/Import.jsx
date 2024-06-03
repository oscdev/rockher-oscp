import { Card, Button, DropZone, Modal, Banner, Link, Toast, Frame, Loading, Badge} from "@shopify/polaris"; //polaris components
import { ExportMinor} from "@shopify/polaris-icons"; // icons used
import { React, useState, useCallback, useEffect} from "react";
import { useAuthenticatedFetch } from "../../hooks";

export function Import() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [filename, setFilename] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const TOAST_DURATION = 3000; // Duration of the toast message in milliseconds

  const [importLists, setImportLists] = useState([]);
  const [isLoadingImport, setIsLoadingImport] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchImportLists(){
		const listImport = await fetch("/api/variantrule/import/lists").then( (res) => res.json())
		setImportLists(listImport);	
		setIsLoadingImport(false);
  }
    useEffect(() => {
      fetchImportLists()
    }, []);
    function updateimportlist(){
      fetchImportLists()
    }

    const handleFileUpload = useCallback((files)=> {
    const file = files[0];
    setSelectedFile(file);
    //validateFile(file);
    setFilename(file.name);

    const fileExtension = file.name.split(".").pop();
    if (fileExtension !== "csv") {
      setErrorMessage("Only CSV files are supported");
      return;
    }
    
    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target.result;
      const parsedData = parseCSVData(csvData);
      const headerCheck = [
        {
			  "Variant ID": '',
        "Product Title (Ref)": '',
        "Variant Name (Ref)": '',
        "Variant SKU (Ref)": '',
        "Variant Price default currency (Ref)": '',
        "Customer Tag":'',
        "Currency Code":'',
        "Unique Rule Identifier":'',
			  "Offer Quantity": '',
			  "Offer Type": '',
			  "Offer Value": ''
        }];

      if(JSON.stringify(Object.keys(headerCheck[0])) === JSON.stringify(Object.keys(parsedData[0]))){
        const uniqueProductIds = new Set();
        for (const item of parsedData) {
          uniqueProductIds.add(item['Product ID (Ref)']);
        }
        setRowCount(parsedData.length);
        setProductCount(uniqueProductIds.size);
       }else{
          setErrorMessage("CSV Column Not Matched");
      }
      };
    reader.readAsText(file);
  }
  ,[]);

  const fetch = useAuthenticatedFetch();

  const handleImport = useCallback(async () => {
    if (selectedFile && errorMessage === "") {
      setIsModalOpen(false);
      handleDisableButtonClick();
      // Perform the import operation
      const formData = new FormData();
      formData.append('attachment', selectedFile);
      const config = {
        method: "POST",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        body: formData,
      };

      const showToastMessage = (message) => {
        setToastMessage(message);
      
        // Remove the toast message after a certain duration
        setTimeout(() => {
          setToastMessage("");
        }, TOAST_DURATION);
      };

      showToastMessage("File imported!"); 
      const listExport = await fetch("/api/variantrule/import", config).then((res) => res.json())
      updateimportlist();
      // if (listExport) {
      //   //console.log("File uploaded successfully!111");
      //   showToastMessage("File imported!"); // Show the success toast message
      // } else {
      //   //console.log("Error uploading file111");
      //   showToastMessage("Error uploading file"); // Show an error toast message
      // }

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }
  }, [selectedFile, errorMessage, fetch]);


  const parseCSVData = (csvData) => {
    const lines = csvData.split(/\r?\n/); // Split lines by any line ending format
    const headers = lines[0].split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");
      if (currentLine.length === headers.length) {
        const product = {};
        for (let j = 0; j < headers.length; j++) {
          product[headers[j]] = currentLine[j];
        }
        data.push(product);
      }
    }

    return data;
  };

  const toggleModal = () => {
    //setIsLoadingImport(true);
    setIsModalOpen(!isModalOpen);
    setSelectedFile(null);
    setErrorMessage("");
    setRowCount(0);
    setProductCount(0);
    setFilename("");
  };

  // when we import a file button disabled for 30 seconds.
  // show message
  const handleDisableButtonClick = () => {
    setIsDisabled(true);
    setMessage('Button is disabled for 30 seconds');

    setTimeout(() => {
      setIsDisabled(false);
      setMessage('');
    }, 30000); // 30 seconds in milliseconds
  };

  async function downloadCsv(){
		const downloadCsv =  [
			{
			  "Product ID (Ref)": 4538802208853,
			  "Variant ID (Ref)": 31801144377429,
			  "Product Title (Ref)": 'Olive Green Jacket',
        "Variant Name (Ref)": 'XL',
        "Variant SKU (Ref)": 'O-G-Jacket-XL',
        "Variant Price (Ref)": 100.00,
        "Offer Quantity": 1,
			  "Discount Type": "fixed",
			  "Offer Value": 90.00
			},
      {
			  "Product ID (Ref)": 7557585502396,
			  "Variant ID (Ref)": 41869505888444,
        "Product Title (Ref)": 'Chequered Red Shirt',
        "Variant Name (Ref)": 'Default Title',
        "Variant SKU (Ref)": 'CRS-0101',
        "Variant Price (Ref)": 50.00,
			  "Offer Quantity": 5,
			  "Discount Type": "fixed",
			  "Offer Value": 40.00
			},			
			{
			  "Product ID (Ref)": 7557585010876,
			  "Variant ID (Ref)": 42839781474492,
			  "Product Title (Ref)": 'Floral White Top',
        "Variant Name (Ref)": 'Small',
        "Variant SKU (Ref)": 'AB-F22',
        "Variant Price (Ref)": 75.00,
        "Offer Quantity": 2,
			  "Discount Type": "fixed",
			  "Offer Value": 70.00
			},
			{
				"Product ID (Ref)": 7557585469628,
				"Variant ID (Ref)": 42039581671612,
				"Product Title (Ref)": 'Long Sleeve Cotton Top',
        "Variant Name (Ref)": 'S / BLUE',
        "Variant SKU (Ref)": 'LSCT-0021',
        "Variant Price (Ref)": 50.00,
        "Offer Quantity": 5,
				"Discount Type": "percent",
				"Offer Value": 10
			  }
		  ];

      const download = (function () {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, fileName) {
          const blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        };
      }());
  
      const separator = ','; // CSV separator character
      const keys = Object.keys(downloadCsv[0]);
      const headerRow = keys.join(separator);
  
      const rows = downloadCsv.map((row) => {
      return keys.map((key) => {
        return row[key];
      }).join(separator);
      });
    
      const data = headerRow + '\n' + rows.join('\n'),
        fileName = "sample-price-rules.csv";
  
      download(data, fileName);
  
    }
    const locale = [
      {"Etc/GMT+12": "en-US"},
      {"Pacific/Pago_Pago": "en-US"},
      {"Pacific/Midway": "en-US"},
      {"Pacific/Honolulu": "en-US"},
      {"America/Juneau": "en-US"},
      {"America/Los_Angeles": "en-US"},
      {"America/Tijuana": "en-US"},
      {"America/Phoenix": "en-US"},
      {"America/Mazatlan": "en-US"},
      {"America/Denver": "en-US"},
      {"America/Guatemala": "en-US"},
      {"America/Chicago": "en-US"},
      {"America/Chihuahua": "en-US"},
      {"America/Mexico_City": "en-US"},
      {"America/Monterrey": "en-US"},
      {"America/Regina": "en-US"},
      {"America/Bogota": "en-US"},
      {"America/New_York": "en-US"},
      {"America/Indiana/Indianapolis": "en-US"},
      {"America/Lima": "en-US"},
      {"America/Halifax": "en-US"},
      {"America/Caracas": "en-US"},
      {"America/Guyana": "en-US"},
      {"America/La_Paz": "en-US"},
      {"America/Puerto_Rico": "en-US"},
      {"America/Santiago": "en-US"},
      {"America/St_Johns": "en-US"},
      {"America/Sao_Paulo": "en-US"},
      {"America/Argentina/Buenos_Aires": "en-US"},
      {"America/Godthab": "en-US"},
      {"America/Montevideo": "en-US"},
      {"Atlantic/South_Georgia": "en-US"},
      {"Atlantic/Azores": "en-US"},
      {"Atlantic/Cape_Verde": "en-US"},
      {"Europe/London": "en-GB"},
      {"Europe/Lisbon": "pt-PT"},
      {"Africa/Monrovia": "en-LR"},
      {"Etc/UTC": "en-US"},
      {"Europe/Amsterdam": "nl-NL"},
      {"Europe/Belgrade": "sr-RS"},
      {"Europe/Berlin": "de-DE"},
      {"Europe/Zurich": "de-CH"},
      {"Europe/Bratislava": "sk-SK"},
      {"Europe/Brussels": "nl-BE"},
      {"Europe/Budapest": "hu-HU"},
      {"Africa/Casablanca": "fr-MA"},
      {"Europe/Copenhagen": "da-DK"},
      {"Europe/Dublin": "en-IE"},
      {"Europe/Ljubljana": "sl-SI"},
      {"Europe/Madrid": "es-ES"},
      {"Europe/Paris": "fr-FR"},
      {"Europe/Prague": "cs-CZ"},
      {"Europe/Rome": "it-IT"},
      {"Europe/Sarajevo": "bs-BA"},
      {"Europe/Skopje": "mk-MK"},
      {"Europe/Stockholm": "sv-SE"},
      {"Europe/Vienna": "de-AT"},
      {"Europe/Warsaw": "pl-PL"},
      {"Africa/Algiers": "ar-DZ"},
      {"Europe/Zagreb": "hr-HR"},
      {"Europe/Athens": "el-GR"},
      {"Europe/Bucharest": "ro-RO"},
      {"Africa/Cairo": "ar-EG"},
      {"Africa/Harare": "en-ZW"},
      {"Europe/Helsinki": "fi-FI"},
      {"Asia/Jerusalem": "he-IL"},
      {"Europe/Kaliningrad": "ru-RU"},
      {"Europe/Kiev": "uk-UA"},
      {"Africa/Johannesburg": "en-ZA"},
      {"Europe/Riga": "lv-LV"},
      {"Europe/Sofia": "bg-BG"},
      {"Europe/Tallinn": "et-EE"},
      {"Europe/Vilnius": "lt-LT"},
      {"Asia/Baghdad": "ar-IQ"},
      {"Europe/Istanbul": "tr-TR"},
      {"Asia/Kuwait": "ar-KW"},
      {"Europe/Minsk": "be-BY"},
      {"Europe/Moscow": "ru-RU"},
      {"Africa/Nairobi": "en-KE"},
      {"Asia/Riyadh": "ar-SA"},
      {"Europe/Volgograd": "ru-RU"},
      {"Asia/Tehran": "fa-IR"},
      {"Asia/Muscat": "ar-OM"},
      {"Asia/Baku": "az-AZ"},
      {"Europe/Samara": "ru-RU"},
      {"Asia/Tbilisi": "ka-GE"},
      {"Asia/Yerevan": "hy-AM"},
      {"Asia/Kabul": "ps-AF"},
      {"Asia/Yekaterinburg": "ru-RU"},
      {"Asia/Karachi": "ur-PK"},
      {"Asia/Tashkent": "uz-UZ"},
      {"Asia/Kolkata": "en-IN"},
      {"Asia/Colombo": "si-LK"},
      {"Asia/Kathmandu": "ne-NP"},
      {"Asia/Almaty": "kk-KZ"},
      {"Asia/Dhaka": "bn-BD"},
      {"Asia/Urumqi": "zh-CN"},
      {"Asia/Rangoon": "my-MM"},
      {"Asia/Bangkok": "th-TH"},
      {"Asia/Jakarta": "id-ID"},
      {"Asia/Krasnoyarsk": "ru-RU"},
      {"Asia/Novosibirsk": "ru-RU"},
      {"Asia/Shanghai": "zh-CN"},
      {"Asia/Chongqing": "zh-CN"},
      {"Asia/Hong_Kong": "zh-HK"},
      {"Asia/Irkutsk": "ru-RU"},
      {"Asia/Kuala_Lumpur": "ms-MY"},
      {"Australia/Perth": "en-AU"},
      {"Asia/Singapore": "en-SG"},
      {"Asia/Taipei": "zh-TW"},
      {"Asia/Ulaanbaatar": "mn-MN"},
      {"Asia/Tokyo": "ja-JP"},
      {"Asia/Seoul": "ko-KR"},
      {"Asia/Yakutsk": "ru-RU"},
      {"Australia/Adelaide": "en-AU"},
      {"Australia/Darwin": "en-AU"},
      {"Australia/Brisbane": "en-AU"},
      {"Australia/Melbourne": "en-AU"},
      {"Pacific/Guam": "en-US"},
      {"Australia/Hobart": "en-AU"},
      {"Pacific/Port_Moresby": "en-US"},
      {"Australia/Sydney": "en-AU"},
      {"Asia/Vladivostok": "ru-RU"},
      {"Asia/Magadan": "ru-RU"},
      {"Pacific/Noumea": "fr-NC"},
      {"Pacific/Guadalcanal": "en-SB"},
      {"Asia/Srednekolymsk": "ru-RU"},
      {"Pacific/Auckland": "en-NZ"},
      {"Pacific/Fiji": "en-FJ"},
      {"Asia/Kamchatka": "ru-RU"},
      {"Pacific/Majuro": "en-MH"},
      {"Pacific/Chatham": "en-NZ"},
      {"Pacific/Tongatapu": "en-TO"},
      {"Pacific/Apia": "en-WS"},
      {"Pacific/Fakaofo": "en-TK"}
      ]	 
    async function  downloadFile(fileName) {
      //write code for the csv file download option for user
    }
  return (
    <Frame>
    <Card title="Import">
      <Card.Section>
        {isLoadingImport && <Loading />} {/* Make sure to define Loading component */}
        <h2>To import discount rules into Shopify admin using a CSV file
        <br />
        <b>Note:</b> Import file is available for the next 7 days.
        </h2>
        {importLists.length ? (
          importLists.map(({
            sh_shop,
            file_attachment,
            app_status,
            shop_status,
            created_at,
            no_of_lines,
            no_of_lines_received,
            poll_status,
            line_error,
            csvname_modified,
            timezone_location,
          }, index) => {
            const timestamp = new Date(created_at);
            const localeCodeData = locale.find((language) => {
              const [timezone] = Object.keys(language);
              return timezone === timezone_location;
            });
            const localeCode = localeCodeData
              ? Object.values(localeCodeData)[0]
              : 'en-US';
            const options = {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              timeZone: timezone_location,
            };
            const localTime = timestamp.toLocaleString(
              localeCode,
              options
            );

            let listItem;
            if (line_error > 0 && poll_status === 'COMPLETED') {
              listItem = (
                <li key={index}>
                  {/* <Link onClick={() => downloadFile(file_attachment)}>
                  </Link> */}
                    <Badge status="critical" progress="complete">
                      {localTime}
                    </Badge>{' '}
                    <p>Imported with Error in {line_error} number of lines</p>
                </li>
              );
            } else if (poll_status === 'COMPLETED') {
              listItem = (
                <li key={index}>
                  <Badge status="success" progress="complete">
                    {localTime}
                  </Badge>{' '}
                  <p>File successfully imported</p>
                </li>
              );
            } else {
              listItem = (
                <li key={index}>
                  {/* <Badge status="critical" progress="complete"> */}
                  <Badge status="success" progress="complete">
                    {localTime}
                  </Badge>{' '}
                  <p>File successfully imported</p>
                  {/* <p>File importing in progress</p> */}
                </li>
              );
            }

            return listItem;
          })
        ) : (
          <h4>No File available</h4>
        )}
        <div className="dashboardBtn" style={{ textAlign: "right" }}>
        <br />
          <Button primary onClick={toggleModal} icon={ExportMinor} disabled={isDisabled}>
            Import
          </Button>
          <p>{message}</p>
          { toastMessage && (
          <Toast content={toastMessage} onDismiss={() => setToastMessage('')} />
          )}

        </div>
      </Card.Section>
      <Modal
        open={isModalOpen}
        onClose={toggleModal}
        title="Import File by CSV"
        primaryAction={{
          content: "Upload",
          onAction: handleImport,
          disabled: !selectedFile || errorMessage !== "",
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: toggleModal,
          },
        ]}
      >
        <Modal.Section>
        {!selectedFile ? (
            <>
              <p>
                Download a{' '}
                <Link onClick={downloadCsv}>sample CSV template</Link> to see an example of the format required.
              </p>
            </>
          ) : (
            <>
              {selectedFile.name.endsWith('.csv') && (
                <>
                  <p>Added File: {filename}</p>
                  <p>Number of products: {productCount}</p>
                  <p>Number of rows: {rowCount}</p>
                </>
              )}
            </>
          )}
          
          {errorMessage && (
            <Banner status="critical">
              <p>{errorMessage}</p>
            </Banner>
          )}
          <br />
          {!selectedFile ? (
            <DropZone onDrop={handleFileUpload}>
              <DropZone.FileUpload />
              <p>Drag and drop a CSV file here or click to browse</p>
            </DropZone>
          ) : null}
            
        </Modal.Section>
      </Modal>
    </Card>
  </Frame>
  );
}