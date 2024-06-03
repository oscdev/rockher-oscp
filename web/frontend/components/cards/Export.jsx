import { Card, Button, Layout, Spinner, List, Link,Icon,Frame,Toast, Badge,Tooltip, TextStyle, Loading } from "@shopify/polaris"; //polaris components
import { ImportMinor,QuestionMarkInverseMinor  } from "@shopify/polaris-icons"; // icons used
import { React, useState, useCallback, useEffect } from "react";
import { useAuthenticatedFetch } from "../../hooks";

export function Export(props) {
	const {  } = props;
	const [exportLists, setExportLists] = useState([]);
	async function fetchExportLists(){
		// setIsLoadingExport(true);
		const listExport = await fetch("/api/variantrule/export/lists").then( (res) => res.json())
		setIsLoadingExport(false);
		setExportLists(listExport);	
	}

	useEffect(() => {
	     fetchExportLists()
	}, []);

	const [isLoadingExport, setIsLoadingExport] = useState(false);
	const [exportedFileUrl, setExportedFileUrl] = useState("");
	const [toastMessage, setToastMessage] = useState('');
	const handleExport = useCallback(() => {
		//setIsLoadingExport(true);
		runExport();
		setToastMessage('Exporting data...');
	}, []);

	/****** */
	// async function getIncompleteOperations(){
	// 	await fetch("/api/export/cron/prepare-incomplete-operations").then( (res) => res.json())
	// }
	// async function updateIncompleteOperations(){
	// 	await fetch("/api/export/cron/upload-incomplete-operations").then( (res) => res.json())
	// }
	/***** */

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

	//   console.log("locale",locale);
	async function runExport(){
		const Export = await fetch("/api/variantrule/export").then( (res) => res.json())
		fetchExportLists()
		setIsLoadingExport(false);
	}

	const handleDownload = useCallback(() => {
		// Trigger file download
		window.open(exportedFileUrl, "_self");
		setExportedFileUrl(null);
	}, [exportedFileUrl]);

	async function downloadData(operationId, created_at, shop){
		operationId = operationId.split('/')
		operationId = operationId[operationId.length-1]
		const downloadData = await fetch("/api/variantrule/export/csv?resource_id="+operationId).then( (res) => res.json())

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
		const keys = Object.keys(downloadData[0]);
		const headerRow = keys.join(separator);
		const rows = downloadData.map((row) => {
		return keys.map((key) => {
			return row[key];
		}).join(separator);
		});

		//return headerRow + '\n' + rows.join('\n');
		function fileNameFormat(date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');
		  
			return `Export_${year}-${month}-${day}_${hours}${minutes}${seconds}.csv`;
		  }
		  
		  const currentDate = new Date();
		  
		  const data = headerRow + '\n' + rows.join('\n'),
		   fileName = fileNameFormat(currentDate);
			// fileName = "Export_"+created_at+".csv";

		download(data, fileName);
	}

	const fetch = useAuthenticatedFetch();

	return (
		<Frame>
		<Layout>
		  <Layout.Section oneHalf>
			<Card title="Export">
				<Card.Section>
				{isLoadingExport && <Loading />}
					<h2>To export discount rules from Shopify admin using a CSV file<br/>
<b>Note:</b> Downloaded file is available for next 7 days.</h2>
				{(exportLists.length) ? <List type="bullet">
				{exportLists.map(({sh_shop, sh_operation_id, app_operation_error, app_operation_status, created_at, timezone_location, meta_value_count}, index) => {
					const timestamp = new Date(created_at);
					const localeCodeData = locale.find((language) => {
						const [timezone] = Object.keys(language);
						return timezone === timezone_location;
					  });
					  const localeCode = localeCodeData ? Object.values(localeCodeData)[0] : "en-US";
						var options = {
							month: 'long',
							day: 'numeric',
							year: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							// hour12: true,
							timeZone: timezone_location
						};
					const localTime = timestamp.toLocaleString( localeCode , options);
					return (app_operation_status == 'COMPLETE')  ? <List.Item>
					<Badge status="success" progress="complete">{localTime}</Badge> {
						(meta_value_count) ? <span className="customDownload"><Link onClick={(e) => {
							downloadData(sh_operation_id, created_at, sh_shop)
						}}>Download</Link></span> : <span className="customDownload">No Data Available</span>
					}
				</List.Item> :
				<>
				{(app_operation_error == 'ERROR') ? <List.Item>
					<Badge status="critical">{localTime}</Badge> Failed
				</List.Item> : <List.Item>
				<Badge progress="complete">{localTime}</Badge> <i>In progress <Link onClick={(e) => {
						fetchExportLists();
						setToastMessage("This might take few minutes, please check after some time")
					}}><div className="checkStatus">Click to update status<Tooltip preferredPosition='above' content="This might take few minutes, please check after some time"><TextStyle> <Icon color="base" source={QuestionMarkInverseMinor} /></TextStyle></Tooltip></div></Link></i>
				</List.Item>}
				</>
				})}
				</List> : ''}
				<br/>

<div className="dashboardBtn" style={{ textAlign: 'right' }}>
				{/* <Button
					style={{ marginRight: "25px" }}
					primary
					textAlign="left"
					onClick={getIncompleteOperations}
				>
					Cron - Get Incomplete Operations
				</Button>
				<Button
					style={{ marginRight: "25px" }}
					primary
					textAlign="left"
					onClick={updateIncompleteOperations}
				>
					Cron - Update Incomplete Operations
				</Button> */}

				<Button
					style={{ marginRight: "25px" }}
					primary
					textAlign="left"
					icon={ImportMinor}
					onClick={handleExport}
					disabled={isLoadingExport}
				>
					Export
				</Button>
				</div>
				{toastMessage && (
  <Toast content={toastMessage} onDismiss={() =>setToastMessage('')}  />)}
				{exportedFileUrl && (
				<div style={{ marginTop: "10px" }}>
					<Button  icon={ImportMinor} onClick={handleDownload}>Download</Button>
				</div>
				)}

				</Card.Section>
			</Card>
		  </Layout.Section>
		  </Layout>

		  </Frame>
	);

}