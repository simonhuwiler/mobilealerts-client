<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from "$app/stores"; 
	import { goto } from "$app/navigation";
	import { sensors } from './store.ts'
	import { SensorType } from './sensors'
	import { fetchApi } from './api'
	import SensorStandard from './SensorStandard.svelte';
	import AddSensor from './AddSensor.svelte';
	import { data } from '$lib/data.js'

	// Tests
	var dataTemperature = JSON.parse(JSON.stringify(data))
	dataTemperature.measurements = dataTemperature.measurements.map(e => {
		return {...e, '_value': e['t1']}
	})
	
	var dataHumidity = JSON.parse(JSON.stringify(data))
	dataHumidity.measurements = dataTemperature.measurements.map(e => {
		return {...e, '_value': e['h']}
	})

	// Define Colors
	const highlightColors = ['#ff6f10', '#3b910a', '#36389c', '#0083a3']

	onMount(async () => {

		// Update URL on Store Change
		sensors.subscribe((value:any[]) => {
			if(value.length > 0)
			{
				var sensorArray:string[] = value.map((e:any) => `${e.sensorID}|${e.sensorName}`)
				var s:string = sensorArray.join(',')
				$page.url.searchParams.set('sensors', s); 
				goto(`?${$page.url.searchParams.toString()}`);

				// Store Cookies
				document.cookie = `sensors=${s}; expires=Thu, 18 Dec 2053 12:00:00 UTC; path=/`;
			}
		});

		// Get Cookies
		const parseCookie = (str:string) =>
		  str
		    .split(';')
		    .map(v => v.split('='))
		    .reduce((acc, v) => {
		      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
		      return acc;
		    }, {});

		var cookies:any = parseCookie(document.cookie);
		if('sensors' in cookies)
		{
			var sensorArray:any[] = []
			cookies.sensors.split(',').forEach((sens:string) => {
				sensorArray.push({
					'sensorID': sens.split('|')[0],
					'sensorName': sens.split('|')[1],
				})
			})
			sensors.set(sensorArray)
		}

	});
	// fetchApi(['0301548CBC4A'])

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="container">
		<SensorStandard data = {dataTemperature} sensor = {SensorType.Temperature} sensorName='Wohnzimmer' color={highlightColors[0]} />
		<SensorStandard data = {dataHumidity} sensor = {SensorType.Humidity} sensorName='Draussen' color={highlightColors[1]} />
		<AddSensor />
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
