/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, Divider, Typography, Slider } from '@mui/material';

import { PieChart, BarChart, Detail, UserDataTable, StarUser, UserDetail } from './_Tools';


import Stack from '@mui/material/Stack'
import moment from 'moment';




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
    const byParamChartOP = []
    const byParamChat = {}
    for (let i = 0; i < pkeys.length; i++) {
        const p = data.by_parameter[pkeys[i]]
        byParamChartOP.push({ name: p.name })
        byParamChat[p.name] = 0
        for (let j = 0; j < p.data.length; j++) {
            byParamChat[p.name] += p.data[j]
        }
        byParamChat[p.name] /= p.data.length
    }

    let byList = data.by_list


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
                        chart={byParamChartOP?.length
                            ? <BarChart params={byParamChartOP} data={[byParamChat]} title={"Metric"} />
                            : <Typography variant='button' >[No result]</Typography>
                        }
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
                {showDetail &&
                    <UserDataTable
                        rows={byList?.map(({ id, evaluated_by: user, parameters, datetime }) => {
                            return {
                                id,
                                name: <UserDetail user={user} />,
                                degree: user.degree.title,
                                date: moment(datetime).format("YYYY-MM-DD HH:mm") || "-",
                                tools: <StarUser type="metric" pid={data.id} uid={user.id} />,
                                detail: parameters?.map(({ id, title, value }) => {
                                    return <Stack direction="column" alignItems="stretch">
                                        <Typography>{title}</Typography>
                                        <Slider
                                            step={1}
                                            marks
                                            min={0}
                                            max={10}
                                            value={value}
                                            readOnly
                                            size="small"
                                            color="warning"
                                        />
                                    </Stack>
                                }),
                            }
                        })}
                        csvData={[
                            ['FullName', 'Email', 'Verify', 'Score', 'Stars', 'Degree', 'Date', ...data.parameters.map(({ id, title, value }) => { return title })],
                            ...byList?.map(({ id, evaluated_by: user, parameters, datetime }) => {
                                return [
                                    user.first_name + " " + user.last_name,
                                    user.email,
                                    user.is_verified,
                                    user.evaluator_scores,
                                    user.stars,
                                    user.degree?.title,
                                    moment(datetime).format("YYYY-MM-DD HH:mm") || "-",
                                    ...parameters?.map(({ id, title, value }) => {
                                        return value
                                    })
                                ]
                            })
                        ]}
                    />
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