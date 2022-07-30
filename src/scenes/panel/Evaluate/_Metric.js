/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, Slider } from '@mui/material';

import * as API from "../../../api";

import { Submit } from "./_Tools"

const ConvertToObject = (user_data) => {
    let result = {}
    user_data?.map(({ parameter, value, id }, index) => {
        result[parameter] = { value, index, id }
    })
    return result
}


const Item = ({ data, setUserData, disabled }) => {

    const user_data = ConvertToObject(data.user_data)


    return <>
        <Grid item spacing={2} >
            <Typography variant='h6'>
                {data.category.name}
            </Typography>
        </Grid>
        <Grid container item spacing={2} >
            {data.parameters.map(({ title, id }) => {
                return <>
                    <Grid item xs={12}>
                        <Typography variant='subtitle2'>
                            {title}
                        </Typography>
                    </Grid>


                    <Grid item xs={12}>
                        <Grid container>
                            <Slider
                                step={1}
                                marks
                                min={0}
                                max={10}
                                valueLabelDisplay="auto"
                                value={user_data[id]?.value}
                                onChange={(e) => setUserData(id, e.target.value)}
                                sx={{ minWidth: 150, width: 250 }}
                                disabled={disabled || user_data[id]?.id > 0}
                            />
                        </Grid>
                    </Grid>
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

    const path = 'metric'

    const changeUserData = (index) => async (paramID, val) => {

        const user_data = ConvertToObject(data[index].user_data)

        let result = {}
        let value = [...data[index].user_data]
        let mindex
        if (!value) value = []
        if (!user_data[paramID]) {
            result = { parameter: paramID, value: val, id: null }
            value.push(result)
            mindex = value.length - 1
        } else {
            mindex = user_data[paramID].index
            result = { ...value[mindex], parameter: paramID, value: val }
            value[mindex] = result
        }
        let items = [...data]
        let _data = { 'user_data': value }
        items[index] = { ...items[index], ..._data }
        set(items)
    }

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
                />
            })}
            <Submit submitHandler={submit} loading={submitLoading} disabled={disabled} />
        </Grid>
    </>

}



export default Form