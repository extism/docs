---
title: JavaScript
sidebar_position: 2
---

## How to install and use the Extism JS PDK

### Installation

We have released binaries of the compiler. Check the [releases](https://github.com/extism/js-pdk/releases) page for the latest.

:::note

Windows is not currently a supported platform, only mac and linux

:::

You can use this script as an easy way to install:

```
curl -O https://raw.githubusercontent.com/extism/js-pdk/main/install.sh
sh install.sh
```

### Compiling

Try it on a script file. Name this `script.js`:

:::note CJS vs ESM

You must use [CJS Module syntax](https://nodejs.org/api/modules.html#modules-commonjs-modules) when not using a bundler.

:::


```javascript
// script.js

const VOWELS = [
    'a', 'e', 'i', 'o', 'u',
]

function count_vowels() {
    let input = Host.inputString()
    let count = 0
    for (let i = 0; i < input.length; i++) {
        if (VOWELS.includes(input[i].toLowerCase())) {
            count += 1
        }
    }
    Host.outputString(JSON.stringify({count}))
}

module.exports = {count_vowels}
```

```bash
extism-js script.js -o count_vowels.wasm
extism call count_vowels.wasm count_vowels --input="Hello World!" --wasi
# => {"count":3}
```

### Bundling and Typescript Support

See the [extism-js README](https://github.com/extism/js-pdk#using-with-a-bundler) for advanced options.

