import React from 'react';
import { useQuery } from 'urql';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient, from } from 'apollo-boost';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-boost';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../Features/Chart/chart.reducer';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { setMetricList, apiLoading, newChartSelection, removeChart, focusChart } from '../../Features/Chart/chart.reducer'
import  ChartEngine  from '../Chart/ChartEngine'
import { Button } from '@material-ui/core';
import Header  from './Header'
import LiveFeed from '../Chart/LiveFeed'

const httpLink = createHttpLink({
    uri: 'https://react.eogresources.com/graphql'
  });
const cache = new InMemoryCache();
const queryObject = new ApolloClient ({
    link : httpLink,
    cache
  })

class Dashboard extends React.Component {
    // "flareTemp"
    // 1: "injValveOpen"
    // 2: "waterTemp"
    // 3: "casingPressure"
    // 4: "tubingPressure"
    // 5: "oilTemp"

    constructor(){
        super();
        this.state = {
            chartsEnabled: 1,
            chartSpecifications: ['',''],
            chartSchema: [
                {selectedMetrics:[]}
            ]
        }
    }

    componentDidMount(){
        this.getMetrics();
    }

    getMetrics = () => {
        this.props.apiLoading();
        queryObject.query({
            query: gql`
            {
                getMetrics
            }
            `
        }).then(newMetricsResponse => {
            let normalizedNewMetrics = 
                newMetricsResponse && 
                newMetricsResponse.data &&
                newMetricsResponse.data.getMetrics ? 
                {newMetrics : newMetricsResponse.data.getMetrics} : { hasError : true };
            this.props.setMetricList(normalizedNewMetrics);
            console.log("AYEEEE", this.props.metricList)
        })
    }

    assignChartMetrics = async(changeRequest) => {
        console.log(changeRequest)
        let { action, chartIndex, newMetric, metricIndex } = changeRequest;
        let oldSelectedMap = this.props.selectedMetricsMap;
        let oldChartSelectedList = this.props.selectedMetricsMap[chartIndex] ?
            [...this.props.selectedMetricsMap[chartIndex]] : [];

        let updatedChartSelectionList = [];
        let updatesSelectedMap = [];

        if(oldChartSelectedList){
            switch(action){
                case 'add':{
                    updatedChartSelectionList = [...oldChartSelectedList, newMetric]
                    break;
                }
                case 'remove':{

                    updatedChartSelectionList = oldChartSelectedList.filter((metric) => {
                        return metric != oldChartSelectedList[metricIndex]
                    })

                    break;
                }
                default:{
                    return
                }
            }

                updatesSelectedMap = {...oldSelectedMap}
                updatesSelectedMap[chartIndex] = updatedChartSelectionList;
           
    
            console.log("Setting...", updatesSelectedMap)
    
            await this.props.newChartSelection({
                newSelectedMetricsMap : updatesSelectedMap,
            });
            console.log('done', this.props.selectedMetricsMap)
        }
 
    }

    addChart = () => {
        console.log('called')
        let newChartSchema = [...this.state.chartSchema, {selectedMetrics:[]}];
        let updatedChartsEnabled = this.state.chartsEnabled+1;

        this.setState({
            chartSchema : newChartSchema,
            chartsEnabled : updatedChartsEnabled
        })
    }

    removeChart = async(chartIndex) => {
        console.log('called')
        let newChartSchema = this.state.chartSchema.splice(chartIndex, 1);
        let newSelectedMetricMap = {};
        // console.log(this.props.selectedMetricsMap)
        for(const [key, value] of Object.entries(this.props.selectedMetricsMap)){
            console.log(key)
            if(key > chartIndex){
                newSelectedMetricMap[key-1] = value;
            }else if(key != chartIndex){
                newSelectedMetricMap[key] = value;
            }
        }
        console.log("newSelectedMetricMap", newSelectedMetricMap)

        let newChartsEnabled = this.state.chartsEnabled - 1;
        await this.setState({
            chartsEnabled : newChartsEnabled,
            chartSchema : newChartSchema
        })
        await this.props.removeChart({
            newSelectedMetricMapObj : newSelectedMetricMap,
        });


        console.log('new metric map', this.props.selectedMetricsMap)
        console.log('enabled charts', this.state.chartsEnabled)
        console.log('enabled charts', this.state.chartSchema)
    }

    focusChart = async(chartId, action) => {
        console.log("CALLED FOCUS")
        if(action === 'focus'){
            await this.props.focusChart({
                newChartToFocus : chartId,
                isFocus : true
            });

        }else{
            await this.props.focusChart({
                newChartToFocus : chartId,
                isFocus : false
            });
        }

    }


    render() {
        return (
            <div
                style={{
                    height: '100vh',
                    width : '100%',
                    backgroundColor : 'white',
                    display:'flex',
                    flexDirection:'column'
                }}
            >
                <div
                    style={{
                        display:'flex',
                        flexDirection: 'row',
                        height:'10vh',
                        width: '100%',
                        backgroundColor: 'white'
                    }}
                    >
                        <Header
                            addChart={this.addChart}
                        >
                        </Header>         
                </div>

                <div
                    style={{
                        display:'flex',
                        flexDirection: 'row',
                        height:'90vh',
                        width: '100%'
                    }}
                >
                    {/* <div
                        style={{
                            display:'flex',
                            height:'100%',
                            width: '15%',
                            backgroundColor: 'pink'
                        }}
                    >
                        <LiveFeed>

                        </LiveFeed>
                    </div> */}

                    <div
                        style={{
                            display: 'flex',
                            width:'100%',
                            height:'100%',
                            overflow:'scroll',
                            overflowX:'hidden'
                        }}
                    >

                        <div
                            style={{
                                height:'100%',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColorL: 'blue',
                            }}
                        >
                            <ChartEngine
                                chartsToDisplay={this.state.chartsEnabled}
                                assignChartMetrics={this.assignChartMetrics}
                                chartSchema={this.state.chartSchema}
                                removeChart={this.removeChart}
                                focusChart={this.focusChart}
                            />
                        </div>

                    </div>
                </div>


            </div>
        )
    }

}

const mapStateToProps = state => ({
    hasError: state.chart.hasError,
    metricList: state.chart.metricList,
    isLoading: state.chart.isLoading,
    selectedMetricsMap : state.chart.selectedMetricsMap,
    hasFocusChart : state.chart.hasFocusChart,
    _focusChart : state.chart.focusChart
})

const mapDispatchToProps = dispatch => ({
    setMetricList: e => dispatch(setMetricList(e)),
    apiLoading: e => dispatch(apiLoading(e)),
    newChartSelection: e => dispatch(newChartSelection(e)),
    removeChart: e => dispatch(removeChart(e)),
    focusChart: e => dispatch(focusChart(e))    
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
