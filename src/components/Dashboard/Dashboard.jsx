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
import { setMetricList, apiLoading } from '../../Features/Chart/chart.reducer'
import  ChartEngine  from '../Chart/ChartEngine'

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
            chartsEnabled: 2,
            chartSpecifications: ['',''],
            chartSchema: [
                {selectedMetrics:['flareTemp', 'injValveOpen']},
                {selectedMetrics:['tubingPressure', 'casingPressure']}
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

    assignChartDetails = (chartIndex, metricIndex, metric) => {

    }


    getWeather = (IState) => {
        const { state } = IState
        const { temperatureinFahrenheit, description, locationName } = state.weather;
        return {
            temperatureinFahrenheit,
            description,
            locationName,
        }
    };

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
                    height:'15vh',
                    width: '100%',
                    backgroundColor: 'white'
                }}
                ></div>

                <div
                    style={{
                        display:'flex',
                        flexDirection: 'row',
                        height:'85vh',
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
                                assignChartDetails={this.assignChartDetails}
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
    isLoading: state.chart.isLoading
})

const mapDispatchToProps = dispatch => ({
    setMetricList: e => dispatch(setMetricList(e)),
    apiLoading: e => dispatch(apiLoading(e))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
