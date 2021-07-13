export class LottieTheming {
  constructor() {}

  /**
   * Check to see whether parameter passed in is json url or json object
   */
  parseSrc(src: string | object): string | object {
    if (typeof src === 'object') {
      return src;
    }

    try {
      return JSON.parse(src);
    } catch (e) {
      // Try construct an absolute URL from the src URL
      const srcUrl: URL = new URL(src, window.location.href);

      return srcUrl.toString();
    }
  }
  /**
   * Validate lottie
   */
  isLottie(json: Record<string, any>): boolean {
    const mandatory = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h'];

    return mandatory.every(field => Object.prototype.hasOwnProperty.call(json, field));
  }
  /**
   * if url is provided. get the json object
   */
  async fromURL(url: string): Promise<Record<string, any>> {
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
      throw new Error(`An error occurred while trying to load the Lottie file from URL`);
    }

    return json;
  }
  /**
   * initialise
   */
  async init(src: string | object) {
    let srcParsed = this.parseSrc(src);
    let jsonData = {};

    let srcAttrib = typeof srcParsed === 'string' ? 'path' : 'animationData';
    // Fetch resource if src is a remote URL
    if (srcAttrib === 'path') {
      jsonData = await this.fromURL(srcParsed as string);
      srcAttrib = 'animationData';
    } else {
      jsonData = srcParsed;
    }
    if (!this.isLottie(jsonData)) {
      // throw error
      // this.dispatchEvent(new CustomEvent(PlayerEvents.Error));
    }
    return jsonData;
  }

  public tokenize() {}
  // style tokenizer
  // function to extract style tokens from a lottie object
  // json based tree exploration to find all stylable elements
  // start with color first
  // json paths as primary identifier and alias as nm

  // style applicator
  // functioon to apply style token and config to a lottie object
}
