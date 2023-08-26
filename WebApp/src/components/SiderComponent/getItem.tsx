import React from 'react'
import { MenuProps } from 'antd';


export type MenuItem = Required<MenuProps>['items'][number];

export interface IMenuItems {
  label: string,
  key: React.Key,
  icon?: React.ReactElement,
  children?: MenuItem[],
  type?: 'group',
  onClick?: () => void,
  style?: React.CSSProperties,
  onMouseEnter: () => void,
  onMouseLeave: () => void
}

/**
 * @param label string
 * @param key React.Key
 * @param icon React.ReactElement | null
 * @param children MenuItem[]
 * @param type 'group'
 * @param onClick () => void
 * @param style React.CSSProperties | null
 * @param onMouseEnter () => void,
 * @param onMouseLeave () => void
 * @returns MenuItem
 */
export const getItem = (
  label: string,
  key: React.Key,
  icon?: React.ReactElement | null,
  children?: MenuItem[] | null,
  type?: 'group' | null,
  onClick?: () => void,
  style?: React.CSSProperties | null,
  onMouseEnter?: (e: any) => void,
  onMouseLeave?: () => void
): IMenuItems => {
  return {key, icon, children, onClick, style, label, type, onMouseEnter, onMouseLeave} as IMenuItems
}

