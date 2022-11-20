
import * as React from 'react';

import Layout from "../../../components/Layout"
import Grid from '@mui/material/Grid';
import EditProfile from './EditProfile';
import Notification from './Notification';

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
        </Grid>
    </Layout>
}


export default Profile