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
let contacts = [];



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
   let booksTable = document.getElementById("books-tbody");
   if(myBooks === undefined || myBooks === null || myBooks.length === 0){
      return;
   }
   while (booksTable.firstChild) {
      booksTable.removeChild(booksTable.lastChild);
   }



   for (let i in myBooks) {
      booksTable.insertAdjacentHTML('beforeend',
          `<tr id="bookId-${i}">
              <td>${Number(i)+1}</td>
              <td>${myBooks[i].name}</td>
              <td>${myBooks[i].description.substring(0,100)}...</td>
              <td>${myBooks[i].category}</td>
              <td>${myBooks[i].author}</td>
              <td>
              <i class="fa-regular fa-trash-can" id="book-tab-del-${i}" style="cursor: pointer"</i>
              </td>
            </tr>`);
   }
}

function deleteBooks(bookList) {
   for (let i in bookList) {
      document.getElementById(`book-tab-del-${i}`).addEventListener("click", ()=>{
         bookList.splice(i, 1);
         set(ref(db, '/books'), bookList);
         document.getElementById(`bookId-${i}`).remove();
      });
   }
}



function showContactUs(contactList) {
   const contactTable = document.getElementById("contact-tbody");
   if(contacts === undefined || contacts === null || contacts.length === 0){
      return;
   }

   while (contactTable.firstChild) {
      contactTable.removeChild(contactTable.lastChild);
   }


   for (let i in contactList) {
      contactTable.insertAdjacentHTML('beforeend',
          `<tr id="contactId-${i}">
              <td>${Number(i)+1}</td>
              <td>${contactList[i].fullName}</td>
              <td>${contactList[i].address}</td>
              <td>${contactList[i].emailAddress}</td>
              <td>${contactList[i].phoneNumber}</td>
              <td>${contactList[i].note}</td>
              <td><i class="fa-regular fa-trash-can" id="contact-tab-del-${i}" style="cursor: pointer"></i></td>
            </tr>`);
   }


}

function addContactUsDeleteEventListeners(contactList) {
   for (let i in contactList) {
      document.getElementById(`contact-tab-del-${i}`).addEventListener("click", ()=>{
         contactList.splice(i, 1);
         set(ref(db, '/contactus'), contactList);

         document.getElementById(`contactId-${i}`).remove();
      })
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

   get(ref(db, '/books')).then(snapshot=>{
      const oldBooks = snapshot.val();
      if(oldBooks!==null){
         books = oldBooks;
         showBooks(books);
         deleteBooks(books);
      }else{
         showBooks([])
      }
   });

  get(ref(db, '/contactus')).then(snapshot=>{
     const oldContacts  = snapshot.val();
     if(oldContacts !== null){
        contacts = oldContacts;
        showContactUs(contacts);
        addContactUsDeleteEventListeners(contacts)
     }else{
        showContactUs([])
     }
  });

   get(ref(db, '/aboutUs')).then(snapshot =>{
      const aboutCurrent = snapshot.val();
      if(aboutCurrent!== null){
         document.getElementById("titleAbout").value = aboutCurrent.title;
         document.getElementById("descAboutUs").value = aboutCurrent.description;
         document.getElementById("imgUrlAbout").value = aboutCurrent.imgSrc;
      }
   });

   get(ref(db, '/joinUs')).then(snapshot=>{
      const joinArray = snapshot.val();
      if(joinArray !== null){
         for (let i in joinArray) {
            document.getElementById("join-tbody").insertAdjacentHTML(
                'beforeend',
                `<tr id="joinId-${i}">
              <td>${Number(i)+1}</td>
              <td>${joinArray[i].fullName}</td>
              <td>${joinArray[i].emailAddress}</td>
              <td><i class="fa-regular fa-trash-can"id="join-tab-del-${i}" style="cursor: pointer"></i></td>

            </tr>`);

            document.getElementById(`join-tab-del-${i}`).addEventListener("click", ()=>{
               joinArray.splice(i, 1);
               set(ref(db, '/joinUs'), joinArray);
               document.getElementById(`joinId-${i}`).remove();
            })
         }
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

document.getElementById("aboutUsForm").addEventListener("submit", (e)=>{
   e.preventDefault()
   const aboutUs = new myClasses.AboutUs(document.getElementById("titleAbout").value,
       document.getElementById("descAboutUs").value, document.getElementById("imgUrlAbout").value);

   set(ref(db, "/aboutUs"), aboutUs);

   showSuccess("About us has been edited!")
});