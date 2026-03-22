import dayjs from 'dayjs';
import { addDocument, removeDocByField, resetCollection, getFilteredData } from '../../modules/database';

import cloneDeep from 'lodash/cloneDeep'

const addBookmarkToDB = (store) => {

  const profile = store.getState().user

  const bookmarks = getFilteredData('bookmarks').data({ removeMeta: true });

  let name = bookmarks.filter(itm =>
    itm.name.match(/Bookmark\s\d+$/)
  );

  let n = 0;

  if (name.length > 0) {
    name.map(itm => {
      if (Number(itm.name.split(' ')[1]) > n) {
        n = Number(itm.name.split(' ')[1]);
      }
      return itm;
    });
  }

  // Get the creator's recent profile
  let creator = profile.name? {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar
    } : null

  // Get a copy of the redux store without the bookmarks
  let storeCopy = null
  if (store) {
    storeCopy = cloneDeep(store.getState())
    delete storeCopy.bookmarks;
    delete storeCopy.user;
  }

  // Item saved to database
  const itm = {
    id: crypto.randomUUID(),
    created_at: dayjs().toISOString(),
    name: `Bookmark ${n + 1}`,
    creator,
    store: storeCopy
  }
  
  addDocument(itm, 'bookmarks');
  return itm;
}

export default addBookmarkToDB;

export const deleteBookmarkFromDB = (id) => {
  if(id){
    if( removeDocByField('id', {'$eq': id }, 'bookmarks' ) )
      return true
  }

  return false;
}

export const editBookmarkDB = (id, payload) => {

  if(id){
    if( removeDocByField({'id': {'$eq': id }}) , 'bookmarks' )
      return true
  }

  return false;
}

export const deleteAllBookmarksFromDB = () => {

  resetCollection( 'bookmarks' )

  return true;
}
