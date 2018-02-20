const assert = require('assert');
const execa = require('execa');
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
        assert(jstdin() === false);
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
        assert(jstdin('{"name": "buster"}', 'x => x.name') === 'buster');
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
        assert(result.stdout === '[ 2, 4, 6 ]');
      })
      .then(() => {
        assert(
          String(jstdin('[1,2,3]', 'x => x.map(x => x*2)', false)) === String([2, 4, 6])
        );
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
        assert(jstdin(null, '2*2', false) === 4);
      });
  });
});
