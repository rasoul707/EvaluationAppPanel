import { Select, MenuItem, FormControl, InputLabel, Box, Grid, IconButton, Button, Avatar, CardContent, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { deepOrange } from '@mui/material/colors';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import GetAppIcon from '@mui/icons-material/GetApp';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';



export default function SoftwareForm({
    isNew,
    disabled,
    loading,
    submit,
    areaList,
    name, setName,
    area, setArea,
    downloadLink, setDownloadLink,
    description, setDescription,
    isActive, setActive,
    image, setImage,
    handleUploadImage,
    handleArchive,
    handleUnarchive,
}) {
    const sxicons = { color: '#0277bd', mr: 1, my: 0.5 }
    const sxbox = { display: 'flex', alignItems: 'flex-end', marginTop: (theme) => theme.spacing(2) }
    return <Grid container>
        <Grid
            item
            lg={6}
            md={9}
            sm={6}
            xs={12}
        >

            <CardContent >

                <Typography variant="h6" component="div">
                    {isNew ? "New Software" : "Edit Software"}
                </Typography>


                <Box sx={sxbox}>
                    <AutoAwesomeMosaicIcon sx={sxicons} />
                    <TextField
                        label="Name"
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
                    <FormControl fullWidth >
                        <InputLabel>Area</InputLabel>
                        <Select
                            label="Area"
                            value={areaList.length === 0 ? "none" : area}
                            onChange={(e) => { setArea(e.target.value) }}
                            disabled={disabled}
                        // autoFocus
                        >
                            <MenuItem value="none" disabled><em>None</em></MenuItem>
                            {areaList.map(({ id, name }) => <MenuItem value={id}>{name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={sxbox}>
                    <GetAppIcon sx={sxicons} />
                    <TextField
                        label="Download link"
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

                <Box sx={sxbox}>
                    <LoadingButton
                        sx={{ mr: .5 }}
                        color="primary"
                        aria-label="add"
                        variant="contained"
                        size="large"
                        disabled={disabled}
                        loading={loading}
                        children={"Submit"}
                        onClick={submit}
                    />
                    {(!isNew && isActive) && <Button
                        sx={{ ml: .5 }}
                        color="error"
                        variant="contained"
                        size="large"
                        disabled={disabled}
                        loading={loading}
                        children={"Archive"}
                        onClick={handleArchive}
                    />}

                    {(!isNew && !isActive) && <Button
                        sx={{ ml: .5 }}
                        color="error"
                        variant="contained"
                        size="large"
                        disabled={disabled}
                        loading={loading}
                        children={"Unarchive"}
                        onClick={handleUnarchive}
                    />}
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

            {image
                ?
                <Grid item >
                    <Grid container direction="column">
                        <Avatar
                            alt={name.toUpperCase()}
                            src={image?.medium}
                            sx={{ width: 75, height: 75 }}
                            variant="rounded"
                            children={"No Photo"}
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
                    <Typography variant="subtitle2" textAlign="center" sx={{ padding: (theme) => theme.spacing(1) + " 0" }}>No Image</Typography>
                    <input accept="image/*" type="file" style={{ display: "none" }} onChange={handleUploadImage} disabled={disabled} />
                </Grid>
            }

        </Grid>
    </Grid >


}