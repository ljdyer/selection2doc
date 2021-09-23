chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      getSelectionText();
    }
  }
);

function getSelectionText(){

  let selectionText = window.getSelection().toString().trim();
  let lines = selectionText.split("\n");

  console.log(lines);
  makeDoc(lines);
}

function makeDoc(allText){
  let paragraphs = allText.map(paragraphFromText);

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: paragraphs
      }
    ]
  });

  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    let filename = generateFilename();
    saveAs(blob, filename);
    console.log("Document created successfully");
  });
}

function paragraphFromText(text){
  result = new docx.Paragraph({
    children: [
      new docx.TextRun({ text: text, break: 0 }),
    ]
  });
  return result;
}

function generateFilename(){
  let docTitle = document.title;
  let filename = `${docTitle.substring(0,10)} ${getFormattedTime()}.docx`;
  return filename;
}

function getFormattedTime(){
  var today = new Date();
  var y = today.getFullYear();
  var m = today.getMonth() + 1; // JavaScript months are 0-based.
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + "-" + m + "-" + d + " " + h + "-" + mi + "-" + s;
}


