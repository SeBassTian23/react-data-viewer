import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Placeholder from 'react-bootstrap/Placeholder'
import { startCase } from 'lodash'

export default function HelpOffcanvas(props) {

  const [show, setShow] = useState(props.show || false);
  const Component = props.as || Button

  return (
    <>
      <Component variant={props.variant || null} onClick={() => setShow(true)} className={props.className} style={props.btnstyle || null}>
        <i className='bi-question-circle' /> {props.text}
      </Component>
      <HelpOffcanvasContent {...props} onHide={setShow} show={show} />
    </>
  );
}

export function HelpOffcanvasContent(props) {

  const [title, setTitle] = useState('Help');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.title)
      setTitle(props.title)

    if (props.show && !data) {
      fetch(props.url || '#')
        .then(response => {
          if (response.ok) {
            return response.text();
          }
        })
        .then(data => {
          if (!props.title) {
            // First get the title from the filename
            let filenameTitle = "Help | " + startCase(props.url.split('/').pop().replace('.md', '').split('-').join(' '))
            setTitle(filenameTitle);

            // Now check if there is a h1 (#) title
            // in the markdown code we take the first
            // appearance here
            let splitContent = data.split('\n');
            for (let i in splitContent) {
              if (splitContent[i].match(/^#\s/))
                setTitle("Help | " + splitContent[i].replace('#', "").trim());
              break;
            }

          }
          let splitContent = data.split('\n');
          for (let i in splitContent) {
            if (splitContent[i].match(/^#\s/)) {
              splitContent[i] = ""
              break
            }
          }
          data = splitContent.join('\n')
          setData(data);
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }, [props.show])

  return (
    <>
      <Offcanvas show={props.show} onHide={() => { props.onHide(false) }} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {loading && <>
            <Placeholder as="h4" animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={5} />
              <Placeholder xs={7} /> <Placeholder xs={4} />
              <Placeholder xs={11} />
              <Placeholder xs={4} /> <Placeholder xs={7} />
              <Placeholder xs={5} />
            </Placeholder>
          </>
          }
          {!loading &&
            <ReactMarkdown
              children={data}
              remarkPlugins={[remarkGfm]}
              components={{
                blockquote: ({ node, ...props }) => <blockquote className='blockquote' {...props} />,
                table: ({ node, ...props }) => <table className='table table-bordered' {...props} />,
                img: ({ node, ...props }) => <img className='img-fluid' alt="" {...props} />
              }}
              rehypePlugins={[
                rehypeRaw
              ]}
            />
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
