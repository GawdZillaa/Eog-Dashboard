import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Weather from '../../Features/Weather/Weather';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,
  },
  headerLeft : {
    flex:'1',
    display:'flex',
    flexDirection:'row',
    backgroundColor:'#d1d1d1'
  },
  headerCenter : {
    flex:'4',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  headerRight : {
    flex:'3',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  addChartButton : {

  }
});

const Header = ({addChart}) => {
    const classes = useStyles();

  const name = "detrich's";
  return (
      <div
        className={classes.headerLeft}
      >
          <div
            style={{
                flex:'3',
                display:'flex',
                justifyContent:'center',
                alignItems:'center'
            }}
          >
            <Weather />

          </div>
          <div
            className={classes.headerCenter}
          >
                <Typography variant="h6" color="inherit" >
                    {name} EOG React Visualization Assessment
                </Typography>
          </div>
          <div
            className={classes.headerRight}
          >
            <Button
                style={{
                    backgroundColor:'#25fa29'
                }}
                onClick={() => addChart()}
            >
                Add Chart
            </Button>
          </div>
      </div>

  );
};

export default Header;
