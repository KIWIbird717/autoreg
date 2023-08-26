import React from 'react'
import { Card, CardProps } from 'antd'
import styles from './styles.module.css'

interface MCardProps extends CardProps {}

/**
 * Custom `Card` comonet. Extents from antd Card
 */
export const MCard: React.FC<MCardProps> = ({children, className, ...props}) => {
  return <Card bordered={false} {...props} className={`${styles.card_style} ${className}`}>{children}</Card>
}
