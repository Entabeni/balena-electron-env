import styled, { css } from 'styled-components'

// Set the button kind (Theme color value)
const typeSpacingStyle = css`
  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};
`

// Text transformations
const typeTransformations = css`
  text-transform: ${props => props.textTransform || 'none'};
`

// Text alignment
const typeAlignment = css`
  text-align: ${props => props.textAlign || 'inherit'};
`

// Line height
const typeLineHeight = css`
  line-height: ${props => props.lineHeight || 'inherit'};
`

//Font and Weights Roboto:300,400,500,700
export const H1 = styled.h1`
  font-size: ${props => props.size || '1.6rem'};
  font-weight: ${props => (props.light ? '300' : '700')};
  color: ${props => props.theme[props.color] || props.theme.greyBlack};

  ${typeSpacingStyle}
  ${typeTransformations}
`

export const H2 = styled.h2`
  font-size: ${props => props.size || '1.5rem'};
  font-weight: 700;
  margin-left: ${props => props.theme[props.marginLeft] || props.marginLeft || 0};
  margin-bottom: ${props => props.theme[props.marginBottom] || props.marginBottom || 0};
  margin-top: ${props => props.theme[props.marginTop] || props.marginTop || 0};
  overflow: hidden;
  height: ${props => props.height || 'auto'};
  color: ${props => props.theme[props.color] || props.theme.greyBlack};

  ${typeTransformations}
`

export const H3 = styled.h3`
  font-size: ${props => props.size || '1.4rem'};
  font-weight: 500;
  color: ${props => props.theme[props.color] || props.theme.greyBlack};

  ${typeSpacingStyle}
  ${typeTransformations}
`

export const H4 = styled.h4`
  font-size: ${props => props.size || '1.3rem'};
  font-weight: 500;
  color: ${props => props.theme[props.color] || props.theme.greyBlack};

  ${typeSpacingStyle}
  ${typeTransformations}
`

export const H5 = styled.h5`
  font-size: ${props => props.size || '1.2rem'};
  font-weight: ${props => (props.light ? '400' : '500')};
  color: ${props => props.theme[props.color] || props.theme.greyBlack};

  ${typeSpacingStyle}
  ${typeTransformations}
`

export const H6 = styled.h6`
  font-size: ${props => props.size || '1.2rem'};
  font-weight: 300;
  color: ${props => props.theme[props.color] || props.theme.greyBlack};

  ${typeSpacingStyle}
  ${typeTransformations}
`

export const Par = styled.p`
  font-size: ${props => props.size || '1rem'};
  font-weight: ${props => (props.light ? '300' : '400')};
  color: ${props => props.theme[props.color] || props.theme.greyBlack};
  border-bottom: ${props => (props.underline ? `1px solid ${props.theme.greyTint}` : 'none')};

  ${typeSpacingStyle}
  ${typeTransformations}
  ${typeLineHeight}
  ${typeAlignment}
`
export const Bold = styled.strong`
  font-size: inherit;
  font-weight: ${props => (props.bolder ? 700 : 500)};
  color: ${props => props.theme[props.color] || 'inherit'};
  margin-left: ${props => props.marginLeft || 0};
  margin-right: ${props => props.marginRight || 0};
`

export const Small = styled.small`
  font-size: 0.7rem;
  font-weight: 300;
  color: ${props => props.theme[props.color] || props.theme.greyBlack};

  ${typeSpacingStyle}
  ${typeTransformations}
`

export const Span = styled.span`
  ${props => props.theme[props.bgColor] && `background-color: ${props.theme[props.bgColor]};`}
  color: ${props => props.theme[props.color] || props.theme.greyBlack};
  display: inline-block;
  ${props => props.lineHeight && `line-height: ${props.lineHeight};`}
  ${props => props.margin && `margin: ${props.margin};`}
  ${props => props.padding && `padding: ${props.padding};`}
`
