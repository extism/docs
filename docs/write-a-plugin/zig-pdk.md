---
title: Zig
sidebar_position: 6
---

## How to install and use the Extism Zig PDK

### Installation

#### via [`gyro`](https://github.com/mattnite/gyro)

```sh
gyro add --src github extism/zig-pdk
```

#### via [`zigmod`](https://github.com/nektro/zigmod)

```yaml title=zigmod.yml
name: my-plugin
main: src/main.zig
license: None
description: None
root_dependencies:
  - src: git https://github.com/extism/zig-pdk
```

#### via `build.zig`

First, clone the `extism-pdk` library into a local project directory:

```sh
mkdir -p libs
cd libs
git clone https://github.com/extism/zig-pdk
```

Then, update your `build.zig`:

```zig title=build.zig
exe.addPackagePath("extism-pdk", "libs/zig-pdk/src/main.zig");
```

And import it into your program:

```zig title=plugin.zig
const extism_pdk = @import("extism-pdk");
const plugin = extism_pdk.Plugin;
const http = extism_pdk.http;
// ...
```

### Compiling to WebAssembly

Since WebAssembly is probably the only target for your Extism plug-in, add this to your
`build.zig`:

```zig title=build.zig
const target = b.standardTargetOptions(.{ .default_target = .{ .cpu_arch = .wasm32, .os_tag = .freestanding } });
```

Then simply run: 

```sh
zig build
```

### Example Usage
```zig title=plugin.zig
const std = @import("std");
const extism_pdk = @import("extism-pdk");
const pdk = extism_pdk.Plugin;
const http = extism_pdk.http;

pub fn main() void {}
const allocator = std.heap.wasm_allocator;

export fn count_vowels() i32 {
    const plugin = pdk.init(allocator);
    const input = plugin.getInput() catch unreachable;
    defer allocator.free(input);
    var count: i32 = 0;
    for (input) |char| {
        switch (char) {
            'A', 'I', 'E', 'O', 'U', 'a', 'e', 'i', 'o', 'u' => count += 1,
            else => {},
        }
    }
    var var_a_optional = plugin.getVar("a") catch unreachable;
    if (var_a_optional == null) {
        plugin.setVar("a", "this is var a");
    } else {
        allocator.free(var_a_optional.?);
    }
    const var_a = plugin.getVar("a") catch unreachable orelse "";
    defer allocator.free(var_a);

    const thing = plugin.getConfig("thing") catch unreachable orelse "<unset by host>";

    const output = std.fmt.allocPrint(allocator, "{{\"count\": {d}, \"config\": \"{s}\", \"a\": \"{s}\"}}", .{ count, thing, var_a }) catch unreachable;
    defer allocator.free(output);

    plugin.output(output);

    return 0;
}

export fn make_http_request() i32 {
    const plugin = pdk.init(allocator);
    var req = http.HttpRequest.init(allocator, "GET", "https://jsonplaceholder.typicode.com/todos/1");
    req.setHeader("some-name", "some-value") catch unreachable;
    req.setHeader("another", "again") catch unreachable;

    defer req.deinit();
    const res = plugin.request(req) catch unreachable;
    defer res.deinit();

    plugin.outputMemory(res.memory);

    return 0;
}
```
