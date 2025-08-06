import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import type { WeatherApiResponse } from '../types';

interface WeatherProps {
  city: string;
}

interface Analytics {
  timestamp: number;
  temp: number;
  humidity: number;
  pressure: number;
}

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

export default function Weather({ city }: WeatherProps) {
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [predictedTemp, setPredictedTemp] = useState<number | null>(null);
  const [predictedHumidity, setPredictedHumidity] = useState<number | null>(null);

  // Fetch live weather data
  useEffect(() => {
    if (!city) {
      setData(null);
      setError('Please enter a city.');
      return;
    }

    let cancelled = false;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      try {
        if (!API_KEY) throw new Error('Missing API key');
        const trimmedCity = city.trim();
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${API_KEY}&units=metric`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const json = await res.json() as WeatherApiResponse;

        if (!cancelled) {
          setData(json);
          setAnalytics(prev => {
            const updated = [...prev, {
              timestamp: Date.now(),
              temp: json.main.temp,
              humidity: json.main.humidity,
              pressure: json.main.pressure,
            }];
            if (updated.length > 50) updated.shift(); // limit data points
            return updated;
          });
        }
      } catch (e) {
        if (!cancelled) {
          setData(null);
          setError('Unable to load live weather. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();
    return () => { cancelled = true; };
  }, [city]);

  // ML model: Predict next temperature and humidity
  useEffect(() => {
    if (analytics.length >= 10) {
      const xs = analytics.map((_, i) => i);
      const tempYs = analytics.map(a => a.temp);
      const humYs = analytics.map(a => a.humidity);

      const tensorX = tf.tensor2d(xs, [xs.length, 1]);

      const buildAndTrainModel = async (ys: number[], setter: (val: number) => void) => {
        const tensorY = tf.tensor2d(ys, [ys.length, 1]);

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 64, inputShape: [1], activation: 'relu' }));
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1 }));
        model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

        await model.fit(tensorX, tensorY, { epochs: 150, verbose: 0 });

        const input = tf.tensor2d([[xs.length]]);
        const prediction = model.predict(input);

        if (Array.isArray(prediction)) {
          const predArray = await prediction[0].array();
          setter((predArray as number[])[0]);
        } else {
          const predArray = await prediction.array();
          setter((predArray as number[])[0]);
        }
      };

      buildAndTrainModel(tempYs, setPredictedTemp);
      buildAndTrainModel(humYs, setPredictedHumidity);
    }
  }, [analytics]);

  // Charts
  const tempChart = {
    labels: analytics.map(a => new Date(a.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: analytics.map(a => a.temp),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.3,
      }
    ]
  };

  const humidityChart = {
    labels: analytics.map(a => new Date(a.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Humidity (%)',
        data: analytics.map(a => a.humidity),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.3,
      }
    ]
  };

  return (
    <section className="card">
      <header className="row space-between">
        <h2>Weather</h2>
      </header>

      {loading && <p>Loading weather…</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="weather">
          <div className="temp">{Math.round(data.main.temp)}°C</div>
          <div className="details">
            <div className="city">{data.name}</div>
            <div className="desc">{data.weather?.[0]?.description ?? '—'}</div>
          </div>
        </div>
      )}

      {analytics.length > 1 && (
  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
    <div style={{ flex: 1, minWidth: '300px' }}>
      <h3>Temperature Trends</h3>
      <Line data={tempChart} />
    </div>
    <div style={{ flex: 1, minWidth: '300px' }}>
      <h3>Humidity Trends</h3>
      <Line data={humidityChart} />
    </div>
  </div>
)}

      {predictedTemp !== null && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Predicted Next Temperature:</h4>
          <p>{predictedTemp.toFixed(2)}°C</p>
        </div>
      )}

      {predictedHumidity !== null && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Predicted Next Humidity:</h4>
          <p>{predictedHumidity.toFixed(2)}%</p>
        </div>
      )}
    </section>
  );
}
