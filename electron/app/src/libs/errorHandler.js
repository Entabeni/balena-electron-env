export function errorHandler(error, path) {
  const currentError = !!error.graphQLErrors ? error.graphQLErrors.map(x => x.message) : error
  console.error(`Error from: ${path}`, currentError)
  return currentError
}
