type MemoryStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type TestBrowser = {
  calls: unknown[][];
  storage: Map<string, string>;
  cookies: Map<string, string>;
  location: { protocol: string; search: string };
  restore: () => void;
};

export function installTestBrowser(): TestBrowser {
  const calls: unknown[][] = [];
  const storage = new Map<string, string>();
  const cookies = new Map<string, string>();
  const target = new EventTarget();
  const location = { protocol: 'https:', search: '' };

  const localStorage: MemoryStorage = {
    getItem: (key) => (storage.has(key) ? storage.get(key)! : null),
    setItem: (key, value) => {
      storage.set(key, value);
    },
    removeItem: (key) => {
      storage.delete(key);
    },
  };

  const document = {
    get cookie() {
      return [...cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
    },
    set cookie(raw: string) {
      const [pair, ...attrs] = raw.split(';').map((part) => part.trim());
      const eq = pair.indexOf('=');
      const name = eq === -1 ? pair : pair.slice(0, eq);
      const value = eq === -1 ? '' : pair.slice(eq + 1);
      const maxAge = attrs.find((attr) => attr.toLowerCase().startsWith('max-age='));
      if (maxAge && Number(maxAge.split('=')[1]) <= 0) {
        cookies.delete(name);
        return;
      }
      cookies.set(name, value);
    },
    getElementById: () => null,
    head: { appendChild: () => {} },
  };

  const win = {
    dataLayer: [] as unknown[],
    __mdGaReady: false,
    __mdAttribution: undefined as Record<string, string> | undefined,
    localStorage,
    location,
    document,
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    gtag: (...args: unknown[]) => {
      calls.push(args);
      win.dataLayer.push(args);
    },
  };

  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: win,
  });

  return {
    calls,
    storage,
    cookies,
    location,
    restore() {
      if (previous) {
        Object.defineProperty(globalThis, 'window', previous);
      } else {
        delete (globalThis as { window?: unknown }).window;
      }
    },
  };
}
