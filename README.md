# torture

Visualise *concurrent* requests to a particular URL.

Made as [stress testing][1] instrumentation for [Bitpaper's][2] Event Sourcing
architecture but you can use it with any URL.

![Screenshot of Torture tool in action](https://i.imgur.com/WgFKGYd.png)

## Why?

To effectively stress test network requests you need to do so via
dispersed geographical locations. A single location/Internet connection simply
doesn't have enough bandwidth.

Deploy this to a couple of geographically dispersed servers and torture your
endpoint.

## Usage

```bash
# clone
$ git clone https://github.com/TheProfs/torture.git

# Instal deps.
$ npm install

# run
$ npm start
```

Open your browser at: http://localhost:3001, enter your URL and the number
of concurrent request you want to fire.

## Tests

This was built as throwaway code. Hence no tests.

## Authors

- [The Profs][3]


## License

> Copyright (c) 2017 The Profs LTD

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[1]: https://en.wikipedia.org/wiki/Stress_testing
[2]: https://bitpaper.io
[3]: https://github.com/TheProfs
[4]: https://github.com/TheProfs
