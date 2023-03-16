---
title: Zig
tags:
    - zig
    - host sdk
---

# Using the Zig Host SDK

:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the Zig library
**NOTE:** The Zig Host SDK currently tracks the latest Zig version, and does a best-effort job
to stay up-to-date with the language as it changes. Extism will continue to release updates tracking
the `master` branch, so you should use the `dev` build of Zig when using Extism. See the [download](https://ziglang.org/download/) 
page for more information.

Install via `git`:
```sh
# within your Zig project directory:
mkdir -p libs
cd libs
git clone https://github.com/extism/extism.git
```

### 2. Include the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > src/code.wasm
```
:::

```zig title=src/main.zig
const std = @import("std");
const extism = @import("extism");

pub fn main() !void {
    var ctx = extism.Context.init();
    defer ctx.deinit();

    const wasm_file = extism.manifest.WasmFile{ .path = "code.wasm" };
    const manifest = .{ .wasm = &[_]extism.manifest.Wasm{.{ .wasm_file = wasm_file }} };

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    // NOTE: if you encounter an error such as: 
    // "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
    // change `false` to `true` in the following function to provide WASI imports to your plugin.
    var plugin = try extism.Plugin.initFromManifest(
        allocator,
        &ctx,
        manifest,
        &[_]extism.Function{},
        false,
    );
    defer plugin.deinit();

    if (plugin.call("count_vowels", "this is a test")) |data| {
        std.debug.print("output: {s}\n", .{data});
    } else |err| switch (err) {
        error.PluginCallFailed => {
            std.debug.print("call error: {s}\n", .{plugin.error_info.?});
        },
    }
}
```

#### Update build configuration

In your `build.zig`:

```zig title=build.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    const exe = b.addExecutable(.{
        .name = "extism-zig-example", 
        .root_source_file = .{ .path = "src/main.zig" },        
        .target = target,
        .optimize = optimize,
    });

    // Add the `extism` library from the cloned repository
    exe.addAnonymousModule("extism", .{ .source_file = .{ .path = "libs/extism/zig/src/main.zig" } });    
    exe.linkLibC();
    
    // Ensure the linker can find the installed shared library and headers
    exe.addIncludePath("/usr/local/include");
    exe.addLibraryPath("/usr/local/lib");
    exe.linkSystemLibrary("extism");
    
    exe.install();

    const run_cmd = exe.run();
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    var exe_tests = b.addTest(.{
       .root_source_file = .{ .path = "src/main.zig" },
       .target = target,
       .optimize = optimize,
    });

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&exe_tests.step);
}
```

### Host Functions

It is also possible to create functions to expose additional functionality from the host by using [Host Functions](/docs/concepts/host-functions/).

:::note Count Vowels Plugin
To run this example, use the version of the count vowels plugin with the example host function:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > src/code.wasm
```

The first step is to define a function with the proper signature:

```zig
const sdk = @import("extism");

export fn hello_world(plugin_ptr: ?*sdk.c.ExtismCurrentPlugin, inputs: [*c]const sdk.c.ExtismVal, n_inputs: u64, outputs: [*c]sdk.c.ExtismVal, n_outputs: u64, user_data: ?*anyopaque) callconv(.C) void {
    std.debug.print("Hello from Zig!\n", .{});
    const str_ud = @ptrCast([*:0]const u8, user_data orelse unreachable);
    std.debug.print("User data: {s}\n", .{str_ud});
    var input_slice = inputs[0..n_inputs];
    var output_slice = outputs[0..n_outputs];
    var curr_plugin = sdk.CurrentPlugin.getCurrentPlugin(plugin_ptr orelse unreachable);
    const input = curr_plugin.inputBytes(&input_slice[0]);
    std.debug.print("input: {s}\n", .{input});
    output_slice[0] = input_slice[0];
}
```

Then add it to the plugin when it's created: 

```zig
const sdk = @import("extism");

const wasmfile_manifest = sdk.manifest.WasmFile{ .path = "code.wasm" };
const man = .{ .wasm = &[_]sdk.manifest.Wasm{ .{ .wasm_file = wasmfile_manifest }} };

var f = Function.init(
    "hello_world",
    &[_]sdk.c.ExtismValType{sdk.c.I64},
    &[_]sdk.c.ExtismValType{sdk.c.I64},
    &hello_world,
    @constCast(@ptrCast(*const anyopaque, "user data")),
);
defer f.deinit();

var plugin = try sdk.Plugin.initFromManifest(allocator, &context, man, &[_]sdk.Function{f}, true);
defer plugin.deinit();
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

