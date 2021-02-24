import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`

  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700');

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    line-height: 1.15;
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  *:focus {
    outline: none;
  }
  #app {
    width: 100%;
  }

  html, body { 
    font-family: ${props => props.theme.fontFamily};
  }

  html {
    height: 100%;
    font-size: 14px;
    -webkit-text-size-adjust: 100%;

    /* Media Query */
    @media (min-width: 800px) {
      font-size: 16px;
    }
  }

  body {
    height: 100%;
    display: flex;
    font-size: 1rem;
    overflow-x: hidden;

    #root{
      height: 100vh;
      margin: 0;
      padding: 0;
      flex: 1;
    }

    &.react-confirm-alert-on-top > #react-confirm-alert {
      z-index: 9999 !important;
    }
  }

  hr {
    height: 0;
    box-sizing: content-box;
    overflow: visible;
  }

  a {
    text-decoration: none;
  }

  b,
  strong {
    font-weight: bolder;
  }

  img {
    border-style: none;
  }

  button,
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  button,
  input {
    overflow: visible;
  }

  button,
  select {
    text-transform: none;
  }

  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }

  button::-moz-focus-inner,
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  button:-moz-focusring,
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  progress {
    vertical-align: baseline;
  }

  textarea {
    overflow: auto;
  }

  [type="checkbox"],
  [type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }

  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }

  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  details {
    display: block;
  }

  [hidden] {
    display: none;
  }

  button:disabled,
  button[disabled]{
    cursor: not-allowed;
    pointer-events: none;
    color: ${props => props.theme.disabled};
    border: 0.05rem solid ${props => props.theme.disabled};
    background-color: ${props => props.theme.disabledTint};

  }

  /* #1060: Adding this global style to overwrite 'react-confirm-alert' plugin styles */
  .react-confirm-alert-overlay {
    background: rgba(10, 10, 10, 0.5) !important;
  }

  .react-confirm-alert {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.75) !important;
    height: auto !important;
    max-height: 60%;
    max-width: 60%;
    min-height: 250px;
    min-width: 500px;
    width: auto !important;

    & > .custom-ui {
      height: 100% !important;
      min-height: 100% !important;
      min-width: 100% !important;
      width: 100% !important;
    }
  }
`
