<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from "$app/stores"; 
	import { goto } from "$app/navigation";
	import { storeSensors, storeIsDeleteMode, storePhoneID, storeHideAddSensor } from './store.ts'

	import { SensorType } from './sensors'
	import { fetchApi } from './api'
	import SensorStandard from './SensorStandard.svelte';
	import DeleteSaveBar from './DeleteSaveBar.svelte';
	import AddSensor from './AddSensor.svelte';
	import Loading from './Loading.svelte';
	import Welcome from './Welcome.svelte'

	var sensorData:any[] = []
	var sensorIDs:string[] = []
	var loadingInProgress:boolean = false
	var hideAddSensor:boolean = false

	// Define Colors
	const highlightColors = ['#ff6f10', '#3b910a', '#36389c', '#d2168d', '#0083a3', '#bd8a05']

	// Subscribe to Delete Mode
	var isDeleteMode:boolean = false
	storeIsDeleteMode.subscribe((v:boolean) => isDeleteMode = v)

	const cloneAndRename = (device:any, property:string, userSensors:any[]):any => {
		// Clone entry
		var cloneData:any = JSON.parse(JSON.stringify(device))

		// Rename 't1' to '_value'
		cloneData.measurements = cloneData.measurements.map((e:any) => {
			return {...e, '_value': e[property]}
		})

		// Rename Sensor Name
		var sensorNames:any[] = userSensors.filter(f => f.sensorID == device.deviceid)
		if(sensorNames.length > 0)
		{
			cloneData.name = sensorNames[0].sensorName
		}
		else
		{
			cloneData.name = 'Unbekannt'
			console.error(`SensorID ${device.deviceid} nicht gefunden`)
		}

		return cloneData
	}

	onMount(async () => {

		// Update URL on Store Change
		storeSensors.subscribe((userSensors:any[]) => {
			if(userSensors && userSensors.length == 0)
			{
				// We had sensor once, but not now. Remove Cookie and URL
				$page.url.searchParams.delete('sensors');
				goto(`?${$page.url.searchParams.toString()}`);

				// Cookies entfernen
				document.cookie = `sensors=; Max-Age=-9999; path=/`;

				// Remove views
				sensorData = []
			}
			else if(userSensors)
			{
				// We have Sensors. Fetch Data

				loadingInProgress = true
				fetchApi(userSensors.map(v => v.sensorID))
				  .then(response => response.json())
  				  .then(response => {

						// Calculate, how many "sensors" we have (a sensor with temperature and humidity combined equals two sensors)
						// We go quick and dirty, what kind of sensor it is, we just look for "t1", "t2" or "h" in measurement data

						// Clear sensorData
						sensorData = []

						var data:any = response

						if(!data.success)
						{
							console.error("API liefert success=false zurück.", data)
						}
						else
						{

							// Daten angekommen. URL anpassen
							var sensorArray:string[] = userSensors.map((e:any) => `${e.sensorID}|${e.sensorName}`)
							var s:string = sensorArray.join(',')
							$page.url.searchParams.set('sensors', s); 
							goto(`?${$page.url.searchParams.toString()}`);

							// Cookies speichern
							document.cookie = `sensors=${s}; expires=Thu, 18 Dec 2053 12:00:00 UTC; path=/`;							

							data.result.devices.forEach((device:any) => {

								// Must have at least one measurement. Otherwise we skip
								if(device.measurements.length == 0) return

								// Has Temperature?
								var m0:any = device.measurements[0]

								const temperatureVars:string[] = ['t', 't1', 't2', 't3', 't4']
								const humidityVars:string[] = ['h', 'h1', 'h2', 'h3', 'h4']

								temperatureVars.forEach((v:string) => {
									if(v in m0)
									{
										var cloned:any = cloneAndRename(device, v, userSensors)
										cloned['_sensorType'] = SensorType.Temperature
										sensorData.push(cloned)
									}									
								})

								humidityVars.forEach((v:string) => {
									if(v in m0)
									{
										var cloned:any = cloneAndRename(device, v, userSensors)
										cloned['_sensorType'] = SensorType.Humidity
										sensorData.push(cloned)
									}									
								})								

							})

							// Add Sensor IDs for chosing the right color. Same Sensors should have same color
							sensorIDs = sensorData.map(v => v.deviceid)
							sensorIDs = [...new Set(sensorIDs)];
						}
					})
					.catch(e => {
						console.error("Fetchfunktion hat Fehler geworfen:")
						console.error(e)
					})
					.then(() => loadingInProgress = false)
			}
			
		});

		// Get Cookies
		const parseCookie = (str:string) => str
		    .split(';')
		    .map(v => v.split('='))
		    .reduce((acc, v) => {
		      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
		      return acc;
		    }, {});

		// Check if URL Parameters. Rule: URL wins for cookies
		const sensorStringToSensorArray = (s:string):any[] => {
			var sensorArray:any[] = []
			s.split(',').forEach((sens:string) => {
					sensorArray.push({
						'sensorID': sens.split('|')[0],
						'sensorName': sens.split('|')[1],
					})
				})
			return sensorArray;
		}

		// Get URL Parameters
		const queryParams = new Proxy(new URLSearchParams(window.location.search), {
		  get: (searchParams, prop) => searchParams.get(prop),
		});

		if(queryParams.sensors)
		{
			storeSensors.set(sensorStringToSensorArray(queryParams.sensors))
		}
		else if(document.cookie != '')
		{
			var cookies:any = parseCookie(document.cookie);
			if('sensors' in cookies)
			{
				storeSensors.set(sensorStringToSensorArray(cookies.sensors))
			}
		}

		// Load phoneID-Cookie
		if(document.cookie != '')
		{
			var cookies:any = parseCookie(document.cookie);
			if('phoneid' in cookies)
			{
				storePhoneID.set(cookies.phoneid)
			}
		}

		// Subscribe to PhoneID-Change and update Cookie
		storePhoneID.subscribe((v:string) => {
			if(v && v !== '')
			{
				document.cookie = `phoneid=${v}; expires=Thu, 18 Dec 2053 12:00:00 UTC; path=/`;
			}
		})

		// Load Hide Add Sensor from Param or Cookie
		if(queryParams.hideaddsensor)
		{
			storeHideAddSensor.set(queryParams.hideaddsensor == '1' ? true : false)
		}
		else if(document.cookie != '')
		{
			var cookies:any = parseCookie(document.cookie);
			if('hideaddsensor' in cookies)
			{
				storeHideAddSensor.set(cookies.hideaddsensor == 1 ? true : false)
			}
		}

		// Subscribe to PhoneID-Change and update Cookie		
		storePhoneID.subscribe((v:string) => {
			if(v && v !== '')
			{
				document.cookie = `phoneid=${v}; expires=Thu, 18 Dec 2053 12:00:00 UTC; path=/`;
			}
		})

		// Subscribe to Hide Add Sensor
		storeHideAddSensor.subscribe((v:boolean) => {
			hideAddSensor = v

			// Add to url
			$page.url.searchParams.set('hideaddsensor', v ? '1' : '0'); 
			goto(`?${$page.url.searchParams.toString()}`);

			// Add Cookie
			document.cookie = `hideaddsensor=${v ? 1 : 0}; expires=Thu, 18 Dec 2053 12:00:00 UTC; path=/`;
		})	

	});



</script>

<svelte:head>
	<title>Meine Sensoren | Dashboard</title>
	<meta name="description" content="Ein Dashboard für Mobile Alerts Sensoren" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	
	<!-- FACEBOOK -->
	<meta property="og:url"           content="https://mobilealerts.vercel.app/" />
	<meta property="og:type"          content="website" />
	<meta property="og:title"         content="Meine Sensore | Dashboard" />
	<meta property="og:description"   content="Ein Dashboard für Mobile Alerts Sensoren" />
	<meta property="og:image"         content="https://mobilealerts.vercel.app/teaser.png" />

	<!-- TWITTER -->
	<meta name="twitter:card" content="summary_large_image"/>
	<meta name="twitter:url" content="https://mobilealerts.vercel.app/" />
	<meta name="twitter:title" content="Meine Sensore | Dashboard"/>
	<meta name="twitter:description" content="Ein Dashboard für Mobile Alerts Sensoren"/>
	<meta name="twitter:image" content="https://mobilealerts.vercel.app/teaser.png"/>
</svelte:head>

<section>
	<div class="container">
		{#if !loadingInProgress}

			{#each sensorData as sensor, i}
				<SensorStandard 
				  data = {sensor}
					sensor = {sensor['_sensorType']}
					sensorName={sensor.name}
					color={highlightColors[sensorIDs.indexOf(sensor['deviceid']) % highlightColors.length]}
				/>
			{/each}

			{#if sensorData.length == 0}
			  <Welcome />
			{/if}

			{#if !hideAddSensor}
		  	<AddSensor />
			{/if}

			{#if isDeleteMode}
			  <DeleteSaveBar />
			{/if}

		{:else}
			<Loading />
		{/if}

	</div>

</section>

<style>
	.container
	{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 15px;
		width: 100%;
	}

	section {
		padding: 15px;
	}


</style>
