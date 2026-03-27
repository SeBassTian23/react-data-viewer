import { useSelector } from 'react-redux'
import JSZip from "jszip";
import { utils, writeFile } from 'xlsx'

import { selectedThresholds } from '../store/thresholds'

import buildNotebookIPYNB from '../utils/export/jupyter/build-notebook';
import buildNotebookRMD from '../utils/export/rmd/build-notebook';
import useGetFilteredData from './useGetFilteredData';
import useModalConfirm from './useModalConfirm';

import sanitizeToString from '../helpers/sanitizeToString'

export default function useExport() {

  const analysis = useSelector(state => state.analysis)
  const datasubsets = useSelector(state => state.datasubsets)
  const state = useSelector(state => state.dashboard)
  const thresholds = useSelector(selectedThresholds)
  const parameters = useSelector(state => state.parameters)

  const { getFilteredData } = useGetFilteredData()
  const modal = useModalConfirm()

  const show = () => {
    modal.show('export', {})
  }

  const data = () => {
    let data = []
    for (let subset of datasubsets) {

      // get data according to subset filter
      const query = getFilteredData('data', {
        filters: subset.filter
      })

      // get subset data with new column containing subset ID
      const subsetData = query
        .data({ removeMeta: false })
        .map((row) => ({
          "__subsets__": [subset.id],
          ...row
        }))

      // Now build the dataset merging IDs when there is an series overlap
      subsetData.forEach(newRow => {
        const existingIdx = data.findIndex(a => a['$loki'] === newRow['$loki'])
        if (existingIdx === -1) {
          data.push(newRow)
        } else {
          if (!data[existingIdx]['__subsets__'].includes(subset.id)) {
            data[existingIdx]['__subsets__'].push(subset.id)
          }
        }
      });
    }

    // remove the $loki id column
    data.forEach(a => delete a['$loki']);

    if (datasubsets.length == 0)
      data = getFilteredData('data', {}).data({ removeMeta: true }).map((row) => ({
        "__subsets__": ['all'],
        ...row
      }))

    return data;
  }

  const downloadIPYNB = ({dashboard}) => {
    const nb = buildNotebookIPYNB(analysis, dashboard? state : [], thresholds, parameters, datasubsets)
    return downloadNotebook(nb, data(), "ipynb", analysis.saveAs)
  }

  const downloadRMD = ({dashboard}) => {
    const nb = buildNotebookRMD(analysis, dashboard? state : [], thresholds, parameters, datasubsets)
    return downloadNotebook(nb, data(), "rmd", analysis.saveAs)
  }

  const downloadXLSX = () => {
    // Set up sheets
    const wsData = utils.json_to_sheet( data().map( row => {
      for(let key in row){
        if(typeof row[key] === 'object'){
          row[key] = sanitizeToString(row[key])
        }
      }
      return row
    }) )
    const wsSubsets = utils.json_to_sheet( datasubsets.map(itm => {
      return {
        'name': itm.name,
        'color': itm.color,
        'isVisible': itm.isVisible,
        'id': itm.id
      }
    }), { header: ['name', 'color', 'isVisible', 'id'] } )
    const wsThresholds = utils.json_to_sheet( thresholds.map(itm => {
      return {
        'name': itm.name,
        'min': itm.min,
        'max': itm.max
      }
    }), { header: ['name', 'min', 'max'] } )
    const wsAliases = utils.json_to_sheet( parameters.filter( itm => itm.alias ).map(itm => {
      return {
        'name': itm.name,
        'alias': itm.alias
      }
    }), { header: ['name', 'alias'] } )
    // Set up Workbook
    const wb = utils.book_new();

    // add Title
    if(!wb.Props) wb.Props = {};
    wb.Props.Title = analysis.title;
    wb.Props.Subject = "Data Analysis";
    if(analysis?.creator?.name)
      wb.Props.Author = analysis.creator.name;
    wb.Props.Comments = analysis.notes;
    wb.Props.CreatedDate = new Date().toISOString();

    utils.book_append_sheet(wb, wsData, 'Data');
    utils.book_append_sheet(wb, wsSubsets, 'Subsets');
    utils.book_append_sheet(wb, wsThresholds, 'Thresholds');
    utils.book_append_sheet(wb, wsAliases, 'Aliases');
    // Write File
    writeFile(wb, `${analysis.saveAs}.xlsx`);
  }

  return {
    show,
    downloadIPYNB,
    downloadRMD,
    downloadXLSX
  }
}

/**
 * Download generated Notebook
 * 
 * @param {object,string} nb Notebook Content
 * @param {object} data Analysis data
 * @param {string} format export format (ipynb, rmd)
 * @param {string} filename filename for notebook (default= analysis.ipynb )
 * @returns zip file for download
 */
async function downloadNotebook(nb = {}, data= [], format=null, filebasename='analysis') {

  const date = new Date().toISOString().slice(0,10);  
  const filename = `${filebasename}-${date}.zip`
  const zip = new JSZip();

  // dataset
  zip.file(
    "data/dataset.json",
    JSON.stringify(data, null, 0)
  );

  if( format == "ipynb"){
    // notebook
    // TODO: implement nbjson use , lines=True in pandas
    zip.file(
      "notebook.ipynb",
      JSON.stringify(nb, null, 2)
    );
  
    // requirements
    zip.file(
      "requirements.txt",
      "pandas\nnumpy\nmatplotlib\n"
    );
  
    // README
    zip.file(
      "README.md",
      ipynbREADME
    );
  }

  if( format == "rmd"){
    // notebook
    zip.file(
      "notebook.rmd",
      nb
    );
  
    // requirements
    zip.file(
      "packages.txt",
      "dplyr\ntidyr\njsonlite\npurrr\nggplot2\n"
    );
  
    // README
    zip.file(
      "README.md",
      rmdREADME
    );
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url);
}

// Readme content for Jupyter
const ipynbREADME = `# Analysis Export
  
## Setup
pip install -r requirements.txt

## Run
jupyter lab notebook.ipynb
`

// Readme content for Rmd
const rmdREADME = `# Analysis Export

## Setup
Libraries are installed/imported when running the notebook

## Run
Rscript -e "rmarkdown::render('notebook.Rmd')"
`