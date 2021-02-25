import React, { useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

// Components
import { Button } from 'es-components'
import MainPanelHeader from './MainPanelHeader'

const MainPanel = styled.div`
  min-height: 100%;
  display: block;
  width: 100%;
  padding: ${props => (!props.inModal ? '0.5rem' : '0')};
  overflow-y: auto;
  ${props => {
    return props.withFilters && props.isFirefox
      ? css`
          width: 1200px;
        `
      : null
  }}
  ${props => {
    return props.fullHeight
      ? css`
          grid-row: span 2;
        `
      : null
  }}
`

const MainArticle = styled.article`
  margin: 0;
  min-height: 100%;
  width: 100%;
  display: grid;
  grid-auto-rows: auto auto;
  overflow-y: auto;
`

const MainSection = styled.section`
  height: auto;
  margin: ${props => (props.centeredLayout ? (props.isProductsPage ? '90px auto 0' : '1rem auto 0') : props.isProductsPage ? '90px 0 0' : '1rem 0 0')};
  overflow-y: hidden;
  ${props => props.centeredLayout && 'padding: 0 1rem 1rem;'}
  width: ${props => (props.centeredLayout && '90%') || '100%'};
`

const CategoriesWrapper = styled.div`
  align-content: space-between;
  display: flex;
  flex-flow: row wrap;
  margin-bottom: ${props => props.theme.spacingSml};
  padding: ${props => (!props.inModal ? '0.5rem' : '0')};
  width: 100%;

  button {
    margin-right: 0.5rem;
  }
`

const ProductsWrapper = styled.div`
  padding-right: ${props => (!props.inModal ? '0.5rem' : '0')};
`

export const MainPanelWrapper = props => {
  let mainSection = useRef()
  let [sectionHeight, setSectionHeight] = useState('300px')
  let [delayedClassName, setDelayedClassName] = useState(null)

  useEffect(() => {
    if (!!mainSection) {
      const calcOffset = mainSection.current.offsetTop + 30
      setSectionHeight(`calc(100vh - ${calcOffset}px)`)
    }
  }, [sectionHeight])

  useEffect(() => {
    setDelayedClassName(null)
    if (props.categoryIdSelected) {
      setTimeout(() => setDelayedClassName(props.categoryIdSelected), 450)
    }
  }, [props.categoryIdSelected])

  return (
    <MainPanel fullHeight={props.fullHeight} fullWidth={props.fullWidth} inModal={props.inModal} isFirefox={props.isFirefox} withFilters={props.withFilters}>
      <MainArticle>
        {!props.disableHeader && (
          <MainPanelHeader
            title={props.title}
            onRefreshProducts={props.onRefreshProducts}
            searchTerm={props.searchTerm}
            setSearchTerm={props.setSearchTerm}
            inModal={props.inModal}
          />
        )}
        <MainSection
          centeredLayout={props.centeredLayout}
          ref={mainSection}
          height={sectionHeight}
          inModal={props.inModal}
          isProductsPage={props.isProductsPage}>
          {props.allCategories && props.allCategories.length ? (
            <CategoriesWrapper inModal={props.inModal}>
              {props.allCategories.map(category => (
                <Button
                  key={category.id}
                  title={category.name}
                  className={`${props.categoryIdSelected === category.id ? 'selected' : ''}${delayedClassName === category.id ? ' show-badge' : ''}`}
                  kind="colorized"
                  sizeH="tall"
                  sizeW="normal"
                  margin="2px"
                  backgroundColor={category.color}
                  rounded
                  onClickHandler={() => {
                    if (props.categoryIdSelected === category.id) {
                      props.selectCategoryId(null)
                    } else {
                      props.selectCategoryId(category.id)
                    }
                  }}
                />
              ))}
            </CategoriesWrapper>
          ) : null}
          <ProductsWrapper inModal={props.inModal}>{props.children}</ProductsWrapper>
        </MainSection>
      </MainArticle>
    </MainPanel>
  )
}
