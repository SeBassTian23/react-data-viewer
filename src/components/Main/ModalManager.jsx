import { useSelector, useDispatch } from "react-redux";
import ModalDialogConfirm from "../Dialogs/ModalDialogConfirm";
import ModalDialogBusy from "../Dialogs/ModalDialogBusy";
import { hideModal } from "../../features/modal.slice";

import { deleteBookmarkFromDB, deleteAllBookmarksFromDB } from '../../utils/data/bookmark'

import { dashboardDeletePanel, dashboardReset } from '../../features/dashboard.slice'
import { thresholdsReset, thresholdDelete } from '../../features/threshold.slice'
import { datasubsetReset, datasubsetDeleted } from '../../features/datasubset.slice'
import { bookmarksReset, bookmarkDelete } from '../../features/bookmark.slice'
import { flagReset } from '../../features/flag.slice'

import { useAppReset } from '../../hooks/useAppReset'
import { useApplyBookmark } from "../../hooks/useApplyBookmark";
import useFlagData from "../../hooks/useFlagData";
import { useAddBookmark } from '../../hooks/useAddBookmark';

import { saveDatabase, setFilename, resetCollection } from '../../modules/database'

import opfs from '../../modules/opfs'

import Form from 'react-bootstrap/Form'
import { useForm } from 'react-hook-form';

export default function ModalManager() {

  const parameters = useSelector((state) => state.parameters);
  const modal = useSelector((state) => state.modal);
  
  const dispatch = useDispatch();
  const {register, setValue, getValues} = useForm();

  const resetApp = useAppReset();
  const applyBookmark = useApplyBookmark();
  const flagData = useFlagData();
   const addBookmark = useAddBookmark();

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

                case "DELETE_PANELS":
                  addBookmark();
                  dispatch(dashboardReset());
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
                  setFilename('loki.db');
                  break;

                case "DELETE_CACHED_ANALYSES":
                  if(opfs.isSupported()){
                    opfs.clearStorage().then(()=>saveDatabase());
                  }
                  break;
                case "DELETE_CACHED_ANALYSIS":
                  if(opfs.isSupported() && modal.props?.payload?.filename){
                    const f = modal.props?.payload?.filename
                    opfs.fileRemove(f).then( () => opfs.fileRemove(f.slice(0,-3) + '.json', true) )
                  }
                  break;
                case "DELETE_FLAGS":
                  resetCollection('flags');
                  saveDatabase();
                  dispatch(flagReset());
                  break;
                default:
                  console.log('No action found')
              }
            }
            dispatch(hideModal());
          }}
        />
      );
    case "busy":
      return (
        <ModalDialogBusy
          {...modal.props}
          show={modal.open}
        />
      );
    case "flag":
      return (
        <ModalDialogConfirm
          {...modal.props}
          header= "Flag Selected Data"
          children= {<>
            <Form.Control as="input" className="mt-3" placeholder="Reason for flagging" {...register("comment")} size='sm' list="floatingTextinput" />
            <datalist id="floatingTextinput">
              {[].map((itm, idx) => (
                <option key={idx} value={itm} />
              ))}
            </datalist>
            <Form.Select size="sm" className="mt-3" {...register("parameter")}>
              { parameters.map( (itm, idx) => <option value={itm.id} key={idx}>{itm.alias || itm.name}</option> )}
            </Form.Select>
          </>}
          show={() => {
            modal.open;
            setValue('parameter', parameters[0]?.id, {shouldTouch: true})
            setValue('comment', '', {shouldTouch: true})
            }
          }
          onHide={(confirmed) => {
            if (confirmed) {
              const ids = modal.props?.payload?.ids
              if(ids !== undefined && Array.isArray(ids)){
                const comment = getValues().comment
                const parameter = getValues().parameter

                flagData.addFlags(ids, parameter, comment)
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
