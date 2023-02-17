import * as React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from 'notistack';
import { Card, Grid, CardActionArea, CardMedia, CardContent, Typography, CardActions } from '@mui/material';
import * as API from "../../../api";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import signDollar from "../../../assets/images/dollar-sign.png"

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
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const { enqueueSnackbar, } = useSnackbar()

    const buy = (price, score) => {
        setPayScore(score)
        setPayPrice(price)
        setOpenPayDialog(true)
    }
    const cancelPayDialog = () => {
        setOpenPayDialog(false)
        setPayScore(null)
        setPayPrice(null)
    }
    const confirmPayDialog = async () => {
        const data = {
            score: user.score + payScore,
        }
        try {
            const response = await API.PATCH(true)('auth/user/', data)
            enqueueSnackbar("Successfully", { variant: 'success' })
            dispatch({ type: 'USER_INFO', payload: { user: response.data } })
            setTimeout(() => {
                window.location.reload();
            }, 1000)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }
    const [openPayDialog, setOpenPayDialog] = React.useState(false)
    const [payPrice, setPayPrice] = React.useState(null)
    const [payScore, setPayScore] = React.useState(null)

    return <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }} sx={{ mb: 2 }}>
        {shop.map(({ id, score, price }, index) => {
            return <Grid item xs={2} sm={4} md={4} key={index}>
                <Card>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            image={signDollar}
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

        <Dialog
            open={openPayDialog}
            keepMounted
            onClose={cancelPayDialog}
        >
            <DialogTitle>Buy score</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want pay {payPrice} to get {payScore} score?
                </Typography>

            </DialogContent>
            <DialogActions>
                <DialogActions>
                    <Button onClick={confirmPayDialog} >Yes</Button>
                    <Button onClick={cancelPayDialog} color="error">Cancel</Button>
                </DialogActions>
            </DialogActions>
        </Dialog>
    </Grid>
}


export default Shop