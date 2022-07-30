/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, CircularProgress, TextField, Switch, Divider, IconButton, FormHelperText } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


import { Adder } from "./_Tools"


import * as API from "../../../api";


const filter = createFilterOptions();


const Item = ({ data, remove, isActive, active, set, disabled, variables }) => {

    const [removeLoading, setRemoveLoading] = React.useState(false)


    const _remove = async () => {
        setRemoveLoading(true)
        await remove()
        setRemoveLoading(false)
    }

    const _set = (key, val, sync) => {
        return set(key, val, sync)
    }


    const FixItems = [
        <Grid item md={3} sm={6} xs={12}>
            <TextField
                size="small"
                label="Max"
                type="number"
                fullWidth
                value={data.max}
                onChange={(e) => _set('max', e.target.value, false)}
                onBlur={(e) => _set('max', e.target.value, true)}
                disabled={disabled || !data.is_active || removeLoading}
            />
        </Grid>
        ,
        <Grid item container md={3} sm={6} xs={12} justifyContent="flex-end">
            <Switch checked={isActive} onChange={(e) => active(e.target.checked)} disabled={disabled || removeLoading} />
            <IconButton color='error' onClick={_remove} disabled={disabled || removeLoading}>
                {removeLoading ? <CircularProgress color="error" size={24} /> : <DeleteOutlineIcon />}
            </IconButton>
        </Grid>
    ]


    const newSection = async (title, old) => {
        const id = await variables.addNewSection(title)
        if (id === 'error') {
            set('section', old)
        } else {
            set('section', id)
        }

    }

    const nn = variables?.sectionsList.map(({ id }) => id)
    const tt = nn.indexOf(data.section)


    return <>
        <Grid container item spacing={2} >
            <Grid item md={6} sm={6} xs={12}>
                <Autocomplete
                    value={variables.sectionsList[tt] ?? data.section}
                    onChange={(event, newValue) => {
                        const old = data.section
                        // by enter
                        if (typeof newValue === 'string') {
                            set('section', { title: newValue }, false)
                            newSection(newValue, old)
                        }
                        // by click
                        else if (newValue && newValue.isNew) {
                            set('section', { title: newValue.value }, false)
                            newSection(newValue.value, old)
                        }
                        // regular
                        else {
                            set('section', newValue.id)
                            if (newValue.category) {
                                variables.addSectionToSoftware(newValue.id)
                            }
                        }
                    }}
                    size="small"
                    groupBy={(option) => option.category}
                    options={variables?.sectionsList}
                    getOptionLabel={(option) => {
                        if (option.isNew) {
                            return `Add "${option.value}"`;
                        }
                        return option.title;
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Section" placeholder="Select or type" />
                    )}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        const { inputValue } = params;
                        const isExisting = options.some((option) => inputValue === option.title);
                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                isNew: true,
                                value: inputValue,
                            });
                        }
                        return filtered;
                    }}
                    disabled={disabled || !data.is_active || removeLoading}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    disableClearable
                    freeSolo
                />
                <FormHelperText>Select or type</FormHelperText>
            </Grid>

            {FixItems}
        </Grid >
        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>

    </>
}


const Form = ({ softID, data, set, disabled, variables }) => {

    const { enqueueSnackbar } = useSnackbar()
    const [addLoading, setAddLoading] = React.useState(false)

    const path = 'rating'

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

    const removeItem = (index) => async () => {
        const { id } = data[index]
        try {
            await API.DELETE()(`${path}/${id}/`)
            set(data.filter((_, i) => i !== index))
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const activeItem = (index) => async (is_active) => {
        await changeItem(index)('is_active', is_active)
    }

    const changeItem = (index) => async (key, val, sync = true) => {
        let _data = { [key]: val }
        let items = [...data]
        let prevData = [...items]
        items[index] = { ...items[index], ..._data }
        set(items)
        if (sync) {
            const { id } = data[index]
            try {
                await API.PATCH()(`${path}/${id}/`, _data)
            } catch (error) {
                API.ResponseError(enqueueSnackbar, error)
                set(prevData)
            }
        }
    }






    return <>
        <Grid container direction="column" spacing={2}>
            {data?.map((data, i) => {
                return <Item
                    key={i}
                    disabled={disabled}

                    data={data}

                    remove={removeItem(i)}
                    set={changeItem(i)}
                    isActive={data.is_active}
                    active={activeItem(i)}

                    variables={variables}
                />
            })}
            <Adder newHandler={addItem} loading={addLoading} disabled={disabled} />
        </Grid>
    </>

}



export default Form