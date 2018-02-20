#!/usr/bin/env node
'use strict';
const meow = require('meow');
const stdin = require('get-stdin');
const jstdin = require('./');

const cli = meow(
  `
	Usage:

    $ jstdin [code] [options]

	Description:

		executes javascript on the command line like \`node -p\`
		but also accepts data via stdin so long as [code] is wrapped
		with an anonymous function; it also formats output.

	Options:

		-r, --raw   prevent formatting output
		-h, --help  show this usage information

	Examples:

		$ jstdin '2*2'
		4

		$ echo '[1,2,3]' | jstdin 'x => x.map(x => x*2)'
		[
			2,
			4,
			6
		]

		$ echo '[1,2,3]' | jstdin 'x => x.map(x => x*2)' --raw
		[ 2, 4, 6 ]

		$ echo '[{"n":1,"a":{"b":"c"}},{"n":2,"a":{"d":{"e":"f"}}}]' | jstdin'
		[
			{
				"n": 1,
				"a": {
					"b": "c"
				}
			},
			{
				"n": 2,
				"a": {
					"d": "e"
				}
			}
		]
`
);

let doFormatting = !(cli.flags.r || cli.flags.raw);
let code = cli.input[0];

stdin().then(data => {
  code = jstdin(data, code, doFormatting);
  if (code === false) {
    return cli.showHelp(0);
  }
  console.log(code);
});
