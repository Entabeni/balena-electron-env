import styled from 'styled-components'

export const LoginContainer = styled.main`
  min-height: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 350px;
  background-color: ${props => props.theme.white};
`

export const DashboardContainer = styled.main`
  margin: 0;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: ${props => props.theme.red};

  display: grid;
  grid-template-rows: auto calc(100vh - 106px) auto;
  grid-template-columns: ${props => (props.dashbordNav ? '60px 1fr 350px' : '1fr 350px')};
`
