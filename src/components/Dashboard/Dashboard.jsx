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
import { setMetricList, apiLoading, newChartSelection } from '../../Features/Chart/chart.reducer'
import  ChartEngine  from '../Chart/ChartEngine'
import { Button } from '@material-ui/core';
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

            // 
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
        // console.log(moment().toDate())
        // console.log(moment().subtract(30, 'minutes').toDate())
        // console.log(moment().valueOf(), moment().subtract(30, 'minutes').valueOf())
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
                    console.log("REMOVING...", JSON.parse(JSON.stringify(oldChartSelectedList)))

                    console.log("REMOVING...", JSON.parse(JSON.stringify(oldChartSelectedList)))
                    console.log("REMOVING...", oldChartSelectedList[metricIndex])
    
                    updatedChartSelectionList = oldChartSelectedList.length > 1 ? oldChartSelectedList.splice(metricIndex, 1) : []
                    console.log("REMOVING...", JSON.parse(JSON.stringify(updatedChartSelectionList)))

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
            console.log(this.props.selectedMetricsMap)
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

    removeChartMetrich = () => {

    }


    render() {
        return (
            <div
                style={{
                    height: '100vh',
                    width : '100%',
                    backgroundColor : 'red',
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
                    <div
                        style={{
                            display:'flex',
                            height:'100%',
                            width: '15%',
                            backgroundColor: 'pink'
                        }}
                    >

                    </div>

                    <div
                        style={{
                            display: 'flex',
                            width:'85%',
                            height:'100%',
                            overflow:'scroll'
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
    selectedMetricsMap : state.chart.selectedMetricsMap
})

const mapDispatchToProps = dispatch => ({
    setMetricList: e => dispatch(setMetricList(e)),
    apiLoading: e => dispatch(apiLoading(e)),
    newChartSelection: e => dispatch(newChartSelection(e))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
