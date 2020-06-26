import React from 'react';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-boost';
import { connect } from 'react-redux';
import { setMetricList, apiLoading, newChartSelection, removeChart, focusChart } from '../../Features/Chart/chart.reducer'
import  ChartEngine  from '../Chart/ChartEngine'
import Header  from './Header'

const httpLink = createHttpLink({
    uri: 'https://react.eogresources.com/graphql'
  });
const cache = new InMemoryCache();
const queryObject = new ApolloClient ({
    link : httpLink,
    cache
  })

class Dashboard extends React.Component {

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
                        return metric !== oldChartSelectedList[metricIndex]
                    })

                    break;
                }
                default:{
                    return
                }
            }

                updatesSelectedMap = {...oldSelectedMap}
                updatesSelectedMap[chartIndex] = updatedChartSelectionList;
           
            await this.props.newChartSelection({
                newSelectedMetricsMap : updatesSelectedMap,
            });
        }
 
    }

    addChart = () => {
        let newChartSchema = [...this.state.chartSchema, {selectedMetrics:[]}];
        let updatedChartsEnabled = this.state.chartsEnabled+1;

        this.setState({
            chartSchema : newChartSchema,
            chartsEnabled : updatedChartsEnabled
        })
    }

    removeChart = async(chartIndex) => {
        let newChartSchema = this.state.chartSchema.splice(chartIndex, 1);
        let newSelectedMetricMap = {};
        for(const [key, value] of Object.entries(this.props.selectedMetricsMap)){
            console.log(key)
            if(key > chartIndex){
                newSelectedMetricMap[key-1] = value;
            }else if(key !== chartIndex){
                newSelectedMetricMap[key] = value;
            }
        }

        let newChartsEnabled = this.state.chartsEnabled - 1;
        await this.setState({
            chartsEnabled : newChartsEnabled,
            chartSchema : newChartSchema
        })
        await this.props.removeChart({
            newSelectedMetricMapObj : newSelectedMetricMap,
        });

    }

    focusChart = async(chartId, action) => {
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
