import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as chartReducer } from '../Features/Chart/chart.reducer';

export default {
  weather: weatherReducer,
  chart: chartReducer,
};