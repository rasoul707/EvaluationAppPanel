/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, Divider, Typography } from '@mui/material';

import { PieChart, BarChart, Detail } from './_Tools';







const Item = ({ data }) => {

    const [showDetail, setShowDetail] = React.useState(false)


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


    const pkeys = Object.keys(data.by_parameter)
    const byParamChart = []
    for (let i = 0; i < pkeys.length; i++) {
        const p = data.by_parameter[pkeys[i]]
        byParamChart.push({ name: p.name, Soft: 0, Target: 0 })
        for (let j = 0; j < p.data.length; j++) {
            byParamChart[i]['Soft'] += p.data[j].soft
            byParamChart[i]['Target'] += p.data[j].target
        }
        byParamChart[i]['Soft'] /= p.data.length
        byParamChart[i]['Target'] /= p.data.length
    }



    const barParams = [
        { name: "Target" },
        { name: "Soft" }
    ]


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
                        setShowDetail={() => setShowDetail(!showDetail)}
                        showDetail={showDetail}
                    />
                </Grid>
            </Grid>
            <Grid item md={6} xs={12} key={1}>
                {byDegreeChart.length
                    ? <PieChart data={byDegreeChart} title={"Degree"} />
                    : ""
                }
            </Grid>
            <Grid item xs={12} key={2} textAlign='center'>
                {byParamChart?.length
                    ? <BarChart params={barParams} data={byParamChart} title={"Compare"} />
                    : <Typography variant='button' >[No result]</Typography>
                }
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