import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Weather from '../../Features/Weather/Weather';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  headerLeft: {
    flex: '1',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#00b7c4',
  },
  headerCenter: {
    flex: '4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flex: '3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChartButton: {},
  addAnotherChartButton: {
    backgroundColor: 'white',
    height: '75px',
    width: '100px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderRadius: '15px',
    textAlign: 'center',
  },
  weatherContainer: {
    flex: '3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Header = ({ addChart }) => {
  const classes = useStyles();

  return (
    <div className={classes.headerLeft}>
      <div className={classes.weatherContainer}>
        <Weather />
      </div>
      <div className={classes.headerCenter}>
        <Typography variant="h6" color="inherit">
          Data Dashboard Project
        </Typography>
      </div>
      <div className={classes.headerRight}>
        <Box className={classes.addAnotherChartButton} onClick={() => addChart()} boxShadow={2}>
          Add Another Chart
        </Box>
      </div>
    </div>
  );
};

export default Header;
