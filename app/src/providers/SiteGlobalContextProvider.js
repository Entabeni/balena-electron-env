import React, { Component } from 'react'
import { SiteGlobalContext } from 'es-context'

class SiteGlobalContextProvider extends Component {
  state = {
    checkForTimeOut: this.checkForTimeOut.bind(this),
    hasTimeOut: false,
    orderID: null,
    timeOutDate: null
  }

  componentWillMount() {
    const { value } = this.props
    this.setState({ ...this.state, ...value })
  }

  checkForTimeOut(order) {
    if (!order) {
      return null
    }

    const { id, orderRunOutTime } = order

    if (orderRunOutTime && /String/.test(Object.prototype.toString.call(orderRunOutTime))) {
      this.setState({ hasTimeOut: true, orderID: id, timeOutDate: orderRunOutTime })
    } else {
      this.setState({ hasTimeOut: false, orderID: id, timeOutDate: null })
    }
  }

  render() {
    const { children } = this.props
    return <SiteGlobalContext.Provider value={this.state}>{children}</SiteGlobalContext.Provider>
  }
}

export default SiteGlobalContextProvider
