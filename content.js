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
  let list = storageItems.idList;

  let elementIds = splitAndTrim(list);
  let elementText = elementIds.map(getElementText);
  let elementTextWithBlankLines = intersperse(elementText, "");
  let lines = elementTextWithBlankLines.map(splitByLineBreak).flat();

  console.log(lines);
  makeDoc(lines);
}

function getElementText(elementId){
  let elementText = $(`#${elementId}`).text();
  // console.log("====================");
  // console.log(`ID: ${elementId}`);
  // console.log($(`#${elementId}`).text());
  // console.log("====================");
  return elementText;
}

function splitAndTrim(commaList){
  result = commaList.split(",").map(trimString);
  return result;
}

function splitByLineBreak(text){
  let result = text.split("\n");
  return result;
}

function intersperse(array, seperator){
  console.log(array);
  result = array.flatMap(e => [seperator,e]).slice(1);
  return result;
}

function trimString(string){
  return string.trim();
}



function makeDoc(allText){
  let paragraphs = allText.map(paragraphFromText);
  let charCount = countChars(allText);

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
    let filename = generateFilename(charCount);
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

function countChars(text){
  let charCounts = text.map(removeSpaces).map(getStringLength);
  // console.log(charCounts);
  let totalCharCount = charCounts.reduce((a, b) => a + b, 0);
  return totalCharCount;
}

function removeSpaces(string){
  return string.replace(" ", "");
}

function getStringLength(string){
  return string.length;
}

function generateFilename(charCount){
  let filename = `${document.title} ${getFormattedTime()} (${charCount} characters).docx`;
  return filename;
}

function getFormattedTime(){
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + "-" + m + "-" + d + " " + h + "-" + mi + "-" + s;
}


