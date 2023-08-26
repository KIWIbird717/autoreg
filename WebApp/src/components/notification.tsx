import { notification } from 'antd'

interface INotif {
  type: 'error' | 'info' | 'warning' | 'success',
  msg: string,
  descrb?: string,
  place: "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight"
}

export const notificationHandler = ({type, msg, descrb, place}: INotif) => {
  notification[type]({
    message: msg,
    description: descrb,
    placement: place
  })
}