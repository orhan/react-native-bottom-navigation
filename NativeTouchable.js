/**
* Native Touchable.
* Native component used for the Ripple effect.
*/

/* --- Imports --- */

import React, {
  Component,
} from 'react';

import {
  requireNativeComponent,
  Platform,
  PixelRatio,
  View,
} from 'react-native';

import PropTypes from 'prop-types';


/* --- Component setup --- */

const NativeTouchableView = requireNativeComponent('BNTouchableView', {
  name: 'NativeTouchable',
  propTypes: {
    ...View.propTypes,

    // Touch events callback
    onTouch: PropTypes.func,
  },
}, {
  nativeOnly: {
    nativeBackgroundAndroid: true,
    nativeForegroundAndroid: true,
  },
});


/* --- Class methods --- */

export default class NativeTouchable extends Component {

  static propTypes = {
    ...View.propTypes,

    // Touch events callback
    onTouch: PropTypes.func,
  };

  /* --- Private methods --- */

  _onTouchEvent(event) {
    if (this.props.onTouch) {
      const evt = event.nativeEvent;
      evt.x = Platform.OS === 'android' ? evt.x / PixelRatio.get() : evt.x;
      evt.x = Platform.OS === 'android' ? evt.x / PixelRatio.get() : evt.x;
      this.props.onTouch(evt);
    }
  }


  /* --- Public methods --- */

  measure(cb) {
    return this.refs.node.measure(cb);
  }


  /* --- Rendering methods --- */

  render() {
    return (
      <NativeTouchableView
        ref="node"
        {...this.props}
        style={this.props.style}
        onChange={this._onTouchEvent.bind(this)}
        onLayout={this.props.onLayout}
        >
        {this.props.children}
      </NativeTouchableView>
    );
  }
};
