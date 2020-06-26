import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Chart from '../Chart/Chart';

const useStyles = makeStyles({
  mainContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const FocusView = ({ DATA_CACHE, chartIndex, selectedMetricsMap }) => {
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      <Chart
        DATA_CACHE={DATA_CACHE}
        chartIndex={chartIndex}
        chartData={
          selectedMetricsMap[chartIndex] &&
          selectedMetricsMap[chartIndex][0] &&
          DATA_CACHE[selectedMetricsMap[chartIndex][0]]
            ? DATA_CACHE[selectedMetricsMap[chartIndex][0]]
            : []
        }
      />
      <div
        style={{
          height: '50px',
          width: '50px',
          borderRadius: '50px',
          backgroundColor: 'red',
          position: 'absolute',
          top: '0',
          left: '0',
        }}
      >
        x
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  hasError: state.chart.hasError,
  metricList: state.chart.metricList,
  isLoading: state.chart.isLoading,
  selectedMetricsMap: state.chart.selectedMetricsMap,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(FocusView);
