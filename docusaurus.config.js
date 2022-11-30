// @ts-check

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Extism - make all software programmable. Extend from within.',
  tagline: 'The Universal Plug-in System',
  url: 'https://extism.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  organizationName: 'extism',
  projectName: 'docs',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // editUrl:
          //   'https://github.com/extism/docs',
        },
        blog: {
          showReadingTime: true,
          // editUrl:
          //   'https://github.com/extism/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Extism',
        logo: {
          alt: 'Extism Logo',
          src: 'img/logo.svg',
        },
        items: [
          { type: 'doc', docId: 'overview', position: 'left', label: 'Overview' },
          { to: '/docs/install', label: 'Installation', position: 'left' },
          { to: '/docs/category/write-a-plug-in', label: 'Write a Plug-in', position: 'left' },
          {
            href: 'https://playground.extism.org',
            label: 'Extism Playground',
            position: 'right',
          },
          {
            href: 'https://github.com/extism/extism',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://discord.gg/cx3usBCWnc',
            label: 'Discord',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Overview',
                to: '/docs/overview',
              },
              { to: '/docs/install', label: 'Installation' },
              { to: '/docs/category/write-a-plug-in', label: 'Write a Plug-in' },
              { to: '/docs/integrate-into-your-codebase/browser-runtime-sdk', label: 'Plug-in system for a Web application' },
              { to: '/docs/integrate-into-your-codebase/c-host-sdk', label: 'Plug-in system in C' },
              { to: '/docs/integrate-into-your-codebase/cpp-host-sdk', label: 'Plug-in system in C++' },
              { to: '/docs/integrate-into-your-codebase/elixir-or-erlang-host-sdk', label: 'Plug-in system in Elixir' },
              { to: '/docs/integrate-into-your-codebase/elixir-or-erlang-host-sdk', label: 'Plug-in system in Erlang' },
              { to: '/docs/integrate-into-your-codebase/go-host-sdk', label: 'Plug-in system in Go' },
              { to: '/docs/integrate-into-your-codebase/haskell-host-sdk', label: 'Plug-in system in Haskell' },
              { to: '/docs/integrate-into-your-codebase/node-host-sdk', label: 'Plug-in system in Node' },
              { to: '/docs/integrate-into-your-codebase/ocaml-host-sdk', label: 'Plug-in system in OCaml' },
              { to: '/docs/integrate-into-your-codebase/php-host-sdk', label: 'Plug-in system in PHP' },
              { to: '/docs/integrate-into-your-codebase/python-host-sdk', label: 'Plug-in system in Python' },
              { to: '/docs/integrate-into-your-codebase/ruby-host-sdk', label: 'Plug-in system in Ruby' },
              { to: '/docs/integrate-into-your-codebase/rust-host-sdk', label: 'Plug-in system in Rust' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Extism Improvement Proposals (EIP)', href: 'https://github.com/extism/proposals' },
              { label: 'GitHub Discussions', href: 'https://github.com/extism/extism/discussions' },
              { label: 'Discord', href: 'https://discord.gg/cx3usBCWnc' },
              { label: 'Twitter', href: 'https://twitter.com/extism' },
              { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/extism' },
            ],
          },
          {
            title: 'Commercial Support',
            items: [
              {
                label: 'Dylibso',
                href: 'https://dylib.so',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Dylibso, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['php', 'ruby', 'rust', 'haskell', 'elixir', 'toml'],
      },
    }),
};

module.exports = config;
