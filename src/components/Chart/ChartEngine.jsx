import React from 'react';
import Chart from '../Chart/Chart';
import ChartActionBar from '../Chart/ChartActionBar';
import NoChartPage from '../Chart/NoChartPage';
import MetricSelector from './MetricSelector';
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as moment from 'moment/moment';
import { connect } from 'react-redux';
import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import LiveFeed from '../Chart/LiveFeed';
import { makeStyles } from '@material-ui/core/styles';
import { EOG_URL } from '../../config/config';

const MAX_ROW = 2;
const MAX_PERPAGE = 4;

const GQL_OBJ = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
let DATA_CACHE = {};
let DATA_LIVEFEED = {};
let DATA_SELECTEDMETRICS = [];

const cache = new InMemoryCache();
const httpLink = createHttpLink({
  uri: EOG_URL,
});
const client = new ApolloClient({
  link: httpLink,
  cache,
});
const useStyles = makeStyles({
  liveFeedContainer: {
    display: 'flex',
    height: '90vh',
    width: '15%',
    backgroundColor: '',
    position: 'absolute',
    overflowX: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageContainer: {
    height: '100vh',
    width: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1',
  },
  chartContaier: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  chartActionBar: {
    display: 'flex',
    flex: '1',
    backgroundColor: '',
  },
  metricSelectorContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '9',
  },
});

const ChartEngine = ({
  chartsToDisplay,
  assignChartMetrics,
  chartSchema,
  selectedMetricsMap,
  removeChart,
  focusChart,
  hasFocusChart,
  focusedChart,
}) => {
  const { data, error } = useSubscription(GQL_OBJ, {});
  DATA_SELECTEDMETRICS = [];
  if (data && data.newMeasurement && data.newMeasurement.metric && !error) {
    DATA_LIVEFEED[data.newMeasurement.metric] = data.newMeasurement.value;

    if (DATA_CACHE[data.newMeasurement.metric]) {
      let { metric } = data.newMeasurement;
      let tempCacheData = JSON.parse(JSON.stringify(DATA_CACHE));
      tempCacheData[metric].shift();
      tempCacheData[metric].push(data.newMeasurement);
      DATA_CACHE = tempCacheData;
    }
  }

  for (let _chartIndex in selectedMetricsMap) {
    for (let innerMetric of selectedMetricsMap[_chartIndex]) {
      let metricInFocus = innerMetric;
      if (!DATA_SELECTEDMETRICS.includes(metricInFocus)) {
        DATA_SELECTEDMETRICS.push(metricInFocus);
      }
      if (!DATA_CACHE[metricInFocus]) {
        if (!DATA_CACHE[0]) {
          let afterDate = moment()
            .utc()
            .subtract(30, 'minutes')
            .format('x');
          let queryString = `[{metricName: "${metricInFocus}", after: ${afterDate}},`;
          for (let [e, metricString] in DATA_CACHE) {
            if (metricString != metricInFocus) {
              queryString += `{metricName: "${metricString}", after: ${afterDate}}`;
            }
          }
          queryString += `]`;
          client
            .query({
              query: gql`
                    {
                        getMultipleMeasurements (input :
                        ${queryString}
                        ){ 
                            metric
                            measurements{
                                metric
                                at
                                value
                                unit
                            }
                        }
                    }
                `,
            })
            .then(metricDataResponse => {
              let { getMultipleMeasurements } = metricDataResponse.data;

              for (let dataObj of getMultipleMeasurements) {
                let { metric, measurements } = dataObj;
                DATA_CACHE[metric] = measurements;
              }
            });
        }
      }
    }
  }

  let pageCount = chartsToDisplay ? Math.ceil(chartsToDisplay / MAX_PERPAGE) : 0;
  const classes = useStyles();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {DATA_SELECTEDMETRICS && DATA_SELECTEDMETRICS.length > 0 ? (
        <div className={classes.liveFeedContainer}>
          {DATA_SELECTEDMETRICS &&
            DATA_SELECTEDMETRICS.map((metricKey, metricValue) => {
              return (
                <LiveFeed
                  key={`${metricKey}_${metricValue}`}
                  title={metricKey}
                  data={DATA_LIVEFEED && DATA_LIVEFEED[metricKey]}
                />
              );
            })}
        </div>
      ) : null}
      {DATA_SELECTEDMETRICS && DATA_SELECTEDMETRICS.length > 0 ? (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '15.5%',
            backgroundColor: '',
          }}
        />
      ) : null}
      <div
        style={{
          display: 'flex',
          width: DATA_SELECTEDMETRICS && DATA_SELECTEDMETRICS.length ? '85%' : '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        {!hasFocusChart && chartsToDisplay > 0
          ? [...Array(pageCount).keys()].map((page, pageId) => {
              return (
                <div className={classes.pageContainer} key={`${page}__${pageId}`}>
                  {[...Array(MAX_ROW).keys()].map((row, rowId) => {
                    return (
                      <div className={classes.rowContainer} key={`${row}___${rowId}`}>
                        {[...Array(MAX_ROW).keys()].map((chart, chartId) => {
                          return (
                            <div
                              style={{
                                flex: 1,
                              }}
                              key={`${chart}_____${chartId}`}
                            >
                              {chartsToDisplay - 1 >= pageId * 4 + (rowId * 2 + chartId) ? (
                                <div className={classes.chartContaier}>
                                  <div className={classes.chartActionBar}>
                                    <ChartActionBar
                                      removeChart={removeChart}
                                      chartIndex={pageId * 4 + (rowId * 2 + chartId)}
                                      focusChart={focusChart}
                                    />
                                  </div>

                                  <div className={classes.metricSelectorContainer}>
                                    <div
                                      style={{
                                        flex: '1.5',
                                      }}
                                    >
                                      <MetricSelector
                                        chartSchema={chartSchema[pageId * 4 + (rowId * 2 + chartId)]}
                                        assignChartMetrics={assignChartMetrics}
                                        chartIndex={pageId * 4 + (rowId * 2 + chartId)}
                                        mode={'multi'}
                                        focusChart={focusChart}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        flex: '8.5',
                                      }}
                                    >
                                      <Chart
                                        DATA_CACHE={DATA_CACHE}
                                        chartIndex={pageId * 4 + (rowId * 2 + chartId)}
                                        chartData={
                                          selectedMetricsMap[pageId * 4 + (rowId * 2 + chartId)] &&
                                          selectedMetricsMap[pageId * 4 + (rowId * 2 + chartId)][0] &&
                                          DATA_CACHE[selectedMetricsMap[pageId * 4 + (rowId * 2 + chartId)][0]]
                                            ? DATA_CACHE[selectedMetricsMap[pageId * 4 + (rowId * 2 + chartId)][0]]
                                            : []
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })
          : null}
        {chartsToDisplay === 0 ? <NoChartPage /> : null}
        {hasFocusChart ? (
          <div
            style={{
              height: '89vh',
              width: '100%',
              backgroundColor: '',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                flex: '1.5',
              }}
            >
              <MetricSelector
                chartSchema={chartSchema[focusedChart]}
                assignChartMetrics={assignChartMetrics}
                chartIndex={focusedChart}
                mode={'focus'}
                focusChart={focusChart}
              />
            </div>
            <div
              style={{
                flex: '8.5',
              }}
            >
              <Chart
                DATA_CACHE={DATA_CACHE}
                chartIndex={focusedChart}
                chartData={
                  selectedMetricsMap[focusedChart] &&
                  selectedMetricsMap[focusedChart][0] &&
                  DATA_CACHE[selectedMetricsMap[focusedChart][0]]
                    ? DATA_CACHE[selectedMetricsMap[focusedChart][0]]
                    : []
                }
              ></Chart>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  hasError: state.chart.hasError,
  metricList: state.chart.metricList,
  isLoading: state.chart.isLoading,
  selectedMetricsMap: state.chart.selectedMetricsMap,
  hasFocusChart: state.chart.hasFocusChart,
  focusedChart: state.chart.focusChart,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ChartEngine);
