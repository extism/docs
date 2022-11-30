import React from 'react';

export default function PDKLogoLinks() {
    const sdks = [
        { name: "Rust", path: "/docs/write-a-plugin/rust-pdk", logo: "/img/sdk-languages/rust.svg" },
        { name: "Go", path: "/docs/write-a-plugin/go-pdk", logo: "/img/sdk-languages/go.svg" },
        { name: "Haskell", path: "/docs/write-a-plugin/haskell-pdk", logo: "/img/sdk-languages/haskell.svg" },
        { name: "AssemblyScript", path: "/docs/write-a-plugin/assemblyscript-pdk", logo: "/img/sdk-languages/assemblyscript.svg" },
        { name: "C", path: "/docs/write-a-plugin/c-pdk", logo: "/img/sdk-languages/c.svg" },
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