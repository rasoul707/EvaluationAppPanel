import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Rating from '@mui/material/Rating';
import { Link as LinkRoute } from "react-router-dom"
import AboutSoftDialog from "../components/AboutSoftDialog"

import EditIcon from '@mui/icons-material/Edit';
import BallotIcon from '@mui/icons-material/Ballot';
import TaskIcon from '@mui/icons-material/Task';
import InfoIcon from '@mui/icons-material/Info';



const SoftwareItem = ({ data, noTools, isMySoftware }) => {
    const isLoading = !data

    const [openInfoDialog, setOpenInfoDialog] = React.useState(false)

    let size = 128
    let $tools = null
    if (noTools) {
        $tools = <Grid item xs container direction="row" spacing={1}>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='circular' children={<IconButton children={<InfoIcon />} />} />
                    :
                    <IconButton
                        children={<InfoIcon />}
                        color="info"
                        onClick={() => setOpenInfoDialog(true)}
                    />
                }
            </Grid>
        </Grid>
    }
    else if (isMySoftware) {
        $tools = <Grid item xs container direction="row" spacing={1}>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='circular' children={<IconButton children={<EditIcon />} />} />
                    :
                    <IconButton
                        children={<EditIcon />}
                        color="info"
                        component={LinkRoute}
                        to={`/softwares/${data.id}`}
                    />
                }
            </Grid>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='circular' children={<IconButton children={<BallotIcon />} />} />
                    :
                    <IconButton
                        children={<BallotIcon />}
                        color="warning"
                        component={LinkRoute}
                        to={`/softwares/${data.id}/evaluation`}
                        disabled={!data.is_active}
                    />
                }
            </Grid>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='circular' children={<IconButton children={<TaskIcon />} />} />
                    :
                    <IconButton
                        children={<TaskIcon />}
                        color="success"
                        component={LinkRoute}
                        to={`/softwares/${data.id}/result`}
                        disabled={!data.is_active}
                    />
                }
            </Grid>
        </Grid>
    }
    else {
        $tools = <Grid item xs container direction="row" spacing={1}>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='circular' children={<IconButton children={<InfoIcon />} />} />
                    :
                    <IconButton
                        children={<InfoIcon />}
                        color="info"
                        onClick={() => setOpenInfoDialog(true)}
                    />
                }
            </Grid>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='circular' children={<IconButton children={<BallotIcon />} />} />
                    :
                    <IconButton
                        children={<BallotIcon />}
                        color="warning"
                        component={LinkRoute}
                        to={`/evaluate/${data.id}`}
                    />
                }
            </Grid>

        </Grid>
    }
    return <Paper
        sx={{
            p: 2,
            margin: 'auto',
            flexGrow: 1,
            backgroundColor: data?.is_active === false ? "#b3b3b3" : '#fff',
        }}

    >

        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='rectangular' width={size} height={size} />
                    :
                    <Avatar
                        alt={data.name.toUpperCase()}
                        src={data.logo?.medium}
                        sx={{ width: size, height: size }}
                        variant="square"
                        children={"No Photo"}
                    />
                }
            </Grid>

            <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2} >

                    <Grid item xs>
                        <Typography gutterBottom variant="h6" component="div">
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='text' />
                                :
                                data.name
                            }
                        </Typography>
                        <Typography gutterBottom variant="body2">
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='text' />
                                :
                                [<b>Area: </b>, data.area?.name]
                            }
                        </Typography>

                        <Typography gutterBottom variant="body2" sx={{ height: 40 }}>
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='text' />
                                :
                                data.evaluations?.length === 0 ? null : [<b>Avail. Evaluations: </b>, data.evaluations?.join(", ")]
                            }
                        </Typography>
                    </Grid>

                    {$tools}

                </Grid>

                <Grid item sx={{ position: "relative" }}>
                    {data?.rating ? <Rating value={data.rating} precision={0.5} readOnly sx={{ position: "absolute", right: 0 }} /> : null}
                </Grid>
            </Grid>


        </Grid>


        <AboutSoftDialog
            open={openInfoDialog}
            handleClose={() => setOpenInfoDialog(false)}
            title={data?.name}
            description={data?.description}
            download_link={data?.download_link}
            logo={data?.logo?.medium}
        />

    </Paper>
}

export default SoftwareItem








