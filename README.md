# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

Install [`just`](https://just.systems) and [`node`](https://nodejs.org). Running `just` will list all recipes:

```
$ just
Available recipes:
    clean
    run *args
    spellcheck
    start      # Start the development server. Automatically installs dependencies.
    test
```

### Local Development

```
$ just start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

You can check your changes using `just test`.

### Build

```
$ just run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true just run deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> just run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
