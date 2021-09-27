## Lottie Theming Library

This is a library to extract themable properties and apply different themes to a given Lottie

### In Javascript or TypeScript:

1. Install package using npm or yarn.

```shell
npm install --save @lottiefiles/lottie-theming
```

2. Import package in your code.

```javascript
import { LottieTheming } from '@lottiefiles/lottie-theming';
```

## Usage

Given a Lottie this library enables extraction of colors and other properties(WIP) from the Lottie and creates a
configuration file with the editable properties. During runtime/implementation on your apps you may apply different
themes with your own logic. For example, you could edit this configuration file and add a light theme and a dark theme
color palette (see config file structure for reference). In your app you can then use this Library to generate a new
Lottie with the given theme applied. You could for example pair this with the Lottie player to play a dark themed Lottie
at night and a light themed Lottie during the day. Ofcourse its not only time based, you could write logic to change a
Lottie given your own parameters such as location.

### Creating theme configuration file and color extraction

1. Initialise the Library by creating a new instance of LottieTheming.
2. Then call the init method along with the url of the Lottie.
3. Call the create config method which will return to you the theme configuration file. This file shows the colors that
   are themeable and you may add color palettes to this config file.

```javascript
const theming = new LottieTheming();
await theming.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');
const themeConfig = theming.createConfig();
```

The example below shows a sample configuration file. Given a Lottie, the library is able to extract out each color and
show the user exactly, which frame, shape, and layer the color belongs to. With this information the user is able to add
multiple color palettes to a Lottie. Applying the theme happens in runtime which will be explained further in this
guide.

```javascript
     {
       Name: 'testTheme',
       Properties: [
         {
           name: 'Color 0',
           path: 'Frame 0 <- Stroke 1 <- Ellipse 1 <- Shape Layer 4',
           locator: '0'
         },
         {
           name: 'Color 1',
           path: 'Frame 0 <- Fill 1 <- Ellipse 1 <- Shape Layer 4',
           locator: '1'
         },
         {
           name: 'Color 2',
           path: 'Frame 0 <- Stroke 1 <- Ellipse 1 <- Shape Layer 3',
           locator: '2'
         }
       ],
       Themes: [
         {
           defaultTheme: {
             'Color 0': '#13427dff',
             'Color 1': '#13427dff',
             'Color 2': '#5bb3bcff',
           }
         },
         {
           darkTheme: {
             'Color 0': '#ffffffff',
             'Color 1': '#ffffffff',
             'Color 2': '#000000ff',
             'Color 3': '#000000ff',

           }
         }
       ]
     }
```

### Adding themes

To add themes, currently you can directly modify the theme config file and add a named object to the Themes array. The
format must be as follows

```javascript
  {
      defaultTheme: {
        'Color 0': '#13427dff',
        'Color 1': '#13427dff',
        'Color 2': '#5bb3bcff',
      }
  },
```

The color names must remain as per the name in the Properties array. There is no unique identifier inside of the Lottie
format and therefore the ID is set via the Library.

### Applying themes

When using this Library to apply themes, assuming your configuration file now has themes other than the default theme
added to it, do remember that the instance of the theming library used must be saved to your state and the same instance
must be used to apply the Theme. Assuming that you have already called the init method and initialsed the library, you
may just call the applyTheme method and pass in the theme configuration file as a JSON object along with the preferred
theme to apply. This method will then return back a Lottie that you can load into the player.

```javascript
// if you have not initialised the library. please do so and call the init method
const theming = new LottieTheming();
theming.init('https://assets3.lottiefiles.com/packages/lf20_wgh8xmh0.json');

// apply theme
const lottie = theming.applyTheme(themeConfig, themeName);

// if time = day
const lottie = theming.applyTheme(themeConfig, 'LightTheme');
// load this returned object to the player

// if time = night
const lottie = theming.applyTheme(themeConfig, 'DarkTheme');
// load this returned object to the player
```

## Testing and development

Testing with jest is set up and you can run yarn test to run the .test file. The source code is located in
packages/lib/src/lottie-theming.ts. This library depends on color extraction from the
[Lottie-JS Library](https://github.com/LottieFiles/lottie-js) which allows the user to map a Lottie into an object model
with named properties. Do have a look at Lottie-JS Library here [click here](https://github.com/LottieFiles/lottie-js)

1. git clone repo

2. yarn install

3. yarn test

## License

MIT License © LottieFiles.com
