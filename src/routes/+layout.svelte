<script lang="ts">
	import { storeIsDeleteMode, storeHideAddSensor } from './store.ts'
	import './styles.css';

	const startDeleteMode = () => storeIsDeleteMode.set(true)

	// Subscribe to Hide Add Sensor
	var hideAddSensor:boolean = false
	storeHideAddSensor.subscribe((v:boolean) => hideAddSensor = v)

</script>

<div class="app">

	<main>
		<slot />
	</main>

	<div class='footer'>
		<span class='link' on:click={startDeleteMode} on:keydown={startDeleteMode}>Sensor entfernen</span> | 
		{#if hideAddSensor}
			<span class='link' on:click={() => storeHideAddSensor.set(!hideAddSensor)} on:keydown={() => storeHideAddSensor.set(!hideAddSensor)}>«Sensor hinzufügen» einblenden</span> | 
		{/if}
		<a href='https://github.com/simonhuwiler/mobilealerts-client' target='_blank' rel='noreferrer'>Source Code</a> | 
		<a href='https://github.com/simonhuwiler/mobilealerts-client' target='_blank' rel='noreferrer'>Anleitung</a>
	</div>

</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		max-width: 100vw;
	}

	.footer
	{
		font-size: 12px;
		color: grey;
		text-align: center;
		padding: 0 0 10px 0;
	}

</style>
