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
    var ctx: extism.Context = extism.Context.init();
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

pub fn build(b: *std.build.Builder) void {
    const target = b.standardTargetOptions(.{});
    const mode = b.standardReleaseOptions();
    const exe = b.addExecutable("extism-zig-example", "src/main.zig");

    // Add the `extism` library from the cloned repository
    exe.addPackagePath("extism", "libs/extism/zig/src/main.zig");
    exe.linkLibC();
    
    // Ensure the linker can find the installed shared library
    exe.addLibraryPath("/usr/local/lib");
    exe.linkSystemLibrary("extism");
    
    exe.setTarget(target);
    exe.setBuildMode(mode);
    exe.install();

    const run_cmd = exe.run();
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    const exe_tests = b.addTest("src/main.zig");
    exe_tests.setTarget(target);
    exe_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&exe_tests.step);
}
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

