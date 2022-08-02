/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, List, RadioGroup, Radio, ListItem, FormControl, FormLabel, FormControlLabel, CircularProgress, Collapse, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import * as API from "../../../api";

import { Submit } from "./_Tools"



const ConvertToObject = (user_data) => {
    let result = {}
    user_data?.map(({ question, answer, id }, index) => {
        result[question] = { answer, index, id }
    })
    return result
}


const Item = ({ data, setUserData, disabled, variables }) => {

    const user_data = ConvertToObject(data.user_data)
    const [previewVisible, setPreviewVisible] = React.useState(null)



    return <>
        <Grid item spacing={2} >
            <Typography variant='h6'>
                {data.category.name}
            </Typography>
        </Grid>
        <Grid container item spacing={2} >
            {data.parameters.map(({ title, id }) => {
                return <>
                    <List
                        sx={{ width: '100%', bgcolor: 'background.paper' }}
                        subheader={
                            <ListItemButton
                                component="div"
                                onClick={() => {
                                    setPreviewVisible(previewVisible === id ? null : id)
                                }}
                            >
                                - {title}
                                {variables?.questionsList[id] ? null : <CircularProgress size={20} />}
                                {previewVisible === id ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        }
                    >

                        <Grid container>
                            <Collapse in={previewVisible === id} timeout="auto" unmountOnExit sx={{ pl: 2, }}>
                                <List
                                    sx={{
                                        width: '100%',
                                        position: 'relative',
                                        overflow: 'auto',
                                        maxHeight: 400,
                                        '& ul': { padding: 0 },
                                    }}
                                    subheader={<li />}
                                >
                                    {variables?.questionsList[id]?.map(({ id: qid, question }, index) => (
                                        <ListItem key={`item-${qid}`}>
                                            <FormControl
                                                disabled={disabled || user_data[qid]?.id > 0}
                                            >
                                                <FormLabel>{question}</FormLabel>
                                                <RadioGroup
                                                    row
                                                    value={user_data[qid]?.answer}
                                                    onChange={(e) => { setUserData(qid, e.target.value) }}
                                                >
                                                    <FormControlLabel value={1} control={<Radio />} label="Useless" />
                                                    <FormControlLabel value={2} control={<Radio />} label="Poor" />
                                                    <FormControlLabel value={3} control={<Radio />} label="Ok" />
                                                    <FormControlLabel value={4} control={<Radio />} label="Good" />
                                                    <FormControlLabel value={5} control={<Radio />} label="Excellent" />
                                                </RadioGroup>
                                            </FormControl>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </Grid>


                    </List>
                </>
            })}


        </Grid >

        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>
    </>
}







const Form = ({ data, set, disabled }) => {

    const { enqueueSnackbar } = useSnackbar()
    const [disabledForm, setDisabledForm] = React.useState(false)

    const path = 'questionnaire'

    const changeUserData = (index) => async (questID, val) => {

        const user_data = ConvertToObject(data[index].user_data)

        let result = {}
        let value = [...data[index].user_data]
        let mindex
        if (!value) value = []
        if (!user_data[questID]) {
            result = { question: questID, answer: val, id: null }
            value.push(result)
            mindex = value.length - 1
        } else {
            mindex = user_data[questID].index
            result = { ...value[mindex], question: questID, answer: val }
            value[mindex] = result
        }
        let items = [...data]
        let _data = { 'user_data': value }
        items[index] = { ...items[index], ..._data }
        set(items)
    }

    const [questionsList, setQuestionsList] = React.useState({})
    const getQuestions = async (parameter) => {
        let newList = {}
        for (let i = 0; i < parameter.length; i++) {
            if (questionsList[parameter[i]]) continue
            try {
                const response = await API.GET()(`${path}/question/?parameter=${parameter[i]}`)
                newList[parameter[i]] = response.data
            } catch (error) {
                API.ResponseError(enqueueSnackbar, error)
            }
        }
        setQuestionsList({ ...questionsList, ...newList })
    }

    React.useEffect(() => {
        let prmIDs = []
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].parameters.length; j++) {
                if (!prmIDs.includes(data[i].parameters[j].id))
                    prmIDs.push(data[i].parameters[j].id)
            }
        }
        getQuestions(prmIDs)
    }, [data])

    const [submitLoading, setSubmitLoading] = React.useState(false)
    const submit = async () => {
        setSubmitLoading(true)
        setDisabledForm(true)
        for (let i = 0; i < data.length; i++) {
            const m = data[i]
            try {
                await API.POST()(`${path}/evaluation/`, { evaluate_id: m.id, data: m.user_data })
                enqueueSnackbar("Successfully", { variant: "success" })
            } catch (error) {
                API.ResponseError(enqueueSnackbar, error)
            }
        }
        setSubmitLoading(false)
    }

    return <>
        <Grid container direction="column" spacing={2}>
            {data?.map((data, i) => {
                return <Item
                    key={i}
                    disabled={disabled || disabledForm}
                    data={data}
                    setUserData={changeUserData(i)}
                    variables={{ questionsList }}
                />
            })}
            <Submit submitHandler={submit} loading={submitLoading} disabled={disabled} />

        </Grid>
    </>

}



export default Form