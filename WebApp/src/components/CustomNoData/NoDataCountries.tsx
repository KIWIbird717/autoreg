import { SmileOutlined } from '@ant-design/icons'

export const NoDataCountries = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SmileOutlined style={{ fontSize: 20 }} />
      <p>Такой страны нет в списке</p>
    </div>
  )
}

export const ServiceIsNotSelected = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <SmileOutlined style={{ fontSize: 20 }} />
      <p>Сначала нужно выбрать СМС сервис</p>
    </div>
  )
}
