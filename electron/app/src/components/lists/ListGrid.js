import React from 'react'
import styled, { css } from 'styled-components'

//Components
import { H3, Par, SearchTextInput, CheckboxInput, Button } from 'es-components'

const ListContainer = styled.article`
  width: 100%;
  border: 1px solid ${props => props.theme.grey};
  ${props => props.fullHeight && 'height: 100%;'}
  ${props => {
    // Specific bugfix for Raspberry Pi based devices running Chromiun web browser (v.72.0.3626.121)
    // Making the whole panels container scrollable only for it, otherwise letting the panels scroll independently
    const isRaspberryPi = /Raspbian Chromium/i.test(window.navigator.userAgent)
    if (isRaspberryPi) {
      return 'overflow-y: scroll !important;'
    }
    return ''
  }}
`

const ListHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.grey};
  padding: 0.5em;
`
const ListHeaderTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .borderRight {
    border-right: 1px solid ${props => props.theme.grey};
  }
`
const ListHeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const ListSection = styled.div`
  width: 100%;
  box-sizing: border-box;

  .listSectionHeader {
    width: 100%;
    display: grid;
    grid-template-columns: ${props => props.listcolwidth};
    grid-column-gap: 5px;
    list-style: none;
    border-bottom: 1px solid ${props => props.theme.grey};
  }

  .listSectionBody {
    width: 100%;
    ${props =>
      props.styles &&
      css`
        ${props.styles.maxHeight && `max-height: ${props.styles.maxHeight};`}
        ${props.styles.overflowY && `overflow-y: ${props.styles.overflowY};`}
      `}

    ul {
      display: grid;
      grid-template-columns: ${props => props.listcolwidth};
      grid-column-gap: 5px;
      list-style: none;

      li {
        list-style: none;
        padding: 0.5em;
      }
    }
  }
`

const ListHeaderItem = styled.li`
  font-weight: bold;
  list-style: none;
  padding: 0.9em;
  line-height: 25px;
  color: ${props => props.theme.greyDark};
  text-align: ${props => props.align || 'left'};
`

export const ListItemWrapper = styled.ul`
  width: 100%;
  background: ${props => props.theme.white};

  ${props =>
    props.difRowColor &&
    css`
      &:nth-child(odd) {
        background-color: ${props => props.theme.greyLight};
      }
    `}
`

export const ListItem = styled.li`
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em;
  display: flex;
  align-items: center;
  justify-content: ${props => props.align || 'flex-start'};
`

export class ListGrid extends React.Component {
  checkHandler = (id, value) => {
    const { checkHandler } = this.props
    if (checkHandler) {
      checkHandler(0, value)
    }
  }

  render() {
    const props = this.props

    const listColWidths = !!props.listColWidths ? props.listColWidths : '1fr 1fr 1fr'

    return (
      <ListContainer fullHeight={props.fullHeight}>
        <ListHeader>
          <ListHeaderTitle>
            <H3 className={props.resultCount ? 'borderRight' : ''} size="1.1rem" margin="0 0.5em 0 0" padding="0 0.5em 0 0">
              {props.listTitle}
            </H3>
            {props.resultCount ? (
              <Par light size="1.1rem" color="greyDark">
                Listing {props.resultCount}
              </Par>
            ) : null}
          </ListHeaderTitle>
          <ListHeaderRight>
            {props.hasCreateButton && <Button title={props.createButtonTitle} kind="primary" margin="0 1em 0 0" onClickHandler={props.handleCreate} />}
            {props.hasScanButton && (
              <Button title="Scan Card" kind="secondary" margin="0 1em 0 0" onClickHandler={this.props.handleScanClicked} loading={this.props.scanning} />
            )}
            {!props.hideSearch && (
              <SearchTextInput
                hideClearSearchButton={props.hideClearSearchButton}
                searchTitle={props.searchTitle}
                onChangeHandler={props.onSearchChangeHandler}
              />
            )}
          </ListHeaderRight>
        </ListHeader>
        <ListSection styles={props.listSectionCustomStyles} listcolwidth={listColWidths}>
          {props.listHeaders && (
            <ul className="listSectionHeader">
              {props.listHeaders.map((header, index) => {
                if (header.title === 'checkbox') {
                  return (
                    <ListHeaderItem align={header.align} key={`${header.title}_${index}`}>
                      <CheckboxInput
                        id="listHeaderCheckBox"
                        onClickHandler={this.checkHandler}
                        key={`${header.title}_${index}`}
                        checked={props.headerCheckboxChecked}
                      />
                    </ListHeaderItem>
                  )
                }
                return (
                  <ListHeaderItem align={header.align} key={`${header.title}_${index}`}>
                    {header.title}
                  </ListHeaderItem>
                )
              })}
            </ul>
          )}
          <section className="listSectionBody">{props.children}</section>
        </ListSection>
      </ListContainer>
    )
  }
}
