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

The package is hosted on [Maven Central](https://search.maven.org/artifact/org.extism.sdk/extism).


For maven, add to your `pom.xml`:

```xml
<dependency>
  <groupId>org.extism.sdk</groupId>
  <artifactId>extism</artifactId>
  <version>0.4.0</version>
</dependency>
```

For gradle, add to your `build.gradle`:

```
implementation 'org.extism.sdk:extism:0.4.0'
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

import org.extism.sdk.Plugin;
import org.extism.sdk.manifest.Manifest;
import org.extism.sdk.wasm.WasmSourceResolver;

import java.nio.file.Path;

public class App 
{
    public static void main(String[] args)
    {
        var resolver = new WasmSourceResolver();
        var manifest = new Manifest(resolver.resolve(Path.of("code.wasm")));

        // NOTE: if you encounter an error such as: 
        // "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
        // change `false` to `true` in the following function to provide WASI imports to your plugin.
        try (var plugin = new Plugin(manifest, false, null)) 
        {
            var output = plugin.call("count_vowels", "Hello World");
            System.out.println(output);
        }
    }
}

```

Output:

```
{"count": 3}
```


### Host Functions

It is also possible to create functions to expose additional functionality from the host by using [Host Functions](/docs/concepts/host-functions/). 


:::note Count Vowels Plugin
To run this example, use the version of the count vowels plugin with the example host function:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```
:::


```java title=App.java
package example;

import org.extism.sdk.Context;
import org.extism.sdk.HostFunction;
import org.extism.sdk.manifest.Manifest;
import org.extism.sdk.HostUserData;
import org.extism.sdk.ExtismFunction;
import org.extism.sdk.wasm.WasmSourceResolver;
import org.extism.sdk.LibExtism.ExtismValType;
import com.sun.jna.Pointer;
import java.util.*;

import java.nio.file.Path;


public class App 
{

  // we can create a custom type to pass complex, or compound, data 
  // through a host function. You could imagine this may hold a reference
  // to a database client or some other Java objects needed by the host functions
  static class MyUserData extends HostUserData {
    private String data1;
    private int data2;

    public MyUserData(String data1, int data2) {
      super();
      this.data1 = data1;
      this.data2 = data2;
    }
  }

  // To create the host function we need a callback in Java world
  // and an ExtismFunction that references it
  public static HostFunction<MyUserData>[] getHostFunctions() {
    ExtismFunction helloWorldFunction = (ExtismFunction<MyUserData>) (plugin, params, returns, data) -> {
      System.out.println("Hello from Java Host Function!");
      System.out.println(String.format("Input string received from plugin, %s", plugin.inputString(params[0])));

      int offs = plugin.alloc(4);
      Pointer mem = plugin.memory();
      mem.write(offs, "test".getBytes(), 0, 4);
      returns[0].v.i64 = offs;

      data.ifPresent(d -> System.out.println(String.format("Host user data, %s, %d", d.data1, d.data2)));
    };

    var parametersTypes = new ExtismValType[]{ExtismValType.I64};
    var resultsTypes = new ExtismValType[]{ExtismValType.I64};

    HostFunction helloWorld = new HostFunction<>(
      "hello_world",
      parametersTypes,
      resultsTypes,
      helloWorldFunction,
      Optional.of(new MyUserData("test", 2))
    );

    HostFunction[] functions = {helloWorld};
    return functions;
  }

  public static void main(String[] args) {
    var resolver = new WasmSourceResolver();
    var manifest = new Manifest(resolver.resolve(Path.of("code.wasm")));
    var functions = getHostFunctions();

    // we must pass any host functions we created to the plugin constructor.
    // it will import these functions so the plugin can call them.
    try (var ctx = new Context(); var plugin = ctx.newPlugin(manifest, true, functions)) {
      var output = plugin.call("count_vowels", "Hello World");
      System.out.println(output);
    }
  }
}
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

