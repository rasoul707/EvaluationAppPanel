/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress, TextField, Switch, Divider, IconButton, } from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { Adder } from "./_Tools"


import * as API from "../../../api";




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

    return <>
        <Grid container item spacing={2} >

            <Grid item md={3} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={variables?.questionnairesCategoriesList.length === 0 ? "none" : data.category}
                        onChange={(e) => _set('category', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}
                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {variables?.questionnairesCategoriesList.map(({ id, name }) => {
                            return <MenuItem value={id}>{name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item md={3} sm={6} xs={12}>
                <FormControl fullWidth size="small">
                    <InputLabel>Parameters</InputLabel>
                    <Select
                        label="Parameters"
                        value={variables?.questionnairesParametersList[data.category]?.length === 0 ? ["none"] : data.parameters}
                        onChange={(e) => _set('parameters', e.target.value)}
                        disabled={disabled || !data.is_active || removeLoading}
                        multiple
                    >
                        <MenuItem value="none" disabled><em>None</em></MenuItem>
                        {variables?.questionnairesParametersList[data.category]?.map(({ id, title }) => {
                            return <MenuItem value={id}>{title}</MenuItem>
                        })}
                    </Select>
                </FormControl>
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

    const path = 'questionnaire'

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
        if (key === 'category') {
            _data['parameters'] = []
        }
        let items = [...data]
        let prevData = [...items]
        items[index] = { ...items[index], ..._data }
        set(items)
        if (sync) {
            const { id } = data[index]
            try {
                await API.PATCH()(`${path}/${id}/`, { [key]: val })
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