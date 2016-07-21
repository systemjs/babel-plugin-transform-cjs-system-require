# babel-plugin-transform-remap-require

Remaps all occurrences of `require` inside a source script to another identifier.

## Example

**In**

```js
require('test/');
```

**Out**

```js
$__require('test');
```

## Installation

```sh
$ npm install babel-plugin-transform-remap-require
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": [
    ["transform-remap-require", {
      requireName: "require",
      mappedRequireName: "$__require"
    }]
  ]
}
```

### Via CLI

```sh
$ babel --plugins transform-remap-require script.js
```

### Via Node API (Recommended)

```javascript
require("babel-core").transform("code", {
  plugins: [
    ["transform-remap-require", {
      requireName: "require",
      mappedRequireName: "$__require",
      map: function(name) {
        return normalize(name);
      }
    }]
  ]
});
```
