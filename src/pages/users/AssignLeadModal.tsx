import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

export const AssignLeadModal = ({ open, toggleModal, message, assignApproved }: any) => {

  const handleClose = () => {
    toggleModal(false);
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Slide}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
          Assign Leads to CRE TL?
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center" }}>
          <ReportGmailerrorredIcon sx={{ fontSize: 150, color: "red", mb: 2 }} />
          <DialogContentText id="alert-dialog-slide-description" sx={{ fontSize: "18px", fontWeight: "500" }}>
            {message}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button onClick={() => assignApproved(true)} variant="contained" color="primary">
            Yes, Assign
          </Button>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>

  );
}
