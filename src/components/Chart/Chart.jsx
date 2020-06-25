import React from 'react';
import { connect } from 'react-redux'
import * as moment from 'moment/moment';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer
} from 'recharts';

// const SUBSCRIBE_VIDEO_ADDED = gql`
//       subscription {
//         count
//       }
// `;

const isOne =true;
const isTwo = true;
const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];
// injValveOpen: Array(1383)
// [0 … 99]
// 0:
// at: 1593047150817
// metric: "injValveOpen"
// unit: "%"
// value: 10.05
// __typename: "Measurement"d

const Chart = ({ chartData, selectedMetrics, chartData_normalized, DATA_CACHE, chartIndex,selectedMetricsMap }) => {

    console.log('new data', chartData)

  return (

    <ResponsiveContainer 
    >
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        {/* <XAxis dataKey="at" tickFormatter={(tick) => moment(tick * 1000).format('HH:mm')}/> */}
        <XAxis dataKey="at" tickFormatter={(tick) => moment.unix(tick).format("HH:mm:ss.SSS")}/>
        <YAxis yAxisId="right" orientation="right" dataKey="" />
        <Tooltip />
        <Legend />
        <Line yAxisId="right" type="monotone" dataKey="value" stroke="#82ca9d"dot={false} isAnimationActive ={false} />
      </LineChart>
    </ResponsiveContainer>

  );
}

const mapStateToProps = state => ({
    hasError: state.chart.hasError,
    metricList: state.chart.metricList,
    isLoading: state.chart.isLoading,
    selectedMetricsMap : state.chart.selectedMetricsMap
})
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
