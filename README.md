# 📝 To-Do with Weather

This is a simple and fun project I built using **React** and **TypeScript**. It combines a to-do list with **live weather updates**, and even includes **temperature and humidity trend charts** along with some basic **machine learning predictions** using TensorFlow.js.

---

## 🔍 Features

- ✅ Add, delete, and complete tasks  
- 🌤 Live weather info for your city (via OpenWeatherMap API)  
- 📊 Charts showing temperature and humidity trends over time  
- 🤖 Machine learning (TensorFlow.js) to predict upcoming temperature and humidity  
- 📦 LocalStorage support for saving tasks and city  
- ⚠️ Error boundaries to handle issues smoothly  

---

## 📦 Technologies Used

- **Frontend**: React + TypeScript + Vite  
- **Charts**: Chart.js (with react-chartjs-2)  
- **Machine Learning**: TensorFlow.js  
- **Weather API**: OpenWeatherMap  
- **Storage**: localStorage  
- **Other Tools**: ESLint, Prettier

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-weather.git
cd todo-weather
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your OpenWeatherMap API key

Create a `.env` file in the root directory and add:

```env
VITE_OWM_API_KEY=your_openweathermap_api_key
```

> ⚠️ You can sign up at [openweathermap.org](https://openweathermap.org/api) to get your free API key.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## 📸 Screenshots

<img width="1872" height="520" alt="image" src="https://github.com/user-attachments/assets/2a82f6c3-f401-4661-a35e-b53505bc36f9" />
<img width="1846" height="888" alt="image" src="https://github.com/user-attachments/assets/c788d8e6-23c5-4f56-807a-e7952a5d3581" />


---

## 📈 Ideas for Future Improvements

- Add 5-day or hourly forecast view  
- Add unit toggle (°C ↔ °F)  
- Support geolocation-based weather  
- Improve ML prediction model with more features  
- Responsive design for mobile

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

