import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

type NOTIFICATION_TYPE = "success" | "danger" | "info" | "default" | "warning";

export interface INotifyProps {
  title: string;
  message: string;
  type?: NOTIFICATION_TYPE;
  duration?: number;
}

export default function Notify(props: INotifyProps) {
  const { title, message, type = "info", duration = 3000 } = props;

  return Store.addNotification({
    title,
    message,
    type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration,
    },
  });
}
