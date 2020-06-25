import React from 'react';
import { connect } from 'react-redux'
import * as moment from 'moment/moment';
import { Button } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import { Icon } from '@material-ui/core';
import { CenterFocusWeak, CancelPresentation, Highlight } from '@material-ui/icons';
import { green, red, yellow } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
    mainContainer : {
        height:'100%',
        width:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },

  });

const ChartActionBar = ({ removeChart, chartIndex }) => {

      const classes = useStyles();

  return (
      
    <div
        className={classes.mainContainer}
    >
        <h1 > No Enabled Charts!</h1>
    </div>

  );
}

const mapStateToProps = state => ({
    hasError: state.chart.hasError,
    metricList: state.chart.metricList,
    isLoading: state.chart.isLoading,
    selectedMetricsMap : state.chart.selectedMetricsMap
})
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ChartActionBar);
