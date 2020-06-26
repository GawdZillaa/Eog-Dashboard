import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};
export type ApiLoadAction = {
  isLoading: boolean;
};
export type MetricItems = {
  newMetrics: [];
};
export type ChartSelection = {
  newSelectedMetricsMap: [];
};
export type RemoveChart = {
  newSelectedMetricMapObj: {};
};

export type FocusChart = {
  newChartToFocus: number;
  isFocus: boolean;
};

const initialState = {
  metricList: [],
  isLoading: false,
  hasError: false,
  selectedMetricsMap: {},
  hasFocusChart: false,
  focusChart: 0,
};

const slice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setMetricList: (state, action: PayloadAction<MetricItems>) => {
      const { newMetrics } = action.payload;
      state.metricList = newMetrics;
      state.isLoading = false;
    },
    apiLoading: state => {
      state.isLoading = true;
    },
    chartApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    newChartSelection: (state, action: PayloadAction<ChartSelection>) => {
      let { newSelectedMetricsMap } = action.payload;
      state.selectedMetricsMap = newSelectedMetricsMap;
    },
    removeChart: (state, action: PayloadAction<RemoveChart>) => {
      let { newSelectedMetricMapObj } = action.payload;
      state.selectedMetricsMap = newSelectedMetricMapObj;
    },
    focusChart: (state, action: PayloadAction<FocusChart>) => {
      let { newChartToFocus, isFocus } = action.payload;
      state.focusChart = isFocus ? newChartToFocus : 0;
      state.hasFocusChart = isFocus;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
export const setMetricList = slice.actions['setMetricList'];
export const apiLoading = slice.actions['apiLoading'];
export const newChartSelection = slice.actions['newChartSelection'];
export const removeChart = slice.actions['removeChart'];
export const focusChart = slice.actions['focusChart'];
