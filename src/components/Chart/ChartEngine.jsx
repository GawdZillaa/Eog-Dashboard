import React from 'react';
import Chart from '../Chart/Chart'

const MAX_SIZE = 4
const MAX_ROW = 2
const charCount = 8
const colors = ['pink', 'red', 'green', 'yellow']
const colorsR = ['white', 'purple']
const colorsC = ['violet', 'brown']
const ChartEngine = ({}) => {
    // var chartAmount = new Array(charCount);
    var chartAmount = [0, 1,2,3,4,5,6];
    // var row = new Array(Math.round(charCount / MAX_ROW)); //Charts % 2
    var row = [0, 1, 2] //Charts % 2
    // var pages = new Array(Math.round(charCount / 4))
    var pages = [0, 1]
    var maxRow = [0, 1] // +0 +1

    console.log(pages)
    return(
        <div
            style={{
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                backgroundColorL: 'blue'
            }}
        >
            {
                pages.map((page, pageId) => {
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
                                maxRow.map((row, rowId) => {
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
                                                maxRow.map((chart, chartId) =>{
                                                    return(
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`
                                                            }}
                                                        >
                                                            <Chart></Chart>
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