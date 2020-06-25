import React from 'react';
import Chart from '../Chart/Chart'
import ChartActionBar from '../Chart/ChartActionBar'
import NoChartPage from '../Chart/NoChartPage'
import MetricSelector from './MetricSelector'
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as moment from 'moment/moment';
import { connect } from 'react-redux';
import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import LiveFeed from '../Chart/LiveFeed'

const MAX_ROW = 2
const MAX_PERPAGE = 4

const GQL_OBJ = gql`
    subscription {
        newMeasurement{
            metric
            at
            value
            unit
          }
    }
`;
let DATA_CACHE = {};
let DATA_LIVEFEED = {};
let DATA_SELECTEDMETRICS = []

const cache = new InMemoryCache();
const httpLink = createHttpLink({
    uri: 'https://react.eogresources.com/graphql'
  });
const client = new ApolloClient ({
    link : httpLink,
    cache
  })

const ChartEngine = ({chartsToDisplay, assignChartMetrics, chartSchema, selectedMetricsMap, removeChart}) => {
    const { data, error, loading } = useSubscription(GQL_OBJ, {});
    DATA_SELECTEDMETRICS = [];
    if(
        data && 
        data.newMeasurement && 
        data.newMeasurement.metric
    ){
        DATA_LIVEFEED[data.newMeasurement.metric] = data.newMeasurement.value;

        if(DATA_CACHE[data.newMeasurement.metric]){
            let { metric } = data.newMeasurement
            let tempCacheData = JSON.parse(JSON.stringify(DATA_CACHE))
            tempCacheData[metric].shift();
            tempCacheData[metric].push(data.newMeasurement);
            DATA_CACHE = tempCacheData;
        }

    }


    for(let _chartIndex in selectedMetricsMap){
        for(let innerMetric of selectedMetricsMap[_chartIndex]){
            let metricInFocus = innerMetric
            if(!DATA_SELECTEDMETRICS.includes(metricInFocus)){
                DATA_SELECTEDMETRICS.push(metricInFocus)
            }
            if(!DATA_CACHE[metricInFocus]){
                console.log("No Data!", metricInFocus)
                if(!DATA_CACHE[0]){
                    console.log("No Refrence!")

                    let afterDate = moment().utc().subtract(30, 'minutes').format("x")
                    let queryString = `[{metricName: "${metricInFocus}", after: ${afterDate}},`
                    for(let [e, metricString] in DATA_CACHE){
                        console.log("in", e, metricString)
                        if(metricString != metricInFocus){
                            queryString +=  `{metricName: "${metricString}", after: ${afterDate}}`
                        }

                    }
                    queryString += `]`
                    client.query({
                        query : gql`
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
                    `
                    }).then(metricDataResponse => {
                        let { getMultipleMeasurements } = metricDataResponse.data;

                        for(let dataObj of getMultipleMeasurements){
                            console.log(dataObj)
                            let { metric, measurements } = dataObj;
                                console.log(metric, measurements[0])
                                DATA_CACHE[metric] = measurements;
                        }
                        //Now normalize

                        for(let metric in DATA_CACHE){
                            console.log('-', metric)
                        }
                    })
                }
            }
        }
    }
    

    let pageCount = chartsToDisplay ?  Math.ceil(chartsToDisplay / MAX_PERPAGE) : 0;
    // console.log("chartSchema", chartSchema)
    return(
        <div
            style={{
                display:'flex',
                flexDirection:'row'
            }}
        >
            <div
                style={{
                    display:'flex',
                    height:'90vh',
                    width: '15%',
                    backgroundColor: '',
                    position:'absolute',
                     overflowX:'hidden',
                     flexDirection: 'column',
                     alignItems:'center'
                }}
            >

                {
                    DATA_SELECTEDMETRICS &&
                    DATA_SELECTEDMETRICS.map((metricKey, metricValue) => {
                        return( 
                            <LiveFeed
                                title={metricKey}
                                data={DATA_LIVEFEED && DATA_LIVEFEED[metricKey]}
                            />
                        )
                    })
                }

                 
            </div>
            <div
                style={{
                    display:'flex',
                    height:'100%',
                    width: '15.5%',
                    backgroundColor: '',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    width:'85%',
                    height:'100%',
                    flexDirection: 'column'
                }}
            >

                {
                    chartsToDisplay > 0 ?
                    [...Array(pageCount).keys()].map((page, pageId) => {
                        return ( //PAGE
                            <div
                                style={{
                                    height : '100vh',
                                    width : '100%',
                                    flexDirection: 'column',
                                    display:'flex'
                                }}
                                key={pageId}
                            >
                                {
                                    [...Array(MAX_ROW).keys()].map((row, rowId) => {
                                        return ( //ROW
                                            <div
                                                style={{
                                                    display:'flex',
                                                    flexDirection:'row',
                                                    flex:'1',
                                                }}
                                                key={rowId}
                                            >
                                                {
                                                    [...Array(MAX_ROW).keys()].map((chart, chartId, ) =>{
                                                        return(
                                                            <div
                                                                style={{
                                                                    flex: 1,
                                                                }}
                                                                key={chartId}
                                                            >
                                                                {
                                                                    chartsToDisplay -1 >= (pageId*4 + ((rowId*2) + chartId)) ? 
                                                                    <div
                                                                        style={{
                                                                            display:'flex',
                                                                            flexDirection:'row',
                                                                            height:'100%',
                                                                            width: '100%'
                                                                        }}
                                                                    >

                                                                        <div
                                                                            style={{
                                                                                display:'flex',
                                                                                flex:'1',
                                                                                backgroundColor:''
                                                                            }}
                                                                        >
                                                                            <ChartActionBar
                                                                                removeChart={removeChart}
                                                                                chartIndex={(pageId*4 + ((rowId*2) + chartId))}
                                                                            />
                                                                        </div>

                                                                        <div
                                                                            style={{
                                                                                display:'flex',
                                                                                flexDirection:'column',
                                                                                flex:'9'
                                                                            }}
                                                                        >

                                                                            <div
                                                                                style={{
                                                                                    flex:'1.5'
                                                                                }}
                                                                            >
                                                                                <MetricSelector
                                                                                    chartSchema={chartSchema[(pageId*4 + ((rowId*2) + chartId))]}
                                                                                    assignChartMetrics={assignChartMetrics}
                                                                                    chartIndex={(pageId*4 + ((rowId*2) + chartId))}
                                                                                />

                                                                            </div>
                                                                            <div
                                                                                style={{
                                                                                    flex:'8.5'
                                                                                }}
                                                                            >
                                                                                <Chart
                                                                                    DATA_CACHE={DATA_CACHE}
                                                                                    chartIndex={(pageId*4 + ((rowId*2) + chartId))}
                                                                                    chartData={
                                                                                        selectedMetricsMap[(pageId*4 + ((rowId*2) + chartId))] &&
                                                                                        selectedMetricsMap[(pageId*4 + ((rowId*2) + chartId))][0] &&
                                                                                        DATA_CACHE[selectedMetricsMap[(pageId*4 + ((rowId*2) + chartId))][0]] ?
                                                                                        DATA_CACHE[selectedMetricsMap[(pageId*4 + ((rowId*2) + chartId))][0]] :
                                                                                        []
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div> : null
                                                                }
                                                            </div>
                                                        )

                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }) : null
                } 
                {
                    chartsToDisplay === 0 ?
                        <NoChartPage/> : null
                }

            </div>
 
        </div>
        
    )
}

const mapStateToProps = state => ({
    hasError: state.chart.hasError,
    metricList: state.chart.metricList,
    isLoading: state.chart.isLoading,
    selectedMetricsMap : state.chart.selectedMetricsMap
})
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ChartEngine);
