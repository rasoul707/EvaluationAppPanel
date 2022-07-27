/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';

import validex from 'validex'


import { Card, } from '@mui/material';

import * as API from "../../../api";

import SoftwareForm from "./SoftwareForm"

import Layout from "../../../components/Layout"


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function NewSoftware() {

    const params = useParams()
    const history = useHistory()


    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const isNew = params.softID === 'new'
    const softID = !isNew ? parseInt(params.softID) : null

    const [openRemoveDig, setOpenRemoveDig] = React.useState(false)


    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [ID, setID] = React.useState(null);
    const [name, setName] = React.useState('');
    const [area, setArea] = React.useState("none");
    const [downloadLink, setDownloadLink] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState(null);

    const [areaList, setAreaList] = React.useState([]);


    const getSoftware = async () => {
        try {
            const response = await API.GET()(`software/${softID}/`)
            const m = response.data
            setID(m.id)
            setName(m.name)
            setArea(m.area_id)
            setDownloadLink(m.download_link)
            setDescription(m.description)
            setImage(m.logo)
        } catch (error) {
            setID(0)
            API.ResponseError(enqueueSnackbar, error)
            history.replace("/softwares")
        }
    }


    const getAreasList = async () => {
        try {
            const response = await API.GET()('software/area/')
            setAreaList(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }


    const submit = async () => {


        // validations
        const data = {
            name: name,
            download_link: downloadLink,
            area_id: area,
            description,
            logo_id: image?.id
        }
        const schema = {
            name: {
                nameAlias: "Name",
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
            logo_id: {
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
            const responseCheck = await API.GET()(`software/?created_by=&name=${name}`)
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
                    res = await API.PATCH()(`software/${softID}/`, data)
                    enqueueSnackbar("Your software updated successfully", { variant: 'success' })
                } else {
                    res = await API.POST()(`software/`, data)
                    enqueueSnackbar("Your software added successfully", { variant: 'success' })
                }

                // await submitEvaluations(res.data.id)
                history.push(`/softwares/` + res.data.id)
            }



        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
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
            const response = await API.POST(true, config)('upload/image/', formData)
            closeSnackbar(uploadingSnackKey)
            enqueueSnackbar("Image uploaded successfully", { variant: 'success' })
            setImage(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }

        setLoading(false)
        setDisabled(false)
    }


    const performDate = async () => {
        if (!isNew && ID === softID) return


        setDisabled(true)

        if (!isNew) {
            await getAreasList()
            await getSoftware()
        }
        else {
            await getAreasList()
            setName('')
            setArea("none")
            setDownloadLink('')
            setDescription('')
            setImage(null)
        }
        setDisabled(false)
    }


    const closeDialog = () => setOpenRemoveDig(false)
    const removeSoftware = async () => {
        const softwareID = softID;
        closeDialog()
        try {
            await API.DELETE()(`software/${softwareID}/`)
            enqueueSnackbar("Deleted successfully", { variant: 'success' })
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
        history.replace("/softwares")
    }

    const handleRemove = () => {
        setOpenRemoveDig(true)
    }

    React.useEffect(() => {
        performDate()
    }, [params])







    return <Layout>
        <Card>
            <SoftwareForm
                {...{
                    isNew,
                    disabled,
                    loading,
                    submit,
                    areaList,
                    name, setName,
                    area, setArea,
                    downloadLink, setDownloadLink,
                    description, setDescription,
                    image, setImage,
                    handleUploadImage,
                    handleRemove,
                }}
            />
            {isNew ||
                <RemoveSoftwareDialog
                    removeID={openRemoveDig ? softID : false}
                    closeDialog={closeDialog}
                    removeSoftware={removeSoftware}
                />
            }
        </Card>

    </Layout>
}


const RemoveSoftwareDialog = ({ removeID, closeDialog, removeSoftware }) => {
    return <Dialog
        open={removeID}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">Remove Software</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to do this?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog} color="info">No</Button>
            <Button onClick={removeSoftware} color="error" autoFocus>Yes! I'm sure</Button>
        </DialogActions>
    </Dialog>
}