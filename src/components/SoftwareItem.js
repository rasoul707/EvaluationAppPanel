import * as React from 'react';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Rating from '@mui/material/Rating';

import { Link as LinkRoute } from "react-router-dom"





const SoftwareItem = ({ data, noTools, isMySoftware }) => {
    const isLoading = !data

    let size = 128
    let $tools = null
    if (noTools) {
        $tools = null
        // size = 20
    }
    else if (isMySoftware) {
        $tools = <Grid item xs container direction="row" spacing={1}>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='rectangular' sx={{ borderRadius: 1 }} children={<Button children="Edit" />} />
                    :
                    <Button
                        children={"Edit"}
                        color="warning"
                        component={LinkRoute}
                        to={`/softwares/${data.id}`}
                    />
                }
            </Grid>
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='rectangular' sx={{ borderRadius: 1 }} children={<Button children="Define_Evaluation" />} />
                    :
                    <Button
                        children="Define Evaluation"
                        color="primary"
                        component={LinkRoute}
                        to={`/softwares/${data.id}/evaluation`}
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
                    <Skeleton animation="wave" variant='rectangular' sx={{ borderRadius: 1 }} children={<Button children="Edit" />} />
                    :
                    <Button
                        children={"Evaluate"}
                        color="primary"
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
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
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
                                "Area: " + data.area?.name
                            }
                        </Typography>

                        <Typography gutterBottom variant="body2">
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='text' />
                                :
                                "Area: " + data.area?.name
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
    </Paper>
}

export default SoftwareItem