/*
 This plug-in assigns the current date to artboards on the current Sketch page.

 To get a date, an artboard needs to include a symbol instance with a text override named '<currentDate>'.
 The name of the symbol instance doesn't matter.

 You can format the date many ways by including a template in the default override text.
 For example [MMM] [DDD], [YYYY] would give you January 3rd, 2019. See code below for template types.
 If there's no template specified, you'll get 1/03/2019.
*/

@import 'common.js';
@import 'symbolfunctions.js';

var onRun = function(context) {
  let thisPage = context.document.currentPage();
  updateArtboards(thisPage);
}

function updateArtboards(page) {
  const startPageNum = 1;
  const currentDateOverrideName = '<currentDate>';
  let artboards = [page artboards];
  let datesAdded = 0;
  for (let i = 0; i < artboards.count(); i++) {
    let artboard = artboards[i];
    layers = artboard.children();
    for (let j = 0; j < layers.count(); j++) {
      let layer = layers[j];
      if (layer.class() === MSSymbolInstance) {
        if (setCurrentDate(layer, currentDateOverrideName) !== undefined) {
          datesAdded++;
        }
      }
    }
  }
  // summary
  const br = String.fromCharCode(13);
  alert('Date updates complete.', `${br}Date instances updated: ${datesAdded}${br}`);
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
