import { useSelector, useDispatch } from "react-redux";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { removeToast } from "../../features/toast.slice";

export default function ToastManager() {
  const toasts = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  return (
    <ToastContainer className="p-3" position='top-end'>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          // bg={toast.variant}
          onClose={() => dispatch(removeToast(toast.id))}
          delay={toast.timeout}
          autohide
        >
          {toast?.header && <Toast.Header className={`bg-${toast.variant}-subtle`}>
            <i className={`bi ${toast?.icon ? toast.icon : 'bi-app-indicator'} me-2`} />
            <strong className="me-auto">{toast.header}</strong>
          </Toast.Header>}
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}
