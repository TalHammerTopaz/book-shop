'use strict'

//


function init(){
    console.log('initiliazing...')
    renderFilterByQueryStringParams()
    console.log('gPageIdx', gPageIdx)
    doTrans()
    renderBooks()
    renderPrevNextBtns(1)
    renderBtns()
    renderBtnsPage(1)
}



function renderBooks(){

    
    const books = getBooksToRender()
    console.log('rendering books', books)
    

    var strHTMLs = books.map ((book)=>   `<tr>
                                            <td>${book.id}</td>
                                            <td>${book.title}</td>
                                            <td>${setCurrancy(getLang(), book.price)}</td>
                                            <td><img src="img/${book.img}"></td>
                                            <td>${book.rate}</td>
                                            <td>
                                <button class = "read" onclick = "onRead('${book.id}')">${getTrans('read')}</button>
                                <button class = "update" onclick = "onUpdateBook ('${book.id}')">${getTrans('update')}</button>
                                <button class = "delete" onclick = "onDelete('${book.id}')">${getTrans('delete')}</button>
                                                </td>
                                            </tr>` )

    document.querySelector('tbody').innerHTML = strHTMLs.join('')

}



function onPageChange(change) {
    var page
    if (change === 'next') page = nextPage()
    if (change === 'prev') page = prevPage()

    renderPrevNextBtns(page)
    renderBtnsPage(page)
    renderBooks()
}


function renderBtns(){
    console.log('renderingBtns')
    const pages = numOfPages()
    console.log(pages)
    var strHTML =''
    for (var i = 1; i <= pages; i++) {
       strHTML += `<button class="page page${i}" 
        onclick="onPageNumChange('${i}')">${i}</button>`
    }
    document.querySelector('.page-buttons').innerHTML = strHTML
}


function onPageNumChange(page){
    console.log('page', page)
    changePage(page)
    renderBooks()
    renderPrevNextBtns(page)
    renderBtnsPage(page)

    
}

function renderBtnsPage(page){
    
    const elPageBtns = document.querySelectorAll('.page')
    console.log(elPageBtns)
    for (var i=0; i<elPageBtns.length; i++){
        console.log(elPageBtns[i])
        if (elPageBtns[i].classList.contains('page'+page)){
            elPageBtns[i].disabled = true
            elPageBtns[i].style.backgroundColor = "gray"
        }
        else {
            elPageBtns[i].disabled = false
            elPageBtns[i].style.backgroundColor = "darkslategray"
        }
    }

}


function  renderPrevNextBtns(page){
    const elPrevBtn = document.querySelector('.prev-page')
    const elNextBtn = document.querySelector('.next-page')
    console.log('page', page)
    page = +page
     if (page === 1) {
        elPrevBtn.disabled = true
        elPrevBtn.style.backgroundColor = "gray"
    } else {
        elPrevBtn.disabled = false
        elPrevBtn.style.backgroundColor = "darkslategray"
    }

    if (isLastPage()) {
        elNextBtn.disabled = true
        elNextBtn.style.backgroundColor = "gray"
     } else {
        elNextBtn.disabled = false
        elNextBtn.style.backgroundColor = "darkslategray"
    }
    

}
    
    



function onSortBy(sortBy) {
    setBookSort(sortBy)
    renderBooks()

}



function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()
  
    const queryStringParams = `?rate=${filterBy.rate}&price=${filterBy.price}&title=${filterBy.title}`
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    renderPrevNextBtns(1)
    renderBtns()
    renderBtnsPage(1)


  }




function renderFilterByQueryStringParams() {
    // Retrieve data from the current query-params
    const queryStringParams = new URLSearchParams(window.location.search)
 
  
    const filterBy = {
      rate: +queryStringParams.get('rate') || 0,
      price: +queryStringParams.get('price') || 0,
      title: queryStringParams.get('title') || '',
    }
  

    if (!filterBy.rate && !filterBy.price &&!filterBy.title) return
  
    document.querySelector('.filter-rate-range').value = filterBy.rate
    document.querySelector('.filter-price-range').value = filterBy.price
    document.querySelector('.filter-title').value = filterBy.title

    setBookFilter(filterBy)
  }


function onRead(bookId) { 
    renderModal(bookId)
}

function hideModal(){
    document.querySelector('.modal').style.display = 'none'
}



function showModal(){
    document.querySelector('.modal').style.display = 'block'
}



function onUpdateBook (bookId){
    console.log('onUpdateBook')
    //const book = getBookById(bookId)
    // const price = prompt('Enter new book price:', book.price)
    showPriceInput(bookId)
}


function onUpdatePrice(ev){
    ev.preventDefault()
    const newPrice = +document.querySelector('[name=new-price]').value
    const bookId = document.querySelector('.book-id').innerText
    if (!newPrice) return
    updateBookPrice(bookId, newPrice)
    renderBooks()
    hidePriceInput()

}


function hidePriceInput(ev=null){
    if(ev) ev.stopPropagation()
    document.querySelector('.price-update').style.display = 'none'
}


function showPriceInput(bookId){

    const book = getBookById(bookId)
    
    const strHTML = `
    <form onsubmit="onUpdatePrice(event)"> 
        <h5>${getTrans('title')}: ${book.title} ${getTrans('id')}: <span class= "book-id">${book.id}</span></h5><br>
        <label for="new-price">${getTrans('new-price')}:</label><br>
        <input type="text" id="new-price" name="new-price" placeholder= ${setCurrancy(getLang(), book.price)}><br>
        <button>${getTrans('update')}</botton>
        <br>
        <button onclick="hidePriceInput(event)">X</botton>
    </form>`
    
    document.querySelector('.price-update').innerHTML = strHTML

    document.querySelector('.price-update').style.display = 'block'    
}


function onAddBook(){
    console.log('onAddBook')
    const title = prompt('Enter book title:')
    const price = prompt('Enter book price:')
    addBook(title,price)
    renderBooks()

}



function onDelete(bookId){
    console.log('onDelete')
    removeBook(bookId)
    renderBooks()

}

function onIncreaseRate(bookId){
    increaseRate(bookId)
    renderBooks()
    renderModal(bookId)

}

function onDecreaseRate(bookId){
    decreaseRate(bookId)
    renderBooks()
    renderModal(bookId)

}


function renderModal(bookId){
    
    const book = getBookById(bookId)


    const strHTML = `
        <h2>${book.title}</h2>
        <h3>${setCurrancy(getLang(), book.price)} </h3>
        <p>${book.details}</p>
        <img src="img/${book.img}">
        <p>${book.id}</p>
        <div class= "rate">
            ${getTrans('rate-this-book')}
            <button onclick = "onDecreaseRate('${book.id}')">-</button>
            <span>${book.rate}<span>
            <button onclick = "onIncreaseRate('${book.id}')">+</button>
        </div>
    
        <button onclick = "hideModal()">X</button>
        <a href ="#">${getTrans('back-to-top')}</a>`
    
    document.querySelector('.modal').innerHTML = strHTML

    showModal()
}



function onSetLang(lang) {
    setLang(lang)
    if (lang === "he") document.body.classList.add("rtl")
    else document.body.classList.remove("rtl")
    doTrans()
    renderBooks()

}