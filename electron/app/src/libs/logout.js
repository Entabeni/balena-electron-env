// Components
import { auth } from 'es-libs'

export const logoutHandler = props => {
  auth.signout()
  props.client.resetStore()
  props.history.push('/')
  props.toastManager.add('You have been logged out successfully.', { appearance: 'success', autoDismiss: true })
}
