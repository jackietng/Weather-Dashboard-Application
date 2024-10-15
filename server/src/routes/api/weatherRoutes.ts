import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body; // Extract city name from request body
  try {
  // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city); 

  // TODO: save city to search history
    await HistoryService.addCity(city);

  // Return weather data
  res.json(weatherData);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'An error occurred while retrieving weather data.' });
}
});

// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving search history.' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
