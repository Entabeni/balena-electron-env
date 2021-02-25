import React from 'react'
import styled from 'styled-components'

import { displayDateFormat, kgToLbs, cmToFeetInches } from 'es-libs'

// Components
import { Span, TableRow, TableCellData, Button } from 'es-components'

const AssetsWrapper = styled(Span)`
  color: ${props => props.theme[props.color]};
  display: block !important;
  line-height: 1.35rem;
  margin-top: 5px;
`

export class RentalSaleListElement extends React.Component {
  state = { checkBoxClicked: false }

  processRentalAssets = rentalAssets => {
    return rentalAssets
      .reduce((acc, asset) => {
        acc.push(asset.assetClassName)
        return acc
      }, [])
      .join(', ')
  }

  render() {
    const {
      measurement,
      forDate,
      guest,
      saleNumber,
      productInfo,
      selectedAccessRecordId,
      scanning,
      printing,
      onScanClick,
      onPrintClick,
      saleId,
      accessRecord,
      id,
      rentalAssets
    } = this.props

    let productName = ''
    if (productInfo) {
      let productInfoObj = JSON.parse(productInfo)
      if (productInfoObj) {
        productName = productInfoObj.name
      }
    }

    let discipline = null
    let fullName = null
    let height = null
    let level = null
    let weight = null
    let age = null
    let stance = null
    if (guest) {
      discipline = guest.discipline
      fullName = guest.fullName
      height = guest.height
      level = guest.level
      weight = guest.weight
      age = guest.age
      stance = guest.stance
    }

    return (
      <TableRow id={`rentalDetailsRow_${id}`} className={'double-lined-row'}>
        <TableCellData leftAligned>
          <Span margin="5px 0" color={fullName == null ? 'red' : 'greyDark'}>
            {fullName ? fullName : 'Guest was deleted'}
            {productName && <AssetsWrapper>{`Product: ${productName}`}</AssetsWrapper>}
            {rentalAssets.length > 0 && <AssetsWrapper>{`Assets: ${this.processRentalAssets(rentalAssets)}`}</AssetsWrapper>}
          </Span>
        </TableCellData>
        <TableCellData>{age}</TableCellData>
        <TableCellData>
          {height != null ? (measurement === 'imperial' ? `${cmToFeetInches(height)[0]} ft ${cmToFeetInches(height)[1]} inches` : `${height} cm`) : ''}
        </TableCellData>
        <TableCellData>{weight != null ? (measurement === 'imperial' ? `${kgToLbs(weight)} lbs` : `${weight} kg`) : ''}</TableCellData>
        <TableCellData>{discipline}</TableCellData>
        <TableCellData>{discipline === 'skiing' ? level : null}</TableCellData>
        <TableCellData>{discipline === 'snowboard' ? stance : null}</TableCellData>
        <TableCellData>{displayDateFormat(forDate)}</TableCellData>
        <TableCellData>{saleNumber}</TableCellData>
        <TableCellData className="action-cell">
          {accessRecord && (
            <Button
              loading={selectedAccessRecordId === accessRecord.id && scanning}
              kind="primary"
              hoverBgColor="red"
              icon="IoMdBarcode"
              iconSize="1.25rem"
              onClickHandler={() => onScanClick(accessRecord.id)}
            />
          )}
        </TableCellData>
        <TableCellData className="action-cell">
          {accessRecord && (
            <Button
              id={`rentalPrintButton_${id}`}
              loading={selectedAccessRecordId === accessRecord.id && printing}
              kind="primary"
              hoverBgColor="red"
              disabled={!saleId}
              icon="MdPrint"
              iconSize="1.25rem"
              onClickHandler={() => onPrintClick(accessRecord, saleId)}
            />
          )}
        </TableCellData>
      </TableRow>
    )
  }
}
