import React from 'react'
import styled from 'styled-components'

// Components
import { Table } from 'es-components'
import { EmailPanelButtons } from './EmailPanelButtons'
import { EmailListItem } from './EmailListItem'

const EmailWrapper = styled.div`
  margin: 0;
  width: 100%;
  min-height: 100%;
  max-height: 500px;
  display: block;
  padding: 0;
  position: relative;
  box-sizing: border-box;
`

// Table SetUp
const rowsToShow = 5
const tableCols = [
  { celltype: 'select-cell', text: 'Select' },
  { leftAligned: true, text: 'Full Name' },
  { leftAligned: true, text: 'Email' }
]
const cellCustomWidths = { '0': 0.35 }

export class EmailPanelWrapper extends React.Component {
  state = { emails: [] }

  onCheckBoxClick = itemId => {
    const { emails } = this.state
    if (emails.indexOf(itemId) === -1) {
      emails.push(itemId)
    } else {
      emails.forEach((val, index) => {
        if (val === itemId) {
          emails.splice(index, 1)
        }
      })
    }

    this.setState({ emails })
  }

  onSendEmailBtnClick = () => {
    const { onSendEmail } = this.props
    const { emails } = this.state

    if (onSendEmail) {
      onSendEmail(emails)
    }
  }

  render() {
    const { emails, onCancel } = this.props

    return (
      <EmailWrapper>
        <Table
          lightTheme
          noResultsMessage="There are not emails to show"
          headerData={tableCols}
          headerStyles={{ borderTop: true }}
          cellCustomWidths={cellCustomWidths}
          verticalScroll={rowsToShow}>
          {emails.map((email, index) => (
            <EmailListItem id={`emailRow_${index}`} key={email.id} email={email} onCheckBoxClick={this.onCheckBoxClick} />
          ))}
        </Table>
        <EmailPanelButtons onCancel={onCancel} onSendEmail={this.onSendEmailBtnClick} />
      </EmailWrapper>
    )
  }
}
