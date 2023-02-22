/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Card, TextField, CardContent, Grid, Avatar, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import * as API from "../../../api";
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from "react-redux";
import { Editor } from '@tinymce/tinymce-react';



const EditProfile = ({ setDisabled, setLoading, disabled, loading }) => {



    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [first_name, setFirstName] = React.useState(user.first_name)
    const [last_name, setLastName] = React.useState(user.last_name)
    const [degree, setDegree] = React.useState(user.degree_id)
    const [username, setUsername] = React.useState(user.username)
    const [email, setEmail] = React.useState(user.email)
    const [phoneNumber, setPhoneNumber] = React.useState(user.phone_number)
    const [avatar, setAvatar] = React.useState(user.avatar)
    const [degreesList, setDegreesList] = React.useState([])
    const editorRef = React.useRef(null);



    const submit = async () => {
        const data = {
            first_name,
            last_name,
            degree_id: degree,
            avatar_id: avatar?.id,
            bio: editorRef?.current?.getContent() || "",
        }

        setDisabled(true)
        setLoading(true)
        try {
            const response = await API.PATCH(true)('auth/user/', data)
            enqueueSnackbar("Successfully updated", { variant: 'success' })
            dispatch({ type: 'USER_INFO', payload: { user: response.data } })
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
        setDisabled(false)
        setLoading(false)
    }

    const getDegreesList = async () => {
        setDisabled(true)
        try {
            const response = await API.GET(false)('auth/degree/')
            setDegreesList(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
        setDisabled(false)
    }

    React.useEffect(() => {
        getDegreesList()
    }, [])


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
            setAvatar(response.data)


        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }

        setLoading(false)
        setDisabled(false)
    }

    return <Card>
        <CardContent>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Edit Profile
            </Typography>



            <Grid container direction="column" sx={{ alignItems: "center", cursor: disabled || "pointer" }} component={"label"}>
                <Avatar
                    src={avatar?.medium ?? "/no-avatar"}
                    sx={{ width: 75, height: 75 }}
                    variant="circular"
                />
                <input accept="image/*" type="file" style={{ display: "none" }} onChange={handleUploadImage} disabled={disabled} />
            </Grid>


            <TextField
                label="First name"
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                type="text"
                fullWidth
                value={first_name}
                onChange={(e) => { setFirstName(e.target.value) }}
                disabled={disabled}
            />

            <TextField
                label="Last name"
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                type="text"
                fullWidth
                value={last_name}
                onChange={(e) => { setLastName(e.target.value) }}
                disabled={disabled}
            />

            <FormControl
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                fullWidth
            >
                <InputLabel>Degree</InputLabel>
                <Select
                    label="Degree"
                    value={degree}
                    onChange={(e) => { setDegree(e.target.value) }}
                    disabled={disabled}
                >

                    {degreesList.map(({ id, title }) => <MenuItem value={id}>{title}</MenuItem>)}
                    {degreesList.length === 0 ? <MenuItem value={null} disabled>Not found</MenuItem> : null}
                </Select>
            </FormControl>

            <TextField
                label="Username"
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                type="text"
                fullWidth
                value={username}
                onChange={(e) => { setUsername(e.target.value) }}
                disabled={disabled || true}
            />


            <TextField
                label="Email"
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                type="text"
                fullWidth
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                disabled={disabled || true}
            />

            <TextField
                label="Phone number"
                variant="standard"
                sx={{ marginBottom: (theme) => theme.spacing(2) }}
                type="text"
                fullWidth
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value) }}
                disabled={disabled || true}
            />


            <Editor
                apiKey={"c5202p0ybgpmcrokfgwn78asoww5xabm9hxbqxxvzxwgsmhg"}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={user.bio}
                init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'image | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | ltr rtl | bullist numlist outdent indent | ' +
                        'removeformat | help |',
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px, }"
                }}

            />

            <br />

            <LoadingButton
                variant="contained"
                size="large"
                children="Edit"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />


        </CardContent>
    </Card>
}

export default EditProfile








