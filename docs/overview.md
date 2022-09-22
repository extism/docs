---
sidebar_position: 1
---

# Overview

Extism is a plug-in system for everyone. We've carefully designed it to be flexible, fitting into codebases of all shapes and sizes, but opinionated enough so that things _Just Work™_ the way they should. Extism's goal is to make all software programmable.

<p align="center">
  <img style={{width: '80%', maxWidth: '600px'}} src="/img/extism-language-support.png"/>
</p>

You can use Extism in your codebase, regardless of the programming language. We support several environments through our official [Host SDKs](/docs/category/integrate-into-your-codebase), and are adding more language support all the time. Let us know if we're missing yours by opening an [issue on GitHub](https://github.com/extism/extism/issues), or talk to us in our [Discord](https://discord.gg/cx3usBCWnc) server.

## What is a "plug-in system"?

A plug-in system is software that enables _your_ users or customers to add some logic into certain points in your application. You decide where this logic runs, and your users decide what the plug-in does. 

When using Extism, your job is to determine where in your application some arbitrary code should run, what data that code should be provided, and the data the plug-in should return. 

With Extism, you would locate a spot in your codebase, before some event or function such as `charge_credit_card()`, and run a function from a plug-in that is dynamically loaded and possibly from a third party. Extism is built on top of WebAssembly, which makes untrusted code execution like this [safe to do](https://webassembly.org/docs/security/) via isolation and sandboxing!

### Example in action

Here's some partial code demonstrating an example ecommerce platform allowing store owners to add custom discount logic:

```ruby title=platform/checkout.rb
require 'extism'
require 'json'

ctx = Extism::Context.new

# your manifest can be created from wasm code on disk (seen here), or from bytes read from other 
# sources such as a database or cache.
manifest = {
  :wasm => [{:path => "store_owner/checkout.wasm"}] 
}
plugin = ctx.plugin(manifest)
input = JSON.generate({
  :cart_total => cart_total.as_cents, 
  :is_new_customer => true, 
  :provided_email => false
})

# call the plug-in's `before_checkout_finalize` function for any custom behavior

output = JSON.parse(plugin.call("before_checkout_finalize", input)
# output = {discount_percent: 20.0}

# use the output however you want in order to charge the customer accordingly

if output.discount > 0 
  charge_credit_card(cart_total.apply_discount(order.discount_percent))
else 
  charge_credit_card(cart_total)
end
```

A store owner can implement a plug-in in a variety of languages (the only real requirement is that it can be run in or as WebAssembly). We officially support many options through the use of an Extism [Plug-in Development Kit (PDK)](/docs/category/write-a-plug-in). Here's an example of the `before_checkout_finalize` function implemented in a plug-in:

```rust title=customer/plugin.rs
use extism_pdk::*;
use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Deserialize)]
struct CartDataInput {
    pub cart_total: i32,
    pub is_new_customer: bool,
    pub provided_email: bool,
}

#[derive(Serialize)]
struct CartDataOutput {
    pub discount_percent: f32,
}

#[no_mangle]
pub extern "C" fn before_checkout_finalize() -> i32 {
    // create a binding to the "host" program, which is calling this function
    let host = Host::new();

    // get the input data from the "host" and deserialize it into the `CartDataInput` type
    let checkout_data: CartDataInput = serde_json::from_slice(host.input()).unwrap();

    let mut output = CartDataOutput {
        discount_percent: 0.0,
    };
    // store owner decides what to do here
    if checkout_data.is_new_customer && checkout_data.cart_total >= 10000 {
        // new customer & $100+ spend, give a 20% discount
        output.discount_percent = 20.0
    }

    // write the output back to the "host"
    host.output(&serde_json::to_string(&output).unwrap());

    // return an error code, where conventionally, `0` indicates a successful function execution
    0
}
```

## Usage

Add a fast, flexible, and secure plug-in system to your project. Server, desktop, mobile, web, database -- you name it. Enable users to write and execute safe extensions to your software in **3 easy steps:**

### 1. Import

Import Extism host SDK into your code as a library dependency.

### 2. Integrate 

Identify the place(s) in your code where some arbitrary logic should run (the plug-in!), returning your code some results.

### 3. Execute

Load WebAssembly modules at any time in your app's lifetime and Extism will execute them in a secure sandbox, fully isolated from your program's memory.

## Writing Plug-ins

If you're looking to customize some software that has implemented a plug-in system with Extism, please refer to the section of our documentation which covers plug-in development using our official Plug-in Development Kits (PDKs): [How to write a plug-in](/docs/category/write-a-plug-in).
