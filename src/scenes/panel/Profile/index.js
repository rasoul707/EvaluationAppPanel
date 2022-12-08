
import * as React from 'react';

import Layout from "../../../components/Layout"
import Grid from '@mui/material/Grid';
import EditProfile from './EditProfile';
import Notification from './Notification';
import Documents from './Documents';
import Referral from './Referral';

const Profile = () => {

    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)


    return <Layout>
        <Grid
            container
            spacing={2}
        >
            <Grid item xs={12}>
                <EditProfile {...{ disabled, loading, setDisabled, setLoading }} />
            </Grid>
            <Grid item xs={12}>
                <Notification {...{ disabled, loading, setDisabled, setLoading }} />
            </Grid>
            <Grid item xs={12}>
                <Documents {...{ disabled, loading, setDisabled, setLoading }} />
            </Grid>
            <Grid item xs={12}>
                <Referral {...{ disabled, loading, setDisabled, setLoading }} />
            </Grid>
        </Grid>
    </Layout>
}


export default Profile