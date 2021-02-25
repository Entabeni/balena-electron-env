import { gql } from 'apollo-boost'

export const CUSTOMER_WAIVER = gql`
  query completedWaiver($id: String!) {
    customerFacingPos {
      completedWaiver(id: $id) {
        id
        waiverId
        guestId
        orderId
        addressId
        userAgent
        dateSigned
        ipAddress
        status
        title
        url
        signingString
        completedWaiverUrl
        signedUrl
        showEmailPos
        signingLocation
        waiver {
          id
          title
          intro
          part1
          part2
          part3
          part4
          part5
        }
      }
    }
  }
`

export const UPDATE_CUSTOMERFACING_PRINT_TERMINAL = gql`
  mutation updatePrintTerminal($id: String!, $screenSteps: String!, $orderId: String) {
    customerFacingPos {
      updatePrintTerminal(id: $id, screenSteps: $screenSteps, orderId: $orderId) {
        id
        creditCardTerminalId
        creditCardApiKey
        creditCardApiPassword
        name
        port
        ipAddress
        parentPrintTerminalId
        screenSteps
      }
    }
  }
`

export const COMPLETE_CUSTOMER_WAIVER = gql`
  mutation updateCompletedWaiver($id: String!, $signatureImageUrl: String!) {
    customerFacingPos {
      updateCompletedWaiver(id: $id, signatureImageUrl: $signatureImageUrl, status: "completed", signingLocation: "cardTerminal") {
        id
      }
    }
  }
`

export const UPDATE_GUEST = gql`
  mutation updateGuest($id: String!, $profilePictureUrl: String) {
    customerFacingPos {
      updateGuest(id: $id, profilePictureUrl: $profilePictureUrl) {
        id
      }
    }
  }
`
export const GET_GUEST = gql`
  query guest($id: String!) {
    customerFacingPos {
      guest(id: $id) {
        id
        fullName
        profilePictureUrl
        signedUrl
      }
    }
  }
`
export const GET_ORDER = gql`
  query order($id: String!) {
    customerFacingPos {
      order(id: $id) {
        number
        orderRunOutTime
        status
        taxes {
          name
          taxType
          value
        }
        total
        subTotal
        taxTotal
        purchaser {
          id
          firstName
          lastName
          email
        }
        userId
        id
        updated
        created
        currentStep
        steps
        shippingOption {
          id
          description
          title
          price
          needAddress
        }
        orderLineItems {
          id
          promoCode
          checkInIds
          updated
          created
          name
          price
          quantity
          eventLineItems {
            id
            eventId
            eventGroupId
            productItemId
            orderLineItemId
            requestedInstructorId
            requestedIntructorName
            requestedAt
            guestName
            event {
              startTime
              endTime
              day
            }
          }
          taxes {
            name
            taxType
            value
          }
          total
          access
          guest {
            id
            firstName
            lastName
            email
          }
          subTotal
          taxTotal
          productId
          guestLineItems {
            id
            guest {
              id
              firstName
              lastName
              fullName
              dateOfBirth
              email
            }
          }
          upsellOrderLineItems {
            id
            name
            price
            quantity
            subTotal
            total
          }
          orderDiscountLineItems {
            id
            discountId
            name
            orderLineItemId
            price
            quantity
            subTotal
            taxTotal
            total
            promoCodeId
          }
        }
      }
    }
  }
`
