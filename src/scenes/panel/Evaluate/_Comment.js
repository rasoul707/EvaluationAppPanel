/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, TextField } from '@mui/material';
import * as API from "../../../api";


import { Submit } from "./_Tools"


const Item = ({ data, setUserData, disabled }) => {

    const user_data = data.user_data


    return <>
        <Grid container item spacing={2} >

            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {data.section?.title}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <TextField
                    label="Comment"
                    autoComplete={true}
                    type="text"
                    fullWidth
                    multiline
                    rows={5}
                    value={user_data?.comment}
                    onChange={(e) => { setUserData(e.target.value) }}
                    disabled={disabled || user_data?.id > 0}
                />
            </Grid>

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

    const path = 'comment'

    const changeUserData = (index) => async (val) => {
        let items = [...data]
        if (!data[index].user_data) data[index].user_data = {}
        let value = { ...data[index].user_data, comment: val, id: null }

        let _data = { 'user_data': { ...value } }
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