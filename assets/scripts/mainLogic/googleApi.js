
export async function makeARequest(word) {
   return (await fetch(`https://www.googleapis.com/books/v1/volumes?q=${word}`)).json()
}