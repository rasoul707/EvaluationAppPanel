import * as React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';

import validex from 'validex'


import { Card, Grid, Paper, CardActionArea, CardMedia, CardContent, Typography, CardActions } from '@mui/material';

import * as API from "../../../api";

import SoftwareForm from "./SoftwareForm"

import Layout from "../../../components/Layout"


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const shop = [
    {
        id: 1,
        score: 50,
        price: 50000,
    },
    {
        id: 2,
        score: 100,
        price: 95000,
    },
    {
        id: 3,
        score: 200,
        price: 180000,
    },
    {
        id: 4,
        score: 500,
        price: 450000,
    }
]

const Shop = () => {
    const buy = (price, score) => {
        alert(score)
        alert(price)

    }
    return <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }} sx={{ mb: 2 }}>
        {shop.map(({ id, score, price }, index) => {
            return <Grid item xs={2} sm={4} md={4} key={index}>
                <Card>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/src/assets/images/dollar-sign.png"
                            alt="dollar"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Get score
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pay {price} and get {score}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => buy(price, score)}>
                            Buy
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        })}
    </Grid>
}


export default Shop