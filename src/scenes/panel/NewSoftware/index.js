import * as React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Select, MenuItem, FormControl, InputLabel, Box, Fab, IconButton, Avatar } from '@mui/material';
import CardContent from '@mui/material/CardContent';

import TextField from '@mui/material/TextField';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import GetAppIcon from '@mui/icons-material/GetApp';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

import CheckIcon from '@mui/icons-material/Check';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { useSnackbar } from 'notistack';
import validex from 'validex'

import { LoadingButton } from '@mui/lab'

import * as api from "../../../api";
import { deepOrange } from '@mui/material/colors';






export default function NewSoftware() {

    const params = useParams()
    const user = useSelector(state => state.auth.user)
    const history = useHistory()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const isNew = params.softID === 'new'
    const softID = !isNew ? parseInt(params.softID) : null


    const [evalPanelsExpanded, setEvalPanelsExpanded] = React.useState(false);
    const handlePanelExpanded = (panel) => (event, isExpanded) => {
        setEvalPanelsExpanded(isExpanded ? panel : false);
    }

    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const [name, setName] = React.useState('');
    const [area, setArea] = React.useState('');
    const [downloadLink, setDownloadLink] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState(null);

    const [areaList, setAreaList] = React.useState([]);


    const getAreasList = async () => {
        setDisabled(true)
        setLoading(true)

        try {
            const response = await api.getApplicationAreaList()
            setAreaList(response.data)
        } catch (error) {
            enqueueSnackbar("[getApplicationAreaList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }

        setDisabled(false)
        setLoading(false)
    }
    React.useEffect(() => { getAreasList() }, [])


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
            const responseCheck = await api.getSoftwareQuery(`?created_by=&software_name=${name}`)
            if (responseCheck.data.length) {
                enqueueSnackbar("This software already added", { variant: 'error' })
            } else {
                if (!isNew) {
                    await api.editSoftware(softID, data)
                    enqueueSnackbar("Your software updated successfully", { variant: 'success' })
                } else {
                    await api.newSoftware(data)
                    enqueueSnackbar("Your software added successfully", { variant: 'success' })
                }

                history.push(`/softwares`);
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
    }




    const sxicons = { color: '#0277bd', mr: 1, my: 0.5 }
    const sxbox = { display: 'flex', alignItems: 'flex-end', marginTop: (theme) => theme.spacing(2) }
    const SoftwareFrom = <Grid container>
        <Grid
            item
            lg={6}
            md={9}
            sm={6}
            xs={12}
        >

            <CardContent>

                <Typography variant="h6" component="div">
                    {isNew ? "New Software" : "Edit Software"}
                </Typography>


                <Box sx={sxbox}>
                    <AutoAwesomeMosaicIcon sx={sxicons} />
                    <TextField
                        label="Name"
                        variant="standard"
                        autoComplete={true}
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        disabled={disabled}

                    />
                </Box>

                <Box sx={sxbox}>
                    <ViewCarouselIcon sx={sxicons} />
                    <FormControl variant="standard" fullWidth>
                        <InputLabel>Area</InputLabel>
                        <Select
                            value={area}
                            onChange={(e) => { setArea(e.target.value) }}
                            disabled={disabled}
                        >
                            {areaList.map(({ id, area_name }) => <MenuItem value={id}>{area_name}</MenuItem>)}
                            {areaList.length === 0 ? <MenuItem value={0} disabled>Not found</MenuItem> : null}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={sxbox}>
                    <GetAppIcon sx={sxicons} />
                    <TextField
                        label="Download link"
                        variant="standard"
                        autoComplete={true}
                        type="url"
                        fullWidth
                        value={downloadLink}
                        onChange={(e) => { setDownloadLink(e.target.value) }}
                        disabled={disabled}

                    />
                </Box>


                <Box sx={sxbox}>
                    <DescriptionIcon sx={sxicons} />
                    <TextField
                        label="Description"
                        variant="standard"
                        autoComplete={true}
                        type="text"
                        fullWidth
                        multiline
                        rows={5}
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        disabled={disabled}

                    />
                </Box>



            </CardContent>
        </Grid>

        <Grid
            lg={6}
            md={3}
            sm={6}
            xs={12}
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ marginBottom: (theme) => theme.spacing(2), marginTop: (theme) => theme.spacing(2) }}
        >

            {
                image ?

                    <Grid item >
                        <Grid container direction="column">
                            <Avatar
                                alt={name.toUpperCase()}
                                src={image.medium}
                                sx={{ width: 75, height: 75 }}
                                variant="rounded"
                            />
                            <Grid container direction="row" justifyContent="space-between">
                                <IconButton color='error' onClick={() => setImage(null)} disabled={disabled}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                                <IconButton color='info' component={"label"} disabled={disabled}>
                                    <ModeEditIcon />
                                    <input accept="image/*" type="file" style={{ display: "none" }} onChange={handleUploadImage} disabled={disabled} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>

                    :
                    <Grid item component={"label"} sx={{ cursor: disabled || "pointer" }} >
                        <Avatar
                            alt={name.toUpperCase()}
                            src={"/no-avatar"}
                            sx={{ width: 75, height: 75, bgcolor: disabled || deepOrange[500] }}
                            children={<InsertPhotoIcon />}
                            variant="rounded"
                        />
                        <input accept="image/*" type="file" style={{ display: "none" }} onChange={handleUploadImage} disabled={disabled} />
                    </Grid>
            }

        </Grid>

    </Grid >


    let Evaluations = []
    Evaluations.push(
        <Accordion expanded={evalPanelsExpanded === 'metric'} onChange={handlePanelExpanded('metric')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                children={<Typography children="Metric" variant="button" />}
            />
            <AccordionDetails>

            </AccordionDetails>
        </Accordion>
    )

    Evaluations.push(
        <Accordion expanded={evalPanelsExpanded === 'comment'} onChange={handlePanelExpanded('comment')} >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                children={<Typography children="Comment" variant="button" />}
            />
            <AccordionDetails>

            </AccordionDetails>
        </Accordion >
    )

    Evaluations.push(
        <Accordion expanded={evalPanelsExpanded === 'rating'} onChange={handlePanelExpanded('rating')} >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                children={<Typography children="Rating" variant="button" />}
            />
            <AccordionDetails>

            </AccordionDetails>
        </Accordion >
    )


    Evaluations.push(
        <Accordion expanded={evalPanelsExpanded === 'compare'} onChange={handlePanelExpanded('compare')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                children={<Typography children="Compare" variant="button" />}
            />
            <AccordionDetails>

            </AccordionDetails>
        </Accordion>
    )


    Evaluations.push(
        <Accordion expanded={evalPanelsExpanded === 'questionnaire'} onChange={handlePanelExpanded('questionnaire')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                children={<Typography children="Questionnaire" variant="button" />}
            />
            <AccordionDetails>

            </AccordionDetails>
        </Accordion>
    )




    return <>
        <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
                <Card>
                    {SoftwareFrom}
                </Card>
            </Grid>
            <Grid item md={6} xs={12}>
                {Evaluations}
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
