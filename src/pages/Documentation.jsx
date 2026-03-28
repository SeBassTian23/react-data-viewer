import { useState, useEffect, useCallback } from 'react'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeToc from 'rehype-toc'
import rehypeSlug from 'rehype-slug'
import rehypeCallouts from 'rehype-callouts'

import chapters from '../constants/documentation'

function isElementFullyVisible(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.bottom <= window.innerHeight;
}

export default function Documentation(props) {

  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {

    const fetchChapters = chapters.map(e => {
      return fetch(e.url || '#').then(response => {
        if (response.ok) {
          return response.text();
        }
      })
    });

    Promise.all(fetchChapters).then(responses => {

      // Build-time constants: __APP_NAME__, __APP_DESCRIPTION__, __APP_VERSION__
      // are injected by the bundler (e.g. Vite define or webpack DefinePlugin)
      const header = `<div class='col py-2 text-center mb-5 intro'>
        <img src="./react-data-viewer.svg" alt="App Logo" style="max-width: 15rem">
        <span class='d-block display-6 fw-bold text-body-emphasis'>${__APP_NAME__}</span>
        <span class='d-block fw-bold text-body-secondary'>${__APP_DESCRIPTION__}</span>
        <small class='d-block text-body-secondary'>v${__APP_VERSION__}</small>
      </div>`

      setData(header + responses.map((itm, idx) => {
        return '<section>\n\n' + (chapters[idx].title ? `# ${chapters[idx].title}\n\n${itm}` : itm) + '\n</section>'
      }).join('\n\n---\n\n'));

    }).finally(() => {
      setLoading(false);
    });

  }, [])

  // Merged scroll handler: return-to-top visibility + TOC scroll spy
  useEffect(() => {
    const container = document.querySelector('#dv-docs');

    if (!container) return;

    const handleScroll = () => {
      // --- Return to top button ---
      const content = document.querySelector('#dv-docs-content');
      if ((content && container.scrollTop > content.offsetHeight * 0.1) || container.scrollTop > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

      // --- TOC scroll spy ---
      const headings = Array.from(document.querySelectorAll('h1, h2'));
      const active = headings.reduce((last, heading) => {
        return heading.getBoundingClientRect().top <= 10 ? heading : last;
      }, null);

      if (active) setActiveId(active.id);

    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // set initial state on mount

    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // Rearrange TOC and intro elements once loading has completed
  useEffect(() => {
    const toc = document.querySelector('#dv-main .toc');
    const intro = document.querySelector('#dv-docs .intro');
    const content = document.querySelector('#dv-docs-content');
    const main = document.querySelector('#dv-docs');

    if (!loading && toc && intro && main && content) {
      main.insertBefore(intro, content);
      main.insertBefore(toc, content);
    }
  }, [loading])

  // Update TOC link highlight based on active heading
  useEffect(() => {
    const tocLinks = document.querySelectorAll('.toc a');

    tocLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const anchorId = href.slice(1);

      if (activeId === anchorId) {
        link.classList.add('active');
        if (!isElementFullyVisible(link)) {
          link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        link.classList.remove('active');
      }
    });
  }, [activeId]);

  const handleClickScrollUp = useCallback(() => {
    document.querySelector('#dv-docs').scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <Row className='vh-100 align-items-center'>
      {!loading && (
        <Col className='overflow-auto' id="dv-docs">
          <div id="dv-docs-content">
            <ReactMarkdown
              children={data}
              remarkPlugins={[remarkGfm]}
              components={{
                blockquote: ({ node, ...props }) => <blockquote className='blockquote' {...props} />,
                table: ({ node, ...props }) => <div className='table-responsive'><table className='table table-bordered' {...props} /></div>,
                img: ({ node, ...props }) => <img className='img-fluid' alt={props.alt || ""} {...props} />
              }}
              rehypePlugins={[
                rehypeRaw,
                rehypeSlug,
                [rehypeToc, { headings: ["h1", "h2"] }],
                [rehypeCallouts, { showIndicator: false }]
              ]}
            />
          </div>
          {showTopBtn && (
            <Button className='scrollup' onClick={handleClickScrollUp} aria-label='Scroll to top'>
              <i className='bi bi-chevron-up' />
            </Button>
          )}
        </Col>
      )}
      {loading && (
        <Col className='text-center'>
          Loading Documentation…
        </Col>
      )}
    </Row>
  );
}