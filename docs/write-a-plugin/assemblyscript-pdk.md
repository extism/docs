---
title: AssemblyScript
sidebar_position: 4
---

## How to install and use the Extism AssemblyScript PDK

### Installation

```sh
npm install @extism/as-pdk
```

### Compiling to WebAssembly

Use the AssemblyScript compiler, `asc`:

```sh
npx asc example.ts --outFile example.wasm --use abort=example/myAbort
```

### Example Usage

```typescript title=example.ts
import { Host } from '@extism/as-pdk';

function myAbort(
  message: string | null,
  fileName: string | null,
  lineNumber: u32,
  columnNumber: u32
): void { }

export function count_vowels(): i32 {
  let host = new Host();
  let str = host.inputString();
  var count = 0;
  for (var i = 0; i < str.length; i++) {
    let x: string = str[i];
    if (x == 'a' || x == 'A' ||
      x == 'e' || x == 'E' ||
      x == 'i' || x == 'I' ||
      x == 'o' || x == 'O' ||
      x == 'u' || x == 'U') {
      count += 1;
    }
  }

  // Additional plug-in APIs:

  // persistent variables (scoped to individual plugin)
  const vars = host.vars()
  var a = Uint8Array.wrap(String.UTF8.encode("this is var a"))
  vars.set('a', a);
  
  let data = vars.get('a');
  let var_a = (data == null) ? "null" : String.UTF8.decode(data.value.buffer);

  // config, provided by the host
  const thing = host.config("thing");

  // write data back to host for use in program
  var out = '{"count": ' + count.toString() + ', "config": "' + (thing == null ? "null" : thing.value) + '", "a": "' + var_a + '"}';
  host.outputString(out);

  return 0;
}
```