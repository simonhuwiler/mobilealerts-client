<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from "$app/stores"; 
	import { goto } from "$app/navigation";
	import { sensors } from './store.ts'

	import { SensorType } from './sensors'
	import { fetchApi } from './api'
	import SensorStandard from './SensorStandard.svelte';
	import AddSensor from './AddSensor.svelte';
	import Loading from './Loading.svelte';

	// import { data } from '$lib/data.js'

	var sensorData:any[] = []
	var loadingInProgress:boolean = false

	// Tests
	// var dataTemperature = JSON.parse(JSON.stringify(data))
	// dataTemperature.measurements = dataTemperature.measurements.map(e => {
	// 	return {...e, '_value': e['t1']}
	// })
	
	// var dataHumidity = JSON.parse(JSON.stringify(data))
	// dataHumidity.measurements = dataTemperature.measurements.map(e => {
	// 	return {...e, '_value': e['h']}
	// })

	// Define Colors
	const highlightColors = ['#ff6f10', '#3b910a', '#36389c', '#0083a3']

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
		sensors.subscribe((userSensors:any[]) => {

			if(userSensors.length > 0)
			{
				// Fetch Data
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

								if('t1' in m0)
								{
									var cloned:any = cloneAndRename(device, 't1', userSensors)
									cloned['_sensorType'] = SensorType.Temperature
									sensorData.push(cloned)
								}
								
								if('t2' in m0)
								{
									var cloned:any = cloneAndRename(device, 't2', userSensors)
									cloned['_sensorType'] = SensorType.Temperature
									sensorData.push(cloned)
								}
								
								if('h' in m0)
								{
									var cloned:any = cloneAndRename(device, 'h', userSensors)
									cloned['_sensorType'] = SensorType.Humidity
									sensorData.push(cloned)
								}

							})
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

		const queryString:string = window.location.search;
		if(queryString != '')
		{
			const urlParams:any = parseCookie(queryString.substring(1))
			if('sensors' in urlParams)
			{
				sensors.set(sensorStringToSensorArray(urlParams.sensors))
			}
		}
		else if(document.cookie != '')
		{
			var cookies:any = parseCookie(document.cookie);
			if('sensors' in cookies)
			{
				sensors.set(sensorStringToSensorArray(cookies.sensors))
			}
		}

	});

</script>

<svelte:head>
	<title>Meine Sensoren</title>
	<meta name="description" content="Mobile Alerts Sensoren" />
</svelte:head>

<section>
	<div class="container">
		{#if !loadingInProgress}

			{#each sensorData as sensor, i}
				<SensorStandard 
				  data = {sensor}
					sensor = {sensor['_sensorType']}
					sensorName={sensor.name}
					color={highlightColors[i % highlightColors.length]}
				/>
			{/each}

			<AddSensor />

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
