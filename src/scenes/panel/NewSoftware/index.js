import * as React from 'react';
import { useParams } from "react-router-dom";


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { Select, MenuItem, FormControl, InputLabel, Box, Snackbar, Alert, Fab } from '@mui/material';
import CardContent from '@mui/material/CardContent';

import TextField from '@mui/material/TextField';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import GetAppIcon from '@mui/icons-material/GetApp';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import CheckIcon from '@mui/icons-material/Check';


import * as api from "../../../api";

export default function NewSoftware() {

    const params = useParams()
    const isNew = params.softID === 'new'
    const softID = !isNew ? parseInt(params.softID) : null


    const [evalPanelsExpanded, setEvalPanelsExpanded] = React.useState(false);
    const handlePanelExpanded = (panel) => (event, isExpanded) => {
        setEvalPanelsExpanded(isExpanded ? panel : false);
    }

    const [disabled, setDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    // const [loading, setLoading] = React.useState(false);

    const [name, setName] = React.useState('');
    const [area, setArea] = React.useState('');
    const [downloadLink, setDownloadLink] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [areaList, setAreaList] = React.useState([]);


    const getAreasList = async () => {
        setDisabled(true)
        setLoading(true)

        try {
            const response = await api.getApplicationAreaList()
            setAreaList(response.data)
        } catch (error) {
            // setError(JSON.stringify(error.data.message))
        }

        setDisabled(false)
        setLoading(false)
    }
    React.useEffect(() => { getAreasList() }, [])


    const submit = () => {
        alert("ggg")
    }






    const sxicons = { color: '#0277bd', mr: 1, my: 0.5 }
    const SoftwareFrom = <Grid container>
        <Grid item lg={6} md={12} sm={9} xs={12}>

            <CardContent>

                <Typography variant="h6" component="div">
                    {isNew ? "New Software" : "Edit Software"}
                </Typography>


                <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className="mart15">
                    <AutoAwesomeMosaicIcon sx={sxicons} />
                    <TextField
                        label="Name"
                        variant="standard"
                        autoComplete={true}
                        type="text"
                        fullWidth={true}
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        disabled={disabled}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className="mart15">
                    <ViewCarouselIcon sx={sxicons} />
                    <FormControl variant="standard" fullWidth={true}>
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

                <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className="mart15">
                    <GetAppIcon sx={sxicons} />
                    <TextField
                        label="Download link"
                        variant="standard"
                        autoComplete={true}
                        type="url"
                        fullWidth={true}
                        value={downloadLink}
                        onChange={(e) => { setDownloadLink(e.target.value) }}
                        disabled={disabled}
                    />
                </Box>


                <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className="mart15">
                    <DescriptionIcon sx={sxicons} />
                    <TextField
                        label="Description"
                        variant="standard"
                        autoComplete={true}
                        type="text"
                        fullWidth={true}
                        multiline
                        rows={5}
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        disabled={disabled}
                    />
                </Box>


                {/* <Box sx={{ display: 'flex', alignItems: 'flex-end' }} className="mart15">
                    <InsertPhotoIcon sx={sxicons} />
                    <TextField
                        label="Image"
                        variant="standard"
                        autoComplete={true}
                        type="file"
                        fullWidth={true}
                        rows={5}
                    // value={email}
                    // onChange={(e) => { setEmail(e.target.value) }}
                    // disabled={disabled}
                    />
                </Box> */}




            </CardContent>
        </Grid>
    </Grid>





    return <>
        <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
                <Card>
                    {SoftwareFrom}
                </Card>
            </Grid>
            <Grid item md={6} xs={12}>

                <Accordion expanded={evalPanelsExpanded === 'metric'} onChange={handlePanelExpanded('metric')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        children={<Typography children="Metric" />}
                    />
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={evalPanelsExpanded === 'comment'} onChange={handlePanelExpanded('comment')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        children={<Typography children="Comment" />}
                    />
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={evalPanelsExpanded === 'rating'} onChange={handlePanelExpanded('rating')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        children={<Typography children="Rating" />}
                    />
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={evalPanelsExpanded === 'compare'} onChange={handlePanelExpanded('compare')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        children={<Typography children="Compare" />}
                    />
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion>

                <Accordion expanded={evalPanelsExpanded === 'questionnaire'} onChange={handlePanelExpanded('questionnaire')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        children={<Typography children="Questionnaire" />}
                    />
                    <AccordionDetails>

                    </AccordionDetails>
                </Accordion>

            </Grid>


        </Grid>

        <Snackbar open={false} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert severity="error" sx={{ width: '100%' }}>
                This is a success message!
            </Alert>
        </Snackbar>

        <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            size="medium"
            sx={{
                position: "fixed",
                bottom: (theme) => theme.spacing(2),
                right: (theme) => theme.spacing(2)
            }}
            onClick={submit}
        >
            <CheckIcon sx={{ mr: 1 }} />
            Submit
        </Fab>


    </>
}
