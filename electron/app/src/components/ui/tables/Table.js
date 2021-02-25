import React from 'react'
import styled, { css } from 'styled-components'

// Utils
import { round } from 'es-libs'

// Table components
import { TableHead, TableFoot, TableBody } from 'es-components'

const rowBaseHeight = '3.625rem'

const createCustomWidthsRules = customWidths => {
  let styles = ''
  for (let [i, width] of customWidths) {
    styles += `
      tr:not(.custom-layout) > th:nth-child(${+i + 1}),
      tr:not(.custom-layout) > td:nth-child(${+i + 1}) {
        width: ${width}% !important;
      }
    `
  }
  return css`
    ${styles}
  `
}

// Custom styled components
const tableResetStyles = css`
  &,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td {
    border: 0;
    font: inherit;
    font-size: 1rem;
    margin: 0;
    padding: 0;
    vertical-align: middle;
  }
`

const TableTag = styled.table`
  ${tableResetStyles}
  border-collapse: collapse;
  border-spacing: 0;
  width: ${props => props.width || '100%'};

  ${props => props.dropShadow && `box-shadow: ${(typeof props.dropShadow === 'string' && props.dropShadow) || '0px 5px 12px 0 rgba(0, 0, 0, 0.1)'};`}

  ${props =>
    props.verticalScroll &&
    `table-layout: fixed;

    tr {
      display: flex !important;
    }

    tbody {
      display: block !important;
      max-height: calc(${rowBaseHeight} * ${props.verticalScroll}) !important;
      overflow-x: hidden;
      overflow-y: scroll;
      width: 100% !important;
    }

    th,
    td {
      width: ${props.baseWidth}%;
    }`}

  ${props => props.verticalScroll && props.customWidths && createCustomWidthsRules(props.customWidths)}
`

const Caption = styled.caption`
  font-size: 1.25rem;
`

// Simple table component
const BaseTable = React.memo(
  ({
    children,
    cellCustomWidths,
    data,
    bodyStyles,
    footerData,
    footerRenderedContent,
    footerStyles,
    headerData,
    headerRenderedContent,
    headerStyles,
    lazy,
    styles,
    title,
    titleStyles,
    visibleTitle,
    lightTheme,
    noResultsMessage,
    emptySearchString,
    minHeight,
    onRefetch: handleDataRefetch,
    onRecordUpdate: handleRecordUpdate,
    onChangeSorting: handleSortChange,
    shouldRefetch,
    shouldUpdateRecord,
    ...props
  }) => {
    let tableHeadStyles = headerStyles || {}
    let tableFootStyles = footerStyles || {}
    const striped = !lightTheme ? null : true

    if (lightTheme) {
      let basicSharedStyles = {
        color: 'greyBlack',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        padding: '1rem 0.5rem'
      }
      tableHeadStyles = { ...basicSharedStyles, ...tableHeadStyles }
      tableFootStyles = { ...basicSharedStyles, ...tableFootStyles }
      props['dropShadow'] = true
    }

    let baseWidth = round(100 / headerData.length, 2)
    let customWidths = null

    if (cellCustomWidths) {
      customWidths = Object.entries(cellCustomWidths)
      const sumToSubstract = customWidths.reduce((acc, [i, factor], j) => {
        let colSize = round(factor * baseWidth, 2)
        customWidths[j][1] = colSize
        return round(acc + colSize, 2)
      }, 0)
      baseWidth = round((100 - sumToSubstract) / (headerData.length - customWidths.length), 2)
    }
    return (
      <TableTag id={props.id} baseWidth={baseWidth} customWidths={customWidths} {...styles} {...props}>
        {title && (
          <Caption isVisible={!!visibleTitle} {...titleStyles}>
            {title}
          </Caption>
        )}
        {(headerData || headerRenderedContent) && (
          <TableHead data={headerData} styles={tableHeadStyles} handleSortChange={handleSortChange}>
            {headerRenderedContent}
          </TableHead>
        )}
        {(footerData || footerRenderedContent) && (
          <TableFoot data={footerData} styles={tableFootStyles}>
            {footerRenderedContent}
          </TableFoot>
        )}
        <TableBody
          noResultsMessage={noResultsMessage}
          emptySearchString={emptySearchString}
          lazy={lazy}
          data={data}
          onRefetch={handleDataRefetch}
          onRecordUpdate={handleRecordUpdate}
          shouldRefetch={shouldRefetch}
          shouldUpdateRecord={shouldUpdateRecord}
          maxHeight={`calc(${rowBaseHeight} * ${props.verticalScroll}) !important`}
          minHeight={minHeight}
          striped={striped}
          styles={bodyStyles}>
          {children}
        </TableBody>
      </TableTag>
    )
  }
)

export const Table = ({ children, ...props }) => <BaseTable {...props}>{children}</BaseTable>

export const LazyTable = React.memo(({ children, onError, onLoading, onSuccess, queryConfig, ...props }) => {
  return (
    <BaseTable lazy={{ ...queryConfig, onError, onLoading, onSuccess }} {...props}>
      {children}
    </BaseTable>
  )
})
