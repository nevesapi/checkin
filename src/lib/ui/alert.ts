import { Vibration } from "react-native";
import { ShowAlertParams } from "../../types";

export const showAlert = (
  { setVisible, setTitle, setMessage, setType }: ShowAlertParams,
  title: string,
  message: string,
  type: "success" | "error" = "error"
) => {
  setTitle(title);
  setMessage(message);
  setVisible(true);
  if (setType) setType(type);

  Vibration.vibrate(300);
};
