/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import * as API from "../../../api";
import { useSnackbar } from 'notistack';



const Documents = ({ setDisabled, setLoading, disabled, loading }) => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const [documents, setDocuments] = React.useState({})

    const submit = async () => {
        const data = {
            document1_id: documents[1]?.id,
            document2_id: documents[2]?.id,
            document3_id: documents[3]?.id,
        }

        setDisabled(true)
        setLoading(true)

        try {
            await API.PATCH(true)('auth/user/', data)
            enqueueSnackbar("Successfully updated", { variant: 'success' })
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }

        setDisabled(false)
        setLoading(false)
    }

    const handleUploadDocument = (id) => async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;

        setLoading(true)
        setDisabled(true)

        const uploadingSnackKey = enqueueSnackbar(`Uploading document#${id} ...`, { variant: 'info', autoHideDuration: null })



        const formData = new FormData();
        formData.append("file", file);
        try {
            const config = {
                onUploadProgress: (progressEvent) => {
                    console.log(progressEvent.loaded)
                }
            }
            const response = await API.POST(true, config)('upload/image/', formData)
            closeSnackbar(uploadingSnackKey)
            enqueueSnackbar(`Document#${id} uploaded successfully`, { variant: 'success' })



            setLoading(false)
            setDisabled(false)


            setDocuments({ ...documents, [id]: response.data })

        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            setLoading(false)
            setDisabled(false)
        }



    }



    return <Card>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Documents
            </Typography>



            <Grid container direction="column" sx={{ alignItems: "center", cursor: disabled || "pointer" }} component={"label"}>
                <Box component="span" sx={{ p: 2, border: '1px dashed grey' }} >
                    Choose Document#1
                    <input accept="image/*" type="file" style={{}} onChange={handleUploadDocument(1)} disabled={disabled} />
                </Box>
            </Grid>

            <Grid container direction="column" sx={{ alignItems: "center", cursor: disabled || "pointer" }} component={"label"}>
                <Box component="span" sx={{ p: 2, border: '1px dashed grey' }} >
                    Choose Document#2
                    <input accept="image/*" type="file" style={{}} onChange={handleUploadDocument(2)} disabled={disabled} />
                </Box>
            </Grid>
            <Grid container direction="column" sx={{ alignItems: "center", cursor: disabled || "pointer" }} component={"label"}>
                <Box component="span" sx={{ p: 2, border: '1px dashed grey' }} >
                    Choose Document#3
                    <input accept="image/*" type="file" style={{}} onChange={handleUploadDocument(3)} disabled={disabled} />
                </Box>
            </Grid>


            <LoadingButton
                variant="contained"
                size="large"
                children="Submit"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />


        </CardContent>
    </Card>
}

export default Documents