import React from 'react'
import styled from 'styled-components'

// Component
import { Modal } from '../Modal'
import { H2, Icon, SpinLoader, CheckboxInputGroup, Par, CheckboxInput, RadioBtnGroup, StandardRadio, StandardForm } from 'es-components'
import { algoliaSearch } from 'es-libs'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { withRouter } from 'react-router-dom'

const TerminalInfoWrapper = styled.div`
  min-height: 100%;
  position: relative;
  padding-top: 80px;
  padding-bottom: 60px;
`

const ModalFooter = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  width: 100%;
  padding: 0 1em;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

const ModalHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 80px;
  padding: 1em;
`

const ModalSection = styled.section`
  position: absolute;
  top: 80px;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 20px;
`

const CloseIconWrappper = styled.div`
  color: ${props => props.theme.greyShade};
  cursor: pointer;
  position: absolute;
  right: ${props => props.right || '5%'};
  top: ${props => props.top || '5%'};

  &:hover {
    color: ${props => props.theme.greyDarkShade};
  }
`

export const GET_PRINT_TERMINALS = gql`
  query GetPrintTerminals {
    pos {
      allPrintTerminals {
        id
        name
        port
      }
    }
  }
`

const menuItems = [
  { id: 'order', label: <Icon name="FaCashRegister" size="1.5rem" /> },
  { id: 'order/orders', label: <Icon name="IoMdCart" size="1.5rem" /> },
  { id: 'order/sales', label: <Icon name="IoLogoUsd" size="1.5rem" /> },
  { id: 'order/guests', label: <Icon name="IoIosPerson" size="1.5rem" /> },
  { id: 'order/outstandingAssets', label: <Icon name="FaSignOutAlt" size="1.5rem" /> },
  { id: 'order/checkIns', label: <Icon name="FaCheckSquare" size="1.5rem" /> },
  { id: 'cashout', label: <Icon name="FaMoneyBill" size="1.5rem" /> }
]

class PrintDetailsModal extends React.Component {
  state = {
    departments: undefined,
    checkedDepartments: undefined
  }

  makeDepartmentsFilterString = () => {
    const departments = this.state.checkedDepartments
    let filter = ''
    if (departments) {
      const departmentIds = []
      Object.keys(departments).forEach(key => {
        departmentIds.push(key)
      })
      filter = 'enabled:true'
      if (departmentIds && departmentIds.length) {
        filter += ' AND ('
        departmentIds.forEach((id, i) => {
          if (i > 0) {
            filter = filter + ' OR '
          }

          filter = filter + `objectID:"${id}"`
        })

        filter = filter + ')'
      }
    }

    return filter
  }

  loadDepartmentsFromAlgolia = () => {
    const filters = this.makeDepartmentsFilterString()
    const attributesToRetrieve = 'name,color,objectID'
    algoliaSearch('departments', { filters, attributesToRetrieve }, (err, departments) => {
      if (departments) {
        this.setState({
          departments
        })
      }
    })
  }

  componentDidMount() {
    const checkedDepartments = JSON.parse(window.localStorage.getItem('departments'))
    this.setState({ checkedDepartments }, this.loadDepartmentsFromAlgolia)
  }

  onPageCheckBoxClick = values => {
    const { defaultPage } = values
    window.localStorage.setItem('defaultPage', defaultPage)
    this.props.history.push(`/${defaultPage}`)
    this.props.onCancelHandler()
  }

  onCheckBoxClick = (id, value) => {
    const departments = JSON.parse(window.localStorage.getItem('departments'))
    Object.keys(departments).forEach(key => {
      if (key === id) {
        departments[key] = value
      }
    })
    window.localStorage.setItem('departments', JSON.stringify(departments))
    this.setState({ checkedDepartments: departments })
  }

  renderDepartments() {
    const { departments, checkedDepartments } = this.state

    if (!departments) {
      return null
    }

    return (
      <div style={{ marginTop: '20px' }}>
        <Par margin="1em 0">Select Departments: </Par>
        <CheckboxInputGroup id="departmentsList" onClickHandler={this.onCheckBoxClick} stack>
          {departments.map((department, index) => (
            <CheckboxInput
              onClickHandler={this.onCheckBoxClick}
              key={department.objectID}
              field={department.objectID}
              id={department.objectID}
              label={department.name}
              checked={checkedDepartments[department.objectID]}
            />
          ))}
        </CheckboxInputGroup>
      </div>
    )
  }

  renderDefaultPages() {
    const defaultPage = window.localStorage.getItem('defaultPage')

    return (
      <div style={{ marginTop: '20px' }}>
        <Par margin="1em 0">Default page: </Par>
        <StandardForm initialValues={{ defaultPage }} formcols={1} onSubmitHandler={values => this.onPageCheckBoxClick(values)}>
          <RadioBtnGroup fieldGroup="defaultPage">
            {menuItems.map((option, index) => (
              <StandardRadio key={option.id} id={`defaultPageOption_${index}`} radioValue={option.id} label={option.label} />
            ))}
          </RadioBtnGroup>
        </StandardForm>
      </div>
    )
  }

  render() {
    const { onCancelHandler } = this.props

    const currentPrintTerminal = window.localStorage.getItem('printTerminalId')

    return (
      <Modal zIndex="1002" height="65%" width="48%">
        <TerminalInfoWrapper>
          <ModalHeader>
            <div>
              <H2 id="settingsModal">Users Settings</H2>
            </div>
          </ModalHeader>
          <CloseIconWrappper onClick={onCancelHandler}>
            <Icon name="MdClear" size="25" />
          </CloseIconWrappper>
          <ModalSection addBorder>
            <Query query={GET_PRINT_TERMINALS}>
              {({ loading, error, data }) => {
                if (loading) return <SpinLoader withWrapper size="80px" color="primary" />
                if (error) return `Error! ${error.message}`
                const { allPrintTerminals } = data.pos
                const currentTerminal = allPrintTerminals.find(terminal => terminal.id === currentPrintTerminal)
                if (currentTerminal) {
                  return (
                    <div>
                      Print Terminal Name: <b>{`${currentTerminal.name}${currentTerminal.port ? ': ' + currentTerminal.port : ''}`}</b>
                    </div>
                  )
                } else {
                  return <div>No terminal selected</div>
                }
              }}
            </Query>
            {this.renderDepartments()}
            {this.renderDefaultPages()}
          </ModalSection>
        </TerminalInfoWrapper>
      </Modal>
    )
  }
}

export default withRouter(PrintDetailsModal)
