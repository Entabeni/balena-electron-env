import React from 'react'

// Icons
import * as Ionic from 'react-icons/io'
import * as FontAwesome from 'react-icons/fa'
import * as Material from 'react-icons/md'

const IconList = {
  ...Ionic,
  ...FontAwesome,
  ...Material
}

// Icons
export const Icon = ({ name, size, ...props }) => {
  const IconName = IconList[name]

  return <IconName className={props && props.className ? `icon ${props.className}` : 'icon'} size={size} />
}
