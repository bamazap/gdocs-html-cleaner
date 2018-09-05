const { ArgumentParser } = require("argparse");

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
parser.addArgument(
  'outfile',
  {
    help: 'Output HTML file',
  },
);

const args = parser.parseArgs();
