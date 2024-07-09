import logo from './logo.svg';
import './App.css';
import Weather from './components/Weather';

function App() {

  // console.log("process.env.NODE_ENV",process.env.NODE_ENV)
  // console.log("process.env.WEATHER_APP_BASE_URL",process.env.WEATHER_APP_BASE_URL)
  return (
    <div className="App">
      <Weather/>
    </div>
  );
}

export default App;
