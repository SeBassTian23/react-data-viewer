import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'

import Dropdown from 'react-bootstrap/Dropdown'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import GraphPanel from '../Widgets/GraphPanel'
import MapPanel from '../Widgets/MapPanel'
import ImagePanel from '../Widgets/ImagePanel'
import NotesPanel from '../Widgets/NotesPanel'

import ANOVAPanel from '../Widgets/ANOVAPanel'
import FishersExactPanel from '../Widgets/FishersExactPanel'
import ChiSquarePanel from '../Widgets/ChiSquaredPanel'
import SummaryPanel from '../Widgets/SummaryPanel'
import TTestPanel from '../Widgets/TTestPanel'
import BarndardsExactPanel from '../Widgets/BarnardsExactPanel'
import MannWhitneyUPanel from '../Widgets/MannWhitneyUPanel'
import SignPanel from '../Widgets/SignPanel'
import SpearmanCorrelationPanel from '../Widgets/SpearmanCorrelationPanel'
import WilcoxonSignedRankPanel from '../Widgets/WilcoxonSignedRankPanel'
import McNemarPanel from '../Widgets/McNemarPanel'
import KruskalWallisPanel from '../Widgets/KruskalWallisPanel'
import WelchsTTestPanel from '../Widgets/WelchsTTestPanel'
import PearsonCorrelationPanel from '../Widgets/PearsonCorrelationPanel'
import KolmogorovSmirnovPanel from '../Widgets/KolmogorovSmirnovPanel'

import useModal from "../../hooks/useModalConfirm";

import { useDispatch } from 'react-redux'
import { dashboardResetPanel, dashboardSetPanelSize, dashboardEditTitlePanel } from '../../features/dashboard.slice'

import { widgetSizes } from '../../constants/widget-sizes'

import copyToClipboard from '../../helpers/clipboard'

import useHelp from "../../hooks/useHelp";

import ErrorBoundary from '../../utils/ErrorBoundary'

const PANEL_REGISTRY = {
  // Pages
  plot: { component: GraphPanel, title: 'Plot', showEdit: false },
  graph: { component: GraphPanel, title: 'Plot', showEdit: false },
  map: { component: MapPanel, title: 'Map', showEdit: false },
  // General
  notes: { component: NotesPanel, title: 'Notes', showEdit: false },
  image: { component: ImagePanel, title: 'Image', showEdit: false },
  // Statistics
  anova: { component: ANOVAPanel, title: 'ANOVA', showEdit: true },
  chisquared: { component: ChiSquarePanel, title: '𝜒²-Test', showEdit: true },
  fishersexact: { component: FishersExactPanel, title: "Fisher's Exact Test", showEdit: true },
  summary: { component: SummaryPanel, title: 'Summary', showEdit: true },
  ttest: { component: TTestPanel, title: "Student's t-Test", showEdit: true },
  barnardsexact: { component: BarndardsExactPanel, title: "Barnard's Exact Test", showEdit: true },
  mannwhitneyu: { component: MannWhitneyUPanel, title: "Mann-Whitney U Test", showEdit: true },
  sign: { component: SignPanel, title: "Sign Test", showEdit: true },
  spearmancorrelation: { component: SpearmanCorrelationPanel, title: "Spearman Rank Correlation", showEdit: true },
  wilcoxonsignedrank: { component: WilcoxonSignedRankPanel, title: "Wilcoxon Signed Rank Test", showEdit: true },
  mcnemar: { component: McNemarPanel, title: "McNemar's Test", showEdit: true },
  kruskalwallis: { component: KruskalWallisPanel, title: "Kruskal-Wallis Test", showEdit: true },
  welchsttest: { component: WelchsTTestPanel, title: "Welch's t-Test", showEdit: true },
  pearsoncorrelation: { component: PearsonCorrelationPanel, title: "Pearson Correlation", showEdit: true },
  kolmogorovsmirnov: { component: KolmogorovSmirnovPanel, title: "Kolmogorov-Smirnov Test", showEdit: true },
};

function DashboardWidget(props) {

  const dispatch = useDispatch();

  const help = useHelp();
  const modal = useModal()

  const [modalShow, setModalShow] = useState(false);
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
    const config = PANEL_REGISTRY[props.type];
    if (!config) return null;

    const Component = config.component;
    if (props.type === 'map')
      return <Component key={props.id} id={props.id} {...props.content} title={config.title} darkmode={props.darkmode} />;
    return <Component id={props.id} {...props.content} title={config.title} darkmode={props.darkmode} />;
  }, [props.type, props.id, props.content, props.darkmode]);

  const handleClickPanelSize = useCallback((e) => {
    const size = e.currentTarget.dataset.size;
    changePanelSize(props.id, size);
  }, [changePanelSize, props.id]);

  const handleClickHelp = useCallback(() => {
    help.open("Help | Dashboard Widgets", "help/md/dashboard.md")
  }, [])

  return (
    <Col xs sm={changesize.sm} md={changesize.md} lg={changesize.lg} xl={changesize.xl} className="px-1 pb-2">
      <Card className='shadow-sm' id={props.id}>
        <Card.Header className="fw-bold d-flex justify-content-between align-items-center" title={props.title || props.content.title || "Untitled"}>
          <i className='bi-grip-vertical' />
          {!editTitle ?
            <div className='w-100 text-truncate'>{props.title || props.content.title || "Untitled"}</div> :
            <Form.Control
              ref={titleRef}
              size={'sm'}
              type="text"
              className='dashboard-title-input'
              onBlur={(e) => editTitleHandler(false)}
              onKeyUp={(e) => e.key === 'Enter' ? editTitleHandler(false) : null} defaultValue={props.title || props.content.title || "Untitled"}
            />
          }
          <Dropdown>
            <Dropdown.Toggle size="sm" variant="outline-secondary" id="dropdown-basic">
              <i className="bi-three-dots-vertical" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {PANEL_REGISTRY[props.type].showEdit &&
                <Dropdown.Item onClick={handleReset}><i className="bi-pencil-square" /> Edit</Dropdown.Item>
              }
              <Dropdown.Item onClick={handleEditTitle}><i className="bi-input-cursor-text" /> Edit Title</Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}><i className="bi-window-x" /> Delete</Dropdown.Item>
              <Dropdown.Divider />
              {(['map', 'image'].indexOf(props.type) === -1) && <>
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