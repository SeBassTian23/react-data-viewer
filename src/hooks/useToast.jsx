import { useDispatch } from "react-redux";
import { addToast } from "../features/toast.slice";

export default function useToast() {
  const dispatch = useDispatch();

  return {
    info: (msg, header, icon, timeout) => dispatch(addToast(msg, "info", header, icon, timeout)),
    success: (msg, header, icon, timeout) => dispatch(addToast(msg, "success", header, icon, timeout)),
    error: (msg, header, icon, timeout) => dispatch(addToast(msg, "danger", header, icon, timeout)),
    warning: (msg, header, icon, timeout) => dispatch(addToast(msg, "warning", header, icon, timeout)),
  };
}
