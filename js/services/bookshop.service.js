'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 3

var gBooks
var gFilterBy = { rate: 0, price: 1000, title:'' }
var gPageIdx = 1


_createBooks()


function nextPage() {
    console.log(gPageIdx, PAGE_SIZE, gPageIdx* PAGE_SIZE, gBooks.length )
    gPageIdx++    
    return gPageIdx
}

function isLastPage(){
    var books = getBooks()
    return ( gPageIdx * PAGE_SIZE >= books.length) 
} 


function prevPage() {
    gPageIdx--
    console.log(gPageIdx, PAGE_SIZE)
    return gPageIdx
}

function numOfPages(){
    var books = getBooks()
    console.log(books.length)
    console.log(books.length/PAGE_SIZE)
    return Math.ceil(books.length/PAGE_SIZE)

}


function getBooks(){

    console.log(gBooks)
    var books =gBooks.filter(
        (book) => book.rate >= gFilterBy.rate &&
                    book.price <= gFilterBy.price&&
                    book.title.toLowerCase().includes(gFilterBy.title.toLowerCase()))

    console.log('getting books', books)    
    return books
}


function changePage(page){
    gPageIdx = page
}


function getBooksToRender(){

    var books = getBooks()
    console.log('geting Books To Render', books)
    console.log(gPageIdx)

    const startIdx = (gPageIdx-1) * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    console.log(books)
    return books
}


function setBookSort(sortBy) {
    if (sortBy === 'price') {
        gBooks.sort((b1, b2) => (b1.price - b2.price))
    } else if (sortBy === 'title') {
        gBooks.sort((b1, b2) => b1.title.localeCompare(b2.title))
    }

}



function updateBookPrice(bookId, price) {
    const exRate = getExRate()
    console.log('exRate', exRate)
    console.log('updating book price service', bookId, price)
    const book = gBooks.find(book => book.id === bookId)
    book.price = price/getExRate()
    _saveBooksToStorage()

}

function getBookById(bookId){
    return gBooks.find(book => book.id === bookId)
}



function addBook(title,price) {
    console.log('adding book service')
    const book = _createBook(title,price)
    gBooks.unshift(book)
    _saveBooksToStorage()
}


function removeBook(bookId){
    console.log('removing book service')
    const bookIdx = gBooks.findIndex((book)=>(book.id === bookId))
    gBooks.splice( bookIdx, 1)
    _saveBooksToStorage()
}


function increaseRate(bookId){
    const book = getBookById(bookId)
    if (book.rate === 10) return
    book.rate++
    console.log(book.rate)
    _saveBooksToStorage()
}

function decreaseRate(bookId){
    const book = getBookById(bookId)
    if (book.rate === 0) return
    book.rate--
    console.log(book.rate)
    _saveBooksToStorage()
}


function setBookFilter(filterBy){
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    if (filterBy.price !== undefined) gFilterBy.price = filterBy.price
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
  return gFilterBy
}




function _createBooks (){
    console.log('creating books')
    var books = loadFromStorage(STORAGE_KEY)
    console.log('books:', books)

    if(!books || !books.length){
        console.log('no books in storage creating new books')
        books =[]

        for (let i=0; i<23; i++){
            books.push(_createBook())
        }
    }

    gBooks = books
    _saveBooksToStorage()

}



function _createBook(title = makeTitle(5), price = getRandomIntInclusive(10,100)){
    var book = {
        id: makeId(),
        title,
        price,
        img: 'book'+getRandomIntInclusive(1,5)+'.jpg',
        rate: 5,
        details: makeLorem(40),
    }

    return book
}




function _saveBooksToStorage(){
    saveToStorage(STORAGE_KEY, gBooks)

}