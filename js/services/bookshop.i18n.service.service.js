'use strict'

var gCurrLang = 'en'

var gTrans ={
    exRate:{
        en:1,
        he:3.5,
    },
    header:{
        en: 'My Book Shop',
        he: 'חנות הספרים שלי',
    },
    'add-book':{
        en: 'Add book',
        he: 'הוסף ספר',
    },
    'filter-by':{
        en: 'Search',
        he: 'חיפוש',
    },
    'placeholder':{
        en: 'Start typing...',
        he: 'הקלד כאן...',
    },
    'min-rating':{
        en: 'Minimum Rating',
        he: 'דירוג מינימלי',
    },
    'max-price':{
        en: 'Maximun Price',
        he: 'מחיר מקסימלי',
    },
    'id':{
        en: 'ID',
        he: 'מזהה',
    },
    'title':{
        en: 'Title',
        he: 'כותר',
    },
    'price':{
        en: 'Price',
        he: 'מחיר',
    },
    'picture':{
        en: 'Picture',
        he: 'תמונה',
    },
    'rating':{
        en: 'Rating',
        he: 'דירוג',
    },
    'actions':{
        en: 'Actions',
        he: 'פעולות',
    },
    'read':{
        en: 'Read',
        he: 'קרא',
    },
    'update':{
        en: 'Update',
        he: 'עדכן',
    },
    'delete':{
        en: 'Delete',
        he: 'מחק',
    },
    'new-price':{
        en: 'New Price',
        he: 'מחיר חדש',
    }, 
    'rate-this-book':{
        en: 'Rate This Book!',
        he: 'דרג ספר זה',
    },
    'back-to-top':{
        en: 'Back To Top',
        he: 'חזור למעלה',
    },
}


function getTrans(transkey){
    var keyTrans = gTrans[transkey]
    if (!keyTrans) return "UNKNOWN"

    var txt = keyTrans[gCurrLang]
    if (!txt) txt = keyTrans.en

    return txt
}

function doTrans(){
    var els = document.querySelectorAll('[data-trans]')
    els.forEach (el => {
        var transKey = el.dataset.trans
        var txt = getTrans(transKey)
        if(el.localName === "input") el.placeholder = txt
        else el.innerText = txt 
    })
}


function setLang(lang){
    gCurrLang = lang
}

function getLang(){
    return gCurrLang
}


function getExRate(){
    return  +gTrans.exRate[gCurrLang]
}

function setCurrancy(lang, price) {
    var nf
    if (lang === 'he'){
        nf = new Intl.NumberFormat("he-li", {
            style: "currency",
            currency: "ILS",
            maximumFractionDigits: 2,
            roundingIncrement: 5
      })
      return nf.format(price*getExRate())
    } else { 
        nf = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            roundingIncrement: 5
      })
      return nf.format(price)
    }

}
  