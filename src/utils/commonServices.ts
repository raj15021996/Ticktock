import { toaster } from "react-toastella";

const showToast: any = ({ message, type }: any) => {
  toaster.notify({
    message,
    progressBar: false,
    theme: 'colored',
    showIcon: false,
    duration: 3000,
    type,
    customStyles: {
      width: '380px',
      backgroundColor: 'black',
      padding: '8px 8px 8px 12px',
      textColor: 'white',
      fontSize: '14px',
      borderRadius: '8px',
      iconColor: 'white',
    },
  });
};

export const forSuccess = (message: string) =>
  showToast({ message, type: 'success' });

export const forError = (message: string) =>
  showToast({ message, type: 'error' });
