const getWeather = async (position) => {
	const WEATHER_API = 'https://fcc-weather-api.glitch.me';
	const { latitude, longitude } = position;
    const URL = `${WEATHER_API}/api/current?lat=${latitude}&lon=${longitude}`;
    try{
        const response = await fetch(URL);
        return response.json();

    } catch (error) { return null };
};
export default getWeather;
