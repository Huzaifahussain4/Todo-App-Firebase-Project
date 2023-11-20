import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBH8W7sy3fEkAP6t-fmAo9P4CraQUyZkm8",
  authDomain: "login-and-signup-project-7d4bc.firebaseapp.com",
  projectId: "login-and-signup-project-7d4bc",
  storageBucket: "login-and-signup-project-7d4bc.appspot.com",
  messagingSenderId: "1034230508670",
  appId: "1:1034230508670:web:960259c6b0b8d61be13c2f",
  measurementId: "G-YXKLNLJ09Q",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log(db);

let registraionForm = document.getElementById("registrationForm");
let indexLoginSigninBrnDiv = document.getElementById("indexLoginSigninBrn");
let loginForm = document.getElementById("logInForm");
let userDetailsDiv = document.getElementById("UserDetails");
let logOutBtn = document.getElementById("logOutBtn");
let addInfoBtn = document.getElementById("addInfoBtn");
let todoInputField = document.getElementById("todoInput");
let todosConatiner = document.getElementById("todosConatinerDiv");
let loaderDiv = document.getElementById("loaderDiv");


let todoCollection = collection(db, "todos");

onAuthStateChanged(auth, (user) => {
  
  if (user) {
    const uid = user.uid;
    console.log("User Logged in");

    indexLoginSigninBrnDiv.style.display = "none";
    loaderDiv.style.display= 'none'
    userDetailsDiv.style.display = "block";
    
    getTodos()
  } else {
    console.log("User not Logged in");
    loaderDiv.style.display= 'block'
  }
});

registraionForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);

  let email = e.target[1].value;
  let password = e.target[2].value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // alert("Registration Sucessful");
      window.location.href = "./index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      alert(errorMessage);
    });
});

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);

  let email = e.target[0].value;
  let password = e.target[1].value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      // alert("Login Sucessful");
      window.location.href = "./index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
    });
});

logOutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User logout");
      window.location.href = "./loginpage.html";

      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
      alert(error);
    });
});

addInfoBtn.addEventListener("click", async () => {
  try {
    const docAdded = await addDoc(todoCollection, {
      todo: todoInputField.value,
    });
    todoInputField.value = "";
    getTodos()
    console.log("Document written with ID: ", docAdded, docAdded.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  // console.log("Add button")
});

async function getTodos() {
  todosConatiner.innerHTML = null
  const querySnapshot = await getDocs(todoCollection);
  querySnapshot.forEach((todoDoc) => {
    let todoObj = todoDoc.data()

    let div = document.createElement('div')
    div.className = "todoSpanDiv"

    let span = document.createElement('span')
    span.className = "todoSpan"
    span.innerText = todoObj.todo

    let button = document.createElement('button')
    button.innerText = 'Delete'
    button.className = 'deleteBtn'
    button.id = todoDoc.id
    button.addEventListener('click',async function (){
      console.log(this)
      let docRef = doc(db, 'todos', this.id)
      console.log(docRef)
      await deleteDoc(docRef)
      getTodos()
    })

    div.appendChild(span)
    div.appendChild(button)

    todosConatiner.appendChild(div)

  });
}
