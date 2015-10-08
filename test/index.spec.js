import { equal, throws } from 'assert';
import findPort from 'find-port';
import { createReadStream } from 'fs';
import { createServer } from 'http';
import { Server as Files } from 'node-static';
import oboePromise from '../index';

const cwd = process.cwd();
const file = 'package.json';
const noop = () => {};
const staticServer = new Files(cwd);
const server = createServer((req, res) => {
  req.addListener('end', () => staticServer.serve(req, res)).resume();
});

const tests = [
  {
    name: 'xhr',
    source: () => `http://localhost:${server.address().port}/${file}`,
  },
  {
    name: 'stream',
    source: () => createReadStream(file),
  },
];

describe('oboePromise', () => {
  tests.forEach(test => {
    describe(test.name, () => {
      before(() => {
        if (test.name === 'xhr') {
          findPort(8000, 9000, ([port]) => server.listen(port));
        }
      });

      after(() => {
        if (test.name === 'xhr') {
          server.close();
        }
      });

      it('returns promise', () => {
        equal(oboePromise(test.source()).run() instanceof Promise, true);
      });

      it('resolves to result', done => {
        oboePromise(test.source())
          .run()
          .then(result => {
            equal(result.name, 'oboe-promise');
            done();
          }, done)
          .catch(done);
      });

      it('proxies #drop', done => {
        oboePromise(test.source())
          .node('devDependencies', oboePromise.drop)
          .run()
          .then(result => {
            equal(result.devDependencies, undefined);
            done();
          })
          .catch(done);
      });

      it('proxies #node', done => {
        oboePromise(test.source())
          .node('name', name => `node-${name}`)
          .run()
          .then(result => {
            equal(result.name, 'node-oboe-promise');
            done();
          })
          .catch(done);
      });

      it('proxies #on', done => {
        oboePromise(test.source())
          .on('node', 'name', name => `node-${name}`)
          .run()
          .then(result => {
            equal(result.name, 'node-oboe-promise');
            done();
          })
          .catch(done);
      });

      it('proxies #path', done => {
        oboePromise(test.source())
          .path('name', () => done())
          .run()
          .then(noop)
          .catch(done);
      });

      it('stubs #done and throws', () => {
        const fn = () => oboePromise(test.source()).done(noop);
        throws(fn, err => {
          if (err instanceof Error) {
            if (/promise/i.test(err)) {
              return true;
            }
          }
        });
      });

      it('stubs #fail and throws', () => {
        const fn = () => oboePromise(test.source()).fail(noop);
        throws(fn, err => {
          if (err instanceof Error) {
            if (/promise/i.test(err)) {
              return true;
            }
          }
        });
      });
    });
  });
});
