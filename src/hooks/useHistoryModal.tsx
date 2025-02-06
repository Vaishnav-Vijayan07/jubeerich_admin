import { useState } from "react";

export const useHistoryModal = () => {
  const [historyModal, setHistoryModal] = useState<boolean>(false);  

  const toggleHistoryModal = () => {
    setHistoryModal(!historyModal);
  };

  return {
    historyModal,
    toggleHistoryModal,
  };
};
