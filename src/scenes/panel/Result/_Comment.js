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



    return <>
        <Grid container item spacing={2} alignItems="center" justifyContent="center">
            <Grid item md={6} xs={12} key={0}>
                <Grid container direction="column" alignItems="flex-start">
                    <Detail
                        title={data.section?.title}
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