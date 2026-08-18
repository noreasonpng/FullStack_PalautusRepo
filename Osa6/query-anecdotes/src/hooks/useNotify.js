import {useNotificationValue, useNotificationDispatch} from '../NotificationContext'

const useNotify = () => {
  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()

  const notify = (message, seconds = 5) => {
    dispatch({type: 'SET_NOTIFICATION', payload: message})
    setTimeout(() => {
      dispatch({type: 'CLEAR_NOTIFICATION'})
    }, seconds * 1000)
  }

  return {notification, notify}
}

export default useNotify