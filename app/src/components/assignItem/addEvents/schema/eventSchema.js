import { gql } from 'apollo-boost/lib/index'

export const ALL_EVENT_GROUPS = gql`
  query GetEventGroups {
    pos {
      allEventGroups {
        id
        name
      }
    }
  }
`

export const ALL_EVENT_TYPES = gql`
  query GetEventTypes {
    pos {
      allEventTypes {
        id
        name
      }
    }
  }
`

export const ALL_PRODUCT_SKUS = gql`
  query GetProductSkus {
    pos {
      allProductSkus {
        id
        name
      }
    }
  }
`

export const CREATE_PRODUCT_EVENT = gql`
  mutation CreateEvent(
    $name: String!
    $day: String!
    $eventTypeId: String!
    $startTime: String!
    $endTime: String!
    $spots: Int
    $productSkuIds: [String]
    $eventEventGroups: [PosEventEventGroupInput]
  ) {
    pos {
      createEvent(
        name: $name
        day: $day
        eventTypeId: $eventTypeId
        startTime: $startTime
        endTime: $endTime
        spots: $spots
        productSkuIds: $productSkuIds
        eventEventGroups: $eventEventGroups
      ) {
        id
        name
        day
        spots
        startTime
        eventEventGroups {
          eventGroupId
          guestIds
          eventGroup {
            id
            name
            description
            color
            enabled
          }
        }
      }
    }
  }
`

export const GET_EVENTS_QUERY = gql`
  query GetEvents($eventIds: [String]!) {
    pos {
      allEvents(filter: { id: $eventIds }) {
        id
        name
        day
        startTime
        spots
        eventEventGroups {
          id
          eventGroup {
            id
            name
          }
          guestIds
        }
      }
    }
  }
`
