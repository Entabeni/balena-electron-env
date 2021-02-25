import { gql } from 'apollo-boost'

export const LOGIN_MUTATION = gql`
  mutation SigninUser($login: String!, $pin: String!) {
    pos {
      signinUser(login: $login, pin: $pin) {
        success
        authToken
        user {
          id
          email
          fullName
          avatar
          profilePictureUrl
          departmentIds
        }
      }
    }
  }
`

export const GET_ACCOUNT_INFO = gql`
  query GetAccountInfo {
    pos {
      account {
        dateFormat
        timeZone
      }
    }
  }
`

export const GET_PRINT_TERMINALS = gql`
  query GetPrintTerminals {
    pos {
      allPrintTerminals {
        id
        name
        customerFacingPrintTerminal
        parentPrintTerminalId
      }
      account {
        id
        algoliaSearchApi
        algoliaApplicationId
      }
    }
  }
`

export const UPSERT_POS_SESSION = gql`
  mutation UpsertPosSession($printTerminalId: String!) {
    pos {
      upsertPosSession(printTerminalId: $printTerminalId) {
        id
        printTerminalId
        openingSessionBalances {
          id
          quantity
          denominationName
          denominationValue
        }
        closingSessionBalances {
          id
          quantity
          denominationName
          denominationValue
        }
        printTerminal {
          id
        }
      }
    }
  }
`

export const COMPLETED_WAVIER_MAILER = gql`
  query completedWaiverMailer($id: String!) {
    pos {
      completedWaiverMailer(id: $id) {
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
`

export const UPDATE_POS_SESSION = gql`
  mutation UpdatePosSession($id: String!, $sessionBalances: [PosSessionBalanceInput]!, $status: String) {
    pos {
      updatePosSession(id: $id, sessionBalances: $sessionBalances, status: $status) {
        id
        printTerminalId
        openingSessionBalances {
          id
          quantity
          denominationName
          denominationValue
        }
        closingSessionBalances {
          id
          quantity
          denominationName
          denominationValue
        }
      }
    }
  }
`
