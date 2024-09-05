<script lang="ts">
	import SearchForm from '$lib/components/searchForm.svelte';
	import WeatherDisplay from '$lib/components/weatherDisplay.svelte';
	import type { WeatherData } from '$lib/wheatherData';

	let { city, weatherData } = $state<{
		city: string;
		weatherData: WeatherData | null;
	}>({
		city: '',
		weatherData: null
	});

	let error = $state<string>('');

	async function fetchWeather(cityName: string): Promise<void> {
		try {
			const response = await fetch(`/api/weather?city=${cityName}`);

			if (response.statusText === 'Not Found') {
				throw new Error(`${cityName} not found`);
			}

			if (!response.ok) {
				throw new Error('Failed to fetch weather data');
			}
			weatherData = await response.json();
			error = '';
		} catch (err: any) {
			error = err.message;
			weatherData = null;
		}
	}

	function handleSearch(event: CustomEvent<string>): void {
		city = event.detail;
		fetchWeather(city);
	}

	$effect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position: GeolocationPosition) => {
					const { latitude, longitude } = position.coords;
					const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
					weatherData = await response.json();
				},
				(err: GeolocationPositionError) => {
					console.error('Geolocation error:', err);
					// Fallback to a default city
					fetchWeather('Berlin');
				}
			);
		} else {
			// Fallback to a default city
			fetchWeather('Berlin');
		}
	});
</script>

<main>
	<h1>Bad Weather App</h1>
	<SearchForm on:search={handleSearch} />
	{#if error}
		<p class="error">{error}</p>
	{/if}
	{#if weatherData}
		<WeatherDisplay {weatherData} />
	{/if}
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}
	.error {
		color: red;
	}
</style>
