/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Card, CardContent, Typography, TextField, } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from 'notistack';
import * as API from "../../../api";
import { LoadingButton } from '@mui/lab'


const Withdrawal = ({ setDisabled, setLoading, disabled, loading }) => {

    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [bank_account, setBankAccount] = React.useState(user.bank_account)

    const submit = async () => {
        const data = {
            bank_account,
        }
        setDisabled(true)
        setLoading(true)
        try {
            const response = await API.PATCH(true)('auth/user/', data)
            enqueueSnackbar("Successfully updated", { variant: 'success' })
            dispatch({ type: 'USER_INFO', payload: { user: response.data } })
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
        setDisabled(false)
        setLoading(false)
    }



    const withdrawalRequest = async () => {
        const data = {
            bank_account,
        }
        setDisabled(true)
        setLoading(true)
        // try {
        //     const response = await API.PATCH(true)('auth/user/', data)
        //     enqueueSnackbar("Successfully updated", { variant: 'success' })
        //     dispatch({ type: 'USER_INFO', payload: { user: response.data } })
        // } catch (error) {
        //     API.ResponseError(enqueueSnackbar, error)
        // }
        setDisabled(false)
        setLoading(false)
    }




    return <Card>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Withdrawal
            </Typography>
            <TextField
                label="Bank account"
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                type="text"
                fullWidth
                value={bank_account}
                onChange={(e) => { setBankAccount(e.target.value) }}
                disabled={disabled}
            />
            <LoadingButton
                variant="contained"
                size="large"
                children="Submit"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />
            <hr />
            <LoadingButton
                variant="outlined"
                size="large"
                children="Withdrawal Request"
                onClick={withdrawalRequest}
                disabled={disabled}
                loading={loading}
            />
        </CardContent>
    </Card>
}

export default Withdrawal