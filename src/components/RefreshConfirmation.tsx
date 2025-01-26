import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const RefreshConfirmation = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'refresh' | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault(); // Prevent the default behavior (browser refresh)
      setPendingAction('refresh');
      setIsDialogOpen(true);
      return ''; // Return an empty string to suppress the native confirmation dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleConfirmRefresh = () => {
    if (pendingAction === 'refresh') {
      setIsDialogOpen(false);
      setTimeout(() => {
        window.location.reload(); // Perform the refresh
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setPendingAction(null);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Refresh</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you refresh the page, all unsaved data will be lost. Are you sure you want to refresh?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmRefresh} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RefreshConfirmation;
