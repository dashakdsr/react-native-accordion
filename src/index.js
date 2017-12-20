import React from 'react'
import {
  TouchableHighlight,
  View,
  Animated,
  Easing
} from 'react-native'

const createReactClass = require('create-react-class')
const PropTypes = require('prop-types')

const Accordion = createReactClass({
  propTypes: {
    animationDuration: PropTypes.number,
    content: PropTypes.element.isRequired,
    easing: PropTypes.func,
    expanded: PropTypes.bool,
    header: PropTypes.element.isRequired,
    onPress: PropTypes.func,
    underlayColor: PropTypes.string,
    style: PropTypes.object
  },

  getDefaultProps () {
    return {
      animationDuration: 300,
      easing: Easing.linear,
      expanded: false,
      underlayColor: '#000',
      style: {}
    }
  },

  getInitialState () {
    return {
      isVisible: this.props.expanded,
      height: null,
      contentHeight: 0
    }
  },

  close () {
    this.state.isVisible && this.toggle()
  },

  open () {
    !this.state.isVisible && this.toggle()
  },

  toggle () {
    this.state.isVisible = !this.state.isVisible
    Animated.timing(
      this.state.height,
      {
        toValue: this.state.isVisible ? this.state.contentHeight : 0,
        duration: this.props.animationDuration,
        easing: this.props.easing
      }
    ).start()
  },

  _onPress () {
    this.toggle()

    if (this.props.onPress) {
      this.props.onPress.call(this)
    }
  },

  getContentHeight (event) {
    const height = event.nativeEvent.layout.height
    if (this.state.contentHeight === 0) {
      this.setState({
        contentHeight: height
      })
      this.state.height = new Animated.Value(0)
      this.state.height.setValue(this.props.expanded ? height : 0)
    }
  },

  render () {
    return (
      <View
        style={{
          overflow: 'hidden'
        }}
      >
        <TouchableHighlight
          ref='AccordionHeader'
          onPress={this._onPress}
          underlayColor={this.props.underlayColor}
          style={this.props.style}
        >
          {this.props.header}
        </TouchableHighlight>
        <Animated.View
          ref='AccordionContentWrapper'
          onLayout={(event) => this.getContentHeight(event)}
          style={{
            height: this.state.height
          }}
        >
          <View ref='AccordionContent'>
            {this.props.content}
          </View>
        </Animated.View>
      </View>
    )
  }
})

module.exports = Accordion
