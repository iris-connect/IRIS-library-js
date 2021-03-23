<p align="center" class="text-center">
  <img src="https://i.imgur.com/7kFsoY9.png" width="320" alt="IRIS Logo" />
</p>

<p align="center" class="text-center">
  <img alt="" src="https://img.shields.io/github/workflow/status/inog-projects/iris-library-js/Release/main"/>
  <img alt="" src="https://shields.io/github/issues/InOG-projects/IRIS-library-js"/>
  <img alt="" src="https://shields.io/npm/l/@inog/iris-library-js"/>
  <img alt="" src="https://shields.io/npm/v/@inog/iris-library-js"/>
</p>

# IRIS - JS Library

IRIS stands for "Integration of Remote systems into Infection control Software" and is intended to be the central point of mediation between the various contact, event and guest tracking apps on the one hand and the infection control software (e.g. SORMAS) in the health departments on the other.

This repository is used as a client library to handle the connection with the IRIS gateway

## Purpose

To help interact with the IRIS Gateway this helper library abstracts aspects of the interaction with the IRIS Gateway like encryption. This way you can just send the data without worrying about the annoying stuff.

## Installation

You should have [node](https://nodejs.org/en/) and npm or [yarn](https://yarnpkg.com) installed.

```bash
$ yarn add @inog/iris-library-js
```

## Basic Usage

Before being able to send or check data the library must be initialized with the url of the IRIS Gateway:

```js
import Iris from '@inog/iris-library-js';

const iris = new Iris({
  baseUrl: 'https://your.iris.url',
});
```

At first, it must be checked whether a data request for this code exists in the IRIS system. This way also the public key for addressing the correct health office is also obtained

```js
const dataRequest = await iris.getDataRequest('12345-abcd');
```

Afterwards the data can be sent with the corresponding code

```js
await iris.sendContactsEvents('12345-abcd', { your: 'data' }, { firstName: 'Sending', lastName: 'User' });
```

> Please note: Before being able to call `sendContactsEvents` with a specific code, the data request must be received first by calling `getDataRequest` with the same code.

## Documentation

> Refer to the basic instructions above. More thorough documentation will be added asap.

## Changelog

For a list of changes, please refer to the [CHANGELOG](docs/CHANGELOG.md).

## Contributions

Contributions are more than welcome, check our [CONTRIBUTING Guide](CONTRIBUTING.md).

## Stay in touch

![Innovationsverbund Öffentliche Gesundheit](https://i.imgur.com/uRkhuII.png)

- Website - [https://inög.de/](https://inög.de/)
- Twitter - [@inoeg_de](https://twitter.com/inoeg_de)

## License

[MIT licensed](LICENSE).
