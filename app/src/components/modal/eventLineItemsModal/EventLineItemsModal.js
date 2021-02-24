import React from 'react'

import { Span, ProductModal, LazyTable, Table, SpinLoader } from 'es-components'

export class EventLineItemsModal extends React.Component {
  state = { modalContext: this.props.context }

  renderModalTitle = () => {
    switch (this.state.modalContext) {
      case 'sale':
        return (
          <React.Fragment>
            Previous Sale{' '}
            <Span lineHeight="2.25rem" padding="0.25rem 1rem">
              {this.props.saleNumber.toString().padStart(10, '0')}
            </Span>
          </React.Fragment>
        )
      case 'guest':
        return `${this.props.guest.fullName}'s events`
      default:
        return `No guest`
    }
  }

  render() {
    const {
      onCancelClick,
      tableCellCustomWidths,
      tableHeaderData,
      tableContent,
      tableOnSuccess,
      tableQueryConfig,
      useLoadingEventModal,
      tableVerticalScroll,
      tableWithScrollableTable
    } = this.props

    return (
      <ProductModal
        title={useLoadingEventModal ? '' : this.renderModalTitle()}
        subTitle={useLoadingEventModal ? '' : 'Scroll down the events list'}
        onCancelHandler={onCancelClick}
        lightLayout
        closeIcon
        withScrollableTable={tableWithScrollableTable}>
        {useLoadingEventModal && <SpinLoader withWrapper="350px" size="80px" color="primary" />}
        {!useLoadingEventModal && tableQueryConfig && (
          <LazyTable
            lightTheme
            cellCustomWidths={tableCellCustomWidths}
            headerData={tableHeaderData}
            onSuccess={tableOnSuccess}
            queryConfig={tableQueryConfig}
            verticalScroll={tableVerticalScroll}
          />
        )}
        {!useLoadingEventModal && !tableQueryConfig && tableContent && (
          <Table lightTheme cellCustomWidths={tableCellCustomWidths} headerData={tableHeaderData} verticalScroll={tableVerticalScroll}>
            {tableContent}
          </Table>
        )}
      </ProductModal>
    )
  }
}
