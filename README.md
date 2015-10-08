# oboe-promise

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]

> Oboe.js with promises

## Install

    npm install --save oboe-promise

## Usage

The API is almost similar to [original][oboe-api]. Replace `done` with `then` and `fail` with `catch` and put `run()` before them.

```js
import oboe from 'oboe-promise';

// { "apple": "banana", "foo": "bar" }
oboe('http://example.com/data.json')
	.node('foo', foo => 'baz')
	.node('apple', oboe.drop)
	.run()
	.then(console.log); // { foo: 'baz' }
```

## Thanks

Scaffolded with the help of awesome [`tiny-es-nm`][tiny-es-nm] generator.

## License

MIT © [Leonard Kinday](http://leonard.kinday.ru)

[npm-url]: https://npmjs.org/package/oboe-promise
[npm-image]: https://img.shields.io/npm/v/oboe-promise.svg?style=flat-square

[travis-url]: https://travis-ci.org/kinday/oboe-promise
[travis-image]: https://img.shields.io/travis/kinday/oboe-promise.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/kinday/oboe-promise
[coveralls-image]: https://img.shields.io/coveralls/kinday/oboe-promise.svg?style=flat-square

[depstat-url]: https://david-dm.org/kinday/oboe-promise
[depstat-image]: https://david-dm.org/kinday/oboe-promise.svg?style=flat-square

[oboe-api]: http://oboejs.com/api
[tiny-es-nm]: http://npmjs.com/package/generator-tiny-es-nm
