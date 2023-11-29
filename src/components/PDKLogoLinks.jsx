import React from 'react';

export default function PDKLogoLinks() {
  const sdks = [
    { name: "Rust", path: "https://github.com/extism/rust-pdk", logo: "/img/sdk-languages/rust.svg" },
    { name: "JavaScript", path: "https://github.com/extism/js-pdk", logo: "/img/sdk-languages/js.svg" },
    { name: "Go", path: "https://github.com/extism/go-pdk", logo: "/img/sdk-languages/go.svg" },
    { name: "Haskell", path: "https://github.com/extism/haskell-pdk", logo: "/img/sdk-languages/haskell.svg" },
    { name: "AssemblyScript", path: "https://github.com/extism/assemblyscript-pdk", logo: "/img/sdk-languages/assemblyscript.svg" },
    { name: "C", path: "https://github.com/extism/c-pdk", logo: "/img/sdk-languages/c.svg" },
    { name: "Zig", path: "https://github.com/extism/zig-pdk", logo: "/img/sdk-languages/zig.svg" },
    { name: ".NET", path: "https://github.com/extism/dotnet-pdk", logo: "/img/sdk-languages/dotnet.svg" },
  ]

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
