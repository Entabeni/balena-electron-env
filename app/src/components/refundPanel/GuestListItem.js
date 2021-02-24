import React from 'react'

// Components
import { TableRow, TableCellData, RoundedCheckboxInput } from 'es-components'

export class GuestListItem extends React.Component {
  state = { checkBoxClicked: false }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.clearState !== this.props.clearState) {
      const { ident } = this.props
      const { checkBoxClicked } = this.state
      if (checkBoxClicked && nextProps.clearState && document.getElementById(ident)) {
        document.getElementById(ident).click()
        this.setState({ checkBoxClicked: false })
      }
    }
  }

  onClick = () => {
    const { guest, onCheckBoxClick } = this.props
    const { checkBoxClicked } = this.state

    if (onCheckBoxClick) {
      onCheckBoxClick(guest, !checkBoxClicked)
      this.setState({ checkBoxClicked: !checkBoxClicked })
    }
  }

  render() {
    const { ident, guest } = this.props
    const { fullName } = guest
    const { checkBoxClicked } = this.state

    return (
      <TableRow>
        <TableCellData celltype="select-cell">
          <RoundedCheckboxInput className="table-checkbox" key={ident} id={ident} field={ident} onClickHandler={this.onClick} checked={checkBoxClicked} />
        </TableCellData>
        <TableCellData leftAligned>{fullName}</TableCellData>
      </TableRow>
    )
  }
}
