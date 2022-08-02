
import * as React from 'react';
import { Grid, TextField, FormHelperText } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import { MainForm, MainItem } from "./_Tools"


const filter = createFilterOptions();



const Item = (props) => {

    const { data, set, disabled, variables, isActive, isPublish } = props
    const _disabled = disabled || !isActive || isPublish

    const newSection = async (title, old) => {
        const id = await variables.addNewSection(title)
        if (id === 'error') {
            set('section', old)
        } else {
            set('section', id)
        }
    }

    const publicSections = async (sid, old) => {
        const id = await variables.addSectionToSoftware(sid)
        if (id === 'error') {
            set('section', old)
        } else {
            set('section', id)
        }
    }

    const nn = variables?.sectionsList.map(({ id }) => id)
    const tt = nn.indexOf(data.section)


    const children = [
        <Grid item md={12} sm={12} xs={12}>
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
                        if (newValue.category) {
                            set('section', newValue.id, false)
                            publicSections(newValue.id, old)
                        } else {
                            set('section', newValue.id)
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
                disabled={_disabled}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                disableClearable
                freeSolo
            />
            <FormHelperText>Select or type</FormHelperText>
        </Grid>
    ]
    return <MainItem {...props} children={children} />
}


const Form = (props) => {
    return <MainForm {...props} path="rating" Item={Item} />
}


export default Form