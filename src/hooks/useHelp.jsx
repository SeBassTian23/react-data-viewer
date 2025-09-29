import { useDispatch } from "react-redux";
import { showOffcanvas, hideOffcanvas } from "../features/offcanvas.slice";

export default function useHelp() {
  const dispatch = useDispatch();

  return {
    open: (title, url) => dispatch(showOffcanvas({ title, url })),
    close: () => dispatch(hideOffcanvas()),
  };
}