import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Weather from '../../Features/Weather/Weather';
import Box from "@material-ui/core/Box";

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
                    Data Dash Project
                </Typography>
          </div>
          <div
            className={classes.headerRight}
          >
            <Box
                bgcolor='white'
                onClick={() => addChart()}
                boxShadow={2}
                height='75px'
                width='100px'
                justifyContent='center'
                alignItems='center'
                display='flex'
                borderRadius='15px'
                textAlign='center'
            >
                Add Another Chart
            </Box>
          </div>
      </div>

  );
};

export default Header;
