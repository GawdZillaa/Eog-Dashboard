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

const initialState = {
  metricList: [],
  isLoading: false,
  hasError: false
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
    chartApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state

  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
export const setMetricList = slice.actions['setMetricList']
export const apiLoading = slice.actions['apiLoading']
