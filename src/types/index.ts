export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Checkin = {
  id: string;
  user_id: string;
  timestamp: string;
  latitude: number | null;
  longitude: number | null;
};

export type CustomAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: "success" | "error";
};

export type ShowAlertParams = {
  setVisible: (visible: boolean) => void;
  setTitle: (title: string) => void;
  setMessage: (message: string) => void;
  setType?: (type: "success" | "error") => void;
};
