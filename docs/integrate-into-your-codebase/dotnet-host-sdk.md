---
title: .NET
tags:
    - dotnet
    - csharp
    - c#
    - host sdk
---

# Using the .NET Host SDK

### 1. Install the Nuget Package

Install via [nuget](https://nuget.org):

```sh
dotnet add package Extism.Sdk --version 0.1.0
```

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```csharp title=Program.cs
using Extism.Sdk.Native;
using System.Reflection;
using System.Text;

var context = new Context();
var wasm = await File.ReadAllBytesAsync("./code.wasm");
using var plugin = context.CreatePlugin(wasm, withWasi: true);

string GetOutput() {
  var outputBytes = plugin.CallFunction("count_vowels", Encoding.UTF8.GetBytes("Hello World!"));
  return Encoding.UTF8.GetString(outputBytes);
}
Console.WriteLine(GetOutput()); // prints {"count": 3}
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

