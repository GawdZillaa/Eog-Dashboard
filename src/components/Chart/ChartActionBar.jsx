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
        flex:'1',
        display:'flex',
        flexDirection:'column'
    },
    actionButtonContainer : {
        flex:'1',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
  });

const ChartActionBar = ({ removeChart, chartIndex }) => {

      const classes = useStyles();

  return (
      
    <Box
        className={classes.mainContainer}
    >
        <Box
            className={classes.actionButtonContainer}
            
        >
            <Tooltip title="Remove Chart">
                <CancelPresentation 
                    style={{ color: red[500] }} 
                    aria-label="Remove Chart" 
                    onClick={() => removeChart(chartIndex)}
                />
            </Tooltip>
        </Box>
        <Box
            className={classes.actionButtonContainer}
        >
            <Tooltip title="Enlarge Chart">
                <CenterFocusWeak style={{ color: green[500] }} aria-label="Enlarge Chart"> </CenterFocusWeak>
            </Tooltip>

        </Box>
        <Box
            className={classes.actionButtonContainer}
        >
            <Tooltip title="Hilight Chart">
                <Highlight style={{ color: yellow[500] }} aria-label="delete"> </Highlight>
            </Tooltip>

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

export default connect(mapStateToProps, mapDispatchToProps)(ChartActionBar);
