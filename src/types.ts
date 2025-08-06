export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type TaskFilter = 'all' | 'active' | 'completed';

export interface WeatherApiResponse {
  name: string;
  weather: { description: string }[];
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
}