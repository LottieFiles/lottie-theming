/**
 * Copyright 2021 Design Barn Inc.
 */

import fs from 'fs';

import fetch from 'cross-fetch';

enum TraverseFilter {
  /** prevents the children from being iterated. */
  'reject' = 'reject',
}

export class LottieTheming {
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
    // main theme config object
    const themeConfig = {
      Name: 'testTheme' as string,
      Properties: [] as unknown[],
      Themes: [] as unknown[],
    };
    // default theme object to add to themes array
    let defaultTheme = {};

    // Check numberic value
    function isNumeric(value: string): boolean {
      return /^-?\d+$/u.test(value);
    }

    // Convert rgb to hex
    function rgb2hex(rgb: string): string {
      const rgbMatches = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/iu);

      if (rgbMatches && rgbMatches.length === 4) {
        return `#${`0${parseInt(rgbMatches[1], 10).toString(16)}`.slice(-2)}${`0${parseInt(rgbMatches[2], 10).toString(
          16,
        )}`.slice(-2)}${`0${parseInt(rgbMatches[3], 10).toString(16)}`.slice(-2)}`;
      }

      return '';
    }

    function rgbaToHex(color: string) {
      const rgba = color.replace(/^rgba?\(|\s+|\)$/gu, '').split(',');
      const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2]))
        .toString(16)
        .slice(1)}`;

      return hex;
    }

    // using this to name tokens for now until we use nm and cl values from the object itself
    let propertyCount = 0;

    // traverse through the entire lottie json. returns all objects inside of the lottie separately.  each one is checked against an assumed condition to get the necessary values
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value, path, parent] of this._traverse(this.jsonData)) {
      // if key is k and parent is c. then its a solid flat color thats not keyframed
      if (path[path.length - 1] === 'k' && path[path.length - 2] === 'c') {
        propertyCount++;

        // Todo : get the item name , shape name , layer name by traversing backwards.

        let pathString = '';
        const token = { name: '', locatorType: 'jsonPath', locator: '', locatorArray: [] as string[] };

        // construct the json path using the individual path values
        path.forEach((item, index) => {
          if (!isNumeric(item)) {
            const val = `['${item}']`;

            pathString += val;
          } else if (isNumeric(item)) {
            const val = `[${item}]`;

            pathString += val;
          }
        });

        // Using this to name tokens for now until we use nm and cl values from the object itself
        const name = `property_${propertyCount}`;

        // Constructing the tokens for properties array
        token.name = name;
        token.locator = pathString;
        token.locatorArray = path;
        themeConfig.Properties.push(token);

        // Instantiate color string
        let color = '';

        // Convert the color to hex
        if (value.length === 3) {
          color = `rgb(${value[0] * 255},${value[1] * 255},${value[2] * 255})`;
          color = rgb2hex(color);
        } else if (value.length === 4) {
          color = `rgba(${value[0] * 255},${value[1] * 255},${value[2] * 255},${value[3]})`;
          color = rgbaToHex(color);
        }

        // Constructing the tokens for the default and current theme.
        defaultTheme = { ...defaultTheme, [name]: color };
        // console.log(path);
        console.log(name);
        console.log(pathString);
        console.log(value);
        console.log('---------------');
      }
    }

    // Push the default theme into themes array.
    themeConfig.Themes.push({ defaultTheme });

    // Print full theme config
    console.dir(themeConfig, { depth: null });

    const data = JSON.stringify(themeConfig);

    // Write JSON string to a file
    fs.writeFile('demo-theme.json', data, (err) => {
      if (err) {
        throw err;
      }
      console.log('JSON data is saved.');
    });
  }

  public applyTheme(themeFilePath: string, themeName: string): void {
    // read JSON object from file
    fs.readFile(themeFilePath, 'utf-8', (err, data) => {
      if (err) {
        throw err;
      }

      // Parse JSON object
      const themeConfig = JSON.parse(data.toString());

      // Loop through all the themes
      for (const key in themeConfig.Themes) {
        // Find the theme name that the user provided from config.themes array
        if (themeConfig.Themes[key].hasOwnProperty(themeName)) {
          // Go through the properties inside of the theme object

          for (const property in themeConfig.Themes[key][themeName]) {
            const propertyName = property;
            const color = themeConfig.Themes[key][themeName][property];
            let path = '';
            let locator = [];
            // console.log(themeConfig.Themes[key][themeName][property]);

            // Go through all the property objects to find the json path from config.properties array
            for (const pathObject in themeConfig.Properties) {
              if (themeConfig.Properties[pathObject].name === propertyName) {
                path = themeConfig.Properties[pathObject].locator;
                locator = themeConfig.Properties[pathObject].locatorArray;
              }
            }

            // Print out details for each token
            console.log(propertyName);
            console.log(this._hexToRgb(color));
            console.log(path);
            const modified = this._setPathValue(this._jsonData, locator, this._hexToRgb(color));

            console.log(modified);
          }
        }
      }

      const json = JSON.stringify(this._jsonData);

      // Write JSON string to a file
      fs.writeFile('modified_lottie.json', json, (err) => {
        if (err) {
          throw err;
        }
        console.log('JSON data is saved.');
      });
    });
  }

  /**
   * if url is provided. get the json object
   */
  private async _fromURL(url: string): Promise<Record<string, unknown>> {
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
  private _isLottie(json: Record<string, unknown>): boolean {
    const mandatory = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h'];

    return mandatory.every((field: string) => Object.prototype.hasOwnProperty.call(json, field));
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

  private _setPathValue(object: unknown, path: string[], value: unknown): string {
    return path.reduce(
      (original: unknown, current: unknown, i: number) =>
        (original[current] = path.length === ++i ? value : original[current] || {}),
      object,
    );
  }

  private _hexToRgb(hex: string) {
    const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/iu.exec(hex);

    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);

      return [r / 255, g / 255, b / 255];
    }

    return null;
  }

  /** Object traversing algorithm  */
  private *_traverse(o: unknown) {
    const memory = new Set();

    function* innerTraversal<T = unknown>(
      root: T,
    ): Generator<[string, T, string[], T], void, TraverseFilter | undefined> {
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
          const item: T = (o as unknown)[i];
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
}
