/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';


import { useSnackbar } from 'notistack';
import { Grid, Divider, Typography, Slider, Avatar } from '@mui/material';

import * as API from "../../../api";

import { Submit } from "./_Tools"

const ConvertToObject = (user_data) => {
    let result = {}
    user_data?.map(({ parameter, main, target, id }, index) => {
        result[parameter] = { main, target, index, id }
    })
    return result
}


const Item = ({ data, setUserData, disabled }) => {

    const user_data = ConvertToObject(data.user_data?.result)
    disabled = disabled || data.user_data?.id > 0


    return <>
        <Grid item spacing={2} >
            <Typography variant='h6'>
                {data.category?.name}
            </Typography>
        </Grid>
        <Grid container item spacing={0} columnSpacing={10} justifyContent="space-between" >

            <Grid item container xs={6} justifyContent="center" alignItems="center" flexDirection="column">
                <Avatar
                    alt={data.software?.name.toUpperCase()}
                    src={data.software?.logo?.medium}
                    sx={{ width: 40, height: 40 }}
                    variant="square"
                    children={"No Photo"}
                />
                <Typography variant='subtitle2'>
                    {data.software?.name}
                </Typography>
            </Grid>

            <Grid item container xs={6} justifyContent="center" alignItems="center" flexDirection="column">
                <Avatar
                    alt={data.target_software?.name.toUpperCase()}
                    src={data.target_software?.logo?.medium}
                    sx={{ width: 40, height: 40 }}
                    variant="square"
                    children={"No Photo"}
                />
                <Typography variant='subtitle2'>
                    {data.target_software?.name}
                </Typography>
            </Grid>
            {data.parameters.map(({ title, id }) => {
                return <>

                    <Grid item xs={12} >
                        <Typography variant='subtitle2' align='center' >
                            {title}
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid container>
                            <Slider
                                step={1}
                                marks
                                min={0}
                                max={10}
                                valueLabelDisplay="auto"
                                value={user_data[id]?.main}
                                onChange={(e) => setUserData(id, e.target.value, 'main')}
                                sx={{ width: '100%' }}
                                disabled={disabled}
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <Grid container>
                            <Slider
                                step={1}
                                marks
                                min={0}
                                max={10}
                                valueLabelDisplay="auto"
                                value={user_data[id]?.target}
                                onChange={(e) => setUserData(id, e.target.value, 'target')}
                                sx={{ width: '100%' }}
                                disabled={disabled}
                            />
                        </Grid>
                    </Grid>
                </>
            })}



        </Grid >

        <Grid container item>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>
    </>
}


const Form = ({ data, set, disabled }) => {

    const { enqueueSnackbar } = useSnackbar()

    const path = 'compare'

    const changeUserData = (index) => async (paramID, val, key) => {
        if (data[index].user_data?.id) return

        let resultItems = data[index].user_data?.result ? [...data[index].user_data?.result] : []
        const user_data = ConvertToObject(data[index].user_data?.result)
        let result = { parameter: paramID, [key]: val, id: null }
        if (!user_data[paramID]) {
            resultItems.push(result)
        }
        else {
            let m_index = user_data[paramID].index
            result = { ...resultItems[m_index], ...result }
            resultItems[m_index] = result
        }

        let items = [...data]
        let _data = { user_data: { result: resultItems } }
        items[index] = { ...items[index], ..._data }
        set(items)
    }

    const [submitLoading, setSubmitLoading] = React.useState(false)
    const submit = async () => {
        setSubmitLoading(true)
        for (let i = 0; i < data.length; i++) {
            const m = data[i]
            try {
                await API.POST()(`${path}/evaluation/`, { evaluate_id: m.id, data: (m.user_data?.result || []) })

                let items = [...data]
                let _data = { user_data: { ...m.user_data, id: 85 } }
                items[i] = { ...items[i], ..._data }
                set(items)

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
                    disabled={disabled}
                    data={data}
                    setUserData={changeUserData(i)}
                />
            })}
            <Submit submitHandler={submit} loading={submitLoading} disabled={disabled} />
        </Grid>
    </>

}



export default Form