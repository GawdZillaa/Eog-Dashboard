import React from 'react';
import Box from "@material-ui/core/Box";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';


const getSpacer = (flexAmount) => {
    return <Box flex= {flexAmount} />
}
const MetricSelector = ({metricList, chartSchema}) => {

    
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
                            onChange={''}
                            fullWidth={true}
                            disabled={chartSchema.selectedMetrics.length === 2}
                        >
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                            {
                                metricList &&
                                metricList.map((metricName, id) =>{
                                
                                {
                                    return !chartSchema.selectedMetrics.includes(metricName) ?
                                    <MenuItem key={id} value={metricName}>{ metricName }</MenuItem> : null
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
                        justifyContent='center'
                        alignItems='center'
                        flexDirection='row'
                        display='flex'
                    >
                    {
                        chartSchema.selectedMetrics &&
                        chartSchema.selectedMetrics.map((metricString, index) =>{
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
                                    flex='1'
                                    margin='7px'
                                    >
                                    x
                                </Box>
                                <Box
                                    flex='1'
                                    margin='7px'
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
    isLoading: state.chart.isLoading
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MetricSelector);
