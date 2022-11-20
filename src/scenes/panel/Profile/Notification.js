/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Card, CardContent, Typography, InputLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
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



            <FormGroup>
                <InputLabel>Finish evaluation</InputLabel>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={notificationFinishEvaluation.includes('email')}
                            onChange={(e) => {
                                const v = e.target.checked
                                let m = notificationFinishEvaluation
                                if (v) m = [...m, 'email']
                                else m = m.filter((v) => v !== 'email')
                                setNotificationFinishEvaluation(m)
                            }}
                        />}
                    label="By Email"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={notificationFinishEvaluation.includes('sms')}
                            onChange={(e) => {
                                const v = e.target.checked
                                let m = notificationFinishEvaluation
                                if (v) m = [...m, 'sms']
                                else m = m.filter((v) => v !== 'sms')
                                setNotificationFinishEvaluation(m)
                            }}
                        />
                    }
                    label="By Sms"
                />
            </FormGroup>


            <LoadingButton
                variant="contained"
                size="large"
                children="Submit"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />


        </CardContent>
    </Card>
}

export default Notification