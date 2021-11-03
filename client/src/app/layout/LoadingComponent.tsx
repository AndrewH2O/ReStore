import { Backdrop, Box, CircularProgress, Typography} from "@mui/material";

// optional note ?
interface Props {
    message?:string;
}

export default function Loadingcomponent({message='Loading...'}) {
    // material ui progress indicators
    // Backdrop takes over entire screen so the user can't click 
    // on anything while waiting
    return (
        <Backdrop open={true} invisible={true}>
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress size={100} color='secondary' />
                <Typography variant='h4' sx={{justifyContent: 'center', position: 'fixed', top: '60%'}}>
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    )
}