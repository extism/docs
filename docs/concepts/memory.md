---
title: Memory
sidebar_position: 5
---

Passing variables and data into and out of WebAssembly (Wasm) isn't trivial as the host and the WebAssembly have separately managed memory and often use differing [ABIs](https://stackoverflow.com/questions/2171177/what-is-an-application-binary-interface-abi) for variables and function calls. The Extism framework provides a general purpose solution to ease passing data between the host and Wasm. Extism implements this by managing memory isolated from both the host and the plug-in/Wasm module.

To pass variables and data between the host and plug-ins, Extism uses a basic message passing system. Plug-in functions take in a buffer of bytes and return out a buffer of bytes. The host encodes input data and the plugin decodes it. The plugin encodes output data and the host decodes it. The Host SDKs and Plug-in Development Kits (PDKs) provide various language-specific convenience methods for serializing and deserializing native types into and out of Extism memory.

### How it Works

When calling a plug-in function from the host, first Extism resets its memory to cleanup from the last plug-in call. Then, an Extism managed buffer is allocated and the input data is copied into it. In WebAssembly, the plug-in function may then, in order to make the input data accessible, copy the data into Wasm's memory. Similarly, returning data from the Plugin to the host is done by allocating an Extism managed buffer and copying the output data into it. Until the next plug-in call, the host may access the output data from that buffer.

### Usage

The exact usage is Host SDK and PDK dependent.

On the host side, `extism_plugin_call` (or the equivalent Host SDK function) handles allocating Extism memory and copying input data into it. From a [Host Function](/docs/concepts/host-functions), `extism_current_plugin_memory_alloc` is used instead. In most Host SDKs, output data and errors are returned from the plug-in call.

In the PDKs, `load` copies from Extism memory, `alloc` allocates a block of Extism memory, and `store` copies into Extism memory. `free` may optionally be used to free a block of Extism memory. Otherwise the block will be automatically be freed in the next plug-in call to avoid leaking memory. `extism_plugin_reset` may also be called from the host to free all Extism memory.
