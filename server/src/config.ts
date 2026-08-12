export const config = {
  port: Number(process.env.PORT ?? 3001),
  userAgent: process.env.API_USER_AGENT ?? 'BookExplorer/1.0 (claude@discretelogix.com)',
  openLibraryUrl: process.env.OPEN_LIBRARY_URL ?? 'https://openlibrary.org',
  googleBooksUrl: process.env.GOOGLE_BOOKS_URL ?? 'https://www.googleapis.com/books/v1',
  googleBooksApiKey: process.env.GOOGLE_BOOKS_API_KEY,
}
