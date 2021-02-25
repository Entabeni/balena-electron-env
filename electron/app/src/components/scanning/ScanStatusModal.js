import React, { Component } from 'react'

import { PrintModal, SpinLoader } from 'es-components'

class ScanStatusModal extends Component {
  componentDidMount() {
    this.timer = setInterval(() => this.props.onPrimaryBtnHandler(false), 10000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }
  render() {
    const { onPrimaryBtnHandler } = this.props
    return (
      <PrintModal primaryBtnTitle="Stop scanning" onPrimaryBtnHandler={onPrimaryBtnHandler} scanWidth title="Scanning" subTitle="Currently scanning">
        <SpinLoader withWrapper="250px" size="80px" color="primary" />
      </PrintModal>
    )
  }
}

export default ScanStatusModal
