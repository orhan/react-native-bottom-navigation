/**
* Button.
* Tab bar button implementation for the Bottom-Navigation-View.
*/
'use strict';

/* --- Imports --- */

import React, {Component} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import Ripple from './Ripple';


/* --- Class methods --- */

export default class Button extends Component {
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
}
