/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, TextField, IconButton } from '@mui/material';
import * as API from "../../../api";
import ForumIcon from '@mui/icons-material/Forum';
import { Button, Alert, Dialog, CircularProgress, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

import { Submit } from "./_Tools"
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';

import { MEDIABaseUrl } from "../../../config/server"
import moment from 'moment';
import { Stack } from '@mui/system';



const Item = ({ data, setUserData, disabled }) => {

    const user_data = data.user_data
    disabled = disabled || data.user_data?.id > 0

    return <>
        <Grid container item spacing={2} >

            <Grid item xs={12} container alignItems="center">
                <Typography variant='subtitle2'>
                    {data.section?.title}
                </Typography>
                <CommentsReplyDialog data={data} disabled={disabled} />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    label="Comment"
                    autoComplete={true}
                    type="text"
                    fullWidth
                    multiline
                    rows={5}
                    value={user_data?.comment}
                    onChange={(e) => { setUserData(e.target.value) }}
                    disabled={disabled}
                />
            </Grid>

        </Grid >

        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>
    </>
}


const Form = ({ data, set, disabled, softID }) => {

    const { enqueueSnackbar } = useSnackbar()
    const [disabledForm, setDisabledForm] = React.useState(false)

    const path = 'comment'

    const changeUserData = (index) => async (val) => {
        let items = [...data]
        if (!data[index].user_data) data[index].user_data = {}
        let value = { ...data[index].user_data, comment: val, id: null }

        let _data = { 'user_data': { ...value } }
        items[index] = { ...items[index], ..._data }
        set(items)
    }

    const [submitLoading, setSubmitLoading] = React.useState(false)
    const submit = async () => {
        setSubmitLoading(true)
        setDisabledForm(true)
        for (let i = 0; i < data.length; i++) {
            const m = data[i]
            try {
                await API.POST()(`${path}/evaluation/`, { evaluate_id: m.id, data: m.user_data })
                enqueueSnackbar("Successfully", { variant: "success" })
            } catch (error) {
                API.ResponseError(enqueueSnackbar, error)
            }
        }
        setSubmitLoading(false)
    }

    return <>

        <Grid container direction="column" spacing={2}>
            {data?.map((data, i) => {
                return <Item
                    key={i}
                    disabled={disabled || disabledForm}
                    data={data}
                    setUserData={changeUserData(i)}
                />
            })}
            <Submit submitHandler={submit} loading={submitLoading} disabled={disabled} />
        </Grid>
    </>

}



export const CommentsReplyDialog = ({ data, }) => {

    const [showDialog, setShowDialog] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [comments, setComments] = React.useState([])

    const handleOpen = async () => {
        setShowDialog(true)
        setLoading(true)
        await getCommentsResult()
    }

    const handleClose = () => {
        setShowDialog(false)
    }

    const evid = data?.id
    const getCommentsResult = async () => {
        try {
            const response = await API.GET()(`comment_reply/?pid=${evid}`)
            setLoading(false)
            setComments(response.data || [])
        } catch (error) {
            // API.ResponseError(enqueueSnackbar, error)
            setLoading(false)
        }
    }

    return <>
        <IconButton size="small" color='secondary' sx={{ ml: 1 }} onClick={handleOpen}>
            <ForumIcon />
        </IconButton>

        <Dialog
            open={showDialog}
            keepMounted
            onClose={handleClose}
            sx={{ "& .MuiPaper-root": { maxWidth: "1000px" } }}
        >
            <DialogTitle>Comments</DialogTitle>
            <DialogContent sx={{ width: "450px" }}>
                <Typography><b>Software:</b> {data?.software?.name}</Typography>
                <Typography><b>Section:</b> {data?.section?.title}</Typography>
                {loading &&
                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
                        <CircularProgress size={20} />
                    </div>
                }
                <br />
                {comments.map(({ comment, datetime, evaluated_by, reply, id }) => {
                    return <CommentBox
                        comment={comment}
                        user={evaluated_by}
                        datetime={datetime}
                        reply={reply}
                        id={id}
                    />
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">Close</Button>
            </DialogActions>
        </Dialog>
    </>
}



export default Form





const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    // transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));




const CommentBox = ({ comment, user, datetime, reply, id }) => {

    const [expanded, setExpanded] = React.useState(false);
    const [myComment, setMyComment] = React.useState("");

    const handleExpandClick = () => {
        setExpanded(!expanded);
        setMyComment("")
    };


    const submitComment = async () => {
        if (!myComment) return
        const data = {
            parent: id,
            content: myComment,
        }
        try {
            const response = await API.POST()(`comment_reply/`, data)
            // setComments(response.data || [])
            setExpanded(false)
            setMyComment("")
        } catch (error) {
            // API.ResponseError(enqueueSnackbar, error)
            setExpanded(false)
            setMyComment("")
        }
    }

    return <Card sx={{ bgcolor: "#cbcbcb" }}>
        <CardHeader
            avatar={
                <Avatar
                    alt={user.first_name + " " + user.last_name}
                    src={user.avatar ? user.avatar?.medium : "/NO-AVATAR"}
                    sx={{ mr: 1 }}
                />
            }
            title={user.first_name + " " + user.last_name}
            subheader={moment(datetime).format("MMM DD, YYYY HH:mm")}
        />
        <CardContent>
            <Typography variant="body2" color="text.secondary">
                {comment}
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
                <FavoriteIcon />
            </IconButton>
            <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
            >
                {expanded ? <CloseIcon /> : <ReplyIcon />}
            </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <Stack direction="column" spacing={1} sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Typography variant='button'>Reply to:</Typography>
                        <Typography color="blue" >{user.first_name + " " + user.last_name}</Typography>
                    </Stack>
                    <TextField
                        label="Comment"
                        autoComplete={true}
                        type="text"
                        fullWidth
                        multiline
                        rows={5}
                        autoFocus
                        value={myComment}
                        onChange={(e) => { setMyComment(e.target.value) }}
                    />
                    <Button
                        children={"Submit"}
                        variant="contained"
                        size='small'
                        onClick={submitComment}
                    />
                </Stack>

            </CardContent>
        </Collapse>
        {reply.map(({ content: comment, user, datetime, }) => {
            return <Card sx={{ bgcolor: "#fff", m: 2 }}>
                <CardHeader
                    avatar={
                        <Avatar
                            alt={user.first_name + " " + user.last_name}
                            src={user.avatar ? MEDIABaseUrl + user.avatar?.medium : "/NO-AVATAR"}
                            sx={{ mr: 1 }}
                        />
                    }
                    title={user.first_name + " " + user.last_name}
                    subheader={moment(datetime).format("MMM DD, YYYY HH:mm")}
                    sx={{ p: 1 }}
                />
                <CardContent sx={{ p: 1, pb: "8px !important" }}>
                    <Typography variant="body2" color="text.secondary">
                        {comment}
                    </Typography>
                </CardContent>
            </Card>
        })}
    </Card>
}