
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Alert, Dialog, AlertTitle, DialogTitle, DialogContent, DialogActions, Slide, Typography, Grid, Tooltip, Chip, TextField, Switch, Divider, IconButton, } from '@mui/material';
import * as React from 'react';
import { LoadingButton } from '@mui/lab'
import * as API from "../../../api";
import { useSnackbar } from 'notistack';
import moment from "moment"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PieChartIcon from '@mui/icons-material/PieChart';
import EventIcon from '@mui/icons-material/Event';
import { useHistory, useLocation } from 'react-router-dom';



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





const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export const PrePublishDialog = ({ open, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Publishing</DialogTitle>
        <DialogContent >
            <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Warning</AlertTitle>
                After publishing evaluation, you can't edit or remove that
            </Alert>
            <Typography>
                Are you sure you want to publish this evaluation?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Yes, I'm sure</Button>
            <Button onClick={handleReject} color="error">Cancel</Button>
        </DialogActions>
    </Dialog>
}


export const PreConfirmDecreaseScoreDialog = ({ open, text, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Pay score</DialogTitle>
        <DialogContent >
            <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Warning</AlertTitle>
                {text}
            </Alert>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Yes, I'm sure</Button>
            <Button onClick={handleReject} color="error">Cancel</Button>
        </DialogActions>
    </Dialog>
}



export const NoScoreDialog = ({ open, handleReject, }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>No Score</DialogTitle>
        <DialogContent >
            <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {open}
            </Alert>
            You can buy score from store or evaluate other softwares or invite people :)
        </DialogContent>
        <DialogActions>
            <Button onClick={handleReject} color="error">Close</Button>
        </DialogActions>
    </Dialog>
}


export const PreActivationDialog = ({ open, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Activation</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to active this evaluation?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Yes, I'm sure</Button>
            <Button onClick={handleReject} color="error">Cancel</Button>
        </DialogActions>
    </Dialog>
}



export const PreInactivationDialog = ({ open, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Inactivation</DialogTitle>
        <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Warning</AlertTitle>
                After inactivating evaluation, it will be remove from evaluations list
            </Alert>
            <Typography>
                Are you sure you want to inactive this evaluation?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Yes, I'm sure</Button>
            <Button onClick={handleReject} color="error">Cancel</Button>
        </DialogActions>
    </Dialog>
}





export const PreDeleteDialog = ({ open, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure you want to delete this evaluation?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Yes, I'm sure</Button>
            <Button onClick={handleReject} color="error">Cancel</Button>
        </DialogActions>
    </Dialog>
}











export const ExtensionDialog = ({ open, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Extension</DialogTitle>
        <DialogContent>
            <Typography>
                Are you sure to extend for 30 days
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Yes</Button>
            <Button onClick={handleReject} color="error">Cancel</Button>
        </DialogActions>
    </Dialog>
}







export const RemoveLimitDialog = ({ open, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Limited</DialogTitle>
        <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Limit</AlertTitle>
                You can publish one evaluation per month
            </Alert>
            <Typography>
                if you want create a new one, you can pay 🤝
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Pay 0$</Button>
            <Button onClick={handleReject} color="error">Cancel</Button>
        </DialogActions>
    </Dialog>
}







export const MainForm = ({ softID, data, set, disabled, variables, Item, path }) => {

    const { enqueueSnackbar } = useSnackbar()
    const [addLoading, setAddLoading] = React.useState(false)
    const [publishDialog, setPublishDialog] = React.useState(-1)
    const [activeDialog, setActiveDialog] = React.useState(-1)
    const [inactiveDialog, setInactiveDialog] = React.useState(-1)
    const [deleteDialog, setDeleteDialog] = React.useState(-1)
    const [extensionDialog, setExtensionDialog] = React.useState(-1)
    const [removeLimitDialog, setRemoveLimitDialog] = React.useState(-1)
    const [noScoreDialog, setNoScoreDialog] = React.useState(false)
    const [confirmDecreaseDialog, setConfirmDecreaseDialog] = React.useState(false)



    const addItem = async () => {
        setAddLoading(true)
        const _data = { software: softID, }
        try {
            const response = await API.POST()(`${path}/`, _data)
            set([...data, response.data])
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
        setAddLoading(false)
    }


    const changeItem = (index) => async (key, val, sync = true) => {
        return new Promise(async (resolve, reject) => {
            let _data = { [key]: val }
            if (key === 'publish') {
                _data.publishing = true
            }

            // **************
            if (path === 'metric' || path === 'compare') {
                if (key === 'category') {
                    _data['parameters'] = []
                }
                if (key === 'parameters' && val.includes('all')) {
                    const params = variables?.metricsParametersList[data[index].category]
                    if (!params || params?.length === 0 || val.length - 1 === params?.length) {
                        _data['parameters'] = []
                    }
                    else {
                        _data['parameters'] = params?.map(({ id }) => id)
                    }
                }
            }
            if (path === 'questionnaire') {
                if (key === 'category') {
                    _data['parameters'] = []
                }
                if (key === 'parameters' && val.includes('all')) {
                    const params = variables?.questionnairesParametersList[data[index].category]
                    if (!params || params?.length === 0 || val.length - 1 === params?.length) {
                        _data['parameters'] = []
                    }
                    else {
                        _data['parameters'] = params?.map(({ id }) => id)
                    }
                }
            }
            // ************


            let items = [...data]
            let prevData = [...items]
            items[index] = { ...items[index], ..._data }
            set(items)
            if (sync) {
                const { id } = data[index]
                try {
                    const response = await API.PATCH()(`${path}/${id}/`, _data)
                    items = [...data]
                    items[index] = { ...items[index], ...response.data }
                    set(items)
                    resolve(response.data)
                } catch (error) {
                    API.ResponseError(enqueueSnackbar, error)
                    set(prevData)
                    reject(error)
                }
            }
        })
    }


    const publishItem = (index) => async () => {
        setPublishDialog(index)
    }
    const confirmPublish = async () => {
        setPublishDialog(-1)
        try {
            await changeItem(publishDialog)('publish', true)
        } catch (error) {
            if (error?.data?.code === 'NO_SCORE') {
                setNoScoreDialog(error?.data?.message)
            }
            if (error?.data?.code === 'CONFIRM_DECREASE_SCORE') {
                setConfirmDecreaseDialog({ id: publishDialog, text: error?.data?.message })
            }
        }
    }
    const rejectPublish = () => {
        setPublishDialog(-1)
    }


    const confirmDecrease = async () => {
        const isExtend = confirmDecreaseDialog.isExtend
        setConfirmDecreaseDialog(-1)
        try {
            await changeItem(confirmDecreaseDialog?.id)(isExtend ? 'confirm_extension' : 'confirm_publish', true)
            enqueueSnackbar("Your evaluation published successfully", { variant: "success" })
            window.location.reload()
        } catch (error) {
            if (error?.data?.code === 'NO_SCORE') {
                setNoScoreDialog(error?.data?.message)
            }
        }
    }
    const rejectDecrease = () => {
        setConfirmDecreaseDialog(-1)
    }


    const activeItem = (index) => async (is_active) => {
        if (is_active) setActiveDialog(index)
        else setInactiveDialog(index)
    }
    const confirmActive = async () => {
        setActiveDialog(-1)
        try {
            await changeItem(activeDialog)('is_active', true)
            enqueueSnackbar("Your evaluation activated successfully", { variant: "success" })
        } catch (error) { }
    }
    const rejectActive = () => {
        setActiveDialog(-1)
    }
    const confirmInactive = async () => {
        setInactiveDialog(-1)
        try {
            await changeItem(inactiveDialog)('is_active', false)
            enqueueSnackbar("Your evaluation inactivated successfully", { variant: "success" })
        } catch (error) { }
    }
    const rejectInactive = () => {
        setInactiveDialog(-1)
    }



    const deleteItem = (index) => async () => {
        setDeleteDialog(index)
    }
    const confirmDelete = async () => {
        setDeleteDialog(-1)
        const { id } = data[deleteDialog]
        try {
            await API.DELETE()(`${path}/${id}/`)
            set(data.filter((_, i) => i !== deleteDialog))
            enqueueSnackbar("Your evaluation deleted successfully", { variant: "success" })
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }
    const rejectDelete = () => {
        setDeleteDialog(-1)
    }



    const extensionItem = (index) => async () => {
        setExtensionDialog(index)
    }
    const confirmExtension = async () => {
        setExtensionDialog(-1)
        try {
            await changeItem(extensionDialog)('extension', true)
        } catch (error) {
            if (error?.data?.code === 'NO_SCORE') {
                setNoScoreDialog(error?.data?.message)
            }
            if (error?.data?.code === 'CONFIRM_DECREASE_SCORE') {
                setConfirmDecreaseDialog({ id: extensionDialog, isExtend: true, text: error?.data?.message })
            }
        }
    }
    const rejectExtension = () => {
        setExtensionDialog(-1)
    }




    const confirmRemoveLimit = async () => {
        setRemoveLimitDialog(-1)

        try {
            await API.POST()(`auth/user/pay_confirm/publish_evaluation/`, { type: path })
            enqueueSnackbar("Good, now you can publish", { variant: "success" })
            // publishItem(removeLimitDialog)()
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }

    }
    const rejectRemoveLimit = () => {
        setRemoveLimitDialog(-1)
    }


    /***** */

    const [questionsList, setQuestionsList] = React.useState({})
    const getQuestions = async (parameter) => {
        let newList = {}
        for (let i = 0; i < parameter.length; i++) {
            if (questionsList[parameter[i]]) continue
            try {
                const response = await API.GET()(`${path}/question/?parameter=${parameter[i]}`)
                newList[parameter[i]] = response.data
            } catch (error) {
                API.ResponseError(enqueueSnackbar, error)
            }
        }
        setQuestionsList({ ...questionsList, ...newList })
    }

    if (path === 'questionnaire') {
        variables = { ...variables, getQuestions, questionsList }
    }

    /****** */


    return <>
        <Grid container direction="column" spacing={2}>
            {data?.map((data, i) => {
                return <Item
                    key={i}
                    disabled={disabled}

                    data={data}

                    remove={deleteItem(i)}

                    set={changeItem(i)}

                    isActive={data.is_active}
                    active={activeItem(i)}

                    isPublish={data.publish && !data.publishing}
                    publish={publishItem(i)}

                    extension={extensionItem(i)}

                    variables={variables}
                />
            })}
            <Adder newHandler={addItem} loading={addLoading} disabled={disabled} />
            {/* <Adder newHandler={addItem} loading={addLoading} disabled={disabled} /> */}
        </Grid>
        <PrePublishDialog
            open={publishDialog >= 0}
            handleReject={rejectPublish}
            handleConfirm={confirmPublish}
        />
        <PreConfirmDecreaseScoreDialog
            open={confirmDecreaseDialog?.id >= 0}
            text={confirmDecreaseDialog?.text}
            isExtend={confirmDecreaseDialog?.isExtend}
            handleReject={rejectDecrease}
            handleConfirm={confirmDecrease}
        />
        <NoScoreDialog
            open={noScoreDialog}
            handleReject={() => setNoScoreDialog(false)}
        />
        <PreActivationDialog
            open={activeDialog >= 0}
            handleReject={rejectActive}
            handleConfirm={confirmActive}
        />
        <PreInactivationDialog
            open={inactiveDialog >= 0}
            handleReject={rejectInactive}
            handleConfirm={confirmInactive}
        />
        <PreDeleteDialog
            open={deleteDialog >= 0}
            handleReject={rejectDelete}
            handleConfirm={confirmDelete}
        />
        <ExtensionDialog
            open={extensionDialog >= 0}
            handleReject={rejectExtension}
            handleConfirm={confirmExtension}
        />
        <RemoveLimitDialog
            open={removeLimitDialog >= 0}
            handleReject={rejectRemoveLimit}
            handleConfirm={confirmRemoveLimit}
        />
    </>

}




export const MainItem = ({ data, set, remove, isActive, active, isPublish, publish, extension, disabled, children, preview, otherTools }) => {

    const history = useHistory()
    const location = useLocation()

    const _result = () => {
        const sid = location.pathname.split("/")[2]
        history.push(`/softwares/${sid}/result`)
    }

    const _disabled = disabled || !isActive || isPublish


    let fixItems = [
        <Grid item md={4} sm={6} xs={12} >
            <TextField
                size="small"
                label="Max"
                type="number"
                fullWidth
                value={data.max}
                onChange={(e) => set('max', e.target.value, false)}
                onBlur={(e) => set('max', e.target.value, true)}
                disabled={_disabled}
            />
        </Grid>
    ]

    if (isPublish) {
        const deadline = moment(data.deadline)
        const isExpired = deadline.diff(moment()) < 0
        fixItems.push(<Grid item container md={4} sm={6} xs={12} alignItems="center">
            <Tooltip title={isExpired ? "Expired" : "Deadline: " + deadline.fromNow()}>
                <Button
                    variant="contained"
                    color={isExpired ? "error" : "success"}
                    startIcon={<EventIcon />}
                    children={deadline.format("YYYY-MM-DD")}
                    disabled={disabled || !isActive}
                    sx={{ width: '100%' }}
                    onClick={extension}
                />
            </Tooltip>
        </Grid>)
    }
    fixItems.push(
        <Grid item container md={isPublish ? 4 : 8} sm={isPublish ? 12 : 6} xs={12} justifyContent="flex-end" alignItems="center">
            <Tooltip title="After publish you can't remove or edit evaluation, Just can inactive">
                <Chip size="small" color={isPublish ? "success" : "info"} label={isPublish ? "publish" : "draft"} disabled={disabled || !isActive} sx={{ mr: 1, ml: 1 }} />
            </Tooltip>
            {otherTools}

            {isPublish && <Tooltip title={isActive ? "Inactivation" : "Activation"}>
                <Switch checked={isActive} onChange={(e) => active(e.target.checked)} disabled={disabled} />
            </Tooltip>
            }
            {!isPublish &&
                <Tooltip title={"Publish"}>
                    <IconButton color='info' onClick={publish} disabled={disabled || !isActive}>
                        <PlayArrowIcon />
                    </IconButton>
                </Tooltip>
            }

            {!isPublish && <Tooltip title={"Delete"}>
                <IconButton color='error' onClick={remove} disabled={disabled}>
                    <DeleteOutlineIcon />
                </IconButton>
            </Tooltip>}

            {isPublish && <Tooltip title={"Result"}>
                <IconButton color='warning' onClick={_result} disabled={disabled}>
                    <PieChartIcon />
                </IconButton>
            </Tooltip>
            }
        </Grid>
    )

    return <>
        <Grid container item spacing={2} >
            {children}
            {fixItems}
        </Grid >

        {preview}

        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>
    </>
}