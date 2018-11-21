/**
* React Native Bottom Navigation.
* A top-level component following the 'Bottom navigation' Material Design spec.
*/


/* --- Imports --- */

import React, {Component, } from 'react';
import {
  Dimensions,
  View,
  Animated,
  Easing,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';

import PropTypes from 'prop-types';
import BottomTabBar from './BottomTabBar';
import DisplayLabels from './DisplayLabels';


/* --- Member variables --- */

let overlayTabs;
let tabBarProps = {};


/* --- Class methods --- */

export default class BottomNavigation extends Component {

  /* --- Component setup -- */

  static propTypes = {
    style: (ViewPropTypes || View.propTypes).style,
    initialPage: PropTypes.number,
    page: PropTypes.number,
    animated: PropTypes.bool,
    animatedTabSwitch: PropTypes.bool,
    animatedTabSwitchDuration: PropTypes.number,
    onChangeTab: PropTypes.func,
    onScroll: PropTypes.func,
    renderTabBarBackground: PropTypes.any,
    translucent: PropTypes.bool,
  };

  static defaultProps = {
    initialPage: 0,
    page: -1,
    animated: false,
    animatedTabSwitch: true,
    animatedTabSwitchDuration: 100,
    translucent: false,
    onChangeTab: () => {},
    onScroll: () => {},
  };

  static DisplayLabels = DisplayLabels;


  /* --- Lifecycle methods --- */

  constructor(props) {
    super(props);

    this.state = {
      currentPage: this.props.initialPage || 0,
      scrollValue: new Animated.Value(this.props.initialPage),
      containerWidth: Dimensions.get('window').width,
      
      animationValue: new Animated.Value(1),
      bottomBarAnimation: new Animated.Value(0),
      bottomBarHidden: false,
    };
  }

  componentWillReceiveProps(props) {
    if (props.page >= 0 && props.page !== this.state.currentPage) {
      this.goToPage(props.page);
    }
  }


  /* --- Public methods --- */

  toggleBottomBar() {
    const { bottomBarHidden } = this.state;
    
    if (bottomBarHidden) {
      this.showBottomBar();
    } else {
      this.hideBottomBar();
    }
  }
  
  hideBottomBar() {
    const { bottomBarAnimation } = this.state;
    
    Animated.timing(bottomBarAnimation, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
    }).start(() => {
      this.setState({ bottomBarHidden: true });
    })
  }
  
  showBottomBar() {
    const { bottomBarAnimation } = this.state;
    
    Animated.timing(bottomBarAnimation, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
    }).start(() => {
      this.setState({ bottomBarHidden: false });
    })
  }
  
  scrollToTop(pageNumber) {
    if (this.props.onScrollToTop) {
      this.props.onScrollToTop({ i: pageNumber, ref: this._children()[pageNumber], });
    }
  }

  goToPage(pageNumber) {
    if (this.props.onChangeTab) {
      this.props.onChangeTab({ i: pageNumber, ref: this._children()[pageNumber], });
    }

    this.state.animationValue.setValue(0);
    this.setState({currentPage: pageNumber}, () => {
      Animated.timing(this.state.animationValue, {
        fromValue: 0,
        toValue: 1,
        duration: this.props.animatedTabSwitchDuration,
        easing: Easing.ease,
      }).start();
    });
  }


  /* --- Private methods --- */

  _updateTabBarProps() {
    const { 
      renderTabBarBackground, 
      tabBarColor, 
      tabBarBorderWidth,
      tabBarBorderColor,
      displayLabels,
      tabStyle,
      labelStyle,
      activeColor,
      inactiveColor,
      inactiveFontSize,
      activeFontSize,
      rippleColor,
      maskColor
    } = this.props;
    
    const { currentPage, scrollValue, containerWidth } = this.state;
    
    tabBarProps = {
      scrollToTop: this.scrollToTop.bind(this),
      goToPage: this.goToPage.bind(this),
      tabs: this._children().map((child) => {
        return {
          enabled: child.props.enabled !== undefined ? child.props.enabled : true,
          icon: child.props.tabIcon,
          name: child.props.tabLabel,
          maskColor: child.props.tabMaskColor,
          rippleColor: child.props.tabRippleColor,
          activeColor: child.props.tabActiveColor,
          backgroundColor: child.props.tabBackgroundColor,
          animationValue: new Animated.Value(0),
          badgeValue: child.props.badgeValue,
          badgeStyle: child.props.badgeStyle,
          renderBadge: child.props.renderBadge,
        };
      }),
      activeTab: currentPage,
      renderBackground: renderTabBarBackground,
      backgroundColor: tabBarColor,
      borderWidth: tabBarBorderWidth,
      borderColor: tabBarBorderColor,
      displayLabels: displayLabels || DisplayLabels.DEFAULT,
      tabStyle: tabStyle,
      labelStyle: labelStyle,
      activeColor: activeColor,
      inactiveColor: inactiveColor,
      inactiveFontSize: inactiveFontSize || 12,
      activeFontSize: activeFontSize || 14,
      scrollValue: scrollValue,
      containerWidth: containerWidth,
      rippleColor: rippleColor || maskColor,
      maskColor: maskColor || rippleColor,
    };
  }

  _handleLayout(e) {
    const { width, } = e.nativeEvent.layout;

    if (width !== this.state.containerWidth) {
      this.setState({ containerWidth: width, });
      if (this.requestAnimationFrame) {
        this.requestAnimationFrame(() => {
          this.goToPage(this.state.currentPage);
        });
      }
    }
  }

  _children() {
    return React.Children.map(this.props.children, (child) => child);
  }

  /* --- Rendering methods --- */

  /**
  * Renders the component itself.
  */
  render() {
    const { translucent, animatedTabSwitch } = this.props;
    const { currentPage, animationValue, bottomBarAnimation } = this.state;
    
    this._updateTabBarProps();

    return (
      <Animated.View
        style={[styles.container, this.props.style]}
        onLayout={this._handleLayout.bind(this)}>
        <Animated.View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            marginBottom: translucent ? 0 : bottomBarAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [56, 0],
            }),
            opacity: animatedTabSwitch ? animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }) : 1,
          }}>
          { 
            this._children().map((child, index) => {
              const isCurrentPage = (index === currentPage);
            
              return (
                <View 
                  key={child.props.tabId + "-" + child.props.tabLabel}
                  style={[
                    StyleSheet.absoluteFill, 
                    isCurrentPage ? null : { opacity: 0 }
                  ]}
                  pointerEvents={isCurrentPage ? 'auto' : 'none'}>
                  {child}
                </View>
              )
            }) 
          }
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.bottomBar,
            {
              transform: [{
                translateY: bottomBarAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 56],
                })
              }]
            }
          ]}
          >
          <BottomTabBar {...tabBarProps} />
        </Animated.View>
      </Animated.View>
    );
  }
}


/* --- Stylesheet --- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  scrollableContentContainerIOS: {
    flex: 1,
  },

  scrollableContentIOS: {
    flexDirection: 'column',
  },

  scrollableContentAndroid: {
    flex: 1,
  },
  
  bottomBar: {
    position: 'absolute',
    height: 56,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
