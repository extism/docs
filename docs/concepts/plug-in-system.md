---
title: Plug-in System
sidebar_position: 0
---

# What is a Plug-in System?

Plug-ins can be a fuzzy concept to grasp. The most accurate description is also the most abstract: *A Plug-in is a software component that can extend the functionality of your application*. But how is this different from any other piece of code?

We think the best way to understand it is through the view of your application. Your application can implement a *Plug-in System*. A plug-in system is simply an *interface* that you define that allows someone else to implement their own functionality in your application. That implementation of the plug-in system is called a [plug-in](/docs/concepts/plug-in).

Extism is an ecosystem of tools that help you create these plug-in systems in your app.
What makes Extism unique is that, through the use of WebAssembly, your plug-ins can be written in any language and embedded in any language.
They can also be run in any environment, from your servers to your browser.
WebAssembly also helps ensure that these plug-ins cannot harm your application accidentally or maliciously through various sandboxing techniques.

## Why implement plug-in system?

Many engineering teams face an ever-growing list of feature requests, often exceeding their bandwidth several times over.
How can you ever keep up?
Making your product extensible by its end-users is a great way to move some of those features outside the core, and empower customers to make your software more useful for them.

A plug-in system can facilitate more complex and low-latency interactions than traditional integration methods such as HTTP APIs or webhooks.

Practically speaking, you can't predict all the ways users will want to work with your software, and for that reason alone a plug-in system is an ideal feature to implement. 

## Example Plug-in Systems

Let's pretend for a moment that we are creating an e-commerce platform in Typescript. We want to give our merchants (our customers who run their stores in our application) the ability to customize give discounts to their customers. We could come up with a convoluted set of configuration pages that the merchant could statically configure, or we could just let the merchant express to us, in a Turing-complete language, how they want their discounts to work.

Let's suppose this is the object that describes our shopping cart:

```typescript title=types.d.ts
interface Cart {
    totalInCents: number,
    newCustomer: boolean,
    providedEmail: boolean,
}
```

We can define a function `processCart(Cart)` that runs the merchant's code
on the customer's cart before checkout. We use a [Host SDK](/concept/host-sdk), the [Extism JavaScript SDK](https://github.com/extism/js-pdk) to load and execute the merchant's code in our application:

```typescript title=checkout.ts
async function processCart(cart: Cart) {
    const wasm = {
        path: "/path/to/customer-discount-plugin.wasm"
    }
    const plugin = await ExtismPlugin.new(wasm)
    const input = JSON.stringify()
    const res = await plugin.call("before_checkout", new TextEncoder().encode(input));
    const discount: Discount = JSON.parse(res)

    if (discount.discountPercentage > 0.0) {
        checkoutCart(cart, discount.discountPercentage)
    } else {
        checkoutCart(cart)
    }
}
```

Now let's suppose the merchant wants to apply a discount of 20%, but only if the customer is a new customer and they are spending over $100. They can write a plug-in using one of our [PDKs](/concept/pdk) that implements `before_checkout`. In this case they are using the [Rust PDK](https://github.com/extism/rust-pdk).

```rust title=discount.rs
#[plugin_fn]
pub fn before_checkout(Json(cart): Json<Cart>) -> FnResult<Json<Discount>> {
    let mut discount = Discount { discount_percent: 0.0 };

    // merchant decides what to do here
    if cart.is_new_customer && cart.cart_total_in_cents >= 10000 { // new customer & $100+ spend, give a 20% discount
        discount.discount_percent = 20.0
    }

    Ok(Json(discount))
}
```

This program compiles to the Wasm which we load in our `processCart` function.






