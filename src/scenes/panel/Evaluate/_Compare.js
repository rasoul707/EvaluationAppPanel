/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, Slider, Box } from '@mui/material';




import * as API from "../../../api";


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
        <Grid container item spacing={2} >

            <Grid item xs={3}>
                <Typography variant='subtitle2'>
                    {data.category.name}
                </Typography>
            </Grid>

            <Grid item xs={9}>
                <Grid container direction="column">
                    {data.parameters.map(({ title, id }) => {
                        return <Grid item>
                            <Grid container direction="row" justifyContent="space-between">
                                <Grid item>
                                    {title}
                                </Grid>
                                <Grid item x={12}>
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
                                            disabled={disabled}
                                        />
                                        {user_data[id]?.value !== null && (
                                            <Box sx={{ ml: 2 }}>{user_data[id]?.value}</Box>
                                        )}
                                    </Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                    })}
                </Grid>
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

    const path = 'metric'

    const changeUserData = (index) => async (paramID, val, sync = true) => {

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
        const prevData = [...items]

        let _data = { 'user_data': value }
        items[index] = { ...items[index], ..._data }
        set(items)

        if (sync) {
            const { id: resultID, value: _value } = result
            const { id } = data[index]


            if (resultID) {
                try {
                    await API.PATCH()(`${path}/evaluate/${resultID}/`, { value: _value })
                } catch (error) {
                    API.ResponseError(enqueueSnackbar, error)
                    set(prevData)
                }
            } else {
                try {
                    const response = await API.POST()(`${path}/evaluate/`, { parameter: paramID, value: _value, evaluate_id: id })
                    value[mindex] = response.data
                    _data.user_data = value
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