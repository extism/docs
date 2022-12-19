---
title: Java
tags:
    - java
    - host sdk
---

# Using the Java Host SDK

:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the jar

The package is hosted on [Maven Central](https://search.maven.org/artifact/org.extism/sdk).


For maven, add to your `pom.xml`:

```xml
<dependency>
  <groupId>org.extism.sdk</groupId>
  <artifactId>extism</artifactId>
  <version>0.1.0</version>
</dependency>
```

For gradle, add to your `build.gradle`:

```
implementation 'org.extism.sdk:extism:0.1.0'
```


### 2. Import the library and use the API

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```java title=App.java
package example;

import org.extism.sdk.Context;
import org.extism.sdk.manifest.Manifest;
import org.extism.sdk.wasm.WasmSourceResolver;

import java.nio.file.Path;

public class App 
{
    public static void main(String[] args)
    {
        var wasmPath = args.length > 0 ? args[0] : "./code.wasm";
        var functionName = args.length > 1 ? args[1] : "count_vowels";
        var input = args.length > 2 ? args[2] : "Hello World";

        var wasmSourceResolver = new WasmSourceResolver();
        var manifest = new Manifest(wasmSourceResolver.resolve(Path.of(wasmPath)));

        System.out.printf("Executing \"%s\" from \"%s\" with input \"%s\"%n", functionName, wasmPath, input);

        try (var ctx = new Context()) {
            try (var plugin = ctx.newPlugin(manifest, false)) {
                var output = plugin.call(functionName, input);
                System.out.println(output);
            }
        }
    }
}

```

Output:
```
Executing "count_vowels" from "./code.wasm" with input "Hello World"
{"count": 3}
```

For a cloneable example, see [https://github.com/thomasdarimont/extism-java-example](https://github.com/thomasdarimont/extism-java-example).

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

