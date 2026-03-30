<script>
	import '$lib/main.css';
	import '$lib/main.rue';
    import LeftBar from '$lib/components/LeftBar.svelte';
    import TopBar from '$lib/components/TopBar.svelte';
	let { children } = $props();

</script>

<!--  -->

<svelte:head>
	<link rel="icon" href="logo-circle.png" />
	<title>rueTV OS</title>
	<script src="https://kit.fontawesome.com/5cf062dc93.js" crossorigin="anonymous"></script>
</svelte:head>

<div class="page">
	{@render children()}
</div>

<!--  -->

<style>
	.page{
		height: 100vh;
		width: 100vw;
		display: grid;
		grid-template-rows: min-content auto;
	}

</style>