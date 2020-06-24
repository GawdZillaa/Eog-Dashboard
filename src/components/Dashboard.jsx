import React from 'react';
import { useQuery } from 'urql';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-boost';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Features/Chart/chart.reducer';
import { IState } from '../store';
import { connect } from 'react-redux';
import { setMetricList, apiLoading } from '../Features/Chart/chart.reducer'

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

        }
    }

    componentDidMount(){
        this.getMetrics();

            // 
    }

    getMetrics = () => {
        // const dispatch = useDispatch();

        // dispatch(actions.apiLoading());

        console.log(this.props)
        queryObject.query({
            query: gql`
            {
                getMetrics
            }
            `
        }).then(newMetricsResponse => {
            console.log(newMetricsResponse)
            let normalizedNewMetrics = 
            newMetricsResponse && 
            newMetricsResponse.data &&
            newMetricsResponse.getMetrics ? 
            {newMetrics : newMetricsResponse.getMetrics} : { hasError : true };

            console.log("NICE", normalizedNewMetrics)
            // dispatch(actions.setMetricList(getWeatherForLocation));

        })
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
                    backgroundColor : 'red'
                }}
            >
                {/* {useSelector(this.getWeather).isLoading} */}
                {this.props.metricList}
            </div>
        )
    }

}

const mapStateToProps = state => ({
    hasError: state.chart.hasError,
    metricList: state.chart.metricList
})

const mapDispatchToProps = dispatch => ({
    setMetricList: e => dispatch(setMetricList(e)),
    apiLoading: e => dispatch(apiLoading(e))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
