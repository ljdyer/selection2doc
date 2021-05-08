chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      chrome.storage.sync.get({
        idList: ""
      }, function(items) {
        var elementText = $('#' + items.idList).eq(0).text();
        makeDoc (elementText);
      });
    }
  }
);

function makeDoc(text1){
  const divider = new docx.TextRun({
    text: "========================================",
    break: 1
  });

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun("Hello World")
            ]
          }),
          new docx.Paragraph({
            children: [divider]
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({text: text1, break: 1}),
            ]
          })
        ]
      }
    ]
  });

  docx.Packer.toBlob(doc).then((blob) => {
    console.log(blob);
    saveAs(blob, "example.docx");
    console.log("Document created successfully");
  });
}
