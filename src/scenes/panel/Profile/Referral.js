/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Card, CardContent, Typography, InputLabel, } from '@mui/material';
import { useSelector, } from "react-redux";



const Referral = ({ setDisabled, setLoading, disabled, loading }) => {

    const user = useSelector(state => state.auth.user)

    return <Card>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Invite friends
            </Typography>

            <InputLabel >
                {user.token}
            </InputLabel>
        </CardContent>
    </Card>
}

export default Referral