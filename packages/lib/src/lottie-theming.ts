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
  GradientFillShape,
  Layer,
  rgbaToHex,
  ColorRgba,
  GradientFillType,
  useRegistry,
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
      // const strokeCol = themeConfig[themeName][classname]?.strokeColor;

      // get the layer by classname from the lottie file
      const lottieLayers = this.animation.getLayersByClassName(classname.substring(1));
      const lottieShapes = this.animation.getShapesByClassName(classname.substring(1));

      lottieLayers.forEach((lottieLayer) => {
        if (lottieLayer) {
          if (lottieLayer instanceof ShapeLayer) {
            const shapes = lottieLayer.shapes;

            if (col) {
              this._processShapes(shapes, col);
            }
          }
          if (lottieLayer instanceof SolidLayer) {
            lottieLayer.solidColor = col;
          }
        }
      });

      if (lottieShapes.length > 0) {
        if (col) {
          this._processShapes(lottieShapes, col);
        }
      }
    });

    // apply colors to layers via id
    idKeys.forEach((id) => {
      const idString = id.substring(1);
      const col = themeConfig[themeName][id].fillColor;

      // get the layer by ID from the lottie file
      const lottieLayer = this.animation.getLayerById(idString);

      if (lottieLayer) {
        if (lottieLayer instanceof ShapeLayer) {
          const shapes = lottieLayer.shapes;

          this._processShapes(shapes, col);
        }
        if (lottieLayer instanceof SolidLayer) {
          lottieLayer.solidColor = col;
        }
      }
    });

    // console.log(this.animation.toJSON());
    // print out lottie (just testing purposes)
    const data = JSON.stringify(this.animation.toJSON());

    return data;
  }

  public autogenClasses(layer: Layer): void {
    if (layer instanceof ShapeLayer) {
      layer.shapes.forEach((shape: Shape, shapeIndex: number) => {
        if (shape instanceof GroupShape) {
          const groupedShapes = shape.shapes;

          // if its a solid color. work the solid color
          const fillShape = groupedShapes.find((element: Shape) => {
            return element instanceof FillShape;
          }) as FillShape;

          // if its a gradient fill. work the gradient fill
          const gradientFill = groupedShapes.find((element: Shape) => {
            return element instanceof GradientFillShape;
          }) as GradientFillShape;

          if (shape.id) {
            shape.id = `#${shape.id}`;
          }

          if (shape.classNames) {
            shape.classNames = `.${shape.classNames}`;
          }

          if (fillShape?.color.values[0]) {
            const color = fillShape.color.values[0].value as ColorRgba;

            // handle rgb when a is not present

            const hex = rgbaToHex([
              Math.round(color.r * 255),
              Math.round(color.g * 255),
              Math.round(color.b * 255),
              color.a,
            ]);

            const className = `.color-${hex.substring(1)}`;

            if (!shape.id && !shape.classNames) {
              shape.classNames = `${className}`;
            }
          } else if (gradientFill) {
            const className = `.gradient-${shapeIndex}`;

            if (!shape.id && !shape.classNames) {
              shape.classNames = `${className}`;
            }
          }
        }
      });
    }
    // apply classnames to shapes with each layer
    // apply classnames to shapes with the shapes array if shape is of group type
  }

  public availableColors(): Record<string, any> {
    const config = {
      defaultTheme: {} as any,
    };
    const tokens: any[] = [];
    const layers = this.animation.layers;

    layers.forEach((layer: Layer) => {
      if (layer instanceof ShapeLayer) {
        layer.shapes.forEach((shape: Shape) => {
          if (shape.classNames || shape.id) {
            if (shape instanceof GroupShape) {
              let col;
              const groupedShapes = shape.shapes;

              // if its a solid color. work the solid color
              const fillShape = groupedShapes.find((element: Shape) => {
                return element instanceof FillShape;
              }) as FillShape;

              // if its a gradient fill. work the gradient fill
              const gradientFill = groupedShapes.find((element: Shape) => {
                return element instanceof GradientFillShape;
              }) as GradientFillShape;

              if (fillShape?.color.values[0]) {
                const color = fillShape.color.values[0].value as ColorRgba;

                // handle rgb when a is not present
                col = rgbaToHex([
                  Math.round(color.r * 255),
                  Math.round(color.g * 255),
                  Math.round(color.b * 255),
                  color.a,
                ]);
              } else if (gradientFill) {
                // handle gradients. find the gradient col and return it. maybe return a placeholder first

                // console.log(gradientFill.endPoint);
                // console.log(gradientFill.gradientColors.gradientColors.values[0]?.value);

                if (Array.isArray(gradientFill.gradientColors.gradientColors.values[0]?.value)) {
                  const colObjects: any = [];

                  if (
                    gradientFill.gradientColors.gradientColors.values[0]?.value.length &&
                    gradientFill.gradientColors.gradientColors.values[0]?.value.length % 2 === 0
                  ) {
                    //
                    const splitcolors = [];

                    for (let i = gradientFill.gradientColors.gradientColors.colorCount; i > 0; i -= 1) {
                      splitcolors.push(
                        gradientFill.gradientColors.gradientColors.values[0]?.value.splice(
                          0,
                          Math.ceil(gradientFill.gradientColors.gradientColors.values[0]?.value.length / i),
                        ),
                      );
                    }
                    splitcolors.forEach((grCol: number[]) => {
                      const offset = grCol[0];

                      grCol.shift();

                      const arr = grCol.map(function (val: number) {
                        return Math.round(val * 255);
                      });

                      const obj = { offset, color: rgbaToHex([...arr, 1]) };

                      colObjects.push(obj);
                    });
                  } else {
                    // alpha or transparency is here handle if needed
                  }

                  const indexOfGFT = Object.values(GradientFillType).indexOf(
                    gradientFill.gradientType as unknown as GradientFillType,
                  );

                  const key = Object.keys(GradientFillType)[indexOfGFT];

                  col = {
                    type: key,
                    startXY: gradientFill.startPoint.values[0]?.value,
                    endXY: gradientFill.endPoint.values[0]?.value,
                    colors: colObjects,
                  };
                }
              }

              const classname = shape.classNames;
              const id = shape.id;
              const type = shape.type;
              const name = shape.name;

              tokens.push({ classname, type, col, name });

              if (classname) {
                config.defaultTheme[classname] = { fillColor: col };
              } else if (id) {
                config.defaultTheme[id] = { fillColor: col };
              }
            }
          }
        });
      }
    });

    return config;
  }

  public changeClass(className: string): void {
    // Validate argument type
    if (typeof className !== 'string') {
      throw new Error(`ID value must be a string`);
    }

    this.animation.layers.forEach((layer) => {
      if (layer instanceof ShapeLayer) {
        layer.shapes.forEach((shape) => {
          if (shape.classNames?.includes(className)) {
            shape.classNames = className;
          }
          if (shape instanceof GroupShape) {
            // group shapes will have a shapes array that contains all of the shapes that are grouped in
            const groupedShapes = shape.shapes;

            groupedShapes.forEach((groupedShape) => {
              if (groupedShape.classNames?.includes(className)) {
                shape.classNames = className;
              }
            });
          }
        });
      }
    });
  }

  //  public function changeColor(){}
  public async init(src: string): Promise<Animation> {
    useRegistry().clear();
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

  public async mapAnimation(src: string): Promise<Animation> {
    const anim = await Animation.fromURL(src);

    this.animation = anim;

    return anim;
  }

  public preprocessAnimation(): string {
    this.animation.layers.forEach((layer: Layer) => {
      this.autogenClasses(layer);
    });
    const data = JSON.stringify(this.animation.toJSON());

    return data;
  }

  private _applyGradientColor(currentFill: GradientFillShape, fillToApply: any): void {
    const colors: number[][] = [];
    let colorCount = 0;

    fillToApply.colors.forEach((colObject: any) => {
      // const alpha = parseFloat(colObject.alpha);
      const rgba = hexToRgba(colObject.color, null);

      rgba.unshift(colObject.offset);
      colors.push(rgba);

      colorCount += 1;
    });

    if (currentFill.startPoint.values[0] && currentFill.endPoint.values[0]) {
      currentFill.startPoint.values[0].value = fillToApply.startXY;
      currentFill.endPoint.values[0].value = fillToApply.endXY;
    }
    if (currentFill.gradientColors.gradientColors.values[0]) {
      currentFill.gradientColors.gradientColors.values[0].value = colors.flat();
      currentFill.gradientColors.gradientColors.colorCount = colorCount;
    }
  }

  private _processShapes(shapes: Shape[], col: any): void {
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
            this._applyGradientColor(gradientFill, col);
          }
        }
      }
      if (shape instanceof FillShape) {
        if (shape.color.values[0]) {
          shape.color.values[0].value = hexToRgba(col, 1);
        }
      }
    });
  }

  // public createConfig() {}
}

export default LottieTheming;

// autogen IDs by default to properties if the IDs dont exist on the lottie
// limiting to colors
