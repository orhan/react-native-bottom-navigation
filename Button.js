/**
* Button.
* Tab bar button implementation for the Bottom-Navigation-View.
*/
'use strict';

/* --- Imports --- */

import React, {
  Component,
  PropTypes
} from 'react';

const ReactNative = require('react-native');
const {
  TouchableWithoutFeedback,
  View,
} = ReactNative;

import Ripple from './Ripple';


/* --- Class methods --- */

const Button = React.createClass({
  render() {
    return (
      <TouchableWithoutFeedback {...this.props}>
        <Ripple
          {...this.props}
          maskBorderRadiusInPercent={this.props.rippleBorderRadiusPercent}
          rippleDuration={this.props.rippleDuration}
          maskDuration={this.props.rippleDuration}
          onTouch={this.props.onTouch}
          >
          {this.props.children}
        </Ripple>
      </TouchableWithoutFeedback>
    )
  }
})


/* --- Module exports --- */

module.exports = Button;
