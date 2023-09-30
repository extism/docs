---
sidebar_position: 3
---

# Use Cases & Examples


## Adding functionality to command-line tools

<details>
  <summary>Example in Action: Extensible ecommerce platform</summary>

  Here's some partial code demonstrating an example ecommerce platform allowing store owners to add custom discount logic:
  
  ```ruby title=ecommerce/checkout.rb
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

  if output.discount_percent > 0 
    charge_credit_card(cart_total.apply_discount(order.discount_percent))
  else 
    charge_credit_card(cart_total)
  end
  ```

  A store owner can implement a plug-in in a variety of languages (the only real requirement is that it can be run in or as WebAssembly). We officially support many options through the use of an Extism [Plug-in Development Kit (PDK)](/docs/category/write-a-plug-in). Here's an example of the `before_checkout_finalize` function implemented in a plug-in:

  ```rust title=store_owner/checkout.rs
  use extism_pdk::*;
  use serde::{Deserialize, Serialize};

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

  #[plugin_fn]
  pub fn before_checkout_finalize(Json(checkout_data): Json<CartDataInput>) -> FnResult<Json<CartDataOutput>> {
      let mut output = CartDataOutput {
          discount_percent: 0.0,
      };
      // store owner decides what to do here
      if checkout_data.is_new_customer && checkout_data.cart_total >= 10000 {
          // new customer & $100+ spend, give a 20% discount
          output.discount_percent = 20.0
      }

      Ok(Json(output))
  }
  ```

</details>

### In the Wild
TKTK **Link to Extism project showcase page for GameBox**

---

## Enable users to "mod" a game

<details>
</details>

### In the Wild
TKTK **Link to Extism project showcase page for GameBox**

___

## Simplify "webhooks" 
to run event-driven logic in vendor systems

<details>
  <summary>Example in Action</summary>
</details>

### In the Wild
TKTK Link to Extism project showcase page for Project X

---

## User-defined functions in a database

<details>
  <summary>Example in Action</summary>
</details>

### In the Wild
TKTK Link to Extism project showcase page for Project X

---

## No-code application extensions

<details>
  <summary>Example in Action</summary>
</details>

### In the Wild
TKTK Link to Extism project showcase page for Project X

---

## Content Management System Extensions

<details>
  <summary>Example in Action</summary>
</details>


## Usage

Add a fast, flexible, and secure plug-in system to your project. Server, desktop, mobile, web, database -- you name it. Enable users to write and execute safe extensions to your software in **3 easy steps:**

### 1. Import

Import an Extism [Host SDK](/docs/category/integrate-into-your-codebase/) into your code as a library dependency.

### 2. Integrate 

Identify the place(s) in your code where some arbitrary logic should run (the plug-in!), returning your code some results.

### 3. Execute

Load WebAssembly modules at any time in your app's lifetime and Extism will execute them in a secure sandbox, fully isolated from your program's memory.

## Writing Plug-ins

If you're looking to customize some software that has implemented a plug-in system with Extism, please refer to the section of our documentation which covers plug-in development using our official Plug-in Development Kits (PDKs): [How to write a plug-in](/docs/category/write-a-plug-in).
