import { useState, useEffect, useCallback } from 'react'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeToc from 'rehype-toc'
import rehypeSlug from 'rehype-slug'

export default function Documentation(props) {

  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {

    const chapters = [
      { url: "help/md/analysis.md" },
      { url: "help/md/data-import.md" },
      { url: "help/md/dashboard.md" },
      { url: "help/md/plot.md" },
      { url: "help/md/map.md" },
      { url: "help/md/data-filter.md" },
      { url: "help/md/data-subsets.md" },
      { url: "help/md/bookmarks.md" },
      { url: "help/md/aliases.md" },
      { url: "help/md/data-types.md" },
      { url: "help/md/parameters.md" },
      { url: "help/md/spreadsheet.md" },
      { url: "help/md/thresholds.md" },
      { url: "help/md/shortcuts.md" }
    ]

    const fetchChapters = chapters.map(e => {
      return fetch(e.url || '#').then(response => {
        if (response.ok) {
          return response.text();
        }
      })
    });

    Promise.all(fetchChapters).then(responses => {

      let header = `<div class='col py-2 text-center mb-5'>
        <img src="./logo192.png" alt="App Logo" style="max-width: 5rem"></img>
        <span class='d-block display-6 fw-bold text-body-emphasis'>${__APP_NAME__}</span>
        <span class='d-block fw-bold text-muted'>${__APP_DESCRIPTION__}</span>
      </div>`

      setData(header + responses.map((itm, idx) => {
        return '<section>\n\n' + (chapters[idx].title ? `# ${chapters[idx].title}\n\n${itm}` : itm) + '\n</section>'
      }).join('\n\n---\n\n'));

    }).finally(() => {
      setLoading(false);
    });

  }, [])

  useEffect(() => {
    const container = document.querySelector('#dv-main');
    const toc = document.querySelector('#dv-main .toc');
    container.addEventListener('scroll', () => {
      if (toc && container.scrollTop > (toc.offsetHeight * .6)) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, [loading]);

  const scrollToTop = () => {
    document.querySelector('#dv-main').scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleClickScrollUp = useCallback(scrollToTop, []);

  return (<>
    <Row className='vh-100 align-items-center'>
      {!loading && <Col className='overflow-auto' data-bs-spy='scroll' data-bs-target='.toc' data-bs-smooth-scroll='true'>
        <Row id="dv-docs">
          <div className="col">
            <ReactMarkdown
              children={data}
              remarkPlugins={[remarkGfm]}
              components={{
                blockquote: ({ node, ...props }) => <blockquote className='blockquote' {...props} />,
                table: ({ node, ...props }) => <table className='table table-bordered table-w-fit' {...props} />,
                img: ({ node, ...props }) => <img className='img-fluid' alt="" {...props} />
              }}
              rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeToc, { headings: ["h1", "h2"] }]]}
            />
          </div>
        </Row>
        {showTopBtn && <Button className=' scrollup' onClick={handleClickScrollUp}><i className='bi bi-chevron-up' /></Button>}
      </Col>}
      {loading && <Col className='text-center'>
        Loading Documentation…
      </Col>}
    </Row>
  </>)

}