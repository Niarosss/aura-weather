// OpenWeatherMap API константи (залишаються без змін)
const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct";
const REVERSE_GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/reverse";

// Налаштування кешу (залишаються без змін)
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 година в мілісекундах

/**
 * Допоміжна функція для кешування результатів fetch-запитів.
 * Зберігає та повертає дані з localStorage, якщо вони дійсні.
 * В іншому випадку виконує новий запит через надану функцію fetcher.
 * @param {string} key Унікальний ключ для зберігання в localStorage.
 * @param {function} fetcher Асинхронна функція, яка виконує фактичний API-запит і повертає дані.
 * @returns {Promise<any>} Отримані або закешовані дані.
 */
async function cachedFetch(key, fetcher) {
  try {
    const cachedData = localStorage.getItem(key);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();

      if (now - timestamp < CACHE_DURATION_MS) {
        // console.log(`Cache hit for ${key}`);
        return data;
      } else {
        // console.log(`Cache expired for ${key}, re-fetching.`);
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.warn(`Error parsing cache for ${key}:`, error);
    localStorage.removeItem(key);
  }

  console.log(`Fetching new data for ${key}`);
  const newData = await fetcher();
  localStorage.setItem(
    key,
    JSON.stringify({ data: newData, timestamp: Date.now() })
  );
  return newData;
}

/**
 * Перевіряє існування міста та отримує його офіційну назву.
 * @param {string} cityName Назва міста для перевірки.
 * @returns {Promise<string>} Офіційна назва міста.
 * @throws {Error} Якщо місто не знайдено або виникла помилка API.
 */
export async function checkCityExistsAndGetName(cityName) {
  const cacheKey = `city_geocode_${cityName.toLowerCase()}`;

  const fetcher = async () => {
    const response = await fetch(
      `${GEOCODING_URL}?q=${cityName}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Не вдалось перевірити місто. Спробуйте пізніше.");
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error(`Місто "${cityName}" не знайдено.`);
    }
    return data[0].name;
  };

  return cachedFetch(cacheKey, fetcher);
}

/**
 * Отримує погодні дані за назвою міста.
 * @param {object} options Об'єкт параметрів.
 * @param {string} options.cityName Назва міста.
 * @param {boolean} [options.fullDetails=false] Якщо true, повертає всі деталі погоди; якщо false, лише основні (температура, опис, іконка).
 * @returns {Promise<object>} Об'єкт з погодними даними.
 * @throws {Error} Якщо погода для міста не знайдена або виникла помилка API.
 */
export async function getWeatherData({ cityName, fullDetails = false }) {
  // Ключ кешу тепер залежить лише від назви міста та рівня деталізації
  const cacheKey = `weather_city_${cityName.toLowerCase()}_${
    fullDetails ? "full" : "basic"
  }`;
  const apiUrl = `${BASE_WEATHER_URL}?q=${cityName}&appid=${API_KEY}&units=metric&lang=ua`;

  const fetcher = async () => {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Погода для міста "${cityName}" не знайдена.`);
      }
      throw new Error("Не вдалось отримати погодні дані. Спробуйте пізніше.");
    }
    const data = await response.json();
    const { main, weather, wind, sys, visibility, rain, snow, name, clouds } =
      data;

    // Формуємо базовий об'єкт з основними даними
    const basicWeatherData = {
      name: name,
      temp: main.temp,
      humidity: main.humidity,
      wind_speed: wind.speed,
      pressure: main.pressure,
      description: weather[0].description,
      icon: weather[0].icon,
    };

    // Якщо потрібні повні деталі, додаємо решту полів
    if (fullDetails) {
      return {
        ...basicWeatherData, // Копіюємо базові дані
        feels_like: main.feels_like,
        visibility: visibility,
        sys: {
          sunrise: sys.sunrise,
          sunset: sys.sunset,
        },
        rain: rain,
        snow: snow,
        clouds: clouds.all,
      };
    } else {
      return basicWeatherData; // Повертаємо лише базові дані
    }
  };

  return cachedFetch(cacheKey, fetcher);
}

/**
 * Отримує назву міста за географічними координатами (зворотне геокодування).
 * @param {number} lat Широта.
 * @param {number} lon Довгота.
 * @returns {Promise<string>} Офіційна назва міста.
 * @throws {Error} Якщо місто не знайдено за координатами або виникла помилка API.
 */
export async function getCityNameByCoords(lat, lon) {
  const roundedLat = lat.toFixed(4);
  const roundedLon = lon.toFixed(4);
  const cacheKey = `reverse_geocode_${roundedLat}_${roundedLon}`;

  const fetcher = async () => {
    const response = await fetch(
      `${REVERSE_GEOCODING_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Не вдалось визначити місто за координатами.");
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("Місто не знайдено за вказаними координатами.");
    }
    return data[0].name;
  };

  return cachedFetch(cacheKey, fetcher);
}
