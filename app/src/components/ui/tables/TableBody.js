import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'

// Table components
import { SpinLoader, TableRow, TableCellData } from 'es-components'
import { algoliaSearch, algoliaMultiRequestForIndex } from 'es-libs'

// Custom styled components
const TableBodyTag = styled.tbody`
  background-color: ${props => props.backgroundColor || props.theme.white};
  ${props => props.loadingContainerHeight && !props.minHeight && `min-height: ${props.loadingContainerHeight};`}

  ${props =>
    props.striped &&
    `&& tr:nth-child(odd) {
      background-color: ${props.theme.greyLight};
    }
    && tr.clickable-row:hover {
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
      transform: scale(1,1);
    }`}

  && td {
    color: ${props => props.theme[props.color] || props.color || 'black'};
    font-size: ${props => props.fontSize || '1rem'};
    line-height: 2.625rem;
    padding: ${props => props.padding || '0.5rem'};
    text-align: ${props => props.textAlign || 'center'};
  }
`

const ErrorWrapper = styled.tr`
  color: ${props => props.theme.red};
`

export const TableBody = React.memo(
  ({ children, data, lazy, maxHeight, styles, onRefetch: handleRefetch, onRecordUpdate: handleRecordUpdate, shouldRefetch, shouldUpdateRecord, ...props }) => {
    // Local non-persisting regular variables
    const noResultsMessage = props.noResultsMessage || 'There are not matching results to show'
    const emptySearchString = props.emptySearchString || 'Please use filter to see results.'

    // Local persisting state variables
    const [isMounted, setIsMounted] = useState(false)
    const [loadingSpinner, setLoadingSpinner] = useState(true)
    const [algoliaLoading, setAlgoliaLoading] = useState(false)
    const [algoliaResultList, setAlgoliaResultList] = useState(undefined)
    const [graphqlRefetch, setGraphqlRefetch] = useState(null)
    const prevLazy = useRef()

    // Different rendering methods
    const renderContent = data => {
      return null
    }

    const renderAlgoliaResults = ({ onSuccess, ...rest }) => {
      if (algoliaLoading) {
        return <SpinLoader withWrapper={maxHeight || '100%'} size="80px" color="primary" />
      }
      if (onSuccess && algoliaResultList) {
        const childrenToRender = onSuccess(algoliaResultList)
        return !childrenToRender || childrenToRender.length < 1 ? (
          <TableRow className="custom-layout">
            <TableCellData size="100%">{rest.noResultsMessage}</TableCellData>
          </TableRow>
        ) : (
          childrenToRender
        )
      } else {
        return renderContent(algoliaResultList)
      }
    }

    const loadAlgoliaList = ({ cachePolicy, indexesForLoad, type, variables }, refetchCB) => {
      if (type === 'algolia' && indexesForLoad && indexesForLoad.length) {
        if (indexesForLoad.length === 1) {
          const index = indexesForLoad[0]
          const options = { ...index.options }
          if (cachePolicy) {
            options['cachePolicy'] = cachePolicy
          }
          if (variables && variables.restrictSearchableAttributes) {
            options['restrictSearchableAttributes'] = variables.restrictSearchableAttributes
          }
          algoliaSearch(index.indexName, { ...options, query: variables ? variables.searchTerm : '' }, (err, algoliaResultList) => {
            if (algoliaResultList) {
              setAlgoliaResultList(algoliaResultList)
              setAlgoliaLoading(false)
              if (refetchCB && typeof refetchCB === 'function') {
                refetchCB()
              }
            }
          })
        }
        if (indexesForLoad.length > 1) {
          const queries = []
          indexesForLoad.forEach(index => {
            let params = {
              filters: index.options.filters,
              hitsPerPage: index.options.hitsPerPage,
              query: variables ? variables.searchTerm : '',
              attributesToRetrieve: index.options.attributesToRetrieve
            }
            if (variables && variables.restrictSearchableAttributes) {
              params['restrictSearchableAttributes'] = variables.restrictSearchableAttributes
            }
            queries.push({
              indexName: index.indexName,
              params
            })
          })
          if (queries.length) {
            algoliaMultiRequestForIndex(
              queries,
              (err, algoliaResultList) => {
                if (algoliaResultList) {
                  setAlgoliaResultList(algoliaResultList)
                  setAlgoliaLoading(false)
                  if (refetchCB && typeof refetchCB === 'function') {
                    refetchCB()
                  }
                }
              },
              cachePolicy
            )
          }
        }
      }
    }

    const renderLazyContent = ({ onError, onLoading, onSuccess, query, type, options, indexName, variables, onEmptySearch, ...rest }) => {
      if (type === 'graphql' && query) {
        return (
          <Query query={query} variables={variables}>
            {({ loading, error, data, refetch }) => {
              if (loading) return (onLoading && onLoading()) || <SpinLoader withWrapper={maxHeight || '100%'} size="80px" color="primary" />
              setLoadingSpinner(false)
              if (error) return (onError && onError(error)) || <ErrorWrapper>`Error! ${error.message}`</ErrorWrapper>
              if (shouldRefetch && !graphqlRefetch) {
                setGraphqlRefetch(refetch)
              }
              if (onSuccess) {
                const childrenToRender = onSuccess(data)
                return !childrenToRender || childrenToRender.length < 1 ? (
                  <TableRow className="custom-layout">
                    <TableCellData size="100%">{rest.noResultsMessage}</TableCellData>
                  </TableRow>
                ) : (
                  childrenToRender
                )
              } else {
                renderContent(data)
              }
            }}
          </Query>
        )
      } else {
        return renderEmptySearch()
      }
    }

    const renderEmptySearch = () => (
      <TableRow className="custom-layout">
        <TableCellData size="100%">{emptySearchString}</TableCellData>
      </TableRow>
    )

    const renderChildren = children => {
      return !children || children.length < 1 ? (
        <TableRow className="custom-layout">
          <TableCellData size="100%">{noResultsMessage}</TableCellData>
        </TableRow>
      ) : (
        children
      )
    }

    // Component did mount
    useEffect(() => {
      setIsMounted(true)
      if (lazy && lazy.type === 'algolia') {
        setAlgoliaLoading(true)
        setAlgoliaResultList(undefined)
        loadAlgoliaList(lazy)
      }
    }, [])

    // Component will receive props
    useEffect(() => {
      if (!isMounted) return
      if (
        (lazy && lazy.type === 'algolia' && lazy.variables && !algoliaResultList && !algoliaLoading) ||
        (lazy && lazy.type === 'algolia' && lazy.variables && lazy.variables.restrictSearchableAttributes && !algoliaLoading) ||
        JSON.stringify(lazy) !== JSON.stringify(prevLazy.current)
      ) {
        setAlgoliaLoading(true)
        setAlgoliaResultList(undefined)
        loadAlgoliaList(lazy)
      }
    }, [lazy])

    // Refetching from parent component
    useEffect(() => {
      if (lazy && shouldRefetch) {
        if (lazy.type === 'algolia') {
          setAlgoliaLoading(true)
          setAlgoliaResultList(undefined)
          loadAlgoliaList(lazy, handleRefetch)
        } else if (lazy.type === 'graphql' && graphqlRefetch) {
          graphqlRefetch()
        }
      }
    }, [shouldRefetch])

    // Updating list record from parent component
    useEffect(() => {
      if (shouldUpdateRecord && handleRecordUpdate && typeof handleRecordUpdate === 'function') {
        setAlgoliaResultList(handleRecordUpdate(algoliaResultList))
      }
    }, [shouldUpdateRecord])

    // Saving previous state of Lazy param
    if (lazy) {
      useEffect(() => {
        prevLazy.current = lazy
      })
    }

    if (lazy && lazy.type === 'algolia') {
      return (
        <TableBodyTag loadingContainerHeight={lazy && loadingSpinner && maxHeight} {...styles} {...props}>
          {renderAlgoliaResults(lazy)}
        </TableBodyTag>
      )
    }

    return (
      <TableBodyTag loadingContainerHeight={lazy && loadingSpinner && maxHeight} {...styles} {...props}>
        {(children && renderChildren(children)) || (lazy && renderLazyContent(lazy)) || renderContent(data)}
      </TableBodyTag>
    )
  }
)
