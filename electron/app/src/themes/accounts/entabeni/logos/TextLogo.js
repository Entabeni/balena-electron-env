import React from 'react'

// Styles
import styled from 'styled-components'

const FullLogo = styled.svg`
  width: auto;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  margin: 0;
  object-fit: contain;
`

export const TextLogo = props => (
  <FullLogo id="es-full-logo" viewBox="0 0 652.1 148.472">
    <path
      fill="#0A1D34"
      d="M313.018,50.48h-26.369v20.314h31.349v10.938H272.39V10.634h45.51v10.987h-31.251v17.872h26.369V50.48z M339.972,28.897l0.635,7.569c1.758-2.702,3.923-4.802,6.495-6.299c2.571-1.497,5.452-2.247,8.643-2.247c5.339,0,9.505,1.718,12.501,5.152c2.995,3.435,4.492,8.863,4.492,16.285v32.375H358.43V49.406c0-3.776-0.659-6.453-1.978-8.033c-1.318-1.579-3.296-2.368-5.933-2.368c-2.117,0-3.98,0.399-5.591,1.196c-1.611,0.798-2.938,1.897-3.98,3.296v38.235H326.69V28.897
      H339.972z M400.474,15.957v12.94h8.936v10.01h-8.936v26.906c0,2.051,0.431,3.516,1.294,4.395c0.862,0.879,1.994,1.318,3.394,1.318c0.749,0,1.399-0.041,1.954-0.122c0.553-0.081,1.188-0.22,1.904-0.415l1.172,10.303c-1.433,0.488-2.825,0.854-4.175,1.099c-1.351,0.244-2.824,0.365-4.419,0.365c-4.916,0-8.7-1.35-11.354-4.052s-3.979-6.983-3.979-12.843V38.907h-7.715v-10.01h7.715
      v-12.94H400.474z M449.354,81.732c-0.521-1.204-0.969-2.474-1.343-3.809c-0.375-1.334-0.643-2.702-0.806-4.102c-1.465,2.572-3.402,4.705-5.811,6.397s-5.273,2.539-8.594,2.539c-5.535,0-9.799-1.423-12.793-4.272c-2.996-2.849-4.493-6.73-4.493-11.646c0-5.176,1.994-9.188,5.982-12.037c3.987-2.848,9.807-4.273,17.457-4.273h8.008V46.33c0-2.54-0.667-4.509-2.002-5.909c-1.335-1.399-3.321-2.1-5.958-2.1c-2.312,0-4.094,0.562-5.347,1.685c-1.254,1.123-1.88,2.661-1.88,4.615h-13.721l-0.098-0.293c-0.229-4.459,1.716-8.309,5.835-11.548c4.118-3.239,9.498-4.859,16.139-4.859c6.348,0,11.483,1.596,15.406,4.786c3.922,3.191,5.884,7.764,5.884,13.722v21.827c0,2.475,0.187,4.802,0.562,6.983c0.374,2.182,0.968,4.346,1.782,6.495H449.354z M436.316,72.21c2.474,0,4.688-0.618,6.641-1.855c1.953-1.237,3.288-2.669,4.004-4.297v-7.471h-8.008c-3.027,0-5.315,0.75-6.861,2.246c-1.546,1.498-2.319,3.337-2.319,5.518c0,1.791,0.578,3.215,1.733,4.273C432.661,71.681,434.265,72.21,436.316,72.21z M519.572,56.779c0,7.878-1.758,14.178-5.273,18.897c-3.516,4.721-8.594,7.08-15.235,7.08c-3.093,0-5.787-0.651-8.082-1.953s-4.241-3.206-5.835-5.713l-1.172,6.641h-12.061V5.556
      h14.209v28.957c1.53-2.116,3.361-3.743,5.494-4.883c2.132-1.139,4.582-1.709,7.349-1.709c6.706,0,11.817,2.532,15.333,7.593c3.516,5.062,5.273,11.81,5.273,20.241V56.779z M505.363,55.754c0-5.144-0.757-9.221-2.271-12.232c-1.514-3.011-4.094-4.517-7.74-4.517c-2.214,0-4.085,0.464-5.615,1.392c-1.531,0.928-2.735,2.254-3.614,3.979v22.365c0.879,1.596,2.091,2.816,3.638,3.663c1.546,0.847,3.442,1.27,5.689,1.27c3.678,0,6.25-1.294,7.715-3.882c1.465-2.588,2.198-6.258,2.198-11.011V55.754z M551.265,82.757c-7.879,0-14.031-2.417-18.458-7.251c-4.428-4.834-6.642-11.06-6.642-18.678v-1.953c0-7.911,2.148-14.389,6.446-19.435c4.297-5.045,10.205-7.552,17.726-7.52c7.096,0,12.541,2.173,16.334,6.519c3.792,4.346,5.688,10.198,5.688,17.555v7.374h-31.496l-0.146,0.293c0.228,3.614,1.326,6.543,3.296,8.79c1.97,2.247,4.891,3.37,8.766,3.37c3.189,0,5.9-0.325,8.13-0.977c2.229-0.651,4.533-1.644,6.91-2.979l3.857,8.79c-2.116,1.726-4.98,3.174-8.595,4.346C559.468,82.172,555.528,82.757,551.265,82.757
      z M550.337,38.907c-2.865,0-5.071,0.985-6.617,2.954c-1.546,1.97-2.482,4.583-2.808,7.837l0.098,0.244h17.384v-1.074c0-3.092-0.635-5.525-1.904-7.3C555.22,39.795,553.169,38.907,550.337,38.907z M593.698,28.897l0.635,7.569c1.758-2.702,3.923-4.802,6.495-6.299c2.571-1.497,5.452-2.247,8.643-2.247c5.339,0,9.505,1.718,12.501,5.152c2.994,3.435,4.492,8.863,4.492,16.285v32.375h-14.308V49.406c0-3.776-0.659-6.453-1.978-8.033c-1.318-1.579-3.296-2.368-5.933-2.368c-2.117,0-3.979,0.399-5.592,1.196c-1.611,0.798-2.938,1.897-3.979,3.296v38.235h-14.259
      V28.897H593.698z M652.1,16.25h-14.259V5.556H652.1V16.25z M652.1,81.732h-14.259V28.897H652.1V81.732z M486.709,128.929c0-1.845-0.73-3.369-2.188-4.571c-1.459-1.202-3.934-2.331-7.425-3.385c-3.819-1.054-6.724-2.368-8.716-3.941c-1.991-1.572-2.987-3.71-2.987-6.411c0-2.751,1.115-5.012,3.344-6.782s5.073-2.656,8.531-2.656c3.639,0,6.564,1.001,8.777,3.002
      s3.286,4.542,3.221,7.622l-0.049,0.148h-2.753c0-2.372-0.856-4.34-2.569-5.905c-1.713-1.564-3.921-2.347-6.626-2.347c-2.787,0-4.97,0.663-6.552,1.988c-1.582,1.326-2.373,2.953-2.373,4.88c0,1.829,0.717,3.332,2.151,4.51s3.962,2.277,7.585,3.298c3.77,1.104,6.646,2.463,8.63,4.077c1.983,1.614,2.975,3.756,2.975,6.424c0,2.801-1.16,5.053-3.479,6.758c-2.319,1.704-5.241,2.557-8.765,2.557c-3.524,0-6.598-0.901-9.22-2.705c-2.623-1.804-3.893-4.436-3.811-7.895l0.049-0.147h2.729c0,2.783,1.041,4.854,3.123,6.214c2.081,1.358,4.458,2.038,7.13,2.038c2.737,0,4.966-0.63,6.688-1.891C485.849,132.548,486.709,130.922,486.709,128.929z M503.772,130.436l0.934,3.188h0.147l8.039-22.682h3.295l-11.555,31.008c-0.688,1.812-1.582,3.352-2.68,4.62c-1.099,1.269-2.705,1.902-4.819,1.902c-0.344,0-0.762-0.037-1.254-0.111c-0.492-0.073-0.853-0.152-1.082-0.234l0.344-2.471c0.197,0.033,0.512,0.07,0.947,0.111c0.434,0.041,0.75,0.062,0.946,0.062c1.279,0,2.303-0.457,3.073-1.371s1.426-2.088,1.967-3.521l1.401-3.607L493.2,110.942h3.27L503.772,130.436z M536.791,130.831c0-1.252-0.513-2.343-1.537-3.274c-1.024-0.93-2.872-1.692-5.544-2.285c-3.146-0.658-5.486-1.561-7.02-2.705c-1.532-1.145-2.299-2.747-2.299-4.806c0-2.043,0.856-3.772,2.569-5.188c1.713-1.417,3.979-2.125,6.799-2.125c2.966,0,5.335,0.753,7.104,2.261c1.771,1.507,2.614,3.364,2.533,5.571l-0.05,0.148h-2.729c0-1.466-0.627-2.743-1.881-3.83
      s-2.914-1.631-4.979-1.631c-2.132,0-3.737,0.47-4.819,1.409c-1.082,0.938-1.623,2.034-1.623,3.286c0,1.219,0.463,2.228,1.39,3.026c0.926,0.799,2.773,1.503,5.544,2.112c3.114,0.691,5.471,1.655,7.068,2.891c1.599,1.235,2.397,2.899,2.397,4.991c0,2.224-0.897,4.031-2.692,5.423c-1.795,1.393-4.167,2.088-7.117,2.088c-3.229,0-5.766-0.773-7.609-2.322c-1.845-1.548-2.717-3.393-2.619-5.534l0.05-0.148h2.704c0.114,1.927,0.897,3.327,2.348,4.2c1.451,0.873,3.16,1.31,5.127,1.31c2.13,0,3.811-0.478,5.04-1.433C536.176,133.31,536.791,132.165,536.791,130.831z M551.101,104.098v6.844h5.852v2.421h-5.852v17.419c0,1.746,0.315,2.986,0.946,3.719c0.631,0.733,1.471,1.1,2.521,1.1c0.36,0,0.708-0.021,1.045-0.062c0.335-0.041,0.732-0.111,1.192-0.211l0.442,2.199c-0.394,0.198-0.882,0.358-1.463,0.482c-0.582,0.123-1.16,0.185-1.733,0.185c-1.869,0-3.323-0.593-4.364-1.778c-1.041-1.187-1.562-3.064-1.562-5.634v-17.419h-4.597v-2.421h4.597v-6.844H551.101z M572.81,138.193c-3.441,0-6.236-1.223-8.384-3.669s-3.221-5.588-3.221-9.426v-1.359c0-3.854,1.086-7.032,3.258-9.537c2.172-2.503,4.863-3.755,8.076-3.755c3.229,0,5.725,1.042,7.486,3.125c1.762,2.084,2.644,4.889,2.644,8.413v2.298h-18.514v0.815c0,3.048,0.767,5.576,2.299,7.585c1.532,2.01,3.651,3.015,6.355,3.015c1.623,0,3.114-0.268,4.475-0.803s2.491-1.256,3.393-2.162l1.254,2.026c-0.934,0.988-2.159,1.808-3.675,2.458C576.739,137.868,574.924,138.193,572.81,138.193z M572.539,112.967c-2.262,0-4.122,0.815-5.581,2.446s-2.311,3.698-2.557,6.202l0.073,0.147h15.244v-0.617c0-2.372-0.619-4.328-1.856-5.868C576.624,113.737,574.851,112.967,572.539,112.967z M591.126,110.942l0.271,4.397c0.852-1.548,1.987-2.75,3.405-3.607c1.417-0.855,3.102-1.284,5.052-1.284c2.032,0,3.729,0.49,5.09,1.47c1.36,0.98,2.335,2.476,2.926,4.484c0.803-1.861,1.945-3.318,3.43-4.373c1.483-1.054,3.273-1.581,5.372-1.581c2.835,0,5.027,0.947,6.576,2.841c1.549,1.895,2.323,4.827,2.323,8.796v15.591h-2.95v-15.64c0-3.295-0.582-5.621-1.745-6.98c-1.164-1.358-2.771-2.038-4.819-2.038c-2.245,0-3.982,0.688-5.212,2.063c-1.229,1.375-2.008,3.149-2.336,5.324c0,0.182,0.004,0.362,0.013,0.544c0.008,0.181,0.012,0.411,0.012,0.691v16.035h-2.975v-15.64c0-3.229-0.586-5.539-1.758-6.931s-2.782-2.088-4.831-2.088c-2.065,0-3.709,0.523-4.93,1.569s-2.077,2.458-2.569,4.237v18.852h-2.95v-26.733H591.126z M649.174,130.831c0-1.252-0.513-2.343-1.537-3.274c-1.024-0.93-2.872-1.692-5.544-2.285c-3.146-0.658-5.486-1.561-7.02-2.705c-1.532-1.145-2.299-2.747-2.299-4.806c0-2.043,0.856-3.772,2.569-5.188c1.713-1.417,3.979-2.125,6.799-2.125c2.966,0,5.335,0.753,7.104,2.261c1.771,1.507,2.614,3.364,2.533,5.571l-0.05,0.148h-2.729c0-1.466-0.627-2.743-1.881-3.83s-2.914-1.631-4.979-1.631c-2.132,0-3.737,0.47-4.819,1.409c-1.082,0.938-1.623,2.034-1.623,3.286c0,1.219,0.463,2.228,1.39,3.026c0.926,0.799,2.773,1.503,5.544,2.112c3.114,0.691,5.471,1.655,7.068,2.891c1.599,1.235,2.397,2.899,2.397,4.991c0,2.224-0.897,4.031-2.692,5.423c-1.795,1.393-4.167,2.088-7.117,2.088c-3.229,0-5.766-0.773-7.609-2.322c-1.845-1.548-2.717-3.393-2.619-5.534l0.05-0.148h2.704c0.114,1.927,0.897,3.327,2.348,4.2c1.451,0.873,3.16,1.31,5.127,1.31c2.13,0,3.811-0.478,5.04-1.433C648.559,133.31,649.174,132.165,649.174,130.831z"
    />
    <polygon
      fill="#950000"
      points="49.4,68.511 0,92.227 96.2,0 163.8,73.782 200.2,42.161 260,115.942 202.8,60.606 176.8,86.957 208,134.388 88.4,21.08 52,115.942"
    />
  </FullLogo>
)