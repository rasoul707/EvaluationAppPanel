/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Card, CardContent, Typography, InputLabel, } from '@mui/material';
import { useSelector, } from "react-redux";



const Withdrawal = ({ setDisabled, setLoading, disabled, loading }) => {

    const user = useSelector(state => state.auth.user)

    return <Card>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Withdrawal
            </Typography>

            <InputLabel >
                {user.token}
            </InputLabel>
        </CardContent>
    </Card>
}

export default Withdrawal