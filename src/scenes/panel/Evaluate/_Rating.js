/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, Rating, Box, } from '@mui/material';
import * as API from "../../../api";


const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const Item = ({ data, setUserData, disabled }) => {

    const user_data = data.user_data
    const [hover, setHover] = React.useState(-1);


    return <>
        <Grid container item spacing={2} >

            <Grid item xs={4}>
                <Typography variant='subtitle2'>
                    {data.section?.title}
                </Typography>
            </Grid>

            <Grid item xs={8}>
                <Grid container>
                    <Rating
                        max={5}
                        value={user_data?.rating / 2}
                        onChange={(e) => { setUserData(e.target.value * 2, true) }}
                        precision={0.5}
                        getLabelText={getLabelText}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                    />
                    {user_data?.rating !== null && (
                        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : user_data?.rating / 2]}</Box>
                    )}
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

    const path = 'rating'

    const changeUserData = (index) => async (val, sync = true) => {

        let items = [...data]
        const prevData = [...items]
        if (!data[index].user_data) data[index].user_data = {}
        let value = { ...data[index].user_data, rating: val }

        let _data = { 'user_data': { ...value } }
        items[index] = { ...items[index], ..._data }
        set(items)

        if (sync) {
            const { id: resultID, } = value
            const { id: evaluate_id } = data[index]


            if (resultID) {
                try {
                    await API.PATCH()(`${path}/evaluate/${resultID}/`, { rating: val })
                } catch (error) {
                    API.ResponseError(enqueueSnackbar, error)
                    set(prevData)
                }
            } else {
                try {
                    const response = await API.POST()(`${path}/evaluate/`, { evaluate_id, rating: val })
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