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
const Plugin = extism_pdk.Plugin;
const http = extism_pdk.http;

pub fn main() void {}
const allocator = std.heap.wasm_allocator;

// define some type to write as output from the plugin back to the host
const Output = struct {
    count: i32,
    config: []const u8,
    a: []const u8,
};

export fn count_vowels() i32 {
    const plugin = Plugin.init(allocator);
    plugin.log(.Debug, "plugin start");
    const input = plugin.getInput() catch unreachable;
    defer allocator.free(input);
    plugin.log(.Debug, "plugin input");
    var count: i32 = 0;
    for (input) |char| {
        switch (char) {
            'A', 'I', 'E', 'O', 'U', 'a', 'e', 'i', 'o', 'u' => count += 1,
            else => {},
        }
    }

    // use persistent variables owned by a plugin instance (stored in-memory between function calls)
    var var_a_optional = plugin.getVar("a") catch unreachable;
    plugin.log(.Debug, "plugin var get");

    if (var_a_optional == null) {
        plugin.setVar("a", "this is var a");
        plugin.log(.Debug, "plugin var set");
    } else {
        allocator.free(var_a_optional.?);
    }
    const var_a = plugin.getVar("a") catch unreachable orelse "";
    defer allocator.free(var_a);

    // access host-provided configuration (key/value)
    const thing = plugin.getConfig("thing") catch unreachable orelse "<unset by host>";
    plugin.log(.Debug, "plugin config get");

    const data = Output{ .count = count, .config = thing, .a = var_a };
    const output = std.json.stringifyAlloc(allocator, data, .{}) catch unreachable;
    defer allocator.free(output);
    plugin.log(.Debug, "plugin json encoding");

    // write the plugin data back to the host
    plugin.output(output);
    plugin.log(.Debug, "plugin output");

    return 0;
}

export fn make_http_request() i32 {
    const plugin = Plugin.init(allocator);
    // create an HTTP request via Extism built-in function (doesn't require WASI)
    var req = http.HttpRequest.init(allocator, "GET", "https://jsonplaceholder.typicode.com/todos/1");
    defer req.deinit();

    // set headers on the request object
    req.setHeader("some-name", "some-value") catch unreachable;
    req.setHeader("another", "again") catch unreachable;

    // make the request and get the response back
    const res = plugin.request(req) catch unreachable;
    defer res.deinit();

    // `outputMemory` provides a zero-copy way to write plugin data back to the host
    plugin.outputMemory(res.memory);

    return 0;
}
```
