import { NotionAPI } from 'notion-client'

const { NOTION_ACCESS_TOKEN } = process.env

const client = new NotionAPI({
  userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  kyOptions: { 
    mode:'cors',
    hooks: {
      beforeRequest: [
        (request) => {
          const url = request.url.toString()
          if (url.includes('/api/v3/syncRecordValues')) {
            return new Request(
              url.replace('/api/v3/syncRecordValues', '/api/v3/syncRecordValuesMain'),
              request
            )
          }
          return request
        }
      ]
    }
  }
})

export default client
