export interface AxioxResponseType<T> {
  data: { success: boolean; errorDetail?: any; message?: string; data: T }
}
