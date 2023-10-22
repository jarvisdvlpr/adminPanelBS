import { ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import {db} from "./fire.js";
import  * as myClasses from "./classes.js";
import  * as google from  "./googleApi.js";

//BookFormInputs variables starts here
const bookNameInput = document.getElementById("bName");
const bookAuthorNameInput = document.getElementById("aName");
const bookImgUrlInput = document.getElementById("Burl");
const bookDescriptionInput = document.getElementById("dscrptn");
const bookCategoryInput = document.getElementById("bCategory");

let books = [];
let categories = [];


function cleanBookForm() {
   bookNameInput.value = "";
   bookAuthorNameInput.value = "";
   bookImgUrlInput.value = "";
   bookDescriptionInput.value = "";
}


function showSuccess(alertMessage) {
   let navMenu = document.querySelector("#navMenu");


   navMenu.insertAdjacentHTML("beforeend",
       `<li><div class="alert alert-success" role="alert">
  ${alertMessage}
</div></li>`)

   function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
   }

   delay(3000).then(() => navMenu.removeChild(navMenu.lastChild));
}



function showBooks(myBooks){
   let booksTable = document.getElementById("booksTable");
   if(myBooks === undefined || myBooks === null || myBooks.length === 0){
      return;
   }
   while (booksTable.firstChild) {
      booksTable.removeChild(booksTable.lastChild);
   }

   booksTable.insertAdjacentHTML('beforeend', `<div class="head">
            <span>#</span>
            <span>Title</span>
            <span>Description</span>
            <span>Category</span>
            <span>Author</span>
          </div>`);
   for (let i in myBooks) {
      booksTable.insertAdjacentHTML('beforeend',
          `
            <div class="info">
            <span>${Number(i)+1}</span>
            <span>${myBooks[i].name}</span>
            <span>${myBooks[i].description}</span>
            <span>${myBooks[i].category}</span>
            <span>${myBooks[i].author}</span>
          </div>`)
   }
}

function showCategories(cats) {
   let selectCatTag = document.getElementById("bCategory");
   if(cats===undefined || cats === null || cats.length ===0){
      return;
   }

   while (selectCatTag.firstChild) {
      selectCatTag.removeChild(selectCatTag.lastChild);
   }

   for (let i in cats) {
      if(i === String(cats.length-1)){
         selectCatTag.insertAdjacentHTML('beforeend',
             `<option value="${i}" selected>${cats[i]}</option>`)
         break;
      }
      selectCatTag.insertAdjacentHTML('beforeend',
          `<option value="${i}">${cats[i]}</option>`)

   }
}

window.addEventListener("load", (event) => {
  get(ref(db, '/categories')).then(snapshot=>{
     const oldCategories = snapshot.val();

     if(oldCategories!==null){
        categories = oldCategories;
        showCategories(categories);
     }else{
        showBooks([])
     }
  })

   get(ref(db, '/books'), books).then(snapshot=>{
      const oldBooks = snapshot.val();
      if(oldBooks!==null){
         books = oldBooks;
         showBooks(books);
      }else{
         showBooks([])
      }
   });

});

document.getElementById("bookForm").addEventListener("submit", e=>{
   e.preventDefault();

   books.push(new myClasses.Book(bookNameInput.value, bookAuthorNameInput.value,
       bookImgUrlInput.value, bookDescriptionInput.value, categories[bookCategoryInput.value]));

   // console.log(books);

   set(ref(db, '/books'), books);

   let oldBooks;
   onValue(ref(db, '/books'), snapshot=>{
       oldBooks = snapshot.val();
   });

   if(oldBooks!==null){
      books = oldBooks;
      showBooks(books);
   }else{
      showBooks([])
   }
   showSuccess("Book has been added!")
   cleanBookForm()

});




// ------------------Category Starts here
document.getElementById("showCategory").addEventListener("click", (e)=>{
   e.stopPropagation()
   document.querySelector(".catUp").style.display = "block";
})


document.body.addEventListener("click", ()=>{
   document.querySelector(".catUp").style.display = "none";
   document.getElementById("searchResult").style.display = "none";
})

document.querySelector(".catUp").addEventListener("click", evt => {
   evt.stopPropagation();
})

document.getElementById("searchResult").addEventListener("click", evt =>{
   evt.stopPropagation();
})

document.querySelector("#categoryAdd").addEventListener("click", ()=>{
   categories.push(document.getElementById("categoryName").value);

   set(ref(db, '/categories'), categories);

   let oldCategories;
   onValue(ref(db, '/categories'), snapshot=>{
      oldCategories = snapshot.val();
   });

   if(oldCategories!==null){
      categories = oldCategories;
      showCategories(categories);
   }else{
      showBooks([])
   }
   showSuccess("category has been added!")
   document.getElementById("categoryName").value = "";

});



function showSearchResults(results) {
   // console.log(results['items']['volumeInfo'])
   let searchTag = document.getElementById("searchResult");

   while (searchTag.firstChild) {
      searchTag.removeChild(searchTag.lastChild);
   }

   for (let resultKey in results['items']) {

      searchTag.insertAdjacentHTML('beforeend',
          ` <div class="result">
              <i class="fa-regular fa-clock"></i>
              <p id="res-${resultKey}">${results['items'][resultKey]['volumeInfo']['title']} ${results['items'][resultKey]['volumeInfo']['authors']}</p>
            </div>`)
   //    console.log(resultKey['volumeInfo']['title']);

      document.getElementById(`res-${resultKey}`).addEventListener("click", ()=>{
         bookNameInput.value = results['items'][resultKey]['volumeInfo']['title'];
         bookAuthorNameInput.value = results['items'][resultKey]['volumeInfo']['authors'];
         bookImgUrlInput.value = results['items'][resultKey]['volumeInfo']['imageLinks']['thumbnail'];
         bookDescriptionInput.value = results['items'][resultKey]['volumeInfo']['description'];
      })
   }


}



document.getElementById("makeSearchGoogle").addEventListener("click", (e)=>{
   e.stopPropagation()

   document.getElementById("searchResult").style.display = "block";

   google.makeARequest(document.getElementById("searchGoogleInput").value).then(answer =>{
      showSearchResults(answer);
       }
   );
});


document.querySelector(".logOut").addEventListener("click", ()=>{
   location.replace("index.html");
});