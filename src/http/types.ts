export interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>
  throwError?: boolean
}
