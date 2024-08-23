// import { QueryFunction } from '@tanstack/react-query'

// export const filterUsers: QueryFunction<
//   IUserModel[],
//   [string, { name: string }]
// > = async ({ queryKey }): Promise<IUserModel[]> => {
//   const [, params] = queryKey
//   const queryParams = new URLSearchParams({
//     ...params,
//   }).toString()
//   const response = await http.get(`/api/v1/users?${queryParams}`)
//   return response.data.data
// }

export const filterUsers = async (): Promise<unknown> => Object.values({})
