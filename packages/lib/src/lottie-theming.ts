/**
 * Copyright 2021 Design Barn Inc.
 */

import {
  Animation,
  // useRegistry,
  // Property,
  // PropertyType,
  // KeyFrame,
  // hexToRgba,
  // GradientFillShape,
  // GradientStrokeShape,
  ShapeLayer,
  Shape,
  FillShape,
  GroupShape,
  hexToRgba,
  SolidLayer,
  Layer,
  GradientFillShape,
} from '@lottiefiles/lottie-js';

export class LottieTheming {
  /**
   * initialise
   */
  public animation: Animation = new Animation();

  public colors: Record<string, unknown> = {};

  public textLayers: Record<string, unknown> = {};

  public applyTheme(themeConfig: Record<string, any>, themeName: string): string {
    // const registry = useRegistry();

    // console.log(registry);
    // get keys for given theme name
    const keys = Object.keys(themeConfig[themeName]);

    // separate out the keys that are IDs and ones that are classnames
    const idKeys = keys.filter((x: string) => x.includes('#'));
    const classKeys = keys.filter((x: string) => x.includes('.'));

    // apply colors to layers via classname
    classKeys.forEach((classname) => {
      const col = themeConfig[themeName][classname].fillColor;

      if (col) {
        // get the layer by classname from the lottie file
        const lottieLayers = this.animation.getLayersByClassName(classname.substring(1));

        lottieLayers.forEach((lottieLayer) => {
          if (lottieLayer) {
            this._processLayers(lottieLayer, col);
          }
        });
      }
    });

    // apply colors to layers via id
    idKeys.forEach((id) => {
      const idString = id.substring(1);
      const col = themeConfig[themeName][id].fillColor;

      // get the layer by ID from the lottie file
      const lottieLayer = this.animation.getLayerById(idString);

      if (lottieLayer) {
        this._processLayers(lottieLayer, col);
      }
    });

    // apply colors to shapes via classname

    // console.log(this.animation.getShapesByClassName('polystar'));
    // console.log(themeName);
    // console.log(keys);

    // console.log(this.animation.toJSON());
    // print out lottie (just testing purposes)
    const data = JSON.stringify(this.animation.toJSON());

    return data;
  }

  public async init(src: string): Promise<Animation> {
    const anim = await Animation.fromURL(src);

    this.animation = anim;
    // console.dir(anim, { depth: null });
    const colors = anim.colorsVerbose;
    const textLayers = anim.textLayers;

    this.textLayers = textLayers;
    this.colors = colors;
    // console.log(colors);
    // this.createConfig();

    return anim;
  }

  // solid layer = color exists in layer
  // shape layer = color exists in shape inside of layer
  // fill color
  // linear gradient color
  // radial gradient color

  public async mapAnimation(src: string): Promise<Animation> {
    const anim = await Animation.fromURL(src);

    this.animation = anim;

    return anim;
  }

  private _applyGradientFill(currentFill: GradientFillShape, fillToApply: any): void {
    const colors: number[][] = [];

    fillToApply.colors.forEach((colObject: any) => {
      // const alpha = parseFloat(colObject.alpha);
      const rgba = hexToRgba(colObject.color, undefined);

      rgba.unshift(colObject.offset);
      colors.push(rgba);
    });

    if (currentFill.startPoint.values[0] && currentFill.endPoint.values[0]) {
      currentFill.startPoint.values[0].value = fillToApply.startXY;
      currentFill.endPoint.values[0].value = fillToApply.endXY;
    }
    if (currentFill.gradientColors.gradientColors.values[0]) {
      console.log('corrent', currentFill.gradientColors.gradientColors.values[0].value);
      console.log(colors.flat());
      currentFill.gradientColors.gradientColors.values[0].value = colors.flat();
    }
    //  console.log(currentFill.gradientColors.gradientColors.values[0]?.value);
  }

  private _processLayers(lottieLayer: Layer, col: any): void {
    if (lottieLayer instanceof ShapeLayer) {
      // shape layer contains an array of shapes
      const shapes = lottieLayer.shapes;

      shapes.forEach((shape: Shape) => {
        // generally in most cases. a shape layer has a group shape inside of it
        if (shape instanceof GroupShape) {
          // group shapes will have a shapes array that contains all of the shapes that are grouped in
          const groupedShapes = shape.shapes;

          // applying color to flat colors.
          if (typeof col === 'string') {
            const fillShape = groupedShapes.find((element: Shape) => {
              return element instanceof FillShape;
            }) as FillShape;

            if (fillShape.color.values[0]) {
              fillShape.color.values[0].value = hexToRgba(col, 1);
            }
          }
          if (typeof col === 'object') {
            const gradientFill = groupedShapes.find((element: Shape) => {
              return element instanceof GradientFillShape;
            }) as GradientFillShape;

            if (gradientFill) {
              // console.log(gradientFill);
              // console.log('type', gradientFill.gradientType);
              // console.log('start', gradientFill.startPoint.values);
              // console.log('end', gradientFill.endPoint.values);
              // console.log('colors', gradientFill.gradientColors.gradientColors.values);
              this._applyGradientFill(gradientFill, col);
            }
          }
        }
        if (shape instanceof FillShape) {
          if (shape.color.values[0]) {
            shape.color.values[0].value = hexToRgba(col, 1);
          }
        }
        // else if (shape instanceof GradientFillShape) {
        // } else if (shape instanceof GradientStrokeShape) {
        // }
      });
      // eslint-disable-next-line no-empty
    } else if (lottieLayer instanceof SolidLayer) {
      lottieLayer.solidColor = col;
    }
  }

  // private _processShapes(className: string, col: string): void {
  //   // Validate argument type
  //   if (typeof className !== 'string') {
  //     throw new Error(`ID value must be a string`);
  //   }
  //   this.animation.layers.forEach((layer) => {
  //     if (layer instanceof ShapeLayer) {
  //       layer.shapes.forEach((shape) => {
  //         if (shape instanceof GroupShape) {
  //           console.log('test ');
  //           // group shapes will have a shapes array that contains all of the shapes that are grouped in
  //           const groupedShapes = shape.shapes;

  //           groupedShapes.forEach((groupedShape) => {
  //             if (groupedShape.classNames?.includes(className) && groupedShape instanceof GroupShape) {
  //               const fillShape = groupedShape.shapes.find((element: Shape) => {
  //                 return element instanceof FillShape;
  //               }) as FillShape;

  //               if (fillShape.color.values[0]) {
  //                 fillShape.color.values[0].value = hexToRgba(col, 1);
  //               }
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }wim
  // only find layers with
  // public createConfig(): Record<string, any> {
  //   // main theme config object
  //   const themeConfig = {
  //     Name: 'testTheme' as string,
  //     Properties: [] as unknown[],
  //     Themes: [] as unknown[],
  //   };
  //   // default theme object to add to themes array
  //   const defaultTheme: Record<string, unknown> = {};

  //   const keys = Object.keys(this.colors);

  //   keys.forEach((key: string) => {
  //     const paths = key.split('.');
  //     const locator = paths[0];
  //     const name = `Color ${locator}`;
  //     const type = 'color';

  //     paths.shift();
  //     const path = paths.join('.');

  //     themeConfig.Properties.push({
  //       name,
  //       path,
  //       locator,
  //       type,
  //     });
  //     defaultTheme[name] = this.colors[key];
  //     // console.log(`${key}: ${this.colors[key]}`);
  //   });

  //   // Push the default theme into themes array.
  //   themeConfig.Themes.push({ defaultTheme });

  //   return themeConfig;
  // }

  // private _handleGroupShape(shape : GroupShape): [] {
  //   const colors = [];

  //   shapes.forEach((shape: Shape) => {
  //     if (shape instanceof GroupShape) {
  //     }
  //     if (shape instanceof FillShape) {
  //       console.log(shape.color);
  //     }
  //     // else if (shape instanceof GradientFillShape) {
  //     // } else if (shape instanceof GradientStrokeShape) {
  //     // }
  //   });

  //   return [];
  // }

  // refer to ../test/sample-config to see the what the themeConfig structure looks like
  // public applyTheme(themeConfig: Record<string, any>, themeName: string): string {
  //   // Loop through all the themes
  //   const keys = Object.keys(themeConfig['Themes']);

  //   keys.forEach((key: string) => {
  //     // Find the theme name that the user provided as argument
  //     if (Object.prototype.hasOwnProperty.call(themeConfig['Themes'][key], themeName)) {
  //       // Go through the properties inside of the theme object
  //       const themeKeys = Object.keys(themeConfig['Themes'][key][themeName]);

  //       // loop through all the properties
  //       themeKeys.forEach((ThemeKey: string) => {
  //         const propertyName = ThemeKey;
  //         const color = hexToRgba(themeConfig['Themes'][key][themeName][ThemeKey], 1);
  //         let locator = '';

  //         // Go through all the property objects to find the unique identifier from config.properties array
  //         const propertyKeys = Object.keys(themeConfig['Properties']);

  //         propertyKeys.forEach((propertyKey: string) => {
  //           if (themeConfig['Properties'][propertyKey].name === propertyName) {
  //             locator = themeConfig['Properties'][propertyKey].locator;
  //           }
  //         });
  //         // details for each color token
  //         // console.log(propertyName, color, locator);

  //         [...useRegistry().keys()]
  //           // Filter color properties
  //           .filter((property: Property) => property.type === PropertyType.COLOR)
  //           .forEach((colorProperty: Property, index: number) => {
  //             if (index === parseInt(locator, 10)) {
  //               // console.log(colorProperty);
  //               colorProperty.values.forEach((kf: KeyFrame) => {
  //                 kf.value = color;
  //               });
  //             }
  //           });
  //         // console.log(propertyName);
  //         // console.log(hexToRgba(color, '1'));
  //         // console.log(path);
  //       });
  //     }
  //   });
  //   // console.log(this.animation.toJSON());
  //   // print out lottie (just testing purposes)
  //   const data = JSON.stringify(this.animation.toJSON());
  //   // Write JSON string to a file

  //   // console.log(data);

  //   return data;
  // }
}

export default LottieTheming;

// autogen IDs by default to properties if the IDs dont exist on the lottie
// limiting to colors
