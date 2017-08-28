/**
 * Bottom Tab Bar.
 * Tab bar implementation for the Bottom-Navigation-View.
 */
'use strict';

/* --- Imports --- */

import React, {Component} from 'react';
import {
  Platform,
  Dimensions,
  StyleSheet,
  Animated,
  Easing,
  View,
  Image,
} from 'react-native';

import PropTypes from 'prop-types';

import DisplayLabels from './DisplayLabels';
import Button from './Button';
import Ripple from './Ripple';

import parseColor from 'parse-color';


/* --- Member variables --- */

let tabPositions = {};
let backgroundColor;
let maskColor;
let rippleColor;


/* --- Class methods --- */

export default class BottomTabBar extends Component {

  /* --- Component setup --- */

  static propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    underlineColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    activeColor: PropTypes.string,
    inactiveColor: PropTypes.string,
  };


  /* --- Lifecycle methods --- */

  constructor(props) {
    super(props);

    let tabWidths = this.setTabWidth(this.props.tabs.length);
    let nextBackgroundColor = this.props.backgroundColor || '#FFFFFF';
    let activeTab = this.props.activeTab || 0;
    let animationValue = 0;

    if (this.props.tabs && this.props.tabs.length > 0 && this.props.tabs[activeTab].backgroundColor) {
      nextBackgroundColor = this.props.tabs[activeTab].backgroundColor;
      animationValue = 1;
    }

    let numberOfTabs = this.props.tabs.length;
    let screenWidth = Dimensions.get('window').width;
    let maxTabWidth = numberOfTabs <= 3 ? (3 * 168) : 168 + (numberOfTabs - 1) * 96;
    let justifyTabs = maxTabWidth < screenWidth ? 'center' : 'space-around';

    this.state = {
      lastTab: activeTab,
      inactiveTabWidth: tabWidths.inactiveTabWidth,
      activeTabWidth: tabWidths.activeTabWidth,
      backgroundColor: this.props.backgroundColor || '#FFFFFF',
      nextBackgroundColor: nextBackgroundColor,
      animationValue: new Animated.Value(1),
      screenWidth,
      maxTabWidth,
      justifyTabs
    }
  }

  componentDidMount() {
    this.props.tabs[this.state.lastTab].animationValue.setValue(1);
  }

  componentWillReceiveProps(nextProps) {
    let tabWidths = this.setTabWidth(nextProps.tabs.length);

    let numberOfTabs = nextProps.tabs.length;
    let maxTabWidth = numberOfTabs <= 3 ? (3 * 168) : 168 + (numberOfTabs - 1) * 96;
    let justifyTabs = maxTabWidth < this.state.screenWidth ? 'center' : 'space-around';

    this.setState({
      lastTab: this.props.activeTab,
      inactiveTabWidth: tabWidths.inactiveTabWidth,
      activeTabWidth: tabWidths.activeTabWidth,
      maxTabWidth,
      justifyTabs
    });
  }


  /* --- Private methods --- */

  setTabWidth(tabCount) {
    let screenWidth = Dimensions.get('window').width;

    // We have three tabs or less, distribute them evenly.
    if (tabCount <= 3 || this.props.displayLabels === DisplayLabels.ALWAYS) {
      let tabWidth = screenWidth / tabCount;

      if (tabWidth > 168) {
        tabWidth = 168;
      }

      return {inactiveTabWidth: tabWidth, activeTabWidth: tabWidth};
    }

    // We have more than three tabs, calculate active and inactive tab width.
    else {
      let activeTabWidth = screenWidth / tabCount;

      if (activeTabWidth > 168) {
        activeTabWidth = 168;
      } else if (activeTabWidth < 96) {
        activeTabWidth = 96;
      }

      let inactiveTabWidth = activeTabWidth / 1.75;

      if (inactiveTabWidth > 96) {
        inactiveTabWidth = 96;
      } else if (inactiveTabWidth < 56) {
        inactiveTabWidth = 56;
      }

      return {inactiveTabWidth: inactiveTabWidth, activeTabWidth: activeTabWidth};
    }
  }


  /* --- Rendering methods --- */

  renderTabOption(tab, page) {
    const isTabActive = this.props.activeTab === page;
    const activeColor = this.props.activeColor || 'black';
    const inactiveColor = this.props.inactiveColor || 'grey';
    const iconStyle = {alignSelf: 'center', height: 24};

    tab.animationValue.setValue(this.state.lastTab === page ? 1 : 0);

    Animated.timing(tab.animationValue, {
      toValue: isTabActive ? 1 : 0,
      duration: 150,
    }).start();

    let hideLabels = this.props.displayLabels === DisplayLabels.NEVER;
    let showAllLabels = (this.props.tabs.length <= 3 && this.props.displayLabels !== DisplayLabels.ACTIVE_TAB_ONLY) || this.props.displayLabels === DisplayLabels.ALWAYS;

    return (
      <Animated.View
        key={tab.name}
        style={[
          {
            alignSelf: 'stretch',
            alignItems: 'center',
            width: tab.animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [this.state.inactiveTabWidth, this.state.activeTabWidth],
            }),
          }
        ]}
        onLayout={(layoutEvent) => {
          let left = layoutEvent.nativeEvent.layout.x;
          let top = layoutEvent.nativeEvent.layout.y;

          tabPositions[tab.name] = {x: left, y: top};
        }}
        >
        <Button
          style={{
            alignSelf: 'stretch',
            justifyContent: hideLabels ? 'center' : 'flex-end',
            height: 56,
          }}
          pointerEvents='box-only'
          enabled={true}
          maskColor={this.props.tabs.length <= 3 ? (tab.maskColor || this.props.maskColor) : 'rgba(255, 255, 255, 0.055)'}
          rippleBorderRadiusPercent={this.props.tabs.length <= 3 ? (Platform.OS === 'ios' ? 25 : 100) : 50}
          rippleColor={this.props.tabs.length <= 3 ? (tab.rippleColor || this.props.rippleColor) : 'rgba(255, 255, 255, 0.055)'}
          rippleDuration={this.props.tabs.length <= 3 ? 100 : 50}
          rippleLocation="center"
          onPress={() => {
            if (isTabActive) {
              this.props.scrollToTop(page);
              return;
            } else if (!tab.enabled) {
              return
            }

            this.props.goToPage(page);

            this.setState({nextBackgroundColor: tab.backgroundColor || this.props.backgroundColor});
            this.state.animationValue.setValue(0);

            Animated.timing(this.state.animationValue, {
              toValue: 1,
              delay: 75,
              duration: 25,
            }).start();
          }}
          onTouch={(touchEvent) => {
            switch (touchEvent.type) {
              case 'TOUCH_DOWN':
                if (this.refs.mainRipple) {
                  maskColor = tab.maskColor;
                  if (!maskColor && tab.backgroundColor) {
                    let color = parseColor(tab.backgroundColor).rgba;
                    color[3] = 0.2;

                    maskColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
                  } else if (!maskColor) {
                    maskColor = this.props.maskColor;
                  }

                  rippleColor = tab.rippleColor;
                  if (!rippleColor && tab.backgroundColor) {
                    let color = parseColor(tab.backgroundColor).rgba;
                    color[3] = 0.75;

                    rippleColor = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
                  } else if (!rippleColor) {
                    rippleColor = this.props.rippleColor;
                  }

                  let tabPosition = tabPositions[tab.name];
                  let backgroundColor = tab.backgroundColor || this.props.backgroundColor;

                  if (this.props.tabs.length > 3 || backgroundColor !== this.state.nextBackgroundColor) {
                    this.refs.mainRipple.setColors(maskColor, rippleColor);
                    this.refs.mainRipple.setCoordinates(tabPosition.x + touchEvent.x, tabPosition.y + touchEvent.y);
                    this.refs.mainRipple.showRipple();
                  }
                }
                break;
              case 'TOUCH_UP':
              case 'TOUCH_CANCEL':
                if (this.refs.mainRipple) {
                  this.refs.mainRipple.hideRipple();
                }
                break;
              default:
                break;
            }
          }}
          >
          <Animated.View
            style={[
              styles.tab,
              this.props.tabStyle,
              {
                paddingBottom: tab.animationValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: hideLabels ? [0, 1] : [showAllLabels ? 7 : 15, 7 - ((this.props.activeFontSize - this.props.inactiveFontSize) / 2)],
                }),
              }
            ]}
            pointerEvents="none"
            >
            <Image
              style={[iconStyle, {tintColor: isTabActive ? (tab.activeColor || activeColor) : inactiveColor}]}
              source={tab.icon}
              resizeMode="contain"
              pointerEvents="none"
            />

            {
              hideLabels ?
                null
                :
                <Animated.Text
                  style={[
                    {
                      alignSelf: 'center',
                      marginTop: 1.5,
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                    },
                    this.props.labelStyle,
                    {
                      fontSize: tab.animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [showAllLabels ? this.props.inactiveFontSize : 0.25, this.props.activeFontSize],
                      }),
                      opacity: showAllLabels ? 1 : tab.animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                      color: isTabActive ? (tab.activeColor || activeColor) : inactiveColor,
                    },
                  ]}
                  numberOfLines={1}
                  pointerEvents="none"
                  >
                  {tab.name}
                </Animated.Text>
            }
          </Animated.View>
        </Button>
      </Animated.View>
    );
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            width: this.state.screenWidth,
            borderTopWidth: this.props.borderWidth || StyleSheet.hairlineWidth,
            borderTopColor: this.props.borderColor || '#E5E5E5',
            backgroundColor: this.state.backgroundColor
          }
        ]}
        >
        <View
          style={[
            styles.tabs,
            {
              justifyContent: this.state.justifyTabs,
            },
          ]}
          >
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: this.state.nextBackgroundColor,
              opacity: this.state.animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            }}
          />

          <Ripple
            ref="mainRipple"
            style={styles.ripple}
            rippleDuration={100}
            rippleColor={rippleColor || this.props.rippleColor}
            maskColor={maskColor || this.props.maskColor}
          />

          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
      </View>
    );
  }
}


/* --- Stylesheet --- */

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 56,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  tabs: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },

  ripple: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
});
