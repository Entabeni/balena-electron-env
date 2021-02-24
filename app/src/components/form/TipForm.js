import React, { useState } from 'react'
import styled from 'styled-components'
import { BasicForm, RadioInputGroup, RadioInput, ListGrid, Par, ListItem, ListItemWrapper } from 'es-components'

const FieldInput = styled.input`
  width: 100%;
  height: 45px;
  padding: ${props => (props.value ? '8px 50px 0 15px' : '0 50px 0 15px')};

  &:hover {
    transition: all 0.4s;
    border-color: ${props => props.theme.greyDarkShade};
  }

  &:focus {
    border-color: ${props => props.theme.greyDarkShade};
  }

  border: ${props => props.err && `2px solid ${props.theme.red}`} !important;

  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`
export function TipForm({ useTipAmout, useAmount, setTipAmount }) {
  const [customTipAmount, setCustomTip] = useState(0)

  return (
    <BasicForm light height="90%" onValueChange={values => setTipAmount(values.tipAmount)} initialValues={{ tipAmount: useTipAmout }}>
      <RadioInputGroup fieldGroup="tipAmount" withoutWrapper>
        <ListGrid
          listTitle="Select the tip amount"
          hideSearch
          listHeaders={[
            { title: 'Percentage', align: 'left' },
            { title: 'Tip Amount', align: 'left' },
            { title: 'Add', align: 'left' }
          ]}
          listColWidths="1fr 1fr 130px">
          <ListItemWrapper key={1} difRowColor>
            <ListItem>
              <Par size="1rem" color="greyDark">
                10%
              </Par>
            </ListItem>
            <ListItem>
              <Par size="1rem" color="greyDark">
                {useAmount * 0.1}
              </Par>
            </ListItem>
            <ListItem>
              <RadioInput id={`10%`} radioValue={useAmount * 0.1} />
            </ListItem>
          </ListItemWrapper>
          <ListItemWrapper key={2} difRowColor>
            <ListItem>
              <Par size="1rem" color="greyDark">
                15%
              </Par>
            </ListItem>
            <ListItem>
              <Par size="1rem" color="greyDark">
                {useAmount * 0.15}
              </Par>
            </ListItem>
            <ListItem>
              <RadioInput id={`15%`} radioValue={useAmount * 0.15} />
            </ListItem>
          </ListItemWrapper>
          <ListItemWrapper key={3} difRowColor>
            <ListItem>
              <Par size="1rem" color="greyDark">
                20%
              </Par>
            </ListItem>
            <ListItem>
              <Par size="1rem" color="greyDark">
                {useAmount * 0.2}
              </Par>
            </ListItem>
            <ListItem>
              <RadioInput id={'20%'} radioValue={useAmount * 0.2} />
            </ListItem>
          </ListItemWrapper>
          <ListItemWrapper key={4} difRowColor>
            <ListItem>
              <Par size="1rem" color="greyDark">
                Custom Amount
              </Par>
            </ListItem>
            <ListItem>
              <Par size="1rem" color="greyDark">
                <FieldInput value={customTipAmount} onChange={e => setCustomTip(e.target.value)} autoComplete="off" />
              </Par>
            </ListItem>
            <ListItem>
              <RadioInput id={'custom'} radioValue={customTipAmount} />
            </ListItem>
          </ListItemWrapper>
        </ListGrid>
      </RadioInputGroup>
    </BasicForm>
  )
}
