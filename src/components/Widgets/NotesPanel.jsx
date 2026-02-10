import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Card from 'react-bootstrap/Card'

import { useDispatch } from 'react-redux'
import { dashboardEditPanel } from '../../features/dashboard.slice'

export default function NotesPanel(props) {

  const notesRef = useRef();

  const [notes, setNotes] = useState(props.content.text)
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch()

  const finishEditing = () => {
    setNotes(notesRef.current.value);
    dispatch(dashboardEditPanel({ id: props.id, content: { text: notesRef.current.value } }));
    setEdit(false);
  }

  useEffect(() => {
    if (notesRef?.current) {
      notesRef.current.focus();
    }
  }, [notesRef, edit]);

  return <Card.Body className={`ps-1 p-0 ${edit? "overflow-hidden" : ""}`} onDoubleClick={() => {setEdit(true);}}>
    {edit? <textarea ref={notesRef} onBlur={finishEditing} defaultValue={notes} /> : 
      <ReactMarkdown 
        classNmae='hasText'
        children={notes}
        remarkPlugins={[remarkGfm]}
        components={{
          blockquote: ({ node, ...props }) => <blockquote className='blockquote' {...props} />,
          table: ({ node, ...props }) => <table className='table table-sm table-w-fit' {...props} />,
        }}
      />
    }
  </Card.Body>
}
