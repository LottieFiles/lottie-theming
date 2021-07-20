/**
 * Copyright 2021 Design Barn Inc.
 */

export default class ThemeConfig {
  public properties: Property[] = [];

  public themes: Theme[] = [];

  public static fromJSON(json: string): ThemeConfig {
    const model = JSON.parse(json);

    const config = new ThemeConfig();

    if (!model.Properties || !model.Themes) {
      throw new Error('');
    }
    model.Properties.forEach((element: Property) => {
      config.properties.push(element);
    });

    model.Themes.forEach((element: Theme) => {
      config.themes.push(element);
    });

    return config;
  }

  public static toJSON(): string {
    //
    return '';
  }
}

interface Theme {
  name: string;
}

interface Property {
  locator: string;
  locatorType: string;
  name: string;
}
