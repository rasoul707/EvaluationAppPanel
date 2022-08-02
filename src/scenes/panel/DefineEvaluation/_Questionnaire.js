/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress, Collapse, List, ListSubheader, Checkbox, ListItemText, ListItem, IconButton } from '@mui/material';
import { MainForm, MainItem } from "./_Tools"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';




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
        <IconButton color='secondary' onClick={_preview} disabled={disabled}>
            {previewVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
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
                            {variables?.questionsList && variables?.questionsList[parmID]?.map(({ id, question }, index) => (
                                <ListItem key={`item-${id}`}>
                                    <ListItemText primary={`${index + 1}) ${question}`} />
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
    return <MainForm {...props} path="questionnaire" Item={Item} />
}



export default Form