import * as React from 'react';

import { LoadingButton } from '@mui/lab'
import { Grid, } from '@mui/material';



export const Submit = ({ submitHandler, loading, disabled }) => {
    return <>
        <Grid container item>
            <Grid item xs={12}>
                <LoadingButton onClick={submitHandler} variant='contained' loading={loading} disabled={disabled} fullWidth>
                    Submit
                </LoadingButton>
            </Grid>
        </Grid>
    </>
}



