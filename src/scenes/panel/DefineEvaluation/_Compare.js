
import * as React from 'react';



import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, Autocomplete } from '@mui/material';



import { MainForm, MainItem } from "./_Tools"




const Item = (props) => {

    const { data, set, disabled, variables, isActive, isPublish } = props
    const _disabled = disabled || !isActive || isPublish

    const paramLength = variables?.metricsParametersList[data.category]?.length

    const nn = variables?.targetSoftwareList.map(({ id }) => id)
    const tt = nn.indexOf(data.target_software)

    const children = [
        <Grid item md={6} sm={6} xs={12}>
            <Autocomplete
                value={variables?.targetSoftwareList[tt]}
                onChange={(event, newValue) => {
                    set('target_software', newValue.id)
                }}
                size="small"
                options={variables?.targetSoftwareList}
                getOptionLabel={(option) => {
                    return option.name;
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Target Software" placeholder="Target Software" />
                )}
                disabled={_disabled}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                disableClearable
            />
        </Grid>
        ,
        <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                    label="Category"
                    value={variables?.metricsCategoriesList.length === 0 ? "none" : data.category}
                    onChange={(e) => set('category', e.target.value)}
                    disabled={_disabled}
                >
                    <MenuItem value="none" disabled><em>None</em></MenuItem>
                    {variables?.metricsCategoriesList.map(({ id, name }) => {
                        return <MenuItem value={id}>{name}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </Grid>
        ,
        <Grid item md={3} sm={6} xs={12}>
            <FormControl fullWidth size="small">
                <InputLabel>Parameters</InputLabel>
                <Select
                    label="Parameters"
                    value={paramLength === 0 ? ["none"] : data.parameters}
                    onChange={(e) => set('parameters', e.target.value)}
                    disabled={_disabled}
                    multiple
                >
                    <MenuItem value="none" disabled><em>None</em></MenuItem>
                    {variables?.metricsParametersList[data.category]?.length && <MenuItem value="all" divider autoFocused >
                        <Checkbox checked={paramLength > 0 && paramLength === data.parameters.length} sx={{ p: .5, pr: 1 }} />
                        <b>Select all</b>
                    </MenuItem>}
                    {variables?.metricsParametersList[data.category]?.map(({ id, title }) => {
                        return <MenuItem value={id}>{title}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </Grid>
    ]
    return <MainItem {...props} children={children} />
}



const Form = (props) => {
    return <MainForm {...props} path="compare" Item={Item} />
}

export default Form