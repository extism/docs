import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--secondary', styles.heroBanner)}>
      <div className="container">
        <p>
          <img src='/img/extism-badge.svg' alt={siteConfig.title} />
        </p>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/overview">
            Read the docs
          </Link>
        </div>
    
        <div className="sdk-quickstart">
          <h4>Quickly embed into officially supported languages:</h4>
          <SDKLogoLinks />
        </div>
      </div>
    </header>
  );
}

function SDKLogoLinks() {
  const sdks = [
    {name: "C", path: "/docs/integrate-into-your-codebase/c-host-sdk", logo: "/img/sdk-languages/c.svg"},
    {name: "C++", path: "/docs/integrate-into-your-codebase/cpp-host-sdk", logo: "/img/sdk-languages/cpp.svg"},
    {name: "Elixir", path: "/docs/integrate-into-your-codebase/elixir-or-erlang-host-sdk", logo: "/img/sdk-languages/elixir.svg"},
    {name: "Erlang", path: "/docs/integrate-into-your-codebase/elixir-or-erlang-host-sdk", logo: "/img/sdk-languages/erlang.svg"},
    {name: "Go", path: "/docs/integrate-into-your-codebase/go-host-sdk", logo: "/img/sdk-languages/go.svg"},
    {name: "Haskell", path: "/docs/integrate-into-your-codebase/haskell-host-sdk", logo: "/img/sdk-languages/haskell.svg"},
    {name: "Node", path: "/docs/integrate-into-your-codebase/node-host-sdk", logo: "/img/sdk-languages/node.svg"},
    {name: "OCaml", path: "/docs/integrate-into-your-codebase/ocaml-host-sdk", logo: "/img/sdk-languages/ocaml.svg"},
    {name: "PHP", path: "/docs/integrate-into-your-codebase/php-host-sdk", logo: "/img/sdk-languages/php.svg"},
    {name: "Python", path: "/docs/integrate-into-your-codebase/python-host-sdk", logo: "/img/sdk-languages/python.svg"},
    {name: "Ruby", path: "/docs/integrate-into-your-codebase/ruby-host-sdk", logo: "/img/sdk-languages/ruby.svg"},
    {name: "Rust", path: "/docs/integrate-into-your-codebase/rust-host-sdk", logo: "/img/sdk-languages/rust.svg"},
  ]
  
  return (
    <ul>
      {sdks.map((sdk, i) => {
        return (
          <li key={i}>
            <a href={sdk.path}>
              <img src={sdk.logo} alt={sdk.name}/>
            </a>
          </li>
        ) 
      })}
    </ul>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Extism is the open source, universal plug-in system. Extend all the software everywhere! Powered by WebAssembly.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
