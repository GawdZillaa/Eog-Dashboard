import React from 'react';
import { connect } from 'react-redux';

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

let newChartData = [];
let metricUnitMap = {};

const Chart = ({ chartData, DATA_CACHE, chartIndex, selectedMetricsMap }) => {
  if (selectedMetricsMap && selectedMetricsMap[chartIndex]) {
    let refrenceSelectedMetrics = [];
    let hasData = true;
    for (let metricString of selectedMetricsMap[chartIndex] && selectedMetricsMap[chartIndex]) {
      if (DATA_CACHE[metricString]) {
        refrenceSelectedMetrics.push(metricString);
      } else {
        hasData = false;
        break;
      }
    }

    if (hasData) {
      newChartData = [];
      let counter = 0;
      if (DATA_CACHE && refrenceSelectedMetrics[0] && DATA_CACHE[refrenceSelectedMetrics[0]]) {
        for (let i = 0; i < DATA_CACHE[refrenceSelectedMetrics[0]].length; i++) {
          let newMetricsData = {};
          let segmentTime;
          for (let _selectMetric of refrenceSelectedMetrics) {
            let tempData = DATA_CACHE[_selectMetric][counter];
            let unitKey = `unit${_selectMetric}`;
            newMetricsData[_selectMetric] = tempData && tempData.value;
            newMetricsData[unitKey] = tempData && tempData.unit;
            segmentTime = tempData && tempData.at;
            if (!metricUnitMap[unitKey]) {
              metricUnitMap[unitKey] = tempData.unit;
            }
          }
          newMetricsData.at = segmentTime;
          newChartData.push(newMetricsData);

          counter++;
        }
      }
    }
  } else {
    newChartData = chartData;
  }

  return (
    <ResponsiveContainer>
      <LineChart
        width={500}
        height={300}
        data={newChartData || []}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="at" tickFormatter={tick => new Date(tick).toLocaleString()} tickInterval={0.5} />
        <Tooltip labelFormatter={t => new Date(t).toLocaleString()} />
        <Legend />
        {selectedMetricsMap &&
          selectedMetricsMap[chartIndex] &&
          selectedMetricsMap[chartIndex].map((metric, metircIndex) => {
            return (
              <Line
                yAxisId={metircIndex}
                type="monotone"
                dataKey={`${metric}`}
                stroke="#82ca9d"
                dot={false}
                isAnimationActive={false}
                key={`${metric}___line`}
              />
            );
          })}
        {selectedMetricsMap &&
          selectedMetricsMap[chartIndex] &&
          selectedMetricsMap[chartIndex].map((metric, metircIndex) => {
            return (
              <YAxis key={`${metric}___yaxis`} yAxisId={metircIndex} orientation={'right'}>
                <Label value={metricUnitMap[`unit${metric}`]} position="insideTopLeft" offset={10 + metircIndex * 30} />
              </YAxis>
            );
          })}
      </LineChart>
    </ResponsiveContainer>
  );
};

const mapStateToProps = state => ({
  hasError: state.chart.hasError,
  metricList: state.chart.metricList,
  isLoading: state.chart.isLoading,
  selectedMetricsMap: state.chart.selectedMetricsMap,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
