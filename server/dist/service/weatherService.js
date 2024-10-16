import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, icon, iconDescription, tempF, windSpeed, humidity, date) {
        this.city = city;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
        this.date = new Date(date);
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        // TODO: Define the baseURL, API key, and city name properties
        this.baseURL = process.env.API_BASE_URL || "";
        this.geocodeBaseURL = process.env.GEO_API_BASE_URL || "";
        this.apiKey = process.env.API_KEY || "";
        this.city = '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            const response = await fetch(`${this.geocodeBaseURL}?${query}`);
            return await response.json();
        }
        catch (error) {
            console.error(error);
            return {};
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        try {
            const { lat, lon } = locationData[0];
            return { latitude: lat, longitude: lon };
        }
        catch (error) {
            console.error(error);
            return { latitude: 0, longitude: 0 };
        }
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        const urlEncodedCity = encodeURIComponent(this.city);
        return `q=${urlEncodedCity}&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&lang=en&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        try {
            const query = this.buildGeocodeQuery();
            const locationData = await this.fetchLocationData(query);
            return this.destructureLocationData(locationData);
        }
        catch (error) {
            console.error(error);
            return { latitude: 0, longitude: 0 };
        }
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        try {
            const query = this.buildWeatherQuery(coordinates);
            const response = await fetch(`${this.baseURL}?${query}`);
            return await response.json();
        }
        catch (error) {
            console.error(error);
            return {};
        }
    }
    ;
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        try {
            const { list } = response;
            return new Weather(this.city, list[0].weather[0].icon, list[0].weather[0].description, list[0].main.temp, list[0].wind.speed, list[0].main.humidity, list[0].dt_txt);
        }
        catch (error) {
            console.error(error);
            return new Weather("", "", "", 0, 0, 0, new Date().toString());
        }
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        try {
            const forecastArray = [currentWeather];
            for (let i = 1; i < weatherData.length; i += 8) {
                const { weather, main, wind, dt_txt } = weatherData[i];
                forecastArray.push(new Weather(this.city, weather[0].icon, weather[0].description, main.temp, wind.speed, main.humidity, dt_txt));
            }
            return forecastArray;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        try {
            this.city = city;
            const coordinates = await this.fetchAndDestructureLocationData();
            const weatherData = await this.fetchWeatherData(coordinates);
            const currentWeather = this.parseCurrentWeather(weatherData);
            return this.buildForecastArray(currentWeather, weatherData.list);
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
}
;
export default new WeatherService();
