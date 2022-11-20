/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, Divider, Collapse, List, ListItemButton, } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


import { PieChart, Detail } from './_Tools';




const score2Title = (score) => {
    return {
        1: 'Useless',
        2: 'Poor',
        3: 'Ok',
        4: 'Good',
        5: 'Excellent',
    }[score]
}


const Item = ({ data }) => {

    const [previewVisible, setPreviewVisible] = React.useState(null)

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
            for (let k = 0; k < data.by_parameter[paramID].questions[questionID].data.length; k++) {
                const c = data.by_parameter[paramID].questions[questionID].data[k]
                if (chartData[c] === undefined) {
                    chartData[c] = byParChartData.length
                    byParChartData.push({ name: score2Title(c), value: 1 })
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
                                            overflow: 'auto',
                                            maxHeight: 400,
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