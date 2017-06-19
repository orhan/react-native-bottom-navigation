/**
* Native Touchable.
* Native component used for the Ripple effect.
*/

/* --- Imports --- */

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  requireNativeComponent,
  Platform,
  PixelRatio,
  View,
} from 'react-native';


/* --- Class methods --- */

const NativeTouchable = React.createClass({

  /* --- Private methods --- */

  _onTouchEvent(event) {
    if (this.props.onTouch) {
      const evt = event.nativeEvent;
      evt.x = Platform.OS === 'android' ? evt.x / PixelRatio.get() : evt.x;
      evt.x = Platform.OS === 'android' ? evt.x / PixelRatio.get() : evt.x;
      this.props.onTouch(evt);
    }
  },


  /* --- Public methods --- */

  measure(cb) {
    return this.refs.node.measure(cb);
  },


  /* --- Rendering methods --- */

  render() {
    return (
      <NativeTouchableView
        ref="node"
        {...this.props}
        style={this.props.style}
        onChange={this._onTouchEvent}
        onLayout={this.props.onLayout}
        >
        {this.props.children}
      </NativeTouchableView>
    );
  }
});


/* --- Component setup --- */

NativeTouchable.propTypes = {
  ...View.propTypes,

  // Touch events callback
  onTouch: PropTypes.func,
};

const NativeTouchableView = requireNativeComponent('BNTouchableView', {
  name: 'NativeTouchable',
  propTypes: NativeTouchable.propTypes,
}, {
  nativeOnly: {
    nativeBackgroundAndroid: true,
    nativeForegroundAndroid: true,
  },
});


/* --- Module exports --- */

module.exports = NativeTouchable;
