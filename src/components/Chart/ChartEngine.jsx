import React from 'react';
import Chart from '../Chart/Chart'
import MetricSelector from './MetricSelector'
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import * as moment from 'moment/moment';
import { connect } from 'react-redux';
const MAX_SIZE = 4
const MAX_ROW = 2
const MAX_PERPAGE = 4
const charCount = 8
const colors = ['pink', 'red', 'green', 'yellow']
const colorsR = ['white', 'purple']
const colorsC = ['violet', 'brown']

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

const ChartEngine = ({chartsToDisplay, assignChartMetrics, chartSchema, selectedMetricsMap}) => {
    const { data, error, loading } = useSubscription(GQL_OBJ, {});
    // console.log(data);

    // console.log(moment().toDate())
    // console.log(moment().subtract(30, 'minutes').toDate())
    // console.log(moment().valueOf(), moment().subtract(30, 'minutes').valueOf())
    for(let _chartIndex in selectedMetricsMap){
        console.log(selectedMetricsMap[_chartIndex])
        let metricInFocus = selectedMetricsMap[_chartIndex]
        if(!DATA_CACHE[metricInFocus]){
            console.log("No Data!")
            if(!DATA_CACHE[0]){
                console.log("No Refrence!")
                //First Piece Of Data
                //Query Using Moment Times
                let date_future
                let data_past
            }else{
                //Already Have Data, Use Time From Arrays
            }
        }
    }
    
            
    let pageCount = chartsToDisplay ?  Math.ceil(chartsToDisplay / MAX_PERPAGE) : 0;
    // console.log("chartSchema", chartSchema)
    return(
        <div

        >
            {
                [...Array(pageCount).keys()].map((page, pageId) => {
                    return ( //PAGE
                        <div
                            style={{
                                height : '100vh',
                                width : '100%',
                                backgroundColor : colors[pageId],
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
                                                backgroundColor: colorsR[rowId]
                                            }}
                                            key={rowId}
                                        >
                                            {
                                                [...Array(MAX_ROW).keys()].map((chart, chartId, ) =>{
                                                    return(
                                                        // console.log(pageId*4 + ((rowId*2) + chartId))
                                                        // console.log(pageId, rowId, chartId, '->',((pageId * pageId) + rowId))
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                // backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`
                                                            }}
                                                            key={chartId}
                                                        >
                                                            {
                                                                chartsToDisplay -1 >= (pageId*4 + ((rowId*2) + chartId)) ? 
                                                                <div
                                                                    style={{
                                                                        display:'flex',
                                                                        flexDirection:'column',
                                                                        height:'100%',
                                                                        width: '100%'
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
                                                                        <Chart></Chart> 
                                                                    </div>
                                                                </div>
                                                                : null

                                                            }
                                                        </div>
                                                    )

                                                })
                                            }
                                        </div>
                                        // console.log('row', rowId, 'page', pageId)
                                    )
                                })
                            }
                        </div>
                        // console.log("page", pageId)
                    )
                })
            }

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
