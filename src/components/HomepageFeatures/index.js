import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    description: (
      <>
        Leveraging the power and portability of WebAssembly, Extism is an off-the-shelf plug-in
        system just a library import away. Ship in days, not weeks or months.
      </>
    ),
  },
  {
    title: 'Secure by Default',
    description: (
      <>
        Don't worry about what some plug-in code might do to your program. Extism is built with
        security as a core principle, and fully sandboxes the execution of all plug-in code.
      </>
    ),
  },
  {
    title: 'Available Everywhere',
    description: (
      <>
        Our flexible architecture uniquely allows Extism to run almost anywhere, with idiomatic Host
        SDKs for Python, Node, Ruby, Rust, Go, PHP, C/C++, OCaml, & more.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
