// From Zod: https://github.com/colinhacks/zod/blob/4e42ee315ad8127945c9917f17818abb64c971fc/src/types.ts#L502
const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i // eslint-disable-line no-useless-escape

export function isListOfEmails(string: string) {
  return (
    string.length === 0 ||
    string.split(',').filter((emailAddress) => !emailRegex.test(emailAddress))
      .length === 0
  )
}

export function isListOfEmailsValidationMessage(string: string) {
  const firstInvalidEmail = string
    .split(',')
    .filter((emailAddress) => !emailRegex.test(emailAddress))[0]
  return `'${firstInvalidEmail}' is not a valid email address.`
}
