# LowdbCookieStore
A cookie store for the tough-cookie library based on Lowdb and powered by lodash

## Installation

```sh
$ npm install tough-cookie-lowdb
```

## Usage

```typescript
import { CookieJar } from 'tough-cookie';
import { LowdbCookieStore } from 'tough-cookie-lowdb';

let store = new LowdbCookieStore({ path: 'store.json' });
let cookieJar = new CookieJar(store);
```

## Documentation

* [Adapters](https://github.com/typicode/lowdb/tree/master/docs/adapters.md)
  * [FileSync](https://github.com/typicode/lowdb/tree/master/docs/adapters.md#file-sync)
  * [FileAsync](https://github.com/typicode/lowdb/tree/master/docs/adapters.md#file-async)
  * [In-memory](https://github.com/typicode/lowdb/tree/master/docs/adapters.md#in-memory)
  * [LocalStorage](https://github.com/typicode/lowdb/tree/master/docs/adapters.md#local-storage)

