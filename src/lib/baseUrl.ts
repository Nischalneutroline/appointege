export const getBaseUrl = () => {
  const baseUrl =
    process.env.NODE_ENV !== 'production'
      ? process.env.NEXT_PUBLIC_DEV_URL
      : process.env.NEXT_PUBLIC_PROD_URL
  return baseUrl || 'http://localhost:3000'
}
