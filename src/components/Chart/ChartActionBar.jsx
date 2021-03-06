import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import { CenterFocusWeak, CancelPresentation } from '@material-ui/icons';
import { green, red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  mainContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  actionButtonContainer: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const ChartActionBar = ({ removeChart, chartIndex, focusChart }) => {
  const classes = useStyles();

  return (
    <Box className={classes.mainContainer}>
      <Box className={classes.actionButtonContainer}>
        <Tooltip title="Remove Chart">
          <CancelPresentation
            style={{ color: red[500] }}
            aria-label="Remove Chart"
            onClick={() => removeChart(chartIndex)}
          />
        </Tooltip>
      </Box>
      <Box className={classes.actionButtonContainer}>
        <Tooltip title="Enlarge Chart">
          <CenterFocusWeak
            style={{ color: green[500] }}
            aria-label="Enlarge Chart"
            onClick={() => focusChart(chartIndex, 'focus')}
          ></CenterFocusWeak>
        </Tooltip>
      </Box>
    </Box>
  );
};

const mapStateToProps = state => ({
  hasError: state.chart.hasError,
  metricList: state.chart.metricList,
  isLoading: state.chart.isLoading,
  selectedMetricsMap: state.chart.selectedMetricsMap,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ChartActionBar);
