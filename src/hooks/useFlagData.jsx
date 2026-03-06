import { useDispatch } from "react-redux";
import { flagAdd, flagRemove } from "../features/flag.slice";

import useToast from "./useToast";
import useModalConfirm from './useModalConfirm';

import { saveDatabase, addDocument, removeDocByField } from '../modules/database'

export default function useFlagData() {

  const toast = useToast();
  const modal = useModalConfirm();

  const dispatch = useDispatch();

  const addFlags = (id = null, parameter=null, comment="") => {
    if(id && parameter){
      if(Array.isArray(id)){
        addDocument(id.map(itm => {
          return {
            datumId: itm,
            parameter: parameter,
            comment: comment
          }
        }), 'flags');

        dispatch(flagAdd(id))
        
        toast.info(`${id.length} data entries were flagged${comment != ""? ` (${comment})` : ""}`, "Data flagged", "bi-flag-fill");
      }
      else{
        addDocument({
          datumId: id,
          parameter: parameter,
          comment: comment
        }, 'flags');

        dispatch(flagAdd([id]))
    
        toast.info(`Data entry was flagged${comment != ""? ` (${comment})` : ""}`, "Data flagged", "bi-flag-fill");
      }
      saveDatabase();
    }
  }

  const resetFlags = () => {
    modal.show("confirm", {
      header: "Remove Flags",
      content: `Removing "all Flags" from data, cannot be undone.`,
      yes: "Remove",
      no: "Cancel",
      payload: {
        action: "DELETE_FLAGS"
      }
    })
  }

  const removeFlag = async (id) => {
    let res = await removeDocByField('datumId', id, 'flags');
    if(res.success){
      dispatch(flagRemove([id]));
      saveDatabase();
    }
  }

  const dialog = (ids) => {
      modal.show("flag", {
      yes: "Flag",
      no: "Cancel",
      payload: {
        ids
      }
    })
  }

  return {
    addFlags,
    removeFlag,
    resetFlags,
    dialog
  }
}