export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null
  params?: Record<string, string | number | boolean | undefined>
  throwError?: boolean
  auth?: boolean
}
