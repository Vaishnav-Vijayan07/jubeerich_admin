import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';

const MaterialErrorAlert = (props: any) => {
    const { body, title, toggleAlertModal, open } = props;
    console.log('PROPS', props);

    return (
<>
    <Dialog
        open={open}
        onClose={toggleAlertModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            <div className='d-flex-row'>
                <div className='d-flex justify-content-center align-items-center'>
                    <ReportOutlinedIcon color='error' style={{ verticalAlign: 'middle', fontSize: '160px' }} />
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    {title || ''}
                </div>
            </div>
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {body || ''}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={toggleAlertModal}>Close</Button>
        </DialogActions>
    </Dialog>
</>

    )
}

export default MaterialErrorAlert