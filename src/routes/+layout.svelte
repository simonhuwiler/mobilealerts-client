<script>
	import './styles.css';
</script>

<div class="app">

	<main>
		<slot />
	</main>

	<div class='footer'>
		Sensor entfernen | <a href='https://github.com/simonhuwiler/mobilealerts-client' target='_blank' rel='noreferrer'>Source Code</a> | <a href='https://github.com/simonhuwiler/mobilealerts-client' target='_blank' rel='noreferrer'>Anleitung</a>
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
	}

</style>
