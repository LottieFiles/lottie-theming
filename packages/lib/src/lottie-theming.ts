/**
 * Copyright 2021 Design Barn Inc.
 */

import { Animation, useRegistry, Property, PropertyType, KeyFrame, hexToRgba } from '@lottiefiles/lottie-js';

export class LottieTheming {
  /**
   * initialise
   */
  public animation: Animation = new Animation();

  public colors: Record<string, any> = {};

  // refer to ../test/sample-config to see the what the themeConfig structure looks like
  public applyTheme(themeConfig: Record<string, any>, themeName: string): string {
    // Loop through all the themes
    const keys = Object.keys(themeConfig['Themes']);

    keys.forEach((key: string) => {
      // Find the theme name that the user provided as argument
      if (Object.prototype.hasOwnProperty.call(themeConfig['Themes'][key], themeName)) {
        // Go through the properties inside of the theme object
        const themeKeys = Object.keys(themeConfig['Themes'][key][themeName]);

        // loop through all the properties
        themeKeys.forEach((ThemeKey: string) => {
          const propertyName = ThemeKey;
          const color = hexToRgba(themeConfig['Themes'][key][themeName][ThemeKey], 1);
          let locator = '';

          // Go through all the property objects to find the unique identifier from config.properties array
          const propertyKeys = Object.keys(themeConfig['Properties']);

          propertyKeys.forEach((propertyKey: string) => {
            // console.log(themeConfig['Properties'][propertyKey].name);
            if (themeConfig['Properties'][propertyKey].name === propertyName) {
              locator = themeConfig['Properties'][propertyKey].locator;
            }
          });
          // details for each color token
          // console.log(propertyName, color, locator);

          [...useRegistry().keys()]
            // Filter color properties
            .filter((property: Property) => property.type === PropertyType.COLOR)
            .forEach((colorProperty: Property, index: number) => {
              if (index === parseInt(locator, 10)) {
                // console.log(colorProperty);
                colorProperty.values.forEach((kf: KeyFrame) => {
                  kf.value = color;
                });
              }
            });
          // console.log(propertyName);
          // console.log(hexToRgba(color, '1'));
          // console.log(path);
        });
      }
    });
    // console.log(this.animation.toJSON());
    // print out lottie (just testing purposes)
    const data = JSON.stringify(this.animation.toJSON());
    // Write JSON string to a file

    // console.log(data);

    return data;
  }

  public async init(src: string): Promise<Animation> {
    const anim = await Animation.fromURL(src);

    this.animation = anim;
    const colors = anim.colorsVerbose;

    this.colors = colors;
    // console.log(colors);
    this.tokenize();

    return anim;
  }

  public async mapAnimation(src: string): Promise<Animation> {
    const anim = await Animation.fromURL(src);

    this.animation = anim;

    return anim;
  }

  public tokenize(): Record<string, any> {
    // main theme config object
    const themeConfig = {
      Name: 'testTheme' as string,
      Properties: [] as unknown[],
      Themes: [] as unknown[],
    };
    // default theme object to add to themes array
    const defaultTheme: Record<string, unknown> = {};

    const keys = Object.keys(this.colors);

    keys.forEach((key: string) => {
      const paths = key.split('.');
      const locator = paths[0];
      const name = `Color ${locator}`;

      paths.shift();
      const path = paths.join(' <- ');

      themeConfig.Properties.push({
        name,
        path,
        locator,
      });
      defaultTheme[name] = this.colors[key];
      // console.log(`${key}: ${this.colors[key]}`);
    });
    // Push the default theme into themes array.
    themeConfig.Themes.push({ defaultTheme });

    // Print full theme config
    // console.dir(themeConfig, { depth: null });

    // node file write
    // const data = JSON.stringify(themeConfig);
    // // Write JSON string to a file
    // fs.writeFile('demo-theme.json', data, (err) => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log('JSON data is saved.');
    // });
    return themeConfig;
  }
}

export default LottieTheming;
