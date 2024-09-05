<script lang="ts">
	import type { WeatherData } from '$lib/wheatherData';
	import { getWeatherDescription } from '../utils';

	let { weatherData }: { weatherData: WeatherData } = $props();

	let { temperatureUnit } = $state<{ temperatureUnit: 'celsius' | 'fahrenheit' }>({
		temperatureUnit: 'celsius'
	});

	$effect(() => {
		console.log('Weather data updated:', weatherData);
	});

	function toggleUnit(): void {
		temperatureUnit = temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
	}

	function convertTemp(temp: number): number {
		return temperatureUnit === 'celsius' ? temp : (temp * 9) / 5 + 32;
	}
</script>

<div class="weather-display">
	<h2 class="location-name">{weatherData.locationName}</h2>
	<p class="current-weather">
		Current Temperature: {convertTemp(weatherData.daily.temperature_2m_max[0]).toFixed(
			1
		)}°{temperatureUnit === 'celsius' ? 'C' : 'F'}
	</p>
	<p class="current-description">
		Weather: {getWeatherDescription(weatherData.daily.weather_code[0])}
	</p>
	<button onclick={toggleUnit}>
		Switch to {temperatureUnit === 'celsius' ? 'Fahrenheit' : 'Celsius'}
	</button>

	<h3>7-Day Forecast</h3>
	<ul class="forecast-list">
		{#each weatherData.daily.time as day, i}
			<li class="forecast-item">
				<div class="forecast-date">
					{new Date(day).toLocaleDateString('en-US', {
						weekday: 'short',
						month: 'short',
						day: 'numeric'
					})}
				</div>
				<div class="forecast-temp">
					{convertTemp(weatherData.daily.temperature_2m_max[i]).toFixed(1)}°{temperatureUnit ===
					'celsius'
						? 'C'
						: 'F'} /
					{convertTemp(weatherData.daily.temperature_2m_min[i]).toFixed(1)}°{temperatureUnit ===
					'celsius'
						? 'C'
						: 'F'}
				</div>
				<div class="forecast-description">
					{getWeatherDescription(weatherData.daily.weather_code[i])}
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.weather-display {
		background-color: #f0f0f0;
		padding: 20px;
		border-radius: 5px;
		font-family: Arial, sans-serif;
	}
	.current-weather,
	.current-description {
		font-size: 1.2em;
		margin-bottom: 10px;
	}
	button {
		background-color: #4caf50;
		border: none;
		color: white;
		padding: 10px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 4px;
	}
	.forecast-list {
		list-style-type: none;
		padding: 0;
	}
	.forecast-item {
		background-color: white;
		margin-bottom: 10px;
		padding: 10px;
		border-radius: 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.forecast-date {
		font-weight: bold;
		width: 30%;
	}
	.forecast-temp {
		width: 30%;
		text-align: center;
	}
	.forecast-description {
		width: 40%;
		text-align: right;
	}
</style>
