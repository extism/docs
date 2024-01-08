import React, { useEffect, useState, useRef } from 'react';
import SlotCounter from 'react-slot-counter';

export const pdks = [
  { name: "Rust", path: "https://github.com/extism/rust-pdk", logo: "/img/sdk-languages/rust.svg" },
  { name: "JavaScript", path: "https://github.com/extism/js-pdk", logo: "/img/sdk-languages/js.svg" },
  { name: "Go", path: "https://github.com/extism/go-pdk", logo: "/img/sdk-languages/go.svg" },
  { name: "Haskell", path: "https://github.com/extism/haskell-pdk", logo: "/img/sdk-languages/haskell.svg" },
  { name: "AssemblyScript", path: "https://github.com/extism/assemblyscript-pdk", logo: "/img/sdk-languages/assemblyscript.svg" },
  { name: "C", path: "https://github.com/extism/c-pdk", logo: "/img/sdk-languages/c.svg" },
  { name: "Zig", path: "https://github.com/extism/zig-pdk", logo: "/img/sdk-languages/zig.svg" },
  { name: ".NET", path: "https://github.com/extism/dotnet-pdk", logo: "/img/sdk-languages/dotnet.svg" },
]

export default function PDKLogoLinks() {
  return (
    <ul>
      {pdks.map((pdk, i) => {
        return (
          <li key={i}>
            <a href={pdk.path}>
              <img src={pdk.logo} alt={pdk.name} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function PDKLogoRotator() {
  let [idx, setIdx] = useState(0);
  const pdkLogos = pdks.map(pdk => <img src={pdk.logo} />);
  const [current, setCurrent] = useState(pdkLogos[0]);
  const langRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      if (idx < pdkLogos.length) {
        setIdx(idx+1);
      } else {
        setIdx(0);
      }
      setCurrent(pdkLogos[idx])
      langRef.current.startAnimation({
        direction: "top-bottom",
        duration: 1,
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
        duration={1} 
        direction={"top-bottom"}
        hasInfiniteList={true}
        dummyCharacters={pdkLogos} 
        value={[current]} />
  )
}