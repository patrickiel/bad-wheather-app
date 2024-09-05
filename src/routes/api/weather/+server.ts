import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { WeatherData } from '$lib/wheatherData';

export const GET: RequestHandler = async ({ url }) => {
    const city = url.searchParams.get('city');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');

    let name: string | undefined;
    let apiUrl: string;
    if (city) {
        // First, get coordinates for the city
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return json({ error: 'City not found' }, { status: 404 });
        }

        const { latitude, longitude } = geoData.results[0];
        name = geoData.results[0].name;
        apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    } else if (lat && lon) {
        apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

        name = 'Unknown location [lat: ' + lat + ', lon: ' + lon + ']';

    } else {
        return json({ error: 'Invalid parameters' }, { status: 400 });
    }

    try {
        const response = await fetch(apiUrl);
        const data: WeatherData = await response.json();

        // Add city name to the response
        if (name) {
            data.locationName = name;
        }

        return json(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
};