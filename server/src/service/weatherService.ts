import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number; 
  lon: number; 
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public forecast: Array<{ date: string; temperature: number; description: string}>
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string = process.env.API_KEY || ''; // Ensure you have your API key in .env
  private city: string = '';

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}weather?q=${query}&appid=${this.apiKey}`);
    const data = await response.json();
    return this.destructureLocationData(data);
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }
  
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}weather?q=${city}&appid=${this.apiKey}`;
  }
  
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return locationData;
  }
  
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }
  
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.main.temp;
    const description = response.weather[0].description;
    const forecast = response.list.map((item: any) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
    }));

    return new Weather(temperature, description, forecast);
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather {
    return new Weather(currentWeather.temperature, currentWeather.description, weatherData);
  }
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.list);
  }
}

export default new WeatherService();
