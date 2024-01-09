import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SDKLogoLinks, {SDKLogoRotator} from '@site/src/components/SDKLogoLinks';
import { PDKLogoRotator } from '../components/PDKLogoLinks';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--secondary', styles.heroBanner)}>
      <div className="container">
        <div className="cross-languages">
          <span>Call</span> <PDKLogoRotator/> <span>code from your</span> <SDKLogoRotator/> <span>apps.</span>
        </div>
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
