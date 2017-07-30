/**
* React Native Bottom Navigation.
* A top-level component following the 'Bottom navigation' Material Design spec.
*/
'use strict';

/* --- Imports --- */

import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Animated,
  Easing,
  ScrollView,
  Platform,
  StyleSheet,
  ViewPagerAndroid,
} from 'react-native';

import PropTypes from 'prop-types';
import BottomTabBar from './BottomTabBar';


/* --- Member variables --- */

let overlayTabs;
let tabBarProps = {};


/* --- Class methods --- */

export default class BottomNavigation extends Component {

  /* --- Component setup -- */

  static propTypes = {
    tabBarPosition: PropTypes.oneOf(['top', 'bottom', 'overlayTop', 'overlayBottom', ]),
    initialPage: PropTypes.number,
    page: PropTypes.number,
    locked: PropTypes.bool,
    onChangeTab: PropTypes.func,
    onScroll: PropTypes.func,
    renderTabBar: PropTypes.any,
    style: View.propTypes.style,
    contentProps: PropTypes.object,
  };

  static defaultProps = {
    tabBarPosition: 'bottom',
    initialPage: 0,
    page: -1,
    locked: true,
    animated: false,
    onChangeTab: () => {},
    onScroll: () => {},
    contentProps: {},
  };


  /* --- Lifecycle methods --- */

  constructor(props) {
    super(props);

    this.state = {
      currentPage: this.props.initialPage || 0,
      scrollValue: new Animated.Value(this.props.initialPage),
      containerWidth: Dimensions.get('window').width,
      animationValue: new Animated.Value(1),
    };
  }

  componentWillReceiveProps(props) {
    if (props.page >= 0 && props.page !== this.state.currentPage) {
      this.goToPage(props.page);
    }
  }


  /* --- Public methods --- */

  scrollToTop(pageNumber) {
    if (this.props.onScrollToTop) {
      this.props.onScrollToTop({ i: pageNumber, ref: this._children()[pageNumber], });
    }
  }

  goToPage(pageNumber) {
    if (this.props.onChangeTab) {
      this.props.onChangeTab({ i: pageNumber, ref: this._children()[pageNumber], });
    }

    if (Platform.OS === 'ios') {
      const offset = pageNumber * this.state.containerWidth;
      this.scrollView.scrollTo({x: offset, y: 0, animated: this.props.animated});
    } else {
      if (this.props.animated) {
        this.scrollView.setPage(pageNumber);
      } else {
        this.scrollView.setPageWithoutAnimation(pageNumber);
      }
    }

    this.state.animationValue.setValue(0);
    Animated.timing(this.state.animationValue, {
      fromValue: 0,
      toValue: 1,
      duration: 200,
    }).start();

    this.setState({currentPage: pageNumber});
  }


  /* --- Private methods --- */

  _updateTabBarProps() {
    overlayTabs = (this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom');
    tabBarProps = {
      scrollToTop: this.scrollToTop.bind(this),
      goToPage: this.goToPage.bind(this),
      tabs: this._children().map((child) => {
        return {
          icon: child.props.tabIcon,
          name: child.props.tabLabel,
          maskColor: child.props.tabMaskColor,
          rippleColor: child.props.tabRippleColor,
          activeColor: child.props.tabActiveColor,
          backgroundColor: child.props.tabBackgroundColor,
          animationValue: new Animated.Value(0),
        }
      }),
      activeTab: this.state.currentPage,
      backgroundColor: this.props.tabBarColor,
      borderWidth: this.props.tabBarBorderWidth,
      borderColor: this.props.tabBarBorderColor,
      labelStyle: this.props.labelStyle,
      activeColor: this.props.activeColor,
      inactiveColor: this.props.inactiveColor,
      inactiveFontSize: this.props.inactiveFontSize || 12,
      activeFontSize: this.props.activeFontSize || 14,
      scrollValue: this.state.scrollValue,
      containerWidth: this.state.containerWidth,
      rippleColor: this.props.rippleColor || this.props.maskColor,
      maskColor: this.props.maskColor || this.props.rippleColor,
    };

    if (overlayTabs) {
      tabBarProps.style = {
        position: 'absolute',
        left: 0,
        right: 0,
        [this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom']: 0,
      };
    }
  }

  _updateSelectedPage(currentPage) {
    let localCurrentPage = currentPage;
    if (typeof localCurrentPage === 'object') {
      localCurrentPage = currentPage.nativeEvent.position;
    }

    this.state.animationValue.setValue(0);
    Animated.timing(this.state.animationValue, {
      fromValue: 0,
      toValue: 1,
      easing: Easing.ease,
      duration: 150,
    }).start();

    this.setState({currentPage: localCurrentPage, }, () => {
      this.props.onChangeTab({ i: localCurrentPage, ref: this._children()[localCurrentPage], });
    });
  }

  _updateScrollValue(value) {
    this.state.scrollValue.setValue(value);
    this.props.onScroll(value);
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
  * Renders the tab bar.
  */
  renderTabBar(props) {
    if (this.props.renderTabBar === false) {
      return null;
    } else if (this.props.renderTabBar) {
      return React.cloneElement(this.props.renderTabBar(), props);
    } else {
      return <BottomTabBar {...props} />;
    }
  }

  /**
  * Renders a horizontal ScrollView on iOS and a native ViewPager on Android.
  */
  renderScrollableContent() {
    if (Platform.OS === 'ios') {
      return (
        <ScrollView
          ref={(scrollView) => { this.scrollView = scrollView; }}
          style={styles.scrollableContentIOS}
          contentContainerStyle={styles.scrollableContentContainerIOS}
          contentOffset={{ x: this.props.initialPage * this.state.containerWidth, }}
          horizontal
          pagingEnabled
          scrollEnabled={!this.props.locked}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled
          alwaysBounceVertical={false}
          keyboardDismissMode="on-drag"
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            this._updateScrollValue(offsetX / this.state.containerWidth);
          }}
          onMomentumScrollBegin={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const page = Math.round(offsetX / this.state.containerWidth);
            if (this.state.currentPage !== page) {
              this._updateSelectedPage(page);
            }
          }}
          onMomentumScrollEnd={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const page = Math.round(offsetX / this.state.containerWidth);
            if (this.state.currentPage !== page) {
              this._updateSelectedPage(page);
            }
          }}
          {...this.props.contentProps}
          >
          {
            this._children().map((child, idx) => {
              return (
                <View
                  key={child.props.tabLabel + '_' + idx}
                  style={{width: this.state.containerWidth, }}
                  >
                  {child}
                </View>
              );
            })
          }
        </ScrollView>
      );
    }

    else {
      return (
        <ViewPagerAndroid
          ref={(scrollView) => { this.scrollView = scrollView; }}
          style={styles.scrollableContentAndroid}
          scrollEnabled={!this.props.locked}
          initialPage={this.props.initialPage}
          onPageSelected={this._updateSelectedPage}
          keyboardDismissMode="on-drag"
          onPageScroll={(e) => {
            const { offset, position, } = e.nativeEvent;
            this._updateScrollValue(position + offset);
          }}
          {...this.props.contentProps}
          >
          {
            this._children().map((child, idx) => {
              return (
                <View
                  key={child.props.tabLabel + '_' + idx}
                  style={{width: this.state.containerWidth, }}
                  >
                  {child}
                </View>
              );
            })
          }
        </ViewPagerAndroid>
      );
    }
  }

  /**
  * Renders the component itself.
  */
  render() {
    this._updateTabBarProps();

    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={this._handleLayout.bind(this)}
        >
        {tabBarProps && this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps)}
        <Animated.View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            opacity: this.state.animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          }}
          >
        {this.renderScrollableContent()}
        </Animated.View>
        {tabBarProps && (this.props.tabBarPosition === 'bottom' || this.state.overlayTabs) && this.renderTabBar(tabBarProps)}
      </View>
    );
  }
}


/* --- Stylesheet --- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
