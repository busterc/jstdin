# jstdin [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/busterc/jstdin.svg)](https://greenkeeper.io/)

> a better `node -p` that accepts stdin and can format and highlight output

## Installation

```sh
$ npm install jstdin --global
```

## Usage

```sh
$ jstdin --help

  Usage:

    $ jstdin [code] [options]

  Description:

    executes javascript on the command line like `node -p`
    but also accepts data via stdin so long as [code] is wrapped
    with an anonymous function; it also formats output.

  Options:

    -r, --raw   prevent formatting output
    -h, --help  show this usage information

  Examples:

    # eval and print js (like node -p)
    $ jstdin '2*2'
    4

    # use stdin, process and pretty print
    $ echo '[1,2,3]' | jstdin 'x => x.map(x => x*2)'
    [
      2,
      4,
      6
    ]

    # use stdin, process and do not pretty print
    $ echo '[1,2,3]' | jstdin 'x => x.map(x => x*2)' --raw
    [ 2, 4, 6 ]

    # use stdin and just pretty print
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
```

## Inspiration:

* [`js`](https://www.npmjs.com/package/js)
* [`jq`](https://www.npmjs.com/package/node-jq)
* [`jq.node`](https://www.npmjs.com/package/jq.node)
* [`fx`](https://www.npmjs.com/package/fx)

## License

ISC © [Buster Collings](https://about.me/buster)

[npm-image]: https://badge.fury.io/js/jstdin.svg
[npm-url]: https://npmjs.org/package/jstdin
[travis-image]: https://travis-ci.org/busterc/jstdin.svg?branch=master
[travis-url]: https://travis-ci.org/busterc/jstdin
[daviddm-image]: https://david-dm.org/busterc/jstdin.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/busterc/jstdin
[coveralls-image]: https://coveralls.io/repos/busterc/jstdin/badge.svg
[coveralls-url]: https://coveralls.io/r/busterc/jstdin
