---
title: .NET
tags:
    - dotnet
    - csharp
    - c#
    - host sdk
---

# Using the .NET Host SDK

:::caution Check your installation

For Mac and Linux users, please be sure you've [installed Extism](/docs/install) before continuing with this guide.
This step is not required for Windows users as the native package is bundled with the Extism runtime DLL.

:::

### 1. Install the NuGet Package

Install via [NuGet](https://nuget.org):

```sh
dotnet add package Extism.Sdk
```

:::note Windows Support

We provide a [native package for Windows](https://www.nuget.org/packages/Extism.runtime.win-x64).
You can install with:

```
dotnet add package Extism.runtime.win-64
```
:::

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```csharp title=Program.cs
using Extism.Sdk.Native;
using System.Text;

var context = new Context();
var wasm = await File.ReadAllBytesAsync("code.wasm");
using var plugin = context.CreatePlugin(wasm, Array.Empty<HostFunction>(), withWasi: true);

var output = Encoding.UTF8.GetString(
    plugin.CallFunction("count_vowels", Encoding.UTF8.GetBytes("Hello World!"))
);
Console.WriteLine(output); // prints {"count": 3}
```

### Host Functions

If a plug-in expects to call any [host functions](/docs/concepts/host-functions), you can implement them in C# and pass them in:

```csharp
var userData = Marshal.StringToHGlobalAnsi("Hello again!");
using var helloWorld = new HostFunction(
    "hello_world",
    "env",
    new[] { ExtismValType.I64 },
    new[] { ExtismValType.I64 },
    userData,
    HelloWorld);

using var plugin = context.CreatePlugin(wasm, new[] { helloWorld }, withWasi: true);

void HelloWorld(CurrentPlugin plugin, Span<ExtismVal> inputs, Span<ExtismVal> outputs, nint data)
{
    Console.WriteLine("Hello from .NET!");

    var text = Marshal.PtrToStringAnsi(data);
    Console.WriteLine(text);

    var input = plugin.ReadString(new nint(inputs[0].v.i64));
    Console.WriteLine($"Input: {input}");

    var output = new string(input); // clone the string
    outputs[0].v.i64 = plugin.WriteString(output);
}
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

