import React from 'react'

// Components
import { TableRow, TableCellData, RoundedCheckboxInput } from 'es-components'

export class EmailListItem extends React.Component {
  state = { checkBoxClicked: false }

  onClick = () => {
    const { email, onCheckBoxClick } = this.props
    const { checkBoxClicked } = this.state

    if (onCheckBoxClick) {
      onCheckBoxClick(email.id)
      this.setState({ checkBoxClicked: !checkBoxClicked })
    }
  }

  render() {
    const { email, fullName, id } = this.props.email
    const { checkBoxClicked } = this.state

    return (
      <TableRow id={this.props.id}>
        <TableCellData celltype="select-cell">
          <RoundedCheckboxInput className="table-checkbox" key={id} id={id} field={id} onClickHandler={this.onClick} checked={checkBoxClicked} />
        </TableCellData>
        <TableCellData leftAligned>{fullName}</TableCellData>
        <TableCellData leftAligned>{email}</TableCellData>
      </TableRow>
    )
  }
}
