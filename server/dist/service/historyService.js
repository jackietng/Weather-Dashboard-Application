import fs from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// TODO: Define a City class with name and id properties
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            const data = await fs.readFile(path.join(__dirname, '../../db/searchHistory.json'), 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            await fs.writeFile(path.join(__dirname, '../../db/searchHistory.json'), JSON.stringify(cities));
        }
        catch (error) {
            console.error(error);
        }
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return this.read();
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        const cities = await this.getCities();
        const newCity = new City(cityName, this.generateId());
        cities.push(newCity);
        await this.write(cities);
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.getCities();
        const updatedCities = cities.filter(city => city.id !== id);
        await this.write(updatedCities);
    }
    // Helper method to generate a unique ID for each city
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
export default new HistoryService();
