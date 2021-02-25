import React from 'react'
import styled from 'styled-components'

import { displayDateFormat, kgToLbs, cmToFeetInches } from 'es-libs'

// Components
import { Span, TableRow, TableCellData, RoundedCheckboxInput } from 'es-components'

const AssetsWrapper = styled(Span)`
  color: ${props => props.theme.greyDark};
  display: block !important;
  line-height: 1.35rem;
  margin-top: 5px;
`

export class CheckInListElement extends React.Component {
  state = { checkBoxClicked: false }

  handleOnClick = () => {
    const { checkInItem, onCheckBoxClick } = this.props
    const { checkBoxClicked } = this.state

    if (onCheckBoxClick) {
      onCheckBoxClick(checkInItem)
      this.setState({ checkBoxClicked: !checkBoxClicked })
    }
  }

  processRentalAssets = rentalAssets => {
    return rentalAssets
      .reduce((acc, asset) => {
        acc.push(asset.assetClassName)
        return acc
      }, [])
      .join(', ')
  }

  render() {
    const { measurement } = this.props
    const { discipline, forDate, guest, height, id, level, weight, rentalAssets, age } = this.props.checkInItem
    const { checkBoxClicked } = this.state

    if (!guest) {
      return null
    }

    return (
      <TableRow className={rentalAssets.length > 0 && 'double-lined-row'}>
        <TableCellData celltype="select-cell">
          <RoundedCheckboxInput className="table-checkbox" key={id} id={id} field={id} onClickHandler={this.handleOnClick} checked={checkBoxClicked} />
        </TableCellData>
        <TableCellData leftAligned>
          <Span margin="5px 0">
            {guest.fullName}
            {rentalAssets.length > 0 && <AssetsWrapper>{this.processRentalAssets(rentalAssets)}</AssetsWrapper>}
          </Span>
        </TableCellData>
        <TableCellData>{age}</TableCellData>
        <TableCellData>{measurement === 'imperial' ? `${cmToFeetInches(height)[0]} ft ${cmToFeetInches(height)[1]} inches` : `${height} cm`}</TableCellData>
        <TableCellData>{measurement === 'imperial' ? `${kgToLbs(weight)} lbs` : `${weight} kg`}</TableCellData>
        <TableCellData>{discipline}</TableCellData>
        <TableCellData>{level}</TableCellData>
        <TableCellData>{displayDateFormat(forDate)}</TableCellData>
      </TableRow>
    )
  }
}
