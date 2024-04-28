import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface IConfirmBox {
  title: string;
  message: string;
  handleYesClick: () => void;
}

export const showConfirmBox = (props: IConfirmBox) => {
  const { title, message, handleYesClick } = props;

  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: "Yes",
        onClick: handleYesClick,
      },
      {
        label: "No",
        onClick: () => { },
      },
    ],
  });
};
