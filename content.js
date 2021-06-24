chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      chrome.storage.sync.get({
        idList: ""
      }, getAllText);
    }
  }
);

function getAllText(storageItems){
  list = storageItems.idList;
  var elementIds = list.split(",");
  console.log(elementIds);
  elementText = elementIds.map(getElementText);
  console.log(elementText);
  makeDoc(elementText);
}

function getElementText(elementId){
  let elementText = $(`#${elementId}`).text();
  console.log("====================");
  console.log(`ID: ${elementId}`);
  console.log($(`#${elementId}`).text());
  console.log("====================");
  return elementText;
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
    saveAs(blob, "example.docx");
    console.log("Document created successfully");
  });
}

function paragraphFromText(text){
  result = new docx.Paragraph({
    children: [
      new docx.TextRun({ text: text, break: 1 }),
    ]
  });
  return result;
}
