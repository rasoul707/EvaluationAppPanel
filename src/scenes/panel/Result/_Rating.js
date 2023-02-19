/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, Divider, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Rating, } from '@mui/material';

import { PieChart, Detail } from './_Tools';

import { MEDIABaseUrl } from "../../../config/server"



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

    let byList = data.by_list
    let _ratingAvg = 0
    for (let i = 0; i < byList.length; i++) {
        _ratingAvg += byList[i].rating
    }
    _ratingAvg /= byList.length


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
                        extra={<>
                            <Rating
                                max={5}
                                value={_ratingAvg / 2}
                                precision={0.5}
                                readOnly
                            />
                        </>
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
                {byList?.length
                    ?
                    <List sx={{ height: "150px", overflowX: "hidden" }}>
                        <Grid container spacing={1}>
                            {byList.map(({ rating, evaluated_by }) => {
                                const { first_name, last_name, avatar } = evaluated_by
                                return <>
                                    <Grid item xs={12} md={6}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={first_name + " " + last_name}
                                                    src={avatar ? MEDIABaseUrl + avatar?.medium : "/NO-AVATAR"}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={first_name + " " + last_name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Rating
                                                            max={5}
                                                            value={rating / 2}
                                                            precision={0.5}
                                                            readOnly
                                                        />
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    </Grid>
                                </>
                            })}
                        </Grid>
                    </List>
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