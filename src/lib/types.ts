type ISideBarProps = {
  savedCityCoordinates: ICityFromAPI[];
  visibleCities: ICityFromAPI[];
  selectedCity: ISelectedCity | null;
  query: string;
  setQuery: (query: string) => void;
  data: City[];
  loading: boolean;
  setSelectedCity: (city: ISelectedCity) => void;
  setSavedCityCoordinates: (city: ICityFromAPI[]) => void;
  setVisibleCities: (city: ICityFromAPI[]) => void;
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
};
type City = {
  id: number;
  name: string;
  state: string;
  country: string;
  lon: number;
  lat: number;
};

type ICityFromAPI = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

type ISearchBox = {
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
  searchedData: City[];
  handlePinThisCity: (city: City) => void;
};
type ISelectedCity = {
  lat: number;
  long: number;
};

type IWeatherData = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain?: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};
type IWeatherCard = {
  coutryCode: string;
  lon: number;
  lat: number;
  descHeading: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  windSpeed: number;
  id: number;
  name: string;
  sunrise: number;
  sunset: number;
  visibility: number;
  clouds: number;
};
