/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import * as API from "../../../api";
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from "react-redux";



const Notification = ({ setDisabled, setLoading, disabled, loading }) => {



    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const { enqueueSnackbar, } = useSnackbar()


    const [notificationFinishEvaluation, setNotificationFinishEvaluation] = React.useState(user.notification_finish_evaluation)

    const submit = async () => {
        const data = {
            notification_finish_evaluation: notificationFinishEvaluation
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





    return <Card>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Notification
            </Typography>
            <FormControl
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                fullWidth
            >
                <InputLabel>When finish evaluation</InputLabel>
                <Select
                    label="Finish evaluation"
                    value={notificationFinishEvaluation.length ? notificationFinishEvaluation : ["none"]}
                    onChange={(e) => {
                        const v = e.target.value
                        if (v.includes("none")) {
                            const ii = v.indexOf("none")
                            v.splice(ii, 1);
                        }
                        setNotificationFinishEvaluation(e.target.value)
                    }}
                    disabled={disabled}
                    multiple
                >
                    <MenuItem value="none" disabled>None</MenuItem>
                    <MenuItem value="email">By email</MenuItem>
                    <MenuItem value="sms">By sms</MenuItem>
                </Select>
            </FormControl>

            <LoadingButton
                variant="contained"
                size="large"
                children="Edit"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />


        </CardContent>
    </Card>
}

export default Notification