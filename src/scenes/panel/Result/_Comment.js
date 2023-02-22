/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, Divider, Avatar, Tooltip, Popover, Button, } from '@mui/material';

import { PieChart, Detail, UserDataTable, StarUser, UserDetail } from './_Tools';
import { MEDIABaseUrl } from "../../../config/server"

import VerifiedIcon from '@mui/icons-material/Verified';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating'
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import StarsIcon from '@mui/icons-material/Stars';
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

    let byList = data.by_list



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
                {showDetail &&
                    <UserDataTable
                        headers={[
                            {
                                id: 'name',
                                numeric: false,
                                disablePadding: true,
                                label: 'Name',
                            },
                            {
                                id: 'degree',
                                numeric: false,
                                disablePadding: false,
                                label: 'Degree',
                            },
                            {
                                id: 'date',
                                numeric: false,
                                disablePadding: false,
                                label: 'Date',
                            },
                            {
                                id: 'comment',
                                numeric: false,
                                disablePadding: false,
                                label: 'Comment',
                            },
                            {
                                id: 'tools',
                                numeric: false,
                                disablePadding: false,
                                label: 'Tools',
                            },
                        ]}
                        rows={byList?.map(({ id, evaluated_by: user, comment, datetime }) => {
                            return {
                                id,
                                name: <UserDetail user={user} />,
                                degree: user.degree.title,
                                date: moment(datetime).format("YYYY-MM-DD HH:mm") || "-",
                                comment: comment,
                                tools: <StarUser type="comment" pid={1} score={null} />
                            }
                        })}
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