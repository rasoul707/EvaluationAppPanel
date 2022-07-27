import * as React from 'react';

import { LoadingButton } from '@mui/lab'
import { Grid, } from '@mui/material';



export const Adder = ({ newHandler, loading, disabled }) => {
    return <>
        <Grid container item >
            <Grid item xs={12}>
                <LoadingButton onClick={newHandler} variant='contained' loading={loading} disabled={disabled} fullWidth>
                    Add New
                </LoadingButton>
            </Grid>
        </Grid>
    </>
}



