import React from 'react';
import Chart from '../Chart/Chart'

const MAX_SIZE = 4
const MAX_ROW = 2
const MAX_PERPAGE = 4
const charCount = 8
const colors = ['pink', 'red', 'green', 'yellow']
const colorsR = ['white', 'purple']
const colorsC = ['violet', 'brown']
const ChartEngine = ({chartsToDisplay, }) => {
    //Each Page can hold 4 charts
    let pageCount = chartsToDisplay ?  Math.ceil(chartsToDisplay / MAX_PERPAGE) : 0;
    console.log("Page Count", pageCount)
    return(
        <div

        >
            {
                [...Array(pageCount).keys()].map((page, pageId) => {
                    return ( //PAGE
                        <div
                            style={{
                                height : '100vh',
                                width : '100%',
                                backgroundColor : colors[pageId],
                                flexDirection: 'column',
                                display:'flex'
                            }}
                        >
                            {
                                [...Array(MAX_ROW).keys()].map((row, rowId) => {
                                    return ( //ROW
                                        <div
                                            style={{
                                                display:'flex',
                                                flexDirection:'row',
                                                flex:'1',
                                                backgroundColor: colorsR[rowId]
                                            }}
                                        >
                                            {
                                                [...Array(MAX_ROW).keys()].map((chart, chartId, ) =>{
                                                    return(
                                                        // console.log(pageId*4 + ((rowId*2) + chartId))
                                                        // console.log(pageId, rowId, chartId, '->',((pageId * pageId) + rowId))
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                // backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`
                                                            }}
                                                        >
                                                            {
                                                                chartsToDisplay -1 >= (pageId*4 + ((rowId*2) + chartId)) ? 
                                                                <Chart></Chart> : null

                                                            }
                                                        </div>
                                                    )

                                                })
                                            }
                                        </div>
                                        // console.log('row', rowId, 'page', pageId)
                                    )
                                })
                            }
                        </div>
                        // console.log("page", pageId)
                    )
                })
            }

        </div>
 
        
    )
}

export default ChartEngine;