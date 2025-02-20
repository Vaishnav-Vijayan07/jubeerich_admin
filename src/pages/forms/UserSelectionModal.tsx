import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Slide } from '@mui/material';
import React, { useEffect, useState } from 'react'

const UserSelectionModal = (props: any) => {
    const { onClose, open, heading, usersList, selectedUsersList } = props;
    const [selectedOptions, setSelectedOptions] = useState<any>([]);

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        let formattedData = selectedOptions.map(({ value, label }: any) => ({ id: value, name: label }));
        selectedUsersList(formattedData);
        onClose();
    };

    const handleCheckboxChange = (option: { value: number; label: string }) => {
        setSelectedOptions((prevSelected: { value: number; label: string }[]) =>
            prevSelected.some((item) => item.value == option.value)
                ? prevSelected.filter((item) => item.value != option.value)
                : [...prevSelected, option]
        );
    };

    useEffect(() => {
        if (open) {
            setSelectedOptions(usersList);
        }
    }, [open, usersList]);

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            TransitionComponent={Slide}
            open={open}
        >
            <DialogTitle>{heading}</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {usersList?.map((option: any) => (
                        <FormControlLabel
                            key={option.value}
                            control={
                                <Checkbox
                                    checked={selectedOptions.some((selected: any) => selected.value == option.value)}
                                    onChange={() => handleCheckboxChange(option)}
                                />
                            }
                            label={option.label}
                            sx={{ m: 1 }}
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserSelectionModal