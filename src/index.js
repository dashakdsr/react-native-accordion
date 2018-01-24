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
    containerHeight: PropTypes.number,
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

  componentWillMount () {
    this.getContentHeight(this.props.containerHeight)
  },

  componentWillReceiveProps (nextProps) {
    this.getContentHeight(nextProps.containerHeight)
  },

  close () {
    this.state.isVisible && this.toggle()
  },

  open () {
    !this.state.isVisible && this.toggle()
  },

  toggle () {
    this.state.isVisible = !this.state.isVisible
    // Animated.timing(
    //   this.state.height,
    //   {
    //     toValue: this.state.isVisible ? this.state.contentHeight : 0,
    //     duration: this.props.animationDuration,
    //     easing: this.props.easing
    //   }
    // ).start()
    this.setState({
      height: this.state.isVisible ? this.state.contentHeight : 0
    })
  },

  _onPress () {
    this.toggle()
    if (this.props.onPress) {
      this.props.onPress.call(this)
    }
  },

  getContentHeight (value) {
    const height = value
    if (this.state.contentHeight === 0) {
      this.setState({
        contentHeight: height
      })
      // this.state.height = new Animated.Value(0)
      // this.state.height.setValue(this.props.expanded ? height : 0)
      this.setState({
        height: this.props.expanded ? height : 0
      })
    } else if (this.state.contentHeight !== height) {
      this.setState({
        height
      })
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
        <View
          ref='AccordionContentWrapper'
          onLayout={(event) => this.getContentHeight(event.nativeEvent.layout.height)}
          style={{
            height: this.state.height
          }}
        >
          <View ref='AccordionContent'>
            {this.props.content}
          </View>
        </View>
      </View>
    )
  }
})

module.exports = Accordion
