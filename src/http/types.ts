export interface RequestOptions extends Omit<RequestInit, 'body'> {
  // eslint-disable-next-line
  body?: any
  // eslint-disable-next-line
  params?: Record<string, any>
  throwError?: boolean
}
