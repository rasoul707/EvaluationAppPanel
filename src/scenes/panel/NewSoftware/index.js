import * as React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from 'notistack';

import validex from 'validex'


import { Grid, Card, Fab } from '@mui/material';
import { LoadingButton } from '@mui/lab'

import CheckIcon from '@mui/icons-material/Check';


import * as api from "../../../api";

import SoftwareForm from "./SoftwareForm"
import EvaluationsForm from "./EvaluationsForm"




export default function NewSoftware() {

    const params = useParams()
    const user = useSelector(state => state.auth.user)
    const history = useHistory()


    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const isNew = params.softID === 'new'
    const softID = !isNew ? parseInt(params.softID) : null




    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const [name, setName] = React.useState('');
    const [area, setArea] = React.useState("none");
    const [downloadLink, setDownloadLink] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState(null);

    const [areaList, setAreaList] = React.useState([]);


    const getSoftware = async () => {
        try {
            const response = await api.getSoftware(softID)
            const m = response.data
            setName(m.software_name)
            setArea(m.area.id)
            setDownloadLink(m.download_link)
            setDescription(m.description)
            setImage(m.image)
        } catch (error) {
            enqueueSnackbar("[getSoftware]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            // history.replace("/softwares")
        }
    }


    const getAreasList = async () => {
        try {
            const response = await api.getApplicationAreaList()
            setAreaList(response.data)
        } catch (error) {
            enqueueSnackbar("[getApplicationAreaList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }

    React.useEffect(() => {
        const data = async () => {
            setDisabled(true)

            if (!isNew) {
                await getAreasList()
                await getSoftware()
            }
            else {
                setName('')
                setArea("none")
                setDownloadLink('')
                setDescription('')
                setImage(null)
                await getAreasList()
            }
            setDisabled(false)
        }
        data()
    }, [params])


    const submit = async () => {


        // validations
        const data = {
            software_name: name,
            download_link: downloadLink,
            area_id: area,
            description,
            image_id: image?.id,
            user: user
        }
        const schema = {
            software_name: {
                nameAlias: "Software name",
                required: true,
                type: 'string',
                min: 3,
            },
            download_link: {
                nameAlias: "Download link",
                required: true,
                url: true,
            },
            area_id: {
                nameAlias: "Area",
                required: true,
                type: 'number',
            },
            description: {
                nameAlias: "Description",
                required: true,
                type: 'string',
                min: 50,
            },
            image_id: {
                nameAlias: "Image",
                required: true,
                type: 'number',
            }
        }

        const validator = validex(data, schema)
        const isValidate = validator.validate()

        if (!isValidate) {
            const errors = validator.getError()
            Object.values(errors).reverse().map((errorText) => {
                return enqueueSnackbar(errorText, { variant: "error" })
            })
            return
        }

        setDisabled(true)
        setLoading(true)

        try {
            const responseCheck = await api.getSoftwaresList(`created_by=&software_name=${name}`)
            let sameName = true
            if (!isNew) {
                responseCheck.data.map((v, ii) => {
                    if (v.id !== softID) sameName = false
                    return null
                })
            } else
                if (responseCheck.data.length) sameName = false
            if (!sameName) {
                enqueueSnackbar("This software already added", { variant: 'error' })
            } else {
                let res
                if (!isNew) {
                    res = await api.editSoftware(softID, data)
                    enqueueSnackbar("Your software updated successfully", { variant: 'success' })
                } else {
                    res = await api.newSoftware(data)
                    enqueueSnackbar("Your software added successfully", { variant: 'success' })
                }

                await submitEvaluations(res.data.id)
                history.push(`/softwares/` + res.data.id)
            }



        } catch (error) {
            enqueueSnackbar("[newSoftware]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }

        setDisabled(false)
        setLoading(false)
    }

    const handleUploadImage = async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            enqueueSnackbar("Image size must be less than 1MB", { variant: 'error' })
            return;
        }

        setLoading(true)
        setDisabled(true)

        const uploadingSnackKey = enqueueSnackbar("Uploading image ...", { variant: 'info', autoHideDuration: null })

        const formData = new FormData();
        formData.append("file", file);
        try {
            const config = {
                onUploadProgress: (progressEvent) => {
                    console.log(progressEvent.loaded)
                }
            }
            const response = await api.uploadImage(formData, config)
            closeSnackbar(uploadingSnackKey)
            enqueueSnackbar("Image uploaded successfully", { variant: 'success' })
            setImage(response.data)
        } catch (error) {
            enqueueSnackbar("[uploadImage]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }

        setLoading(false)
        setDisabled(false)
    }




    const [metricForm, setMetricForm] = React.useState([])
    const [commentForm, setCommentForm] = React.useState([])
    const [ratingForm, setRatingForm] = React.useState([])
    const [compareForm, setCompareForm] = React.useState([])
    const [questionnaireForm, setQuestionnaireForm] = React.useState([])

    const submitEvaluations = async (softwareID) => {

        // metricForm
        metricForm.map(async val => {
            const data = { software: softwareID, ...val }
            try {
                if (val.id) {
                    await api.editMetricEvaluate(val.id, data)
                }
                else {
                    await api.newMetricEvaluate(data)
                }
            } catch (error) {
                enqueueSnackbar("[metricForm]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        })

        // commentForm
        commentForm.map(async val => {
            const data = { software: softwareID, ...val }
            try {
                if (val.id) {
                    await api.editCommentEvaluate(val.id, data)
                }
                else {
                    await api.newCommentEvaluate(data)
                }
            } catch (error) {
                enqueueSnackbar("[commentForm]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        })

        // ratingForm
        ratingForm.map(async val => {
            const data = { software: softwareID, ...val }
            try {
                if (val.id) {
                    await api.editRatingEvaluate(val.id, data)
                }
                else {
                    await api.newRatingEvaluate(data)
                }
            } catch (error) {
                enqueueSnackbar("[ratingForm]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        })

        // compareForm
        compareForm.map(async val => {
            const data = { software: softwareID, ...val }
            try {
                if (val.id) {
                    await api.editCompareEvaluate(val.id, data)
                }
                else {
                    await api.newCompareEvaluate(data)
                }
            } catch (error) {
                enqueueSnackbar("[compareForm]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        })


        // questionnaireForm
        questionnaireForm.map(async val => {
            const data = { software: softwareID, ...val }
            try {
                if (val.id) {
                    await api.editQuestionnaireEvaluate(val.id, data)
                }
                else {
                    await api.newQuestionnaireEvaluate(data)
                }
            } catch (error) {
                enqueueSnackbar("[questionnaireForm]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        })


    }

    return <>
        <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
                <Card>
                    <SoftwareForm
                        {...{
                            isNew,
                            disabled,
                            areaList,
                            name, setName,
                            area, setArea,
                            downloadLink, setDownloadLink,
                            description, setDescription,
                            image, setImage,
                            handleUploadImage
                        }}
                    />
                </Card>
            </Grid>
            <Grid item md={6} xs={12}>
                <EvaluationsForm
                    {...{
                        isNew, softID, area,
                        metricForm, setMetricForm,
                        commentForm, setCommentForm,
                        ratingForm, setRatingForm,
                        compareForm, setCompareForm,
                        questionnaireForm, setQuestionnaireForm,
                    }}
                />
            </Grid>
        </Grid>

        <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            size="large"
            sx={{
                position: "fixed",
                bottom: (theme) => theme.spacing(2),
                right: (theme) => theme.spacing(2)
            }}
            onClick={submit}
            disabled={disabled}
            loading={loading}
            component={LoadingButton}
        >
            {!loading ? [<CheckIcon sx={{ mr: 1 }} />, "Submit"] : null}
        </Fab>


    </>
}