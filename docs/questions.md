---
sidebar_position: 6
---

# FAQs

### What can I use Extism for?
As a WebAssembly (Wasm) framework, Extism can be used for many of the same use cases that make Wasm exciting, including [Plug-in Systems](https://extism.org/docs/concepts/plug-in-system), Functions as a Service (FaaS) platforms, Universal Software Packages, etc. Extism puts WebAssembly in “easy mode” so you can put more focus on designing/building innovative products, and less focus less on navigating complex technical intricacies.

### How does Extism make it “easier” to use WebAssembly?
Extism is a high level abstraction layer that wraps lower level WebAssembly execution engines such as Wasmtime, Wazero, V8, Spidermonkey, etc. This means that you are not tied to any specific Wasm runtime, and that you’re able to easily embed them into all sorts of host applications/languages without having to deal directly with mechanisms (e.g., Foreign Function Interfaces, etc.) to manage cross-language and cross-platform (e.g., browser, server) integration.

Further, when tinkering with any of the low-level runtimes you'll be stuck with integers and floats, or you'll have to craft your own Application Binary Interface (ABI) to handle anything trickier (e.g., Strings). This can be challenging and time-consuming. Extism comes with a ready-made ABI for a smooth back-and-forth between your host app and any embedded Wasm modules (we like to call them Plug-ins). You can send and receive complex data, call up functions, tweak settings, and keep track of state. Extism [SDKs](https://extism.org/docs/concepts/host-sdk) and [PDKs](https://extism.org/docs/concepts/pdk) package all of this functionality up with idiomatic language ergonomics for a delightful developer experience.

If you’d like to dive a bit deeper, take a look at [this blog post](https://dylibso.com/blog/why-extism/).

### What data types does Extism allow me to pass between my Host application and the Plug-ins its running? Can I use Protobufs? JSON?
Extism provides a bytes in / bytes out interface between Hosts and Plug-ins. This enables you to easily use complex data types (Strings! and more!) that are not supported by the core Wasm specification. You define your own high-level interface and bring your own serialization format, with the only limitation being the formats available in the host and plug-in languages you're using. Thus, Extism supports JSON, Proto, Cap'n Proto, Arrow - take your pick!

### Where does Extism “run” in relation to my host application/platform? Is it some sort of “side car” design pattern?
Extism is actually embedded into your program's process, not isolated over a network boundary like a sidecar. The benefit of this is typically much faster execution speed, and thanks to WebAssembly's security model, it's safe to execute Plug-in code - unlike a DLL or dlopen to a .dylib or .so file. In effect, it becomes an actual function call, not a Remote Procedure Call (RPC).

That being said, it’s certainly possible to ship Extism in many different ways, so you could always deploy an actual sidecar that runs it -- but we believe operationally it is far simpler to eliminate other deployments and run WASM in-process as it was designed to do.

Check out [this page](https://extism.org/docs/concepts/host-sdk) for more info on using Extism Host SDKs to embed the runtime in your application.


### If I embed Extism in my application what is the impact on install size and memory usage?
Install size will depend on your architecture. Because Extism uses other WebAssembly runtimes  under the hood, a lot of the size is related to that. You can also take a look at our [binary releases ](https://github.com/extism/extism/releases)to get an idea. In terms of memory usage, as the host you can constrain the memory that any plug-ins can use. 

### I want to create a Plug-in in a language that compiles to WASM but doesn't have an officially supported Extism PDK. Is there a spec that I can follow to create a compatible WASM binary?
Absolutely! You can create new PDKS by building wrappers around the functions defined in this header file in your language of choice. Send us a PR!

### How can I create new SDKs for Extism?
If you would like to implement an SDK in another language, please refer to the [Runtime APIs](https://extism.org/docs/concepts/runtime-apis/) section to see the functions you will need to write bindings to.

### Can I use Extism with my own WebAssembly runtime?
Surely! but you’ll need to implement Extism on top of it. Luckily, much of Extism is, itself, implemented in Wasm :)  The main task is instantiating the Extism kernel as a Wasm module then mapping its exports as imports to the Plug-in. You’ll also need to write a class that contains both those modules and handles Plugin.call, etc. There might be a few other ways to do it but this is the simplest. 

Check out the Extism kernel [README](https://github.com/extism/extism/blob/main/kernel/README.md) for more information. To get a better idea of the approach, you can also check out [this branch](https://github.com/dylibso/chicory/compare/main...extism) of Chicory, a native WebAssembly runtime implemented in Java, which adds in the Extism kernel.

### How does concurrency work? Are Plug-ins single threaded?

Extism Plug-ins are single threaded, as threading inside of a Wasm module is still a developing story in the WebAssembly ecosystem. But your host application can do whatever it wants! If you need concurrency, one pattern might be to create “pools” of Plug-in instances that can be called from threads running in your Host.

### Does Extism support the Component Model?

Extism is currently focused on WebAssembly core modules and the bountiful use cases that they unlock, but we are tracking the Component Model closely and are very excited about the next level of cross-language composability and complex type support that it’s bringing to the Wasm ecosystem. In fact, we have [Discord channel](https://discord.gg/cx3usBCWnc) dedicated to discussing the ways in which Extism can support it in the future. Come join in!


### Which WebAssembly interfaces does Extism support (e.g., WASI, WASIX, WALI)?

Extism currently supports WASI as a superset of functionality - but you don’t always want to give your guest code access to system resources even in a limited environment. With Extism you don’t need to enable WASI to use a Plug-in, as you can invoke functions directly and even build your own custom [Host functions](https://extism.org/docs/concepts/host-functions) for fine-grained control over the capabilities your Plug-ins can access. But use what’s best suited for your needs!

WASIX and WALI are under consideration.

### **Can a Plugin call functions on another Plugin?**

Yup! The caveat is that all Plug-in to Plug-in interactions need to be facilitated by your host application. So pick your design pattern and go forth.

### **Can I run a Plugin in a Plugin?**

Sure… Check out this [little experiment](https://github.com/extism/plugpluginin). The bigger question is why do you want to do this?! Drop into Discord and tell us more :)

### What’s up with the Extism logo?

The logo has certainly elicited the spectrum of reactions from “its absolutely, viscerally horrifying” to “rock on!”. The logo is intended to invoke thoughts about how the project enables one to “Extend from within”, hence the octopus crawling out from the skull. It also harkens back to some of the mechanisms that Extism seeks to replace. The cursed loading of DLLs / dlopen tons of plug-ins into your program to execute untrusted code is downright scary.