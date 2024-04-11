import React, {useState, useEffect, useRef } from 'react';
import SlotCounter from 'react-slot-counter';

export const sdks = [
  { name: "Browser", path: "https://github.com/extism/js-sdk", logo: "/img/sdk-languages/browser.svg" },
  { name: "C", path: "https://github.com/extism/extism/tree/main/libextism", logo: "/img/sdk-languages/c.svg" },
  { name: "C++", path: "https://github.com/extism/cpp-sdk", logo: "/img/sdk-languages/cpp.svg" },
  { name: "Elixir", path: "https://github.com/extism/elixir-sdk", logo: "/img/sdk-languages/elixir.svg" },
  { name: "Go", path: "https://github.com/extism/go-sdk", logo: "/img/sdk-languages/go.svg" },
  { name: "Haskell", path: "https://github.com/extism/haskell-sdk", logo: "/img/sdk-languages/haskell.svg" },
  { name: "Java", path: "https://github.com/extism/java-sdk", logo: "/img/sdk-languages/java-android.svg" },
  { name: ".NET", path: "https://github.com/extism/dotnet-sdk", logo: "/img/sdk-languages/dotnet.svg" },
  { name: "Node", path: "https://github.com/extism/js-sdk", logo: "/img/sdk-languages/node.svg" },
  { name: "OCaml", path: "https://github.com/extism/ocaml-sdk", logo: "/img/sdk-languages/ocaml.svg" },
  { name: "PHP", path: "https://github.com/extism/perl-sdk", logo: "/img/sdk-languages/perl.svg" },
  { name: "PHP", path: "https://github.com/extism/php-sdk", logo: "/img/sdk-languages/php.svg" },
  { name: "Python", path: "https://github.com/extism/python-sdk", logo: "/img/sdk-languages/python.svg" },
  { name: "Ruby", path: "https://github.com/extism/ruby-sdk", logo: "/img/sdk-languages/ruby.svg" },
  { name: "Rust", path: "https://github.com/extism/extism/tree/main/runtime", logo: "/img/sdk-languages/rust.svg" },
  { name: "Zig", path: "https://github.com/extism/zig-sdk", logo: "/img/sdk-languages/zig.svg" },
]

export default function SDKLogoLinks({ only }) {
  let filtered = sdks;
  if (only) {
    filtered = sdks.filter(language => only.includes(language.name))
  }

  return (
    <ul>
      {filtered.map((sdk, i) => {
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


export function SDKLogoRotator() {
  let [idx, setIdx] = useState(0);
  const sdkLogos = sdks.map(sdk => <img src={sdk.logo} />);
  let [current, setCurrent] = useState(sdkLogos[idx])
  const langRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (idx < sdkLogos.length) {
        setIdx(idx+1);
      } else {
        setIdx(0);
      }
      setCurrent(sdkLogos[idx])
      langRef.current.startAnimation({
        direction: "bottom-top",
        duration: 2,
      });
    }, 5000);

    return () => clearInterval(id);
  }, [idx])

  return (
      <SlotCounter 
        ref={langRef}
        containerClassName="slot-lang-logo"
        valueClassName="value-lang-logo"
        charClassName="char-lang-logo"
        duration={2} 
        hasInfiniteList={true}
        direction={"bottom-top"}
        dummyCharacters={sdkLogos}
        value={[current]} />
  )
}