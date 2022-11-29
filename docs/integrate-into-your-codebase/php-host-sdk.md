---
title: PHP
tags:
    - php
    - host sdk
---

# Using the PHP Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the PHP library

Install via [Packagist](https://packagist.org/):
```sh
composer require extism/extism
```

:::caution

For the time being you may need to add a minimum-stability of "dev" to your composer.json

```json
{
    // ...
    "minimum-stability": "dev",
    // ...
}
```

:::

### 2. Import the library and use the APIs

```php title=index.php
<?php

require_once __DIR__ . '/vendor/autoload.php';

$ctx = new \Extism\Context();
$wasm = file_get_contents("../../wasm/code.wasm");
$plugin = new \Extism\Plugin($ctx, $wasm);

$output = $plugin->call("count_vowels", "this is an example");
$json = json_decode(pack('C*', ...$output));
echo "Vowels counted = " . $json->{'count'} . PHP_EOL;
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

