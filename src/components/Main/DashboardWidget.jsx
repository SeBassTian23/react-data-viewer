import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import useModalConfirm from "../../hooks/useModalConfirm";

import { useDispatch } from 'react-redux'
import { dashboardResetPanel, dashboardSetPanelSize, dashboardEditTitlePanel } from '../../features/dashboard.slice'

import { widgetSizes } from '../../constants/widget-sizes'
import widgets from "../../constants/widgets"

import copyToClipboard from '../../helpers/clipboard'

import useHelp from "../../hooks/useHelp";

import ErrorBoundary from '../../utils/ErrorBoundary'

function DashboardWidget(props) {

  const dispatch = useDispatch();

  const help = useHelp();
  const modal = useModalConfirm()

  const [changesize, setChangesize] = useState(props.size || widgetSizes.default);
  const [editTitle, setEditTitle] = useState(false);

  const titleRef = useRef()

  const changePanelSize = (id, size) => {
    let sizes = widgetSizes[size] || widgetSizes.default;
    setChangesize(sizes)
    dispatch(dashboardSetPanelSize({ id, size: sizes }))
  }

  const editTitleHandler = (e) => {
    setEditTitle(e);
    if (!e && titleRef.current) {
      dispatch(dashboardEditTitlePanel({ id: props.id, title: titleRef.current.value }));
    }
  }

  const handleReset = useCallback(
    () => dispatch(dashboardResetPanel({ id: props.id })),
    [dispatch, props.id]
  );

  const handleEditTitle = useCallback(
    () => editTitleHandler(true),
    [editTitleHandler]
  );

  const handleDelete = useCallback(() => modal.show("confirm", {
    header: "Delete Panel",
    content: `Are you sure you want to delete the "${props?.content?.title || props.title || "Untitled"}" panel?`,
    yes: "Delete",
    no: "Cancel",
    payload: {
      id: props.id,
      action: "DELETE_PANEL"
    }
  }), [] )

  const handleCopy = useCallback(
    () => copyToClipboard(props.id),
    [props.id]
  );

  useEffect(() => {
    if (titleRef?.current) {
      titleRef.current.focus();
    }
  }, [titleRef, editTitle]);

  useEffect(() => {
    setChangesize(props.size)
  }, [props.size])

  const content = useMemo(() => {
    const config = widgets.find(itm => itm.type == props.type);
    if (!config) return (
      <div className="d-flex flex-column justify-content-center align-items-center p-1 card-body text-muted small">
        <i className="bi bi-window fs-2"></i>
        Unknown or Unsupported Widget
      </div>
    );

    const Component = config.component;
    if (props.type === 'map')
      return <Component key={props.id} id={props.id} {...props.content} title={config.title} darkmode={props.darkmode} size={changesize} />;
    return <Component id={props.id} content={props.content} title={config.title} darkmode={props.darkmode} size={changesize} />;
  }, [props.type, props.id, props.content, props.darkmode, props.size.xl]);

  const handleClickPanelSize = useCallback((e) => {
    const size = e.currentTarget.dataset.size;
    changePanelSize(props.id, size);
  }, [changePanelSize, props.id]);

  const handleClickHelp = useCallback(() => {
    const anchor = widgets.find( itm => itm.type == props.type )?.anchor? "#"+widgets.find( itm => itm.type == props.type ).anchor: ""
    help.open("Help | Dashboard Widgets", "help/md/dashboard.md"+ anchor )
  }, [])

  return (
    <Col xs sm={changesize.sm} md={changesize.md} lg={changesize.lg} xl={changesize.xl} className="px-1 pb-2">
      <Card className='shadow-sm' id={props.id}>
        <Card.Header className="fw-bold d-flex justify-content-between align-items-center" title={props.title || "Untitled"}>
          <i className='bi-grip-vertical' />
          {!editTitle ?
            <div className='w-100 text-truncate'>{props.title || "Untitled"}</div> :
            <Form.Control
              ref={titleRef}
              size={'sm'}
              type="text"
              className='dashboard-title-input'
              onBlur={(e) => editTitleHandler(false)}
              onKeyUp={(e) => e.key === 'Enter' ? editTitleHandler(false) : null} defaultValue={props.title || "Untitled"}
            />
          }
          <Dropdown>
            <Dropdown.Toggle size="sm" variant="outline-secondary" id="dropdown-basic">
              <i className="bi-three-dots-vertical" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {widgets.find(itm => itm.type == props.type)?.showEdit &&
                <Dropdown.Item onClick={handleReset}><i className="bi-pencil-square" /> Edit</Dropdown.Item>
              }
              <Dropdown.Item onClick={handleEditTitle}><i className="bi-input-cursor-text" /> Edit Title</Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}><i className="bi-window-x" /> Delete</Dropdown.Item>
              <Dropdown.Divider />
              {(['map', 'image', 'plot'].indexOf(props.type) === -1) && <>
                <Dropdown.Item onClick={handleCopy}><i className="bi-clipboard" /> Copy</Dropdown.Item>
                <Dropdown.Divider /> </>}
              <Dropdown.Header>Size</Dropdown.Header>
              <Dropdown.Item data-size="md" onClick={handleClickPanelSize}><i className="bi-file" /> Default</Dropdown.Item>
              <Dropdown.Item data-size="lg" onClick={handleClickPanelSize}><i className="bi-textarea-resize" /> Large</Dropdown.Item>
              <Dropdown.Item data-size="xl" onClick={handleClickPanelSize}><i className="bi-aspect-ratio" /> Full Width</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleClickHelp}><i className='bi-question-circle' /> Help</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        <ErrorBoundary>
          {content}
        </ErrorBoundary>
      </Card>
    </Col>
  )
}

export default React.memo(DashboardWidget);