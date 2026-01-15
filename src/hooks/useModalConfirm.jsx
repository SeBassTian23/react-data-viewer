import { useDispatch } from "react-redux";
import { showModal, hideModal } from "../features/modal.slice";

export default function useModalConfirm() {
  const dispatch = useDispatch();

  return {
    show: (type, props = {}) => dispatch(showModal({ type, props })),
    hide: () => dispatch(hideModal()),
  };
}
