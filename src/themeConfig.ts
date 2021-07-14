class ThemeConfig {
    /**
     *
     */
    constructor() {
        this.properties = new Array<Property>();
        this.themes = new Array<Theme>();
    }

    properties: Array<Property>;
    themes: Array<Theme>;

    toJSON() : string {
        return JSON.stringify(this);
    }

    tempScaffold(): void {
        this.properties.push(Property.);
    }
}

class Property {
    constructor(name: string, locator: string, locatorType: locatorType) {
        this.name = name;
        this.locator = locator;
        this.locatorType = locatorType;
    }
    
    name: string;
    locator: string;
    locatorType: locatorType;
}

type Theme = {  
    name: string,  
    properties: Record<string,string>
}

enum locatorType {
    JsonPath
}

export { ThemeConfig, Theme, Property };