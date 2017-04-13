function savePng() {
  var node = document.getElementById('text');
  var docEl = node.children[0]

  domtoimage.toBlob(docEl)
    .then(function (blob) {
      window.saveAs(blob, 'legal-doc.png');
    })
}

/* HTML to Microsoft Word Export Demo 
* This code demonstrates how to export an html element to Microsoft Word
* with CSS styles to set page orientation and paper size.
* Tested with Word 2010, 2013 and FireFox, Chrome, Opera, IE10-11
* Fails in legacy browsers (IE<10) that lack window.Blob object
*/
function saveDoc() {

  if (!window.Blob) {
    alert('Your legacy browser does not support this action.');
    return;
  }

  var html, link, blob, url, css;

  // EU A4 use: size: 841.95pt 595.35pt;
  // US Letter use: size:11.0in 8.5in;

  css = (
   '<style>' +
   '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: portrait;}' +
   'div.WordSection1 {page: WordSection1;}' +
   'h1 {font-family: "Times New Roman", Georgia, Serif; font-size: 16pt;}' +
   'p {font-family: "Times New Roman", Georgia, Serif; font-size: 14pt;}' +
   '</style>'
  );

  var rightAligned = document.getElementsByClassName("sm-align-right");
  for (var i=0, max=rightAligned.length; i < max; i++) {
    rightAligned[i].style = "text-align: right;"
  }

  var centerAligned = document.getElementsByClassName("sm-align-center");
  for (var i=0, max=centerAligned.length; i < max; i++) {
    centerAligned[i].style = "text-align: center;"
  }

  html = document.getElementById('text').innerHTML;
  html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><title>Legal document</title><xml><w:worddocument xmlns:w="#unknown"><w:view>Print</w:view><w:zoom>90</w:zoom><w:donotoptimizeforbrowser /></w:worddocument></xml></head><body lang=RU-ru style="tab-interval:.5in"><div class="Section1">' + html + '</div></body></html>'

  blob = new Blob(['\ufeff', css + html], {
    type: 'application/msword'
  });
  url = URL.createObjectURL(blob);
  link = document.createElement('A');
  link.href = url;
  // Set default file name.
  // Word will append file extension - do not add an extension here.
  link.download = 'LegalDoc';   
  document.body.appendChild(link);
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob( blob, 'legal-doc.doc'); // IE10-11
  } else {
    link.click();  // other browsers
  }
  document.body.removeChild(link);
};