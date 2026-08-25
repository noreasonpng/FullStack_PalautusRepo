import { Alert } from "@mui/material";
import useNotificationStore from "../Store/NotificationStore";

const Notification = () => {
  const message = useNotificationStore((state) => state.message);
  const type = useNotificationStore((state) => state.type);

  if (!message) {
    return null;
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={type}>
      {message}
    </Alert>
  );
};

export default Notification;
