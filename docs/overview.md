---
sidebar_position: 1
---

# Overview

Extism is a plug-in system for everyone. We've carefully designed it to be flexible, fitting into codebases of all shapes and sizes, but opinionated enough so that things _Just Work™_ the way they should. **Extism's goal is to make all software programmable.**

![Extism, universal plug-in system](/img/extism-language-support.png)

You can use Extism in your codebase, regardless of the programming language. We support several environments through our official [Host SDKs](/docs/category/integrate-into-your-codebase), and are adding more language support all the time. Let us know if we're missing yours by opening an [issue on GitHub](https://github.com/extism/extism/issues), or talk to us in our [Discord](https://discord.gg/cx3usBCWnc) server.

## Why use a plug-in system?

A plug-in system is software that enables _your_ users or customers to add some logic into certain points in your application. You decide where this logic runs, and your users decide what the plug-in does. 

Many engineering teams face an ever-growing list of feature requests, often exceeding their bandwidth several times over. How can you ever keep up? Making your product **extensible** by its end-users is a great way to move some of those features outside the core, and empower customers to make your software more useful for them.

Practically speaking, you can't predict all the ways users will want to work with your software, and for that reason alone a plug-in system is an ideal feature to implement. 

When using Extism, your job is to determine where in your application some arbitrary code should run, what data that code should be provided, and the data the plug-in should return. 

With Extism, you would locate a spot in your codebase, before some event or function such as `charge_credit_card()`, and run a function from a plug-in that is dynamically loaded and possibly from a third party. Extism is built on top of WebAssembly, which makes untrusted code execution like this [safe to do](https://webassembly.org/docs/security/) via isolation and sandboxing!

