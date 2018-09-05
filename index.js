const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const juice = require('juice');
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser({
  version: '1.0.0',
  addHelp: true,
  description: 'Clean up HTML from Google Drive',
});
parser.addArgument(
  'infile',
  {
    help: 'Input HTML file',
  },
);
const args = parser.parseArgs();

const infilePath = path.resolve(args.infile);
const dirtyHTML = fs.readFileSync(infilePath, { encoding: 'utf8' });
const juicyHTML = juice(dirtyHTML);
const $ = cheerio.load(juicyHTML);

const toRemove = [
  'meta',
  'style',
];

const attrToClear = [
  'class',
  'id',
  'style',
];

const textToReplace = {
  '&#xA0;': ' ',
};

for (let hLevel = 5; hLevel >= 0; hLevel -= 1) {
  $(`h${hLevel}`).each((i, elm) => {
    elm.tagName = `h${hLevel + 1}`;
  });
}
$('.title').each((i, elm) => {
  elm.tagName = 'h1';
});

$('h1, h2, h3, h4, h5, h6').find('span').replaceWith(function () {
  return $(this).html();
});

function isBold($elm) {
  return $elm.css('font-weight') === '700';
}

function isItalic($elm) {
  return $elm.css('font-style') === 'italic';
}

$('span').each(function (i, elm) {
  const $span = $(this);
  const italic = isItalic($span);
  const bold = isBold($span);
  if (bold && italic) {
    elm.tagName = 'strong';
    $span.innerHTML = `<em>${$span.html()}</em>`;
  } else if (bold) {
    elm.tagName = 'strong';
  } else if (italic) {
    elm.tagName = 'em';
  } else {
    $span.replaceWith($span.html());
  }
});

toRemove.forEach((selector) => {
  $(selector).remove();
});

attrToClear.forEach((attr) => {
  $('*').removeAttr(attr);
});

let cleanHTML = $('body').html();
Object.entries(textToReplace).forEach(([find, replace]) => {
  cleanHTML = cleanHTML.replace(new RegExp(find, 'g'), replace);
});

// eslint-disable-next-line no-console
console.log(cleanHTML);
