@import 'common.js';
@import 'symbolfunctions.js';
@import 'artboardfunctions.js';
const {toArray} = require('util');

// called from plug-in menu
var _addCurrentDate = function(context) {
  const doc = context.document;
  let summary = [];
  if (checkDateSetup(doc, summary) !== undefined) {
    addCurrentDate(context, summary);
  }
  displaySummary(doc, summary);
}

//======================================================

function addCurrentDate(context, summary) {
  const doc = context.document;
  const page = doc.currentPage();
  let artboards = toArray(page.layers()).filter(item => item.class() === MSArtboardGroup);
  let datesAdded = 0;
  for (const artboard of artboards) {
    instances = toArray(artboard.children()).filter(item => item.class() === MSSymbolInstance);
    for (const instance of instances) {
      if (setCurrentDate(instance, '<currentDate>') !== undefined) {
        datesAdded++;
      }
    }
  }
  // summary
  summary.push(`${datesAdded} dates updated`);
}

function setCurrentDate(instance, overrideName) {
  let template = originalTemplate = getDefaultOverrideText(instance, overrideName);
  if (template !== undefined) {
    const today = new Date();
    const d = today.getDate();
    const m = today.getMonth(); //January is 0
    const y = today.getFullYear();
    const longMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m];
    // using month abbreviations from writing style guide, rather than just first 3 letters.
    const shortMonth = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'][m];

    // comments below assume date of 1/3/2019
    template = template.replace('[MMMM]', longMonth); // January
    template = template.replace('[MMM]', shortMonth); // Jan
    template = template.replace('[MM]', '0'.concat(m + 1).slice(-2)); // 01
    template = template.replace('[M]', m + 1); // 1
    template = template.replace(['[DDD]'], addOrdinalIndicator(d)); // 3rd
    template = template.replace(['[DD]'], '0'.concat(d).slice(-2)); // 03
    template = template.replace('[D]', d); // 3
    template = template.replace('[YYYY]', y); // 2019
    template = template.replace('[YY]', y.toString().slice(-2)); // 19

    if (template == originalTemplate) {
      // no template specified, so return date in MM/DD/YYYY format
      template = `${'0'.concat(m + 1).slice(-2)}/${'0'.concat(d).slice(-2)}/${y}`;
    }
    return setOverrideText(instance, overrideName, template);
  }
  return undefined;
}

function addOrdinalIndicator(num) {
  lastNum = num.toString().slice(-1);
  if (lastNum == '1') {
    return `${num}st`;
  } else if (lastNum == '2') {
    return `${num}nd`;
  } else if (lastNum == '3') {
    return `${num}rd`;
  } else {
    return `${num}th`;
  }
}

// make sure user is set up for current date
function checkDateSetup(doc, summary) {
  const curDate = symbolMasterWithOverrideName(doc, '<currentDate>');
  if (curDate === undefined) {
    summary.push('[ERROR]Update dates: No symbol with override <currentDate> found.');
    return undefined;
  }
  return 'success';
}
