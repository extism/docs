import React from 'react';

export default function SDKLogoLinks({ only }) {
  let sdks = [
    { name: "Browser", path: "https://github.com/extism/js-sdk", logo: "/img/sdk-languages/browser.svg" },
    { name: "C", path: "https://github.com/extism/tree/main/libextism", logo: "/img/sdk-languages/c.svg" },
    { name: "C++", path: "https://github.com/extism/cpp-sdk", logo: "/img/sdk-languages/cpp.svg" },
    { name: "Elixir", path: "https://github.com/extism/elixir-sdk", logo: "/img/sdk-languages/elixir.svg" },
    { name: "Go", path: "https://github.com/extism/go-sdk", logo: "/img/sdk-languages/go.svg" },
    { name: "Haskell", path: "https://github.com/extism/haskell-sdk", logo: "/img/sdk-languages/haskell.svg" },
    { name: "Java", path: "https://github.com/extism/java-sdk", logo: "/img/sdk-languages/java-android.svg" },
    { name: ".NET", path: "https://github.com/extism/dotnet-sdk", logo: "/img/sdk-languages/dotnet.svg" },
    { name: "Node", path: "https://github.com/extism/js-sdk", logo: "/img/sdk-languages/node.svg" },
    { name: "OCaml", path: "https://github.com/extism/ocaml-sdk", logo: "/img/sdk-languages/ocaml.svg" },
    { name: "PHP", path: "https://github.com/extism/php-sdk", logo: "/img/sdk-languages/php.svg" },
    { name: "Python", path: "https://github.com/extism/python-sdk", logo: "/img/sdk-languages/python.svg" },
    { name: "Ruby", path: "https://github.com/extism/ruby-sdk", logo: "/img/sdk-languages/ruby.svg" },
    { name: "Rust", path: "https://github.com/extism/extism/tree/main/runtime", logo: "/img/sdk-languages/rust.svg" },
    { name: "Zig", path: "https://github.com/extism/zig-sdk", logo: "/img/sdk-languages/zig.svg" },
  ]

  if (only) {
    sdks = sdks.filter(language => only.includes(language.name))
  }

  return (
    <ul>
      {sdks.map((sdk, i) => {
        return (
          <li key={i}>
            <a href={sdk.path}>
              <img src={sdk.logo} alt={sdk.name} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
