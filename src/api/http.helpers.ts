export function formatUrlParams(
  cursor: string | null,
  params: { [key: string]: string | number | null | undefined | boolean },
) {
  const queryParams = new URLSearchParams({})
  Object.entries({ ...params, cursor }).forEach(
    ([key, value]) => value && queryParams.append(key, `${value}`),
  )
  return queryParams.toString()
}
