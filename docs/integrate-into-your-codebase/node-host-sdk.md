---
title: Node
tags:
    - node
    - host sdk
---

# Using the Node Host SDK


:::caution Check your installation

Please be sure you've installed Extism before continuing with this guide.

Visit those docs [here](/docs/install).

:::

### 1. Install the Node library

Install via [npm](https://www.npmjs.com/):
```sh
npm i --save extism
```

Install via `git`:
```sh
# TODO
```

### 2. Import the library and use the APIs

```javascript title=app.js
import { Plugin } from "extism";
import { readFileSync } from "fs";

let wasm = readFileSync("../wasm/code.wasm");
let plugin = new Plugin(wasm);

let buf = plugin.call("count_vowels", process.argv[2] || "this is a test");

console.log(JSON.parse(buf.toString())['count']);
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](#) where the project maintainers and users can help you. Come hang out!

