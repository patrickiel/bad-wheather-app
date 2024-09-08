<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ search: string }>();
	let searchTerm: string = $state('');

	function handleSubmit(event: Event): void {
		event.preventDefault();
		if (searchTerm.trim()) {
			dispatch('search', searchTerm.trim());
		}
	}
</script>

<form onsubmit={handleSubmit}>
	<input type="text" placeholder="Enter city name" bind:value={searchTerm} />
	<button type="submit">Search</button>
</form>

<style>
	form {
		display: flex;
		margin-bottom: 20px;
	}
	input {
		flex-grow: 1;
		padding: 10px;
		font-size: 16px;
	}
	button {
		padding: 10px 20px;
		font-size: 16px;
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
	}
</style>
