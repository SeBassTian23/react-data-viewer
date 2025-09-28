export default function copyToClipboard(id) {

  if(document.querySelector(`[id="${id}"] img`)){
    const img = document.querySelector(`[id="${id}"] img`).src;
    fetch(img).then(r => {
      navigator.clipboard.write([new ClipboardItem({'image/png': r.blob()})]);
    });
  }
  // else if(document.querySelector(`[id="${id}"] canvas`)){
  //   const canvas = document.querySelector(`[id="${id}"] canvas`);
  //   canvas.drawImage()
  //   const img = canvas.toDataURL("image/png");
  //   fetch(img).then(r => {
  //     navigator.clipboard.write([new ClipboardItem({'image/png': r.blob()})]);
  //   });
  // }
  else if (document.querySelector(`[id="${id}"] table`)){
    const tables = document.querySelectorAll(`[id="${id}"] table`);
    let txt = [];
    tables.forEach( e => txt.push(formatTableAsText(e)))
    navigator.clipboard.writeText( txt.join("\n\n") );
  }
  else{
    const txt = document.querySelector(`[id="${id}"] .card-body`).textContent;
    navigator.clipboard.writeText( txt );
  }
}

// Helper function to convert table to text
function formatTableAsText(table) {
  let text = '';

  // Loop through each row
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    
    // Loop through each cell in row
    for (let j = 0; j < row.cells.length; j++) {
      
      // Add cell text with padding
      let cellText = row.cells[j].textContent;
      cellText = cellText.padEnd(15);
      text += cellText;
    }
    
    // Add newline after each row
    text += '\n';
  }

  return text;
}