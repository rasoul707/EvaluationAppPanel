/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, Divider, Collapse, List, ListItemButton, Typography } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


import { Slider } from '@mui/material';

import { PieChart, Detail, UserDataTable, StarUser } from './_Tools';



import VerifiedIcon from '@mui/icons-material/Verified';
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import { MEDIABaseUrl } from "../../../config/server"
import moment from 'moment';

const defOptions = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
}
const score2Title = (score, custom_options, options) => {
    if (custom_options) return options.split("|")[score - 1]
    else return defOptions[score]
}


const Item = ({ data }) => {

    const [previewVisible, setPreviewVisible] = React.useState(null)
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





    let byParameterChart = {}
    for (let i = 0; i < Object.keys(data.by_parameter).length; i++) {
        const paramID = Object.keys(data.by_parameter)[i]
        let byQuestions = {}
        for (let j = 0; j < Object.keys(data.by_parameter[paramID].questions).length; j++) {
            const questionID = Object.keys(data.by_parameter[paramID].questions)[j]
            let chartData = {}
            let byParChartData = []
            const o = data.by_parameter[paramID].questions[questionID]['options']
            const f = data.by_parameter[paramID].questions[questionID]['custom_options']
            for (let k = 0; k < data.by_parameter[paramID].questions[questionID].data.length; k++) {
                const c = data.by_parameter[paramID].questions[questionID].data[k]

                if (chartData[c] === undefined) {
                    chartData[c] = byParChartData.length
                    byParChartData.push({ name: score2Title(c, f, o), value: 1 })
                } else {
                    byParChartData[chartData[c]]['value'] += 1
                }
            }
            byQuestions[questionID] = {
                title: data.by_parameter[paramID].questions[questionID].title,
                data: byParChartData
            }
        }

        byParameterChart[paramID] = {
            name: data.by_parameter[paramID].name,
            questions: byQuestions
        }
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
                        chartWidth={800}
                        chart={Object.keys(byParameterChart).length
                            ?
                            <Grid container item spacing={2}>
                                {Object.keys(byParameterChart).map((paramID) => {
                                    const { name, questions } = byParameterChart[paramID]
                                    return <>
                                        <List
                                            sx={{ width: '100%', bgcolor: 'background.paper' }}
                                            subheader={
                                                <ListItemButton
                                                    component="div"
                                                    onClick={() => {
                                                        setPreviewVisible(previewVisible === paramID ? null : paramID)
                                                    }}
                                                >
                                                    - {name}
                                                    {previewVisible === paramID ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                            }
                                        >
                                            <Grid container>
                                                <Collapse in={previewVisible === paramID} timeout="auto" unmountOnExit sx={{ pl: 2, width: "100%" }}>
                                                    <List
                                                        sx={{
                                                            width: '100%',
                                                            position: 'relative',
                                                            overflowX: 'hidden',
                                                            '& ul': { padding: 0 },
                                                        }}
                                                    >
                                                        <Grid container item spacing={2} alignItems="center" justifyContent="center">
                                                            {Object.keys(questions).map((quID) => {
                                                                const { title, data } = questions[quID]
                                                                return <Grid item md={6} xs={12} key={1}>
                                                                    <PieChart data={data} title={title} />
                                                                </Grid>
                                                            })}
                                                        </Grid>
                                                    </List>
                                                </Collapse>
                                            </Grid>
                                        </List>
                                    </>
                                })}
                            </Grid >
                            : <Typography variant='button' >[No result]</Typography>}
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
                                id: 'parameters',
                                numeric: false,
                                disablePadding: false,
                                label: 'Parameters',
                            },
                            {
                                id: 'tools',
                                numeric: false,
                                disablePadding: false,
                                label: 'Tools',
                            },
                        ]}
                        rows={byList?.map(({ id, evaluated_by: user, parameters, datetime }) => {
                            return {
                                id,
                                name: <>
                                    <Stack direction="row" alignItems="center">
                                        <Avatar
                                            alt={user.first_name + " " + user.last_name}
                                            src={user.avatar ? MEDIABaseUrl + user.avatar?.medium : "/NO-AVATAR"}
                                        />
                                        <Rating
                                            max={5}
                                            value={user.stars / 2}
                                            precision={0.5}
                                            readOnly
                                        />
                                        ({user.evaluator_scores})
                                    </Stack>
                                    <Stack direction="row" alignItems="center">
                                        {user.first_name + " " + user.last_name}{user.is_verified && <VerifiedIcon sx={{ ml: 1, color: "rgb(29, 155, 240)" }} fontSize="small" />}
                                    </Stack>
                                    <Stack direction="row" alignItems="center">
                                        {user.email}
                                    </Stack>
                                </>,
                                degree: user.degree.title,
                                date: moment(datetime).format("YYYY-MM-DD HH:mm") || "-",
                                parameters: parameters?.map(({ id, title, value }) => {
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