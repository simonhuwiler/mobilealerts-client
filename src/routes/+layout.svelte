<script>
	import { storeIsDeleteMode } from './store.ts'
	import './styles.css';

	const startDeleteMode = () => storeIsDeleteMode.set(true)
</script>

<div class="app">

	<main>
		<slot />
	</main>

	<div class='footer'>
		<span class='link' on:click={startDeleteMode} on:keydown={startDeleteMode}>Sensor entfernen</span> | 
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
