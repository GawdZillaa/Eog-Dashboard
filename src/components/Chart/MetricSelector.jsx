import React from 'react';
import Box from "@material-ui/core/Box";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../Features/Chart/chart.reducer';
import { Button } from '@material-ui/core';


const getSpacer = (flexAmount) => {
    return <Box flex= {flexAmount} />
}
const MetricSelector = ({metricList, chartSchema, chartIndex, assignChartMetrics, selectedMetricsMap}) => {

    
        return (
            <div
                style={{
                    height:'100%',
                    width:'100%',
                    backgroundColor:''
                }}
            >

            <Box
                display= 'flex'
                flex='1'
                flexDirection='row'
            >
                <Box
                    display = 'flex'
                    justifyContent= 'center'
                    alignItems= 'center'
                    bgcolor= ''
                    flex = '5'
                    flexDirection='row'

                >

                    <Box flex= {2} />
                    <Box
                        flex= '6'
                    >
                    <FormControl 
                        variant="outlined"
                        fullWidth={true}

                    >
                        <InputLabel id="demo-simple-select-helper-label"></InputLabel>
                        <Box
                        boxShadow='3'
                        borderRadius='50'
                        overflow='hidden'
                        >
                        <Select
                            labelId="Select Metric"
                            id="Select Metric"
                            value={'Metric'}
                            onChange={(event) => assignChartMetrics({
                                chartIndex : chartIndex,
                                newMetric : event.target.value,
                                action : 'add'
                            })}
                            fullWidth={true}
                            disabled={
                                selectedMetricsMap[chartIndex] && 
                                selectedMetricsMap[chartIndex].length === 2
                            }
                        >
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                            {
                                metricList &&
                                metricList.map((metricName, id) =>{
                                
                                {
                                    return !selectedMetricsMap[chartIndex] ||
                                        !selectedMetricsMap[chartIndex].includes(metricName) ?
                                    <MenuItem key={id} name={id} value={metricName}>{ metricName }</MenuItem> : null 
                                }
                                
                                })
                            }
                            </Select>
                        </Box>
                        <FormHelperText>Select Metric</FormHelperText>
                    </FormControl>
                    </Box>
                    <Box flex= {2} />
                </Box>




                <Box
                    display='flex'
                    flex= '5'
                    bgcolor=''
                    flexDirection= 'row'
                    
                >
                    <Box flex= {2} />
                    <Box
                        flex='8'
                        bgcolor=''
                        flexDirection='row'
                        display='flex'
                    >
                    {
                        selectedMetricsMap[chartIndex] &&
                        selectedMetricsMap[chartIndex].map((metricString, index) =>{
                        return (
                            <Box
                                height='fit-content'
                                width='fit-content'
                                borderRadius='5px'
                                boxShadow='2'
                                display='flex'
                                flexDirection='row'
                                key={index}
                                marginRight='5px'

                            >
                                <Box
                                    flex='2'
                                    margin='7px'
                                    >
                                    <Button
                                        style={{
                                            backgroundColor:'red',
                                        }}
                                        onClick={(event) => assignChartMetrics({
                                            chartIndex : chartIndex,
                                            newMetric : event.target.value,
                                            action : 'remove',
                                            metricIndex: index
                                        })}
                                    >
                                        x
                                    </Button>
                                </Box>
                                <Box
                                    flex='8'
                                    margin='7px'
                                    justifyContent='center'
                                    alignItems='center'
                                    display='flex'
                                >
                                    { metricString }
                                </Box>
                            </Box>
                        )
                        })
                    }
                    </Box>
                    <Box flex= {1} />
                </Box>
                </Box>
            </div>
        )
}

const mapStateToProps = state => ({
    hasError: state.chart.hasError,
    metricList: state.chart.metricList,
    isLoading: state.chart.isLoading,
    selectedMetricsMap : state.chart.selectedMetricsMap
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MetricSelector);
