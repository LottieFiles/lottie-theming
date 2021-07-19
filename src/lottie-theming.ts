/**
 * Copyright 2021 Design Barn Inc.
 */

import fetch from 'cross-fetch';

enum TraverseFilter {
  /** prevents the children from being iterated. */
  'reject' = 'reject',
}
export default class LottieTheming {
  private _jsonData: Record<string, unknown> = {};

  public get jsonData(): Record<string, unknown> {
    return this._jsonData;
  }

  public set jsonData(value: Record<string, unknown>) {
    this._jsonData = value;
  }

  /**
   * initialise
   */
  public async init(src: string | Record<string, unknown>): Promise<Record<string, unknown>> {
    const srcParsed = this._parseSrc(src);
    let jsonData = {};

    let srcAttrib = typeof srcParsed === 'string' ? 'path' : 'animationData';

    // Fetch resource if src is a remote URL
    if (srcAttrib === 'path') {
      jsonData = await this._fromURL(srcParsed as string);
      srcAttrib = 'animationData';
    } else {
      jsonData = srcParsed;
    }
    if (!this._isLottie(jsonData)) {
      // throw error
      // this.dispatchEvent(new CustomEvent(PlayerEvents.Error));
    }
    this.jsonData = jsonData;

    return jsonData;
  }

  public tokenize(): void {
    const themeConfig = {
      Name: 'testTheme' as string,
      Properties: [] as any[],
      Themes: [] as any[],
    };
    let defaultTheme = {};

    function isNumeric(value: string): boolean {
      return /^-?\d+$/.test(value);
    }
    let propertyCount = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value, path, parent] of this._traverse(this.jsonData)) {
      // if key is k and parent is c. then its a solid flat color thats not keyframed
      if (path[path.length - 1] === 'k' && path[path.length - 2] === 'c') {
        propertyCount++;
        // console.log(key, value, path, parent);
        // Todo: get the item name , shape name , layer name by traversing backwards.
        let pathString = '';
        const token = { name: '', locatorType: 'jsonPath', locator: '' };

        path.forEach(function (item, index) {
          if (!isNumeric(item)) {
            const val = `['${item}']`;

            pathString += val;
          } else if (isNumeric(item)) {
            const val = `[${item}]`;

            pathString += val;
          }
        });
        const name = `property_${propertyCount}`;

        token.name = name;
        token.locator = pathString;
        const themeProperty = { name: value };

        defaultTheme = { ...defaultTheme, ...themeProperty };

        themeConfig.Properties.push(token);
        // console.log(path);
        // console.log(parent);

        console.log(pathString);
        console.log(value);
        console.log('---------------');
      }
    }
    // console.log(themeConfig);
    console.log(defaultTheme);
  }

  /**
   * if url is provided. get the json object
   */
  private async _fromURL(url: string): Promise<Record<string, any>> {
    if (typeof url !== 'string') {
      throw new Error(`The url value must be a string`);
    }

    let json;

    try {
      // Try construct an absolute URL from the src URL
      const srcUrl: URL = new URL(url);

      // Fetch the JSON file from the URL
      const result = await fetch(srcUrl.toString());

      json = await result.json();
    } catch (err) {
      console.log(err);
      throw new Error(`An error occurred while trying to load the Lottie file from URL`);
    }

    return json;
  }

  /**
   * Validate lottie
   */
  private _isLottie(json: Record<string, any>): boolean {
    const mandatory = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h'];

    return mandatory.every(field => Object.prototype.hasOwnProperty.call(json, field));
  }

  /**
   * Check to see whether parameter passed in is json url or json object
   */
  private _parseSrc(src: string | Record<string, unknown>): string | Record<string, unknown> {
    if (typeof src === 'object') {
      return src;
    }

    try {
      return JSON.parse(src);
    } catch (e) {
      // Try construct an absolute URL from the src URL
      const srcUrl: URL = new URL(src);

      return srcUrl.toString();
    }
  }

  /** object traversing algorithm  */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private *_traverse(o: any) {
    const memory = new Set();

    function* innerTraversal<T = any>(root: T): Generator<[string, T, string[], T], void, TraverseFilter | undefined> {
      const queue: Array<[T, string[]]> = [];

      queue.push([root, []]);
      while (queue.length > 0) {
        const [o, path] = queue.shift() as [T, string[]];

        if (memory.has(o)) {
          // we've seen this object before don't iterate it
          continue;
        }
        // add the new object to our memory.
        memory.add(o);
        // eslint-disable-next-line no-restricted-syntax
        for (const i of Object.keys(o)) {
          const item: T = (o as any)[i];
          const itemPath: string[] = path.concat([i]);
          const filter = yield [i, item, itemPath, o];

          if (filter === TraverseFilter.reject) continue;
          if (item !== null && typeof item === 'object') {
            // going one step down in the object tree!!
            queue.push([item, itemPath]);
          }
        }
      }
    }
    yield* innerTraversal(o);
  }

  // style tokenizer
  // function to extract style tokens from a lottie object
  // json based tree exploration to find all stylable elements
  // start with color first
  // json paths as primary identifier and alias as nm

  // style applicator
  // functioon to apply style token and config to a lottie object
}
