/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, TextField } from '@mui/material';
import * as API from "../../../api";




const Item = ({ data, setUserData, disabled }) => {

    const user_data = data.user_data


    return <>
        <Grid container item spacing={2} >

            <Grid item xs={4}>
                <Typography variant='subtitle2'>
                    {data.section?.title}
                </Typography>
            </Grid>

            <Grid item xs={8}>
                <TextField
                    label="Comment"
                    autoComplete={true}
                    type="text"
                    fullWidth
                    multiline
                    rows={5}
                    value={user_data?.comment}
                    onChange={(e) => { setUserData(e.target.value, false) }}
                    onBlur={(e) => { setUserData(e.target.value, true) }}
                    disabled={disabled}
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

    const path = 'comment'

    const changeUserData = (index) => async (val, sync = true) => {

        let items = [...data]
        const prevData = [...items]
        if (!data[index].user_data) data[index].user_data = {}
        let value = { ...data[index].user_data, comment: val }

        let _data = { 'user_data': { ...value } }
        items[index] = { ...items[index], ..._data }
        set(items)

        if (sync) {
            const { id: resultID, } = value
            const { id: evaluate_id } = data[index]


            if (resultID) {
                try {
                    await API.PATCH()(`${path}/evaluate/${resultID}/`, { comment: val })
                } catch (error) {
                    API.ResponseError(enqueueSnackbar, error)
                    set(prevData)
                }
            } else {
                try {
                    const response = await API.POST()(`${path}/evaluate/`, { evaluate_id, comment: val })
                    _data.user_data = response.data
                    let items = [...data]
                    items[index] = { ...items[index], ..._data }
                    set(items)
                } catch (error) {
                    API.ResponseError(enqueueSnackbar, error)
                    set(prevData)
                }
            }
        }
    }

    return <>
        <Grid container direction="column" spacing={2}>
            {data?.map((data, i) => {
                return <Item
                    key={i}
                    disabled={disabled}
                    data={data}
                    setUserData={changeUserData(i)}
                />
            })}
        </Grid>
    </>

}



export default Form