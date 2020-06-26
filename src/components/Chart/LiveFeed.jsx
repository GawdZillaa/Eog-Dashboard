import React from 'react';
import { connect } from 'react-redux'
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    mainContainer : {
        height:'100%',
        width:'100%',
        display:'flex',
        flexDirection:'column',
        backgroundColor: 'yellow'
    },

  });

const LiveFeed = ({ title, data }) => {

  return ( 
    <Box
        height='100px'
        width='75%'
        bgcolor='white'
        boxShadow={3}
        display='flex'
        alignItems='center'
        marginBottom={7}
        flexDirection='column'
    >   
        <Box
            flex={1}
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            {title}

        </Box>
        <Box
            flex={1}
            display='flex'
            justifyContent='center'
            alignItems='center'
        >
            { data }

        </Box>


    </Box>

  );
}

const mapStateToProps = state => ({
    hasError: state.chart.hasError,
    metricList: state.chart.metricList,
    isLoading: state.chart.isLoading,
    selectedMetricsMap : state.chart.selectedMetricsMap
})
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(LiveFeed);
