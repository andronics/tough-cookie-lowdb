import { Cookie, Store } from 'tough-cookie'
import { defaultsDeep, get, set, unset, values } from 'lodash'

const STORE_KEY: string = '__cookieStore__'

export interface LowdbCookieStoreOptions {}

export class LowdbCookieStore extends Store {
	
	constructor({}: LowdbCookieStoreOptions) {
		super();
		this._storage = storage;
		this.synchronous = true;
	}

	public findCookie(domain, path, key, callback) {
		let store = this._readStore();
		let cookie = get(store, [domain, path, key], null);
		callback(null, Cookie.fromJSON(cookie));
	}

	public findCookies(domain, path, callback) {
		if (!domain) {
			callback(null, []);
			return;
		}

		let cookies = [];
		let store = this._readStore();
		let domains = ToughCookie.permuteDomain(domain) || [domain];
		for (let domain of domains) {
			if (!store[domain]) {
				continue;
			}

			let matchingPaths = Object.keys(store[domain]);
			if (path != null) {
				matchingPaths = matchingPaths
					.filter(cookiePath => this._isOnPath(cookiePath, path));
			}

			for (let path of matchingPaths) {
				cookies.push(...values(store[domain][path]));
			}
		}

		cookies = cookies.map(cookie => Cookie.fromJSON(cookie));
		callback(null, cookies);
	}

	public putCookie(cookie, callback) {
		let store = this._readStore();
		set(store, [cookie.domain, cookie.path, cookie.key], cookie);
		this._writeStore(store);
		callback(null);
	}

	public updateCookie(oldCookie, newCookie, callback) {
		this.putCookie(newCookie, callback);
	}

	public removeCookie(domain, path, key, callback) {
		let store = this._readStore();
		unset(store, [domain, path, key]);
		this._writeStore(store);
		callback(null);
	}

	public removeCookies(domain, path, callback) {
		let store = this._readStore();
		if (path == null) {
			unset(store, [domain]);
		} else {
			unset(store, [domain, path]);
		}
		this._writeStore(store);
		callback(null);
	}

	public getAllCookies(callback) {
		let cookies = [];
		let store = this._readStore();
		for (let domain of Object.keys(store)) {
			for (let path of Object.keys(store[domain])) {
				cookies.push(...values(store[domain][path]));
			}
		}

		cookies = cookies.map(cookie => Cookie.fromJSON(cookie));
		cookies.sort((c1, c2) => (c1.creationIndex || 0) - (c2.creationIndex || 0));
		callback(null, cookies);
	}

	private _isOnPath(cookiePath, urlPath) {
		if (!cookiePath) {
			return false;
		}

		if (cookiePath === urlPath) {
			return true;
		}

		if (!urlPath.startsWith(cookiePath)) {
			return false;
		}

		if (cookiePath[cookiePath.length - 1] !== '/' &&
				urlPath[cookiePath.length] !== '/') {
			return false;
		}
		return true;
	}

	private _readStore() {
		let json = this._storage.getItem(STORE_KEY);
		if (json != null) {
			try {
				return JSON.parse(json);
			} catch (e) { }
		}
		return {};
	}

	private _writeStore(store) {
		this._storage.setItem(STORE_KEY, JSON.stringify(store));
	}

}
