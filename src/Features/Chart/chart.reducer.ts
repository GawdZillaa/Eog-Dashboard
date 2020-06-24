import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};
export type ApiLoadAction = {
  isLoading: boolean
}
export type MetricItems = {
  newMetrics: []
};
export type ChartSelection = {
  newSelectedMetricsMap: []
}

const initialState = {
  metricList: [],
  isLoading: false,
  hasError: false,
  chartMap: [],
  selectedMetricsMap: {}
};

const slice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setMetricList: (state, action: PayloadAction<MetricItems>)=>{
      const { newMetrics } = action.payload;
      state.metricList = newMetrics;
      state.isLoading = false;
    },
    apiLoading: (state)=>{
      state.isLoading = true;
    },
    chartApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    newChartSelection: (state, action: PayloadAction<ChartSelection>) =>{
      let { newSelectedMetricsMap } = action.payload;
      state.selectedMetricsMap = newSelectedMetricsMap;
    }

  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
export const setMetricList = slice.actions['setMetricList']
export const apiLoading = slice.actions['apiLoading']
export const newChartSelection = slice.actions['newChartSelection']
