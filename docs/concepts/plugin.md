---
title: Plug-in
sidebar_position: 1
---

# What is a Plug-in?

A plug-in is a code module that conforms to the interface of your [Plug-in System](/concepts/plug-in-system). In Extism, a plug-in is ultimately a WebAssembly Module that can be created using one of our [PDKs](/concept/pdk) in the language of your choice.

WebAssembly modules, `.wasm files`, are a binary representation of your code module. Like all programming languages, WebAssembly modules are composed of functions. Some of these functions functions are internal, some can be *exported* to your application so that you can invoke them.

You can think of them like a JavaScript module. Functions defined in the file can't be seen or invoked from the outside. It must export a function to be used:

```javascript mymodule.js

// this const and function are private
const VOWELS = "aeiou";
function isVowel(char) {
    return VOWELS.includes(char)
}

// this function is exported and can be invoked from outside
export function countVowels(input) {
  return input
      .split('')
      .reduce((count, char) =>
          count + isVowel(char) ? 1 : 0, 0)
}
```

Of course, what is unique about Extism plug-ins is the language you wrote the plug-in in doesn't matter. We can use any [Host SDK](/concepts/host-sdk) to load these modules and call these exports.

Like JavaScript modules, WebAssembly modules also have the ability to *import* functions. This is useful because WebAssembly code, on its own, is basically a sandboxed calculator. It can only see the world inside its own memory and doesn't have access to the underlying system. For example, it cannot read from the file system or from the processes memory, or anything that would require a syscall.

So any of this functionality must be imported and implemented by the application. Though, you do not need to implement these yourself. Extism provides the module with some of its own imports to facilitate communication. There are also standards like [WASI](https://wasi.dev/) which can give your module some of the POSIX-like capabilities you expect in a normal programming environment (like reading files or doing I/O).

That said, these imports can be very powerful as they allow you to selectively imbue your plug-ins with the capabilities and APIs of your application itself. This is what [Host Functions](/concepts/host-functions) offer. Like the module has the ability to export a function in a language agnostic way, host functions give you a way to import a function into your plug-in in a language agnostic way. If my application is written in python for example, I could pass a python host function to a plug-in that can say read from my database, or call internal APIs. Host Functions truly unlock the power of a plug-in system as they can, selectively, give your plug-in the same capabilities as your internal application code.


