
## react-native-bottom-navigation

This is a top-level component following the ['Bottom navigation' Material Design](https://material.google.com/components/bottom-navigation.html#) specifications.


## Installation

1. 

`npm install --save react-native-bottom-navigation`

2a. Using RNPM (React-Native Package Manager):

`rnpm link react-native-bottom-navigation`

2b. Manually (iOS):

  1. Add node_modules/react-native-bottom-navigation/iOS/RCTBottomNavigation.xcodeproj to your xcode project, usually under the Libraries group
  
  2. Add libRCTBottomNavigation.a (from Products under RCTBottomNavigation.xcodeproj) to build target's *Linked Frameworks and Libraries* list

2c. Manually (Android):

  1. Add the following snippet to your `android/settings.gradle`:
```
include ':RNBottomNavigation'
project(':RNBottomNavigation').projectDir = file('../node_modules/react-native-bottom-navigation/android')
```

  2. Declare the dependency in your `android/app/build.gradle`
```
dependencies {
    ...
    compile project(':RNBottomNavigation')
}
```

  3.
```
import com.github.orhan.bottomnavigation.ReactBottomNavigationPackage;          <-- Import this!

...

@Override protected
List<ReactPackage> getPackages() {
  return Arrays.asList(
    new MainReactPackage(),
    new ReactBottomNavigationPackage()                                          <-- Add this!
  );
}
```

## Usage

1. `const BottomNavigation = require('react-native-bottom-navigation');`

2.

```html
<BottomNavigation
  style={styles.container}
  activeColor="rgb(0, 100, 125)"
  inactiveColor="#757575"
  >
  <View
    style={styles.child}
    tabLabel="Tab 1"
    tabIcon={require('./icons/ic_tab_1.png')}
    />

  <View
    style={styles.child}
    tabLabel="Tab 2"
    tabIcon={require('./icons/ic_tab_2.png')}
    />

  <View
    style={styles.child}
    tabLabel="Tab 3"
    tabIcon={require('./icons/ic_tab_3.png')}
    />

  <View
    style={styles.child}
    tabLabel="Tab 4"
    tabIcon={require('./icons/ic_tab_4.png')}
    />
</BottomNavigation>
```

## Example Project

You can check out the [Example Project](https://github.com/orhan/react-native-bottom-navigation-example) to get a better understanding of this library.

## Props Reference

`TODO`

## Acknowledgements

This library is based on the fantastic work of the [React-Native Material-Kit](https://github.com/xinthink/react-native-material-kit) by [xinthink](https://github.com/xinthink). So if you are interested in having the ripple effect in other areas of your app, you can check that library out.

---

**MIT Licensed**
