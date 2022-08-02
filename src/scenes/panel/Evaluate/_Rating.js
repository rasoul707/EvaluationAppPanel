/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, Rating, Box, } from '@mui/material';
import * as API from "../../../api";

import { Submit } from "./_Tools"


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

            <Grid item xs={12}>
                <Typography variant='subtitle2'>
                    {data.section?.title}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Grid container>
                    <Rating
                        max={5}
                        value={user_data?.rating / 2}
                        onChange={(e) => { setUserData(e.target.value * 2) }}
                        precision={0.5}
                        getLabelText={getLabelText}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                        disabled={disabled || user_data?.id > 0}
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
    const [disabledForm, setDisabledForm] = React.useState(false)

    const path = 'rating'

    const changeUserData = (index) => async (val) => {
        let items = [...data]
        if (!data[index].user_data) data[index].user_data = {}
        let value = { ...data[index].user_data, rating: val, id: null }
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