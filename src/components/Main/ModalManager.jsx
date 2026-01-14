import { useSelector, useDispatch } from "react-redux";
import ModalDialogConfirm from "../Dialogs/ModalDialogConfirm";
import { hideModal } from "../../features/modal.slice";

import { deleteBookmarkFromDB, deleteAllBookmarksFromDB } from '../../utils/data/bookmark'

import { dashboardDeletePanel } from '../../features/dashboard.slice'
import { thresholdsReset, thresholdDelete } from '../../features/threshold.slice'
import { datasubsetReset, datasubsetDeleted } from '../../features/datasubset.slice'
import { bookmarksReset, bookmarkDelete } from '../../features/bookmark.slice'

import { useAppReset } from '../../hooks/useAppReset'
import { useApplyBookmark } from "../../hooks/useApplyBookmark";

export default function ModalManager() {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const resetApp = useAppReset();
  const applyBookmark = useApplyBookmark();

  if (!modal.open) return null;

  switch (modal.type) {
    case "confirm":
      return (
        <ModalDialogConfirm
          {...modal.props}
          show={modal.open}
          onHide={(confirmed) => {
            if (confirmed) {
              switch (modal.props?.payload?.action) {

                case "DELETE_PANEL":
                  dispatch(dashboardDeletePanel(modal.props?.payload?.id));
                  break;

                case "DELETE_THRESHOLDS":
                  dispatch(thresholdsReset());
                  break;
                case "DELETE_THRESHOLD":
                  dispatch(thresholdDelete(modal.props?.payload?.id))
                  break;

                case "DELETE_SUBSETS":
                  dispatch(datasubsetReset());
                  break;

                case "DELETE_SUBSET":
                  dispatch(datasubsetDeleted(modal.props?.payload?.id));
                  break;

                case "DELETE_BOOKMARKS":
                  deleteAllBookmarksFromDB();
                  dispatch(bookmarksReset());
                  saveDatabase();
                  break;

                case "DELETE_BOOKMARK":
                  deleteBookmarkFromDB(modal.props?.payload?.id);
                  dispatch(bookmarkDelete(modal.props?.payload?.id));
                  saveDatabase();
                  break;

                case "APPLY_BOOKMARK":
                  applyBookmark(modal.props?.payload?.id)
                  break;

                case "NEW_ANALYSIS":
                  resetApp();
                  break;

                default:
                  console.log('No action found')
              }
            }
            dispatch(hideModal());
          }}
        />
      );
    // add other modal types here...
    default:
      return null;
  }
}
