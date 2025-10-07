import { useDispatch, useStore } from 'react-redux';
import addBookmarkToDB from '../utils/data/bookmark'
import { bookmarkAdd } from '../features/bookmark.slice';
import useToast from "./useToast";

export function useAddBookmark() {

  const store = useStore();
  const dispatch = useDispatch();

  const toast = useToast();

  const addBookmark = () => {
    const bookmark = addBookmarkToDB(store);

    dispatch(bookmarkAdd({
      id: bookmark.id,
      name: bookmark.name,
      created_at: bookmark.created_at,
      dashboard: bookmark.store.dashboard.length,
      datasubsets: bookmark.store.datasubsets.length,
      thresholds: bookmark.store.thresholds.length,
      creator: bookmark.creator
    }))

    toast.info(`Bookmark "${bookmark.name}" created`, "Bookmark", "bi-bookmark-plus")
  }

  return addBookmark
}