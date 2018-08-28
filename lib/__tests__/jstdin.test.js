const assert = require('assert');
const execa = require('execa');
const highlight = require('cardinal').highlight;
const jstdin = require('../');
const cli = require('path').resolve(__dirname, '../cli.js');

describe('jstdin', () => {
  it('shows help', () => {
    return execa(`${cli}`, {
      stdio: ['inherit', 'pipe', 'pipe']
    })
      .then(result => {
        assert(result.stdout.match(/\$ jstdin \[code\] \[options\]/));
      })
      .then(() => {
        assert(jstdin() === undefined);
      });
  });

  it('filters json', () => {
    return execa(`${cli}`, ['x => x.name'], {
      input: '{"name": "buster"}'
    })
      .then(result => {
        assert(result.stdout === 'buster');
      })
      .then(() => {
        assert(jstdin({ name: 'buster' }, 'x => x.name') === '"buster"');
      });
  });

  it('formats json', () => {
    return execa(`${cli}`, {
      input: '[{"n":1,"a":{"b":"c"}},{"n":2,"a":{"d":"e"}}]'
    })
      .then(result => {
        assert(result.stdout.match('      "d": "e"'));
      })
      .then(() => {
        assert(
          jstdin('[{"n":1,"a":{"b":"c"}},{"n":2,"a":{"d":"e"}}]', undefined, true).match(
            '      .*"d"'
          )
        );
      });
  });

  it('suppresses formatting json', () => {
    return execa(`${cli}`, ['x => x.map(x => x*2)', '--raw'], {
      input: '[1,2,3]'
    })
      .then(result => {
        assert(result.stdout === '[2,4,6]');
      })
      .then(() => {
        assert(String(jstdin('[1,2,3]', 'x => x.map(x => x*2)', false)) === '[2,4,6]');
      })
      .then(() => {
        assert(jstdin('"hiya"') === '"hiya"');
      });
  });

  it('executes js', () => {
    return execa(`${cli}`, ['2*2'], {
      stdio: ['inherit', 'pipe', 'pipe']
    })
      .then(result => {
        assert(result.stdout === '4');
      })
      .then(() => {
        assert(jstdin(undefined, '2*2', true) === highlight('4'));
        assert(jstdin(undefined, 'x=>"HIYA"') === '"HIYA"');
        assert(jstdin(undefined, 'x=>"HIYA"', true) === highlight('HIYA'));
        assert(jstdin(undefined, 'console.log("testing console.log")') === undefined);
        assert(
          jstdin(undefined, 'x=>console.log("testing console.log, again")') === undefined
        );
        assert(jstdin(3, 'x=>x*x', true) === highlight('9'));
      });
  });

  it('escapes strings', () => {
    return execa(`${cli}`, {
      input: 'hi'
    })
      .then(result => {
        assert(result.stdout === '"hi"');
      })
      .then(() => {
        assert(jstdin('hi', undefined, true) === highlight('"hi"'));
        assert(jstdin('hi', undefined, false) === '"hi"');
        assert(jstdin(undefined, 'hi', true) === highlight('"hi"'));
        assert(jstdin(undefined, 'hi') === '"hi"');
        // Console.log(jstdin(undefined, undefined, true));
        // Assert(jstdin(undefined, undefined, true) === highlight('"undefined"'));
      });
  });
});
