/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, Divider, } from '@mui/material';

import { PieChart, Detail } from './_Tools';







const Item = ({ data }) => {

    let degreeChart = {}
    let byDegreeChart = []
    for (let i = 0; i < data.by_degree.length; i++) {
        const degName = data.by_degree[i]
        if (degreeChart[degName] === undefined) {
            degreeChart[degName] = byDegreeChart.length
            byDegreeChart.push({ name: degName, value: 1 })
        }
        else {
            byDegreeChart[degreeChart[degName]]['value'] += 1
        }
    }





    let byParameterChart = {}
    for (let i = 0; i < Object.keys(data.by_parameter).length; i++) {
        const paramID = Object.keys(data.by_parameter)[i]
        let chartData = {}
        let byParChartData = []
        for (let j = 0; j < data.by_parameter[paramID].data.length; j++) {
            const c = data.by_parameter[paramID].data[j]
            if (chartData[c] === undefined) {
                chartData[c] = byParChartData.length
                byParChartData.push({ name: 'Score ' + c, value: 1 })
            } else {
                byParChartData[chartData[c]]['value'] += 1
            }
        }
        byParameterChart[paramID] = {
            name: data.by_parameter[paramID].name,
            data: byParChartData
        }
    }




    return <>
        <Grid container item spacing={2} alignItems="center" justifyContent="center">
            <Grid item md={6} xs={12} key={0}>
                <Grid container direction="column" alignItems="flex-start">
                    <Detail
                        title={data.category?.name}
                        completed={data.completed_datetime}
                        deadline={data.deadline}
                        published={data.published_datetime}
                        max={data.max}
                        evaluates={data.evaluates}
                        excelData={[]}
                    />
                </Grid>
            </Grid>
            <Grid item md={6} xs={12} key={1}>
                <PieChart data={byDegreeChart} title={"Degree"} />
            </Grid>
            {Object.keys(byParameterChart).map((paramID) => {
                const { name, data } = byParameterChart[paramID]
                return <Grid item md={6} xs={12} key={paramID}>
                    <PieChart data={data} title={name} />
                </Grid>
            })}
        </Grid >

        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>
    </>
}














const Form = ({ data }) => {
    return <>
        <Grid container direction="column" spacing={2}>
            {data?.map((data, i) => {
                return <Item
                    key={i}
                    data={data}
                />
            })}
        </Grid>
    </>
}



export default Form