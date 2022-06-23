/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */



import * as React from 'react';
import { useParams } from "react-router-dom";

import { useSnackbar } from 'notistack';
import { AccordionSummary, Dialog, DialogTitle, DialogActions, Button, DialogContentText, DialogContent, Typography, Grid, FormControl, InputLabel, Select, MenuItem, ListSubheader, TextField, Switch, Divider, IconButton, Accordion, AccordionDetails, } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import {
    ExpandMore as ExpandMoreIcon,
    DeleteOutline as DeleteOutlineIcon,

} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import * as api from "../../../api";




export default function EvaluationsForm({
    isNew, softID, area,
    metricForm, setMetricForm,
    commentForm, setCommentForm,
    ratingForm, setRatingForm,
    compareForm, setCompareForm,
    questionnaireForm, setQuestionnaireForm,
}) {

    const { enqueueSnackbar } = useSnackbar()
    const params = useParams()

    const [panelExpanded, setPanelExpanded] = React.useState(null);
    const handlePanelExpanded = (panel) => (event, isExpanded) => {
        setPanelExpanded(isExpanded ? panel : null);
    }

    React.useEffect(() => {
        sectionsListStatus.current = 'doReceive'
        setPanelExpanded(null)
    }, [params])




    // metric list
    const [metricsList, setMetricsList] = React.useState([])
    const metricsListStatus = React.useRef('first')
    const getMetricsList = async () => {
        try {
            const response = await api.getMetricsList()
            let metList = []
            let metCategories = []
            response.data.map((_) => {
                if (!metCategories.includes(_.category.id)) {
                    metCategories.push(_.category.id)
                    metList.push({ is_cat: true, title: _.category.name })
                }
                metList.push({ title: _.title, value: _.id })
            })
            setMetricsList(metList)
            metricsListStatus.current = 'received'
        } catch (error) {
            enqueueSnackbar("[getMetricsList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }

    // sections list
    const [sectionsList, setSectionsList] = React.useState([])
    const sectionsListStatus = React.useRef('first')
    const [addSectionDialogOpen, setAddSectionDialogOpen] = React.useState(false)
    const getSectionsList = async () => {
        if (isNew) {
            setSectionsList([])
            return
        }
        try {
            const response = await api.getSoftwareSectionsList(`software=${softID}`)
            setSectionsList(response.data)
            sectionsListStatus.current = 'received'
        } catch (error) {
            enqueueSnackbar("[getSoftwareSectionsList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }
    const addSoftwareSection = async (title) => {
        try {
            const responseCheck = await api.getSoftwareSectionsList(`software=${softID}&title=${title}`)
            if (responseCheck.data.length) {
                enqueueSnackbar("You have already added this section", { variant: 'error' })
                return
            }
            const data = { title, software: softID }
            const response = await api.newSoftwareSection(data)
            setSectionsList([...sectionsList, response.data])
            setAddSectionDialogOpen(false)
        } catch (error) {
            enqueueSnackbar("[newSoftwareSection]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }

    // targetSoftsList
    const [targetSoftsList, setTargetSoftsList] = React.useState([])
    const targetSoftsListStatus = React.useRef('first')
    const getTargetSoftsList = async () => {
        try {
            const response = await api.getSoftwaresList(`area=${area}`)
            setTargetSoftsList(response.data.filter((_) => _.id !== softID).map((_) => { return { title: _.software_name, value: _.id } }))
            targetSoftsListStatus.current = 'received'
        } catch (error) {
            enqueueSnackbar("[getTargetSoft]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }


    // questionnaireList
    const [questionnaireList, setQuestionnaireList] = React.useState([])
    const questionnaireListStatus = React.useRef('first')
    const getQuestionnaireList = async () => {
        try {
            const response = await api.getQuestionnaireList()
            let metList = []
            let metCategories = []
            response.data.map((_) => {
                if (!metCategories.includes(_.category.id)) {
                    metCategories.push(_.category.id)
                    metList.push({ is_cat: true, title: _.category.name })
                }
                metList.push({ title: _.title, value: _.id })
            })
            setQuestionnaireList(metList)
            questionnaireListStatus.current = 'received'
        } catch (error) {
            enqueueSnackbar("[getMetricsList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }


    React.useEffect(() => {
        if (metricsListStatus.current === 'first')
            metricsListStatus.current = 'doReceive'
        else if (metricsListStatus.current === 'doReceive')
            if (['metric', 'compare'].includes(panelExpanded)) {
                getMetricsList()
            }

        if (sectionsListStatus.current === 'first')
            sectionsListStatus.current = 'doReceive'
        else if (sectionsListStatus.current === 'doReceive')
            if (['comment', 'rating'].includes(panelExpanded)) {
                getSectionsList()
            }

        if (targetSoftsListStatus.current === 'first')
            targetSoftsListStatus.current = 'doReceive'
        else if (targetSoftsListStatus.current === 'doReceive')
            if (['compare'].includes(panelExpanded)) {
                getTargetSoftsList()
            }


        if (questionnaireListStatus.current === 'first')
            questionnaireListStatus.current = 'doReceive'
        else if (questionnaireListStatus.current === 'doReceive')
            if (['questionnaire'].includes(panelExpanded)) {
                getQuestionnaireList()
            }
    }, [panelExpanded])







    const fdata = {
        isNew, softID,
        panelExpanded, handlePanelExpanded,
    }
    return [
        <MetricForm
            {...fdata}
            data={metricForm}
            set={setMetricForm}
            metricsList={metricsList}
        />,
        <CommentForm
            {...fdata}
            data={commentForm}
            set={setCommentForm}
            sectionsList={sectionsList}
            addSectionDialog={() => setAddSectionDialogOpen(true)}
        />,
        <RatingForm
            {...fdata}
            data={ratingForm}
            set={setRatingForm}
            sectionsList={sectionsList}
            addSectionDialog={() => setAddSectionDialogOpen(true)}
        />,
        <CompareForm
            {...fdata}
            data={compareForm}
            set={setCompareForm}
            metricsList={metricsList}
            tSoftsList={targetSoftsList}
        />,
        <QuestionnaireForm
            {...fdata}
            data={questionnaireForm}
            set={setQuestionnaireForm}
            questionnaireList={questionnaireList}
        />,
        <AddSectionDialog
            open={addSectionDialogOpen}
            closeDialog={() => setAddSectionDialogOpen(false)}
            addSection={addSoftwareSection}
        />
    ]



}














// *************


const MetricItem = ({ metricsList, data, remove, set, disabled }) => {

    const [removeLoading, setRemoveLoading] = React.useState(false)
    const _remove = async () => {
        setRemoveLoading(true)
        await remove()
        setRemoveLoading(false)
    }


    return <>
        <Grid container item spacing={2}>
            <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Metric</InputLabel>
                    <Select
                        label="Metric"
                        value={metricsList.length === 0 ? "none" : data.metric}
                        onChange={(e) => set('metric', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}
                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {metricsList.map(({ is_cat, value, title }) => {
                            if (is_cat) return <ListSubheader color="primary">{title}</ListSubheader>
                            return <MenuItem value={value}>{title}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
                <TextField
                    size="small"
                    label="Max"
                    type="number"
                    fullWidth
                    value={data.max}
                    onChange={(e) => set('max', e.target.value)}
                    disabled={disabled || !data.is_active || removeLoading}
                />
            </Grid>
            <Grid item container sm={3} xs={12} justifyContent="center" alignItems="center">
                <Switch checked={data.is_active} onChange={(e) => set('is_active', e.target.checked)} disabled={disabled || removeLoading} />
                <IconButton color={'error'} onClick={_remove} disabled={disabled || removeLoading}>
                    {removeLoading ? <MoreHorizOutlinedIcon /> : <DeleteOutlineIcon />}
                </IconButton>
            </Grid>

        </Grid >
        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>

    </>
}


const MetricForm = ({ isNew, softID, data, set, metricsList, panelExpanded, handlePanelExpanded }) => {

    const { enqueueSnackbar } = useSnackbar()
    const params = useParams()

    const isExpanded = panelExpanded === 'metric'
    const toggleExpand = handlePanelExpanded('metric')


    const addItem = () => {
        set([...data, { metric: "none", max: 100, is_active: true }])
    }
    const removeItem = (index) => async () => {
        if (data[index].id) {
            try {
                await api.deleteMetricEvaluate(data[index].id)
                set(data.filter((_, i) => i !== index))
            } catch (error) {
                enqueueSnackbar("[deleteMetricEvaluate]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        } else {
            set(data.filter((_, i) => i !== index))
        }
    }
    const changeItem = (index) => (key, val) => {
        let items = [...data];
        items[index] = { ...items[index], [key]: val };
        set(items);
    }
    const getList = async () => {
        if (isNew) {
            set([])
            return
        }
        try {
            const response = await api.getMetricEvaluateList(`software=${softID}`)
            set(response.data)
        } catch (error) {
            enqueueSnackbar("[getMetricEvaluateList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }
    React.useEffect(() => getList(), [params])

    return <>
        <Accordion expanded={isExpanded} onChange={toggleExpand}>
            <EvaluationTitle title="Metric" />
            <AccordionDetails>
                <Grid container direction="column" spacing={2}>
                    {data.map((data, i) => {
                        return <MetricItem
                            key={i}

                            data={data}
                            remove={removeItem(i)}
                            set={changeItem(i)}

                            metricsList={metricsList}
                        />
                    })}
                    <Adder newHandler={addItem} />
                </Grid>
            </AccordionDetails>
        </Accordion>
    </>

}


// ***********


const CommentItem = ({ sectionsList, data, remove, set, disabled, addSectionDialog }) => {

    const [removeLoading, setRemoveLoading] = React.useState(false)
    const _remove = async () => {
        setRemoveLoading(true)
        await remove()
        setRemoveLoading(false)
    }


    return <>
        <Grid container item spacing={2}>
            <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Sections
                        <Button
                            variant="contained" color="info" size="small"
                            sx={{ padding: 0, minWidth: "18px", marginLeft: "6px" }}
                            onClick={addSectionDialog}
                        >
                            <AddIcon />
                        </Button>
                    </InputLabel>
                    <Select
                        label="Sections List"
                        value={sectionsList.length === 0 ? "none" : data.section}
                        onChange={(e) => set('section', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}

                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {sectionsList.map(({ id: value, title }) => {
                            return <MenuItem value={value}>{title}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
                <TextField
                    size="small"
                    label="Max"
                    type="number"
                    fullWidth
                    value={data.max}
                    onChange={(e) => set('max', e.target.value)}
                    disabled={disabled || !data.is_active || removeLoading}
                />
            </Grid>
            <Grid item container sm={3} xs={12} justifyContent="center" alignItems="center">
                <Switch checked={data.is_active} onChange={(e) => set('is_active', e.target.checked)} disabled={disabled || removeLoading} />
                <IconButton color={'error'} onClick={_remove} disabled={disabled || removeLoading}>
                    {removeLoading ? <MoreHorizOutlinedIcon /> : <DeleteOutlineIcon />}
                </IconButton>
            </Grid>

        </Grid >
        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>

    </>
}



const CommentForm = ({ isNew, softID, data, set, sectionsList, panelExpanded, handlePanelExpanded, addSectionDialog }) => {

    const { enqueueSnackbar } = useSnackbar()
    const params = useParams()

    const isExpanded = panelExpanded === 'comment'
    const toggleExpand = handlePanelExpanded('comment')


    const addItem = () => {
        set([...data, { section: "none", max: 100, is_active: true }])
    }
    const removeItem = (index) => async () => {
        if (data[index].id) {
            try {
                await api.deleteCommentEvaluate(data[index].id)
                set(data.filter((_, i) => i !== index))
            } catch (error) {
                enqueueSnackbar("[deleteCommentEvaluate]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        } else {
            set(data.filter((_, i) => i !== index))
        }
    }
    const changeItem = (index) => (key, val) => {
        let items = [...data];
        items[index] = { ...items[index], [key]: val };
        set(items);
    }
    const getList = async () => {
        if (isNew) {
            set([])
            return
        }
        try {
            const response = await api.getCommentEvaluateList(`software=${softID}`)
            set(response.data)
        } catch (error) {
            enqueueSnackbar("[getCommentEvaluateList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }
    React.useEffect(() => getList(), [params])

    return <>
        <Accordion expanded={isExpanded} onChange={toggleExpand}>
            <EvaluationTitle title="Comment" />
            <AccordionDetails>
                <Grid container direction="column" spacing={2}>
                    {data.map((data, i) => {
                        return <CommentItem
                            key={i}

                            data={data}
                            remove={removeItem(i)}
                            set={changeItem(i)}

                            sectionsList={sectionsList}
                            addSectionDialog={addSectionDialog}
                        />
                    })}
                    <Adder newHandler={addItem} />
                </Grid>
            </AccordionDetails>
        </Accordion>
    </>

}



// ***********




const RatingItem = ({ sectionsList, data, remove, set, disabled, addSectionDialog }) => {

    const [removeLoading, setRemoveLoading] = React.useState(false)
    const _remove = async () => {
        setRemoveLoading(true)
        await remove()
        setRemoveLoading(false)
    }


    return <>
        <Grid container item spacing={2}>
            <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Sections
                        <Button
                            variant="contained" color="info" size="small"
                            sx={{ padding: 0, minWidth: "18px", marginLeft: "6px" }}
                            onClick={addSectionDialog}
                        >
                            <AddIcon />
                        </Button>
                    </InputLabel>
                    <Select
                        label="Sections List"
                        value={sectionsList.length === 0 ? "none" : data.section}
                        onChange={(e) => set('section', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}
                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {sectionsList.map(({ id: value, title }) => {
                            return <MenuItem value={value}>{title}</MenuItem>
                        })}

                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
                <TextField
                    size="small"
                    label="Max"
                    type="number"
                    fullWidth
                    value={data.max}
                    onChange={(e) => set('max', e.target.value)}
                    disabled={disabled || !data.is_active || removeLoading}
                />
            </Grid>
            <Grid item container sm={3} xs={12} justifyContent="center" alignItems="center">
                <Switch checked={data.is_active} onChange={(e) => set('is_active', e.target.checked)} disabled={disabled || removeLoading} />
                <IconButton color={'error'} onClick={_remove} disabled={disabled || removeLoading}>
                    {removeLoading ? <MoreHorizOutlinedIcon /> : <DeleteOutlineIcon />}
                </IconButton>
            </Grid>

        </Grid >
        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>

    </>
}



const RatingForm = ({ isNew, softID, data, set, sectionsList, panelExpanded, handlePanelExpanded, addSectionDialog }) => {

    const { enqueueSnackbar } = useSnackbar()
    const params = useParams()

    const isExpanded = panelExpanded === 'rating'
    const toggleExpand = handlePanelExpanded('rating')


    const addItem = () => {
        set([...data, { section: "none", max: 100, is_active: true }])
    }
    const removeItem = (index) => async () => {
        if (data[index].id) {
            try {
                await api.deleteRatingEvaluate(data[index].id)
                set(data.filter((_, i) => i !== index))
            } catch (error) {
                enqueueSnackbar("[deleteRatingEvaluate]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        } else {
            set(data.filter((_, i) => i !== index))
        }
    }
    const changeItem = (index) => (key, val) => {
        let items = [...data];
        items[index] = { ...items[index], [key]: val };
        set(items);
    }
    const getList = async () => {
        if (isNew) {
            set([])
            return
        }
        try {
            const response = await api.getRatingEvaluateList(`software=${softID}`)
            set(response.data)
        } catch (error) {
            enqueueSnackbar("[getRatingEvaluateList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }
    React.useEffect(() => getList(), [params])

    return <>
        <Accordion expanded={isExpanded} onChange={toggleExpand}>
            <EvaluationTitle title="Rating" />
            <AccordionDetails>
                <Grid container direction="column" spacing={2}>
                    {data.map((data, i) => {
                        return <RatingItem
                            key={i}

                            data={data}
                            remove={removeItem(i)}
                            set={changeItem(i)}

                            sectionsList={sectionsList}
                            addSectionDialog={addSectionDialog}
                        />
                    })}
                    <Adder newHandler={addItem} />
                </Grid>
            </AccordionDetails>
        </Accordion>
    </>

}



// ***********




const CompareItem = ({ tSoftsList, metricsList, data, remove, set, disabled }) => {

    const [removeLoading, setRemoveLoading] = React.useState(false)
    const _remove = async () => {
        setRemoveLoading(true)
        await remove()
        setRemoveLoading(false)
    }


    return <>
        <Grid container item spacing={2}>
            <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Target Software</InputLabel>
                    <Select
                        label="Target Software"
                        value={tSoftsList.length === 0 ? "none" : data.target_software}
                        onChange={(e) => set('target_software', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}
                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {tSoftsList.map(({ value, title }) => {
                            return <MenuItem value={value}>{title}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Metric</InputLabel>
                    <Select
                        label="Metric"
                        value={metricsList.length === 0 ? "none" : data.metric}
                        onChange={(e) => set('metric', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}
                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {metricsList.map(({ is_cat, value, title }) => {
                            if (is_cat) return <ListSubheader color="primary">{title}</ListSubheader>
                            return <MenuItem value={value}>{title}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
                <TextField
                    size="small"
                    label="Max"
                    type="number"
                    fullWidth
                    value={data.max}
                    onChange={(e) => set('max', e.target.value)}
                    disabled={disabled || !data.is_active || removeLoading}
                />
            </Grid>
            <Grid item container sm={3} xs={12} justifyContent="center" alignItems="center">
                <Switch checked={data.is_active} onChange={(e) => set('is_active', e.target.checked)} disabled={disabled || removeLoading} />
                <IconButton color={'error'} onClick={_remove} disabled={disabled || removeLoading}>
                    {removeLoading ? <MoreHorizOutlinedIcon /> : <DeleteOutlineIcon />}
                </IconButton>
            </Grid>

        </Grid >
        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>

    </>
}



const CompareForm = ({ isNew, softID, data, set, tSoftsList, metricsList, panelExpanded, handlePanelExpanded }) => {

    const { enqueueSnackbar } = useSnackbar()
    const params = useParams()

    const isExpanded = panelExpanded === 'compare'
    const toggleExpand = handlePanelExpanded('compare')


    const addItem = () => {
        set([...data, { target_software: "none", metric: "none", max: 100, is_active: true }])
    }
    const removeItem = (index) => async () => {
        if (data[index].id) {
            try {
                await api.deleteCompareEvaluate(data[index].id)
                set(data.filter((_, i) => i !== index))
            } catch (error) {
                enqueueSnackbar("[deleteCompareEvaluate]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        } else {
            set(data.filter((_, i) => i !== index))
        }
    }
    const changeItem = (index) => (key, val) => {
        let items = [...data];
        items[index] = { ...items[index], [key]: val };
        set(items);
    }
    const getList = async () => {
        if (isNew) {
            set([])
            return
        }
        try {
            const response = await api.getCompareEvaluateList(`software=${softID}`)
            set(response.data)
        } catch (error) {
            enqueueSnackbar("[getCompareEvaluateList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }
    React.useEffect(() => getList(), [params])

    return <>
        <Accordion expanded={isExpanded} onChange={toggleExpand}>
            <EvaluationTitle title="Compare" />
            <AccordionDetails>
                <Grid container direction="column" spacing={2}>
                    {data.map((data, i) => {
                        return <CompareItem
                            key={i}

                            data={data}
                            remove={removeItem(i)}
                            set={changeItem(i)}

                            tSoftsList={tSoftsList}
                            metricsList={metricsList}

                        />
                    })}
                    <Adder newHandler={addItem} />
                </Grid>
            </AccordionDetails>
        </Accordion>
    </>

}



// ***********




const QuestionnaireItem = ({ questionnaireList, data, remove, set, disabled }) => {

    const [removeLoading, setRemoveLoading] = React.useState(false)
    const _remove = async () => {
        setRemoveLoading(true)
        await remove()
        setRemoveLoading(false)
    }


    return <>
        <Grid container item spacing={2}>
            <Grid item sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Questionnaire</InputLabel>
                    <Select
                        label="Questionnaire"
                        value={questionnaireList.length === 0 ? "none" : data.questionnaire}
                        onChange={(e) => set('questionnaire', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}
                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {questionnaireList.map(({ is_cat, value, title }) => {
                            if (is_cat) return <ListSubheader color="primary">{title}</ListSubheader>
                            return <MenuItem value={value}>{title}</MenuItem>
                        })}

                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
                <TextField
                    size="small"
                    label="Max"
                    type="number"
                    fullWidth
                    value={data.max}
                    onChange={(e) => set('max', e.target.value)}
                    disabled={disabled || !data.is_active || removeLoading}
                />
            </Grid>
            <Grid item container sm={3} xs={12} justifyContent="center" alignItems="center">
                <Switch checked={data.is_active} onChange={(e) => set('is_active', e.target.checked)} disabled={disabled || removeLoading} />
                <IconButton color={'error'} onClick={_remove} disabled={disabled || removeLoading}>
                    {removeLoading ? <MoreHorizOutlinedIcon /> : <DeleteOutlineIcon />}
                </IconButton>
            </Grid>

        </Grid >
        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>

    </>
}



const QuestionnaireForm = ({ isNew, softID, data, set, questionnaireList, panelExpanded, handlePanelExpanded }) => {

    const { enqueueSnackbar } = useSnackbar()
    const params = useParams()

    const isExpanded = panelExpanded === 'questionnaire'
    const toggleExpand = handlePanelExpanded('questionnaire')


    const addItem = () => {
        set([...data, { questionnaire: "none", max: 100, is_active: true }])
    }
    const removeItem = (index) => async () => {
        if (data[index].id) {
            try {
                await api.deleteQuestionnaireEvaluate(data[index].id)
                set(data.filter((_, i) => i !== index))
            } catch (error) {
                enqueueSnackbar("[deleteQuestionnaireEvaluate]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        } else {
            set(data.filter((_, i) => i !== index))
        }
    }
    const changeItem = (index) => (key, val) => {
        let items = [...data];
        items[index] = { ...items[index], [key]: val };
        set(items);
    }
    const getList = async () => {
        if (isNew) {
            set([])
            return
        }
        try {
            const response = await api.getQuestionnaireEvaluateList(`software=${softID}`)
            set(response.data)
        } catch (error) {
            enqueueSnackbar("[getQuestionnaireEvaluateList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }
    React.useEffect(() => getList(), [params])

    return <>
        <Accordion expanded={isExpanded} onChange={toggleExpand}>
            <EvaluationTitle title="Questionnaire" />
            <AccordionDetails>
                <Grid container direction="column" spacing={2}>
                    {data.map((data, i) => {
                        return <QuestionnaireItem
                            key={i}

                            data={data}
                            remove={removeItem(i)}
                            set={changeItem(i)}

                            questionnaireList={questionnaireList}
                        />
                    })}
                    <Adder newHandler={addItem} />
                </Grid>
            </AccordionDetails>
        </Accordion>
    </>

}



// **********


const EvaluationTitle = ({ title, count }) => {
    return <>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid container direction="column">
                <Grid item><Typography children={title} variant="button" /></Grid>
            </Grid>
        </AccordionSummary>
    </>
}



const Adder = ({ newHandler }) => {
    return <>
        <Grid container item >
            <Grid item xs={12}>
                <LoadingButton onClick={newHandler} loading={false} fullWidth>
                    Add New
                </LoadingButton>
            </Grid>
        </Grid>
    </>
}


const AddSectionDialog = ({ open, closeDialog, addSection }) => {

    const [title, setTitle] = React.useState('')
    React.useEffect(() => {
        setTitle('')
    }, [open])

    return <Dialog
        open={open}
        onClose={closeDialog}
    >
        <DialogTitle >Add Section</DialogTitle>
        <DialogContent>
            <DialogContentText >
                Type the title of section:
            </DialogContentText>
            <TextField
                label="Title"
                type="text"
                fullWidth
                value={title}
                onChange={(e) => { setTitle(e.target.value) }}
                sx={{ marginTop: 1, minWidth: 300 }}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog} color="inherit">Cancel</Button>
            <Button onClick={() => addSection(title)} color="info" autoFocus>Add</Button>
        </DialogActions>
    </Dialog>
}