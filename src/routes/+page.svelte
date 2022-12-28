<script lang="ts">
	import { SensorType } from './sensors'
	import { fetchApi } from './api'
	import SensorStandard from './SensorStandard.svelte';
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

	fetchApi(['0301548CBC4A'])

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="container">
			<SensorStandard data = {dataTemperature} sensor = {SensorType.Temperature} sensorName='Wohnzimmer' color={highlightColors[0]} />
			<SensorStandard data = {dataHumidity} sensor = {SensorType.Humidity} sensorName='Draussen' color={highlightColors[1]} />
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
