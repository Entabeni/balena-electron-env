import { gql } from 'apollo-boost'

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder {
    pos {
      createOrder {
        id
        number
        status
        orderRunOutTime
      }
    }
  }
`
export const UPDATE_SALE = gql`
  mutation UpdateSale($id: String!, $hasShipped: Boolean, $shippedAt: String) {
    pos {
      updateSale(id: $id, hasShipped: $hasShipped, shippedAt: $shippedAt) {
        id
        shippedAt
      }
    }
  }
`

export const DELETE_ORDER_MUTATION = gql`
  mutation DeleteOrder($id: String!) {
    pos {
      deleteOrder(id: $id) {
        success
      }
    }
  }
`

export const UPDATE_PRINT_TERMINAL = gql`
  mutation updatePrintTerminal($id: String!, $screenSteps: String!, $waiverId: String, $orderId: String, $guestId: String) {
    pos {
      updatePrintTerminal(id: $id, screenSteps: $screenSteps, waiverId: $waiverId, orderId: $orderId, guestId: $guestId) {
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

export const DELETE_ORDER_LINE_ITEM_MUTATION = gql`
  mutation DeleteOrderLineItem($orderId: String!, $orderLineItemId: String!) {
    pos {
      updateOrder(id: $orderId, orderLineItems: [{ id: $orderLineItemId, _destroy: true }]) {
        id
        orderRunOutTime
        subTotal
        taxTotal
        total
        orderLineItems {
          id
          name
          price
          quantity
          promoCode
          taxes {
            name
            taxType
            value
          }
          orderDiscountLineItems {
            id
            discountId
            promoCodeId
            name
            price
            quantity
            subTotal
            taxTotal
            total
          }
          events
          access
          checkInIds
          guestLineItems {
            id
            guest {
              id
              firstName
              lastName
              fullName
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
          productId
          subTotal
          taxTotal
          total
          answers {
            id
            questionId
            questionnaireId
            answerJsonb
            answerDateTime
            userId
          }
        }
      }
    }
  }
`

export const ADD_ORDER_LINE_ITEMS_MUTATION = gql`
  mutation UpdateOrder($id: String!, $orderLineItems: [PosOrderLineItemInput!], $refundShippingOption: Boolean) {
    pos {
      updateOrder(id: $id, orderLineItems: $orderLineItems, refundShippingOption: $refundShippingOption) {
        id
        orderRunOutTime
        subTotal
        taxTotal
        total
        shippingOptionPrice
        orderLineItems {
          id
          name
          price
          quantity
          promoCode
          taxes {
            name
            taxType
            value
          }
          orderDiscountLineItems {
            id
            discountId
            promoCodeId
            name
            price
            quantity
            subTotal
            taxTotal
            total
          }
          events
          access
          checkInIds
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
            productAddOn {
              requireGuest
            }
            guestLineItems {
              id
              guest {
                id
                firstName
                lastName
              }
            }
          }
          productId
          subTotal
          taxTotal
          total
          answers {
            id
            questionId
            questionnaireId
            answerJsonb
            answerDateTime
            userId
          }
        }
      }
    }
  }
`

export const ADD_PURCHASER_MUTATION = gql`
  mutation UpdateOrder($id: String!, $purchaserId: String) {
    pos {
      updateOrder(id: $id, purchaserId: $purchaserId) {
        id
        orderRunOutTime
        purchaser {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`

export const UPDATE_ORDER_STEP_MUTATION = gql`
  mutation UpdateOrder($id: String!, $step: String) {
    pos {
      updateOrder(id: $id, currentStep: $step) {
        id
        orderRunOutTime
        subTotal
        taxTotal
        total
        shippingOptionPrice
        currentStep
        steps
        sale {
          id
          created
          number
          orderId
          purchaser {
            id
            firstName
            fullName
            lastName
            email
          }
          subTotal
          taxTotal
          total
          status
          accessRecords {
            id
            productJson
            guest {
              id
              firstName
              lastName
              profilePictureUrl
              profilePictureUrlExtraLarge
              fullName
              email
            }
          }
          saleLineItems {
            id
            name
            quantity
            subTotal
            total
            events
            forDate
            price
            productId
            guestId
            saleDiscountLineItems {
              discountId
              price
            }
            guests {
              id
              fullName
              email
            }
            guest {
              id
              fullName
              email
            }
            answers {
              id
            }
          }
          eventLineItems {
            id
            event {
              id
              name
              day
              startTime
              eventEventGroups {
                id
                eventGroup {
                  id
                  name
                }
              }
            }
            guestName
          }
        }
        orderLineItems {
          id
          name
          price
          quantity
          promoCode
          taxes {
            name
            taxType
            value
          }
          orderDiscountLineItems {
            id
            discountId
            promoCodeId
            name
            price
            quantity
            subTotal
            taxTotal
            total
          }
          events
          access
          checkInIds
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
          productId
          subTotal
          taxTotal
          total
          answers {
            id
            questionId
            questionnaireId
            answerJsonb
            answerDateTime
            userId
          }
        }
      }
    }
  }
`

export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment(
    $orderId: String!
    $paymentTypeId: String!
    $status: String!
    $printTerminalId: String!
    $amount: Float!
    $transactions: [PosTransactionJsonInput]
  ) {
    pos {
      createPayment(
        orderId: $orderId
        paymentTypeId: $paymentTypeId
        status: $status
        printTerminalId: $printTerminalId
        amount: $amount
        transactions: $transactions
      ) {
        id
        sale {
          accessRecordsPresent
          id
          number
          accessRecords {
            productJson
            cardRfid
            id
            guest {
              id
              fullName
            }
          }
        }
        order {
          id
          currentStep
        }
      }
    }
  }
`

export const PRINT_JOBS_SUBSCRIPTION = gql`
  subscription onNewPrintJob($printTerminalId: String!) {
    newPrintJob(printTerminalId: $printTerminalId) {
      id
      printData
      printJobType
      status
      accessRecordId
      printTerminalId
      saleId
    }
  }
`

export const CREATE_TERMINAL_PAYMENT = gql`
  mutation createTerminalPayment(
    $paymentId: String
    $paymentTypeId: String!
    $orderId: String!
    $printTerminalId: String!
    $amount: Float!
    $saveCard: Boolean
  ) {
    pos {
      createTerminalPayment(
        paymentId: $paymentId
        paymentTypeId: $paymentTypeId
        orderId: $orderId
        printTerminalId: $printTerminalId
        amount: $amount
        saveCard: $saveCard
      ) {
        amount
        collectedAt
        created
        createdUnix
        id
        objectID
        orderId
        paymentTypeId
        paymentTypeName
        sale {
          id
        }
        saleId
        saleNumber
        scheduledAt
        status
        updated
        updatedUnix
      }
    }
  }
`
export const NEW_TRANSACTION_SUBSCRIPTION = gql`
  subscription transaction($orderId: String!) {
    transaction(orderId: $orderId) {
      id
      success
      message
      reason
    }
  }
`

export const SCAN_JOBS_SUBSCRIPTION = gql`
  subscription onNewScanJob($printTerminalId: String!) {
    newScanJob(printTerminalId: $printTerminalId) {
      id
      printTerminalId
      cardRfid
      status
      accessRecordId
      userIds
    }
  }
`
export const UPDATE_PRINT_TERMINAL_SUBSCRIPTION = gql`
  subscription updatedPrintTerminal($id: String!) {
    updatedPrintTerminal(id: $id) {
      screenSteps
      waiverId
      orderId
      guestId
    }
  }
`

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    pos {
      product(id: $id) {
        id
        name
        rank
        image
        steps
        showWarning
        questionnaireId
        upsellProductIds
        needPicture
        categoryIds
        checkStockLevel
        price
        specialPrice
        productType
        eventRules
        upsellProducts {
          id
          name
          rank
          steps
          showWarning
          price
          upsellProductIds
          questionnaireId
          productItems {
            productItemId
            required
            canCreate
            default
            productSkuIds
            eventIds
            eventText
            rank
          }
        }
        ageVariants {
          id
          title
          description
          ageFrom
          ageTo
          range
        }
        availabilities {
          day
          availableForSale
        }
        discounts {
          id
          name
          discountValue
        }
        productItems {
          productItemId
          required
          canCreate
          default
          productSkuIds
          eventIds
          eventText
          rank
        }
        questions {
          id
          questionText
          required
          formElement
          description
          options {
            id
            optionText
          }
        }
      }
    }
  }
`

export const GET_ACCOUNT_INFO = gql`
  query GetAccountInfo {
    pos {
      account {
        id
        ageCalculationMethod
        ageOfMajority
        endOfWinterSeasonMonth
        ageCalculationDate
        dateFormat
        dateTimeFormat
        timeZone
      }
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    pos {
      allCategories {
        id
        enabled
        name
        color
      }
      account {
        id
        ageCalculationMethod
        ageOfMajority
        endOfWinterSeasonMonth
        ageCalculationDate
        dateFormat
        measurement
      }
    }
  }
`

export const GET_DASHBOARD_QUERY = gql`
  query GetDashboard($id: String!) {
    pos {
      account {
        id
        ageCalculationMethod
        ageOfMajority
        endOfWinterSeasonMonth
        ageCalculationDate
        dateFormat
      }
      order(id: $id) {
        id
        number
        status
        steps
        payments {
          amount
          collectedAt
          created
          createdUnix
          id
          objectID
          orderId
          paymentTypeId
          paymentTypeName
          saleId
          saleNumber
          scheduledAt
          status
          updated
          updatedUnix
        }
        currentStep
        orderRunOutTime
        shippingOptionPrice
        taxes {
          name
          taxType
          value
        }
        subTotal
        taxTotal
        total
        purchaser {
          id
          firstName
          lastName
          email
        }
        orderLineItems {
          id
          name
          price
          quantity
          promoCode
          orderDiscountLineItems {
            id
            discountId
            promoCodeId
            name
            price
            quantity
            subTotal
            taxTotal
            total
          }
          taxes {
            name
            taxType
            value
          }
          upsellOrderLineItems {
            id
            name
            price
            quantity
            subTotal
            total
            productAddOn {
              requireGuest
            }
            guestLineItems {
              id
              guest {
                id
                firstName
                lastName
              }
            }
          }
          events
          access
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
          productId
          subTotal
          taxTotal
          total
          answers {
            id
            questionId
            questionnaireId
            answerJsonb
            answerDateTime
            userId
          }
        }
      }
    }
  }
`

export const GET_WAIVERS_QUERY = gql`
  query Waivers($orderId: String!) {
    pos {
      allCompletedWaivers(orderId: $orderId) {
        id
        signingString
        status
        waiver {
          id
          title
          intro
          showEmailPos
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

export const GET_COMPLETED_WAIVER_BY_ID = gql`
  query Waivers($id: String!) {
    pos {
      singleCompletedWaiver(id: $id) {
        status
      }
    }
  }
`

export const GET_ORDER_DETAILS_BY_ID = gql`
  query order($id: String!) {
    pos {
      order(id: $id) {
        id
        subTotal
        number
        taxTotal
        total
        orderRunOutTime
        shippingOptionPrice
        orderLineItems {
          id
          name
          price
          quantity
          promoCode
          taxes {
            name
            taxType
            value
          }
          orderDiscountLineItems {
            id
            discountId
            promoCodeId
            name
            price
            quantity
            subTotal
            taxTotal
            total
          }
          events
          access
          checkInIds
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
          productId
          subTotal
          taxTotal
          total
          answers {
            id
            questionId
            questionnaireId
            answerJsonb
            answerDateTime
            userId
          }
        }
      }
    }
  }
`

export const GET_SALE_DETAILS_BY_ID = gql`
  query sale($id: String!) {
    pos {
      sale(id: $id) {
        id
        hasShipped
        shippedAt
        trackingNumber
        created
        number
        shippingAddressId
        orderId
        purchaser {
          id
          firstName
          fullName
          lastName
          email
        }
        subTotal
        taxTotal
        total
        status
        accessRecords {
          id
          productJson
          guest {
            id
            firstName
            profilePictureUrl
            profilePictureUrlExtraLarge
            lastName
            fullName
            email
          }
        }
        saleLineItems {
          id
          name
          quantity
          subTotal
          total
          events
          forDate
          price
          productId
          guestId
          saleDiscountLineItems {
            discountId
            price
          }
          guests {
            id
            fullName
            email
          }
          guest {
            id
            fullName
            email
          }
          answers {
            id
          }
        }
        eventLineItems {
          id
          event {
            id
            name
            day
            startTime
            eventEventGroups {
              id
              eventGroup {
                id
                name
              }
            }
          }
          guestName
        }
      }
    }
  }
`

export const CREATE_PRINT_JOB_MUTATION = gql`
  mutation CreatePrintJob($printJobType: String!, $printTerminalId: String!, $accessRecordId: String, $saleId: String, $printData: String) {
    pos {
      createPrintJob(
        printJobType: $printJobType
        printTerminalId: $printTerminalId
        accessRecordId: $accessRecordId
        saleId: $saleId
        printData: $printData
        status: "created"
      ) {
        id
        printData
      }
    }
  }
`

export const CREATE_ACCESS_RECORD_PRINT_JOB_MUTATION = gql`
  mutation createAccessRecordPrintJob($saleId: String!, $printTerminalId: String!, $accessRecordId: String!) {
    pos {
      createAccessRecordPrintJob(saleId: $saleId, printTerminalId: $printTerminalId, accessRecordId: $accessRecordId) {
        id
        printData
      }
    }
  }
`

export const GET_SALE_QUERY = gql`
  query sale($id: String!) {
    pos {
      sale(id: $id) {
        id
        hasShipped
        shippedAt
        trackingNumber
        number
        shippingAddressId
        guests {
          id
          firstName
          lastName
        }
      }
    }
  }
`

export const GET_RENTAL_SALE_BY_ID_QUERY = gql`
  query rentalSale($id: String) {
    pos {
      rentalSale(id: $id) {
        id
        number
        todaysRentalSaleLineItems {
          id
          upsellSaleLineItems {
            id
            forDate
            upsellSelfId
            guestLineItems {
              id
              guest {
                id
                fullName
                age
                stance
                discipline
                height
                shoeSize
                level
                weight
              }
              rentalAssets {
                id
                assetNumber
                assetClassName
                size
              }
              accessRecord {
                id
                productJson
                forDate
                productInfo {
                  productName
                  accessPermissionName
                }
                guest {
                  id
                  firstName
                  lastName
                  profilePictureUrl
                  fullName
                  email
                }
                saleId
              }
            }
          }
          forDate
          upsellSelfId
          guestLineItems {
            id
            guest {
              id
              fullName
              age
              stance
              discipline
              height
              shoeSize
              level
              weight
            }
            rentalAssets {
              id
              assetNumber
              assetClassName
              size
            }
            accessRecord {
              id
              productJson
              forDate
              productInfo {
                productName
                accessPermissionName
              }
              guest {
                id
                firstName
                lastName
                profilePictureUrl
                fullName
                email
              }
              saleId
            }
          }
        }
      }
      account {
        id
        measurement
      }
    }
  }
`

export const GET_ALL_RENTAL_SALES_QUERY = gql`
  query allRentalSales($search: String) {
    pos {
      allRentalSales(filter: { search: $search }) {
        id
        number
        purchaser {
          id
          profilePictureUrl
          avatar
          fullName
          customerNumber
        }
        total
        status
        todaysRentalSaleLineItems {
          id
          guestLineItems {
            id
            guest {
              id
              profilePictureUrl
              profilePictureUrlExtraLarge
              avatar
              fullName
              customerNumber
            }
          }
        }
      }
    }
  }
`

export const GET_CHECKINS_BY_GUEST_QUERY = gql`
  query allCheckInsByGuest($id: String) {
    pos {
      allCheckInGuests(filter: { id: $id }) {
        checkIns {
          id
          height
          weight
          age
          stance
          discipline
          registrationId
          registrationCode
          shoeSize
          level
          forDate
          guest {
            fullName
            lastName
            email
            firstName
            dateOfBirth
            id
          }
          rentalAssets {
            id
            assetNumber
            assetClassName
            size
          }
        }
      }
      account {
        id
        measurement
      }
    }
  }
`

export const CREATE_SCAN_JOB_MUTATION = gql`
  mutation CreateScanJob($accessRecordId: String, $printTerminalId: String!, $status: String) {
    pos {
      createScanJob(accessRecordId: $accessRecordId, printTerminalId: $printTerminalId, status: $status) {
        id
        status
        accessRecordId
        printTerminalId
        userIds
      }
    }
  }
`
export const GET_GUESTS_BY_CARD_QUERY = gql`
  query GetGuests($cardRfid: String!) {
    pos {
      allGuests(cardRfid: $cardRfid) {
        id
        firstName
        lastName
        fullName
        email
        profilePictureUrl
        avatar
        active
        dateOfBirth
        phone
        customerNumber
        accessRecords {
          id
          productJson
          forDate
          productInfo {
            productName
            accessPermissionName
          }
          saleId
        }
        completedWaiversInvited {
          id
          signingString
          waiver {
            id
            title
            showEmailPos
            intro
            part1
            part2
            part3
            part4
            part5
          }
        }
      }
      account {
        id
        dateFormat
      }
    }
  }
`

export const GET_GUEST_DETAILS_BY_ID = gql`
  query GetGuest($id: String!) {
    pos {
      guest(id: $id) {
        id
        active
        firstName
        lastName
        fullName
        email
        profilePictureUrl
        avatar
        dateOfBirth
        phone
        customerNumber
        accessRecords {
          id
          productJson
          forDate
          productInfo {
            productName
            accessPermissionName
          }
          saleId
        }
        completedWaiversInvited {
          id
          signingString
          waiver {
            id
            title
            showEmailPos
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
  }
`

export const UPDATE_EVENT_LINE_ITEM = gql`
  mutation UpdateEventLineItem(
    $id: String!
    $eventId: String!
    $eventGroupId: String
    $requestedInstructorId: String
    $requestedIntructorName: String
    $requestedAt: String
  ) {
    pos {
      updateEventLineItem(
        id: $id
        eventId: $eventId
        eventGroupId: $eventGroupId
        requestedInstructorId: $requestedInstructorId
        requestedIntructorName: $requestedIntructorName
        requestedAt: $requestedAt
      ) {
        id
        eventName
        productItemId
        event {
          eventEventGroups {
            id
            eventGroup {
              id
              name
            }
          }
          id
          day
          startTime
        }
      }
    }
  }
`

export const GET_EVENT_LINE_ITEMS_BY_GUEST_QUERY = gql`
  query GetGuest($id: String!) {
    pos {
      guest(id: $id) {
        id
        fullName
        eventLineItems {
          id
          eventName
          productItemId
          availableEvents {
            id
          }
          event {
            eventEventGroups {
              id
              eventGroup {
                id
                name
              }
            }
            id
            day
            startTime
          }
        }
      }
    }
  }
`

export const CREATE_EMAIL_ORDER = gql`
  mutation EmailOrder($saleId: String!, $guestIds: [String]!) {
    pos {
      email(saleId: $saleId, guestIds: $guestIds) {
        success
      }
    }
  }
`

export const UPDATE_CHECKIN = gql`
  mutation UpdateCheckIn($id: String!, $saleLineItemId: String!) {
    pos {
      updateCheckIn(id: $id, saleLineItemId: $saleLineItemId) {
        id
      }
    }
  }
`

export const UPDATE_ACCESS_RECORD = gql`
  mutation updateAccessRecord($id: String!, $status: String, $cardRfid: String, $forDate: String) {
    pos {
      updateAccessRecord(id: $id, status: $status, cardRfid: $cardRfid, forDate: $forDate) {
        id
        updated
        created
        cardRfid
        enabled
        guestId
        productItemId
        saleLineItemId
        status
        forDate
        guestJson
        productJson
        accessPermissionsJson
        printTerminalId
        fileUrl
        saleId
      }
    }
  }
`

export const UPDATE_GUEST_USER = gql`
  mutation UpdateGuest($userId: String!, $firstName: String, $lastName: String, $profilePictureUrl: String, $dateOfBirth: String, $email: String) {
    pos {
      updateGuest(id: $userId, firstName: $firstName, lastName: $lastName, profilePictureUrl: $profilePictureUrl, dateOfBirth: $dateOfBirth, email: $email) {
        id
        firstName
        fullName
        lastName
        email
        profilePictureUrl
        dateOfBirth
      }
    }
  }
`

export const SIGN_IN_TERMINAL = gql`
  mutation signInTerminal($printTerminalId: String!, $password: String!) {
    pos {
      signInTerminal(printTerminalId: $printTerminalId, password: $password) {
        success
        authToken
      }
    }
  }
`

export const DEDUPLICATE_GUESTS = gql`
  mutation DeduplicateGuests($userId: String!, $usersToMerge: [String]!) {
    pos {
      deduplicateGuests(guestId: $userId, guestIds: $usersToMerge) {
        id
        email
      }
    }
  }
`
