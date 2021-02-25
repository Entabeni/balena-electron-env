import React from 'react'
import { SalesRow } from './SalesRow'
import { LazyTable } from 'es-components'
const getPreviousSalesBaseQueryConfig = () => {
  let filters = 'status:complete'
  const previousSalesBaseQueryConfig = {
    noResultsMessage: 'There are not matching sales to show',
    indexesForLoad: [
      {
        indexName: 'sales',
        options: {
          attributesToRetrieve: 'objectID,guestName,created,number,status,total,',
          hitsPerPage: 20,
          filters,
          restrictSearchableAttributes: []
        }
      }
    ],
    type: 'algolia'
  }

  return previousSalesBaseQueryConfig
}
const rowsToShow = 10

const previousSalesCellCustomWidths = { '0': 1.2, '2': 1.2, '5': 0.6 }
export const SalesTable = React.memo(({ setSaleSelected, showAndLoadEventLineItems, account, variables }) => {
  const previousSalesTableCols = [
    { leftAligned: true, text: 'Created' },
    'Number',
    { leftAligned: true, text: 'Purchaser' },
    'Status',
    'Total',
    { celltype: 'action-cell', text: '' }
  ]
  const renderSales = data => {
    return data.map((sale, index) => (
      <SalesRow setSaleSelected={setSaleSelected} showAndLoadEventLineItems={showAndLoadEventLineItems} sale={sale} index={index} account={account}></SalesRow>
    ))
  }
  return (
    <LazyTable
      lightTheme
      cellCustomWidths={previousSalesCellCustomWidths}
      headerData={previousSalesTableCols}
      onSuccess={data => renderSales(data)}
      queryConfig={{ ...getPreviousSalesBaseQueryConfig(), variables }}
      verticalScroll={rowsToShow}
    />
  )
})
