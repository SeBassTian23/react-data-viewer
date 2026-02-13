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
  const [activeId, setActiveId] = useState('');

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

      let header = `<div class='col py-2 text-center mb-5 intro'>
        <img src="./logo192.png" alt="App Logo" style="max-width: 15rem">
        <span class='d-block display-6 fw-bold text-body-emphasis'>${__APP_NAME__}</span>
        <span class='d-block fw-bold text-muted'>${__APP_DESCRIPTION__}</span>
        <small class='d-block text-muted'>v${__APP_VERSION__}</small>
      </div>`

      setData(header + responses.map((itm, idx) => {
        return '<section>\n\n' + (chapters[idx].title ? `# ${chapters[idx].title}\n\n${itm}` : itm) + '\n</section>'
      }).join('\n\n---\n\n'));

    }).finally(() => {
      setLoading(false);
    });

  }, [])

  // Scroll Spy for Return to Top Button
  useEffect(() => {
    const container = document.querySelector('#dv-docs');

    if (!container) return;

    const handleScroll = () => {
      const content = document.querySelector('#dv-docs-content');
      if (content && container.scrollTop > (content.offsetHeight * .1) || container.scrollTop > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Call once on mount to set initial active heading
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading]);

  // Rearange elements once loading has been completed
  useEffect(() => {
    const toc = document.querySelector('#dv-main .toc');
    const intro = document.querySelector('#dv-docs .intro');
    const content = document.querySelector('#dv-docs-content');
    const main = document.querySelector('#dv-docs');

    if (!loading && toc && intro && main && content) {
      main.insertBefore(intro, content)
      main.insertBefore(toc, content)
    }
  }, [loading])

  // Scroll Spy for TOC
  useEffect(() => {
    const container = document.querySelector('#dv-docs');

    if (!container) return;

    const handleScroll = () => {
      const headings = Array.from(document.querySelectorAll('h1, h2'));
      let current = '';

      headings.some((heading) => {
        const rect = heading.getBoundingClientRect();
        // Adjust 100 based on your header height or preference
        if (rect.top <= 10) {
          current = heading.id;
          setActiveId(current);
          return
        }
        return
      });
    };

    container.addEventListener('scroll', handleScroll);
    // Call once on mount to set initial active heading
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [loading]); // Re-attach when loading changes

  // Update TOC based on visible content element
  useEffect(() => {
    const updateTocLinks = () => {
      const tocLinks = document.querySelectorAll('.toc a');
      tocLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const anchorId = href.slice(1);

        if (activeId === anchorId) {
          link.classList.add('active');
          if (!isElementFullyVisible(link))
            link.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'  // 'start', 'center', 'end', 'nearest'
            });
        } else {
          link.classList.remove('active');
        }
      });
    };

    function isElementFullyVisible(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight
      );
    }

    updateTocLinks();
  }, [activeId]); // Update whenever activeId changes

  const handleClickScrollUp = useCallback(() => {
    document.querySelector('#dv-docs').scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (<>
    <Row className='vh-100 align-items-center'>
      {!loading && <Col className='overflow-auto' id="dv-docs">
        <div id="dv-docs-content">
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
        {showTopBtn && <Button className='scrollup' onClick={handleClickScrollUp}><i className='bi bi-chevron-up' /></Button>}
      </Col>}
      {loading && <Col className='text-center'>
        Loading Documentation…
      </Col>}
    </Row>
  </>)

}