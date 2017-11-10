# babel-plugin-inline-svg

Import raw SVG files into your code, optimising with [SVGO](https://github.com/svg/svgo/), and removing ID namespace conflicts.

## What it do

### 1. Turns `import` statements into inline SVG strings

So this:

```js
import someSvg from 'some-svg.svg';
```

Becomes this:

```js
var someSvg = '<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><title>home</title><path d="M37.6 24.104l-4.145-4.186v-6.389h-3.93v2.416L26.05 12.43a1.456 1.456 0 0 0-2.07 0L12.43 24.104a1.488 1.488 0 0 0 0 2.092c.284.288.658.431 1.031.431h1.733V38h6.517v-8.475h6.608V38h6.517V26.627h1.77v-.006c.36-.01.72-.145.995-.425a1.488 1.488 0 0 0 0-2.092" fill="#191919" fill-rule="evenodd" id="someSvg-someID"/></svg>';
```

So you can do something like this maybe:

```js
import React from 'react';
import someSvg from 'some-svg.svg';

const NaughtyUsage = () => (
  <span
    dangerouslySetInnerHTML={{
      __html: someSvg,
    }}
  />
);
```

### 2. Namespaces `id`’s to prevent conflicts

If you inline a lot of SVGs you might get namespace conflicts, which could well interfere with your CSS and whatnot. This plugin solves that.

So given this simple `cheese.svg` file:

```svg
<svg><circle cx="10" cy="10" r="50" id="someCircle"></circle></svg>
```

Which you then import like so:

```js
import wheelOfCheese from 'cheese.svg';
```

You get the following output:

```js
var wheelOfCheese = '<svg><circle cx="10" cy="10" r="50" id="wheelOfCheese-someCircle"></circle></svg>';
```

If you want to disable this feature, just pass `{cleanupIDs: true}` as a [plugin option](https://github.com/iest/babel-plugin-inline-svg/blob/master/test.js#L30) to SVGO in your .babelrc file.


## Installation

```
npm install --save-dev babel-plugin-inline-svg
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [
    "inline-react-svg"
  ]
}
```

#### Options

- *`ignorePattern`* - A pattern that imports will be tested against to selectively ignore imports.
- *`svgo`* - svgo options. Example .babelrc:

```js

{
  "plugins": [
    [
      "inline-svg",
      {
        "ignorePattern": /ignoreAThing/,
        "svgo": {
          "plugins": [
            {"cleanupIDs": false},
            {
              "removeDoctype": true,
            }
          ]

        }
      }
    ]
  ]
}

```

### Via CLI

```sh
$ babel --plugins inline-react-svg script.js
```

### Via Node API


```javascript
require('babel-core').transform('code', {
  plugins: ['inline-react-svg']
}) // => { code, map, ast };
```

---

Big thanks to [inline-react-svg](https://github.com/kesne/babel-plugin-inline-react-svg), which this project is based on.
