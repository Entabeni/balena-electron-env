import React from 'react'
import styled, { css } from 'styled-components'

// Style Utils
import { flexCenterItem } from '../utils'

// Components
import { Icon } from 'es-components'

const AvatarWrapper = styled.div`
  margin-left: 1em;
  padding-left: 1em;
  border-left: 1px solid ${props => props.theme.grey};
`

const AvatarFigure = styled.figure`
  height: 40px;
  width: 40px;
  overflow: hidden;
  background-color: ${props => props.theme.greyLight};
  border-radius: 0.6em;
  border: 1px solid ${props => props.theme.grey};

  ${flexCenterItem}
`

const GuestFullName = styled.div`
  float: left;
  border: 1px solid;
  color: ${props => props.theme.greyDark};
  height: 35px;
  padding: 5px;
  margin-right: 10px;
  margin-top: 2px;
  border-radius: 10px;
  padding: 7px 15px;
  border-radius: 0.6em;
`

const AvatarImg = styled.img`
  height: auto;
  width: 105%;
  overflow: hidden;

  ${flexCenterItem}
`

export function Avatar({ guest }) {
  return (
    <AvatarWrapper>
      <GuestFullName id="guestFullName">{!!guest && guest.fullName ? guest.fullName : 'User Full Name'}</GuestFullName>
      <AvatarFigure>
        {!!guest && guest.profilePictureUrl ? <AvatarImg src={guest.profilePictureUrl} alt={`${guest.fullName} Profile Image`} /> : 'AP'}
      </AvatarFigure>
    </AvatarWrapper>
  )
}

const userRoundedPicSharedStyles = css`
  ${props => props.inGrid && `grid-area: ${props.inGrid};`}
  height: ${props => props.size};
  width: ${props => (props.width ? props.width : props.size)};
`

const UserRoundedImage = styled.div`
display: inline-block;
  background-image: url(${props => props.imageURL});
  background-repeat: no-repeat;
  background-size: cover;
  ${userRoundedPicSharedStyles}
  border-radius: ${props => (props.square ? '5px' : '50%')};
`

const UserRoundedEmptyImage = styled.div`
  display: ${props => (props.square ? 'flex' : 'inline-block')};
  background-color: ${props => props.theme.white};
  color: ${props => props.theme.grey};
  ${userRoundedPicSharedStyles}
  justify-content: center;
  border-radius: ${props => (props.square ? '5px' : '50%')};
`

export const RoundedAvatar = ({ imageURL, inGrid, size, square, width }) => {
  if (imageURL) {
    return <UserRoundedImage imageURL={imageURL} inGrid={inGrid} size={size} width={width} square={square} />
  } else {
    return (
      <UserRoundedEmptyImage inGrid={inGrid} size={size} width={width} square={square}>
        <Icon name="FaUserCircle" size={size} />
      </UserRoundedEmptyImage>
    )
  }
}
