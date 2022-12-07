/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { FormGroup, InputAdornment, OutlinedInput, Chip, Grid, FormControl, Divider, InputLabel, TextField, Select, Typography, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress, Collapse, List, ListSubheader, Checkbox, ListItemText, ListItem, IconButton, Button, Tooltip } from '@mui/material';
import { MainForm, MainItem } from "./_Tools"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import { useSnackbar } from 'notistack';

import * as API from "../../../api";

const filter = createFilterOptions();

const Item = (props) => {

    const { data, set, disabled, variables, isActive, isPublish } = props
    const _disabled = disabled || !isActive || isPublish

    const paramLength = variables?.questionnairesParametersList[data.category]?.length

    const children = [
        <Grid item md={6} sm={6} xs={12}>
            <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                    label="Category"
                    value={variables?.questionnairesCategoriesList.length === 0 ? "none" : data.category}
                    onChange={(e) => set('category', e.target.value)}
                    disabled={_disabled}
                >
                    <MenuItem value="none" disabled><em>None</em></MenuItem>
                    {variables?.questionnairesCategoriesList.map(({ id, name }) => {
                        return <MenuItem value={id}>{name}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </Grid>
        ,
        <Grid item md={6} sm={6} xs={12}>
            <FormControl fullWidth size="small">
                <InputLabel>Parameters</InputLabel>
                <Select
                    label="Parameters"
                    value={variables?.questionnairesParametersList[data.category]?.length === 0 ? ["none"] : data.parameters}
                    onChange={(e) => set('parameters', e.target.value)}
                    disabled={_disabled}
                    multiple
                >
                    <MenuItem value="none" disabled><em>None</em></MenuItem>
                    {variables?.questionnairesParametersList[data.category]?.length && <MenuItem value="all" divider autoFocused >
                        <Checkbox checked={paramLength > 0 && paramLength === data.parameters.length} sx={{ p: .5, pr: 1 }} />
                        <b>Select all</b>
                    </MenuItem>}
                    {variables?.questionnairesParametersList[data.category]?.map(({ id, title }) => {
                        return <MenuItem value={id}>{title}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </Grid>
    ]



    /****** */
    const [previewVisible, setPreviewVisible] = React.useState(false)

    React.useEffect(() => {
        if (previewVisible) {
            variables?.getQuestions(data.parameters)
        }
    }, [previewVisible, data.parameters])

    const _preview = () => {
        setPreviewVisible(!previewVisible)
    }

    const otherTools = <>
        <Tooltip title={"Review questions"}>
            <IconButton color='secondary' onClick={_preview} disabled={disabled}>
                {previewVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
        </Tooltip>
    </>


    const getParameterObj = (pid) => {
        return variables?.questionnairesParametersList[data.category]?.filter(({ id }) => id === pid)[0]
    }
    const previewItems = <>
        <Collapse in={previewVisible} timeout="auto" unmountOnExit sx={{ pl: 2, }}>
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300,
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
            >
                {data.parameters.map((parmID) => (
                    <li key={`param-${parmID}`}>
                        <ul>
                            <Grid alignItems="center" container>
                                <ListSubheader>
                                    {`${getParameterObj(parmID)?.title}`}
                                </ListSubheader>
                                {variables?.questionsList && variables?.questionsList[parmID] ? null : <CircularProgress size={20} />}
                            </Grid>
                            {variables?.questionsList && variables?.questionsList[parmID]?.map(({ id, question, options, custom_options }, index) => (
                                <ListItem key={`item-${id}`}>
                                    <ListItemText
                                        primary={`${index + 1}) ${question}`}
                                        secondary={custom_options ? options : "Useless|Poor|Ok|Good|Excellent"}
                                    />
                                </ListItem>
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </Collapse>
    </>
    /****** */

    return <MainItem {...props} children={children} preview={previewItems} otherTools={otherTools} />
}


const Form = (props) => {
    return <>
        <MainForm {...props} path="questionnaire" Item={Item} />
        <CustomQuestionnaireButton
            categories={props.variables?.questionnairesCategoriesList}
            parameters={props.variables?.questionnairesParametersList}

        />
    </>
}



export default Form









export const CustomQuestionnaireButton = ({ categories, parameters }) => {

    const { enqueueSnackbar } = useSnackbar()


    const [selectedCategory, setSelectedCategory] = React.useState(null)
    const [selectedParameter, setSelectedParameter] = React.useState(null)
    const [questionsList, setQuestionsList] = React.useState([])


    const [showModal, setShowModal] = React.useState(false)

    const handleConfirm = async () => {
        const data = {
            category: selectedCategory,
            parameter: selectedParameter,
            questions: questionsList
        }
        try {
            await API.POST()(`questionnaire/question/`, data)
            enqueueSnackbar('Your request sent. It will be published after approval by the admin', { variant: "success" })
            // setShowModal(false)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            // setShowModal(false)
        }

    }

    const handleReject = () => {
        setShowModal(false)
    }

    const openModal = () => {
        setShowModal(true)
        setSelectedCategory(null)
        setSelectedParameter(null)
        setQuestionsList([])
    }


    const changeQuestion = (index, key, value) => {
        let m = [...questionsList]
        m[index] = { ...m[index], [key]: value }
        setQuestionsList(m)
    }




    return <>
        <Grid container item >
            <Grid item xs={12}>
                <Button onClick={openModal} variant='contained' fullWidth sx={{ mt: 1 }} color='warning'>
                    Define my own
                </Button>
            </Grid>
        </Grid>
        <Dialog
            open={showModal}
            // TransitionComponent={Transition}
            keepMounted
            onClose={handleReject}
        >
            <DialogTitle>Define custom questionnaire</DialogTitle>
            <DialogContent>
                <Grid container rowSpacing={2}>
                    <Grid item xs="12">
                        <Typography>
                            First, type or select category and parameter:
                        </Typography>
                    </Grid>
                    <Grid item xs="12">
                        <Autocomplete
                            value={selectedCategory}
                            onChange={(event, newValue) => {
                                // by enter
                                if (typeof newValue === 'string') {
                                    setSelectedCategory({ id: null, name: newValue })
                                }
                                // by click
                                else if (newValue && newValue.isNew) {
                                    setSelectedCategory({ id: null, name: newValue.value })
                                }
                                // regular
                                else {
                                    setSelectedCategory(newValue)
                                }
                            }}
                            size="small"
                            options={categories}
                            getOptionLabel={(option) => {
                                if (option.isNew) {
                                    return `Add "${option.value}"`;
                                }
                                return option.name;
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label="Category" placeholder="Select or type" />
                            )}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const { inputValue } = params;
                                const isExisting = options.some((option) => inputValue === option.name);
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        isNew: true,
                                        value: inputValue,
                                    });
                                }
                                return filtered;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            disableClearable
                            freeSolo
                        />
                    </Grid>
                    {selectedCategory &&
                        <Grid item xs="12">
                            <Autocomplete
                                value={selectedParameter}
                                onChange={(event, newValue) => {
                                    // by enter
                                    if (typeof newValue === 'string') {
                                        setSelectedParameter({ id: null, title: newValue })
                                    }
                                    // by click
                                    else if (newValue && newValue.isNew) {
                                        setSelectedParameter({ id: null, title: newValue.value })
                                    }
                                    // regular
                                    else {
                                        setSelectedParameter(newValue)
                                    }
                                }}
                                size="small"
                                options={parameters[selectedCategory?.id] || []}
                                getOptionLabel={(option) => {
                                    if (option.isNew) {
                                        return `Add "${option.value}"`;
                                    }
                                    return option.title;
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Parameter" placeholder="Select or type" />
                                )}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);
                                    const { inputValue } = params;
                                    const isExisting = options.some((option) => inputValue === option.name);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push({
                                            isNew: true,
                                            value: inputValue,
                                        });
                                    }
                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                disableClearable
                                freeSolo
                            />
                        </Grid>
                    }
                    {selectedCategory && selectedParameter &&
                        <>
                            <Grid item xs={12}>
                                <Button
                                    onClick={() => {
                                        let m = [...questionsList]
                                        m.push({
                                            question: "",
                                            options: "Useless|Poor|Ok|Good|Excellent",
                                            custom_options: false
                                        })
                                        setQuestionsList(m)
                                    }}
                                    variant='outlined'
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    color='info'
                                >
                                    Add question
                                </Button>
                            </Grid>
                            <Grid item xs="12">
                                <Divider />
                            </Grid>
                            {questionsList.map(({ question, options, custom_options }, index) => {
                                return <>
                                    <Grid item xs="12">
                                        <FormGroup>
                                            <Chip
                                                label={"Question " + (index + 1)}
                                                onDelete={() => {
                                                    questionsList.splice(index, 1)
                                                    setQuestionsList([...questionsList])
                                                }}
                                            />
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs="12">
                                        <FormControl sx={{ width: "100%" }} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">Question</InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type='text'
                                                value={question}
                                                onChange={(e) => changeQuestion(index, 'question', e.target.value)}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <Tooltip title={"Custom options"}>
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={() => changeQuestion(index, 'custom_options', !custom_options)}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                edge="end"
                                                            >
                                                                {custom_options ? <DashboardCustomizeIcon /> : <DashboardCustomizeOutlinedIcon />}
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                }
                                                label="Question"
                                            />
                                        </FormControl>
                                    </Grid>
                                    {custom_options &&
                                        <Grid item xs="12">
                                            <TextField
                                                size="small"
                                                label="Options"
                                                type="text"
                                                fullWidth
                                                value={options}
                                                onChange={(e) => changeQuestion(index, 'options', e.target.value)}
                                            />
                                        </Grid>
                                    }
                                </>
                            })}
                        </>
                    }


                </Grid>






            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} >Submit</Button>
                <Button onClick={handleReject} color="error">Cancel</Button>
            </DialogActions>
        </Dialog>
    </>
}