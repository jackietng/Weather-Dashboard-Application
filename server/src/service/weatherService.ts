import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number; 
  lon: number; 
}

// TODO: Define a class for the Weather object
class Weather {
  city: string 
  icon: string
  iconDescription: string 
  temperature: number
  windSpeed: number
  humidity: number
  date: Date

  constructor(
    city: string, 
    icon: string,
    iconDescription: string, 
    temperature: number,
    windSpeed: number,
    humidity: number,
    date: string,
  ) {
    this.city = city
    this.icon = icon
    this.iconDescription = iconDescription
    this.temperature = temperature
    this.windSpeed = windSpeed
    this.humidity = humidity
    this.date = new Date(date)
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.API_BASE_URL || "";
  private apiKey: string = process.env.API_KEY || "";
  city: string = '';

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
  private buildGeocodeQuery(): string {
    const urlEncodedCity = encodeURIComponent(this.city)
    return `q=${urlEncodedCity}&appid=${this.apiKey}`;
  }
  
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&lang=en&appid=${this.apiKey}`;
  }
  
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    try {
      const query = this.buildGeocodeQuery();
      const locationData = await this.fetchLocationData(query);
      return this.destructureLocationData(locationData);    
    } catch (error) {
      console.error(error);
      return { lat: 0, lon: 0};
    }
  }
  
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await fetch(`${this.baseURL}?${query}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return {};
  }};
  
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    try {
      const { list } = response; 
      return new Weather(
        this.city, 
        list[0].weather[0].icon,
        list[0].weather[0].description,
        list[0].main.temp,
        list[0].wind.speed,
        list[0].main.humidity,
        list[0].dt_txt
      )
    } catch (error) {
      console.error(error)
      return new Weather ("","","", 0, 0, 0, new Date().toString());
    }
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    try {
      const forecastArray: Weather[] = [currentWeather]
			for (let i = 1; i < weatherData.length; i += 8) {
				const { weather, main, wind, dt_txt } = weatherData[i]
				forecastArray.push(
					new Weather(
						this.city,
						weather[0].icon,
						weather[0].description,
						main.temp,
						wind.speed,
						main.humidity,
						dt_txt
					)
				);
    }
    return forecastArray;
  } catch (error) {
    console.error(error);
    return [];
  }}
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
			this.city = city
			const coordinates = await this.fetchAndDestructureLocationData();
			const weatherData = await this.fetchWeatherData(coordinates);
			const currentWeather = this.parseCurrentWeather(weatherData);
			return this.buildForecastArray(currentWeather, weatherData.list);
		} catch (error) {
			console.error(error);
			return [];
		}
  }};

export default new WeatherService();
