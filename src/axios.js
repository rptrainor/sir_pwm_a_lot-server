const instance = axios.create({
  baseURL: 'https://haveibeenpwned.com/api/v3/'
})

instance.defaults.headers.common['User-Agent'] = 'have-i-been-pawned-Graphql-API'
