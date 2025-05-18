// variables
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');
const sideNav = document.getElementById('side-nav');
const mainHeader = document.querySelector('.main-header');
const mealsContainer = document.getElementById('content-container');
const ingradients = document.getElementById('ingradients');
const area = document.getElementById('area');
const Categories = document.getElementById('Categories');
const searchContainer = document.getElementById('searchContainer');
const search = document.getElementById('search');
const contact = document.getElementById('contact');


// events
// open sidebar
menuIcon.addEventListener('click', () => {
    sideNav.style.left = '0px';
    menuIcon.style.display = 'none';
    closeIcon.style.display = 'inline-block';
    mainHeader.classList.add('header-shift');

    // Set initial styles for the list items
    $('#side-nav ul li').css({
        opacity: 0,
        transform: 'translateY(100px)' // Start from below
    });

    // Animate each list item
    $('#side-nav ul li').each(function (index) {
        $(this).delay(100 * index).animate({
            opacity: 1,
            translateY: '0' // Move to original position
        }, {
            duration: 300,
            step: function (now, fx) {
                if (fx.prop === 'translateY') {
                    $(this).css('transform', `translateY(${100 - now}px)`); // Adjust position
                }
            },
            complete: function() {
                // Reset transform to ensure proper positioning after animation
                $(this).css('transform', 'translateY(0)');
            }
        });
    });
});

// close sidebar
closeIcon.addEventListener('click', () => {
  closeSideNav();
});

function closeSideNav() {
    // Animate all list items to move down and to the left while fading out
    $('#side-nav ul li').animate({
        opacity: 0, // Fade out
        top: '+=50px', // Move down
        left: '-=50px' // Move left
    }, {
        duration: 300,
        complete: function() {
            // Reset styles after animation
            $(this).css({
                transform: 'translateY(0) translateX(0)', // Reset transform
                left: '0', // Reset left position
                top: '0' // Reset top position
            });
        }
    });

    // After the last item finishes, hide the sidebar
    setTimeout(() => {
        sideNav.style.left = '-250px';
        closeIcon.style.display = 'none';
        menuIcon.style.display = 'inline-block';
        mainHeader.classList.remove('header-shift');
    }, 300); // Wait for the animation to finish
}

document.addEventListener('DOMContentLoaded', fetchMeals);
ingradients.addEventListener("click",getIngredients);
area.addEventListener("click",getArea);
Categories.addEventListener("click",getCategories);
search.addEventListener("click",showSearchInputs);
contact.addEventListener("click",showContacts)

// api functions

// getmeals (default)
async function fetchMeals() {
  $(".spinner").fadeIn(300)

  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const data = await res.json();
    displayMeals(data.meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
  }
      $(".spinner").fadeOut(300);

}

// 
function displayMeals(meals) {
  mealsContainer.innerHTML = ''; 
  
   

  meals.forEach(meal => {
    const mealHTML = `
      <div class="col-md-3 col-sm-6 mb-4">
        <div class="meal-container position-relative overflow-hidden rounded cursor-pointer" onclick="getMealDetails('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" class="img-fluid w-100 rounded" alt="${meal.strMeal}" />
          <div class="meal-layer position-absolute w-100 h-100 d-flex align-items-center text-black p-2" style="background: rgba(255,255,255,0.7);">
            <h3 class="fw-bold fs-5">${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
    mealsContainer.innerHTML += mealHTML;
  });
     

}

//
async function getMealDetails(mealID) {
  closeSideNav();
 $(".spinner").fadeIn(300)
  try {
       

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0];
    showMealDetails(meal);
        $(".spinner").fadeOut(300)

  } catch (error) {
    console.error('Error fetching meal details:', error);
  }
}

function showMealDetails(meal) {
  searchContainer.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
   
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let content = `
    <div class="col-md-4 text-white">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="details">
                    <h2 style="font-size:27px">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <p class="p-2" style="font-size:13.5px">${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    mealsContainer.innerHTML = content

}


async function getIngredients() {
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
        const data = await response.json();
        console.log(data.meals);
        displayIngredients(data.meals.slice(0, 20));
    } catch (error) {
        console.error("Error fetching ingredients:", error);
    } finally {
        $(".spinner").fadeOut(300);
    }
}

function displayIngredients(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center text-white" style="cursor:pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x" style="font-size:50px"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p style="font-size:13px">${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    mealsContainer.innerHTML = cartoona
}
async function getIngredientsMeals(ingredients) {
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
        const data = await response.json();
        displayCategoryMeals(data.meals?.slice(0, 20) || []);
    } catch (error) {
        console.error("Error fetching meals by ingredient:", error);
    } finally {
        $(".spinner").fadeOut(300);
    }
}
async function getArea() {
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        const data = await response.json();
        console.log(data.meals);
        displayAreas(data.meals);
    } catch (error) {
        console.error("Error fetching area list:", error);
    } finally {
        $(".spinner").fadeOut(300);
    }
}

function displayAreas(arr)
{
  let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
       <div class="col-md-3 text-white" >
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center" style="cursor:pointer">
                        <i class="fa-solid fa-house-laptop fa-4x " style="font-size:55px"></i>
                        <h3 style="font-size:25px" class="mb-4">${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    mealsContainer.innerHTML = cartoona
}
async function getAreaMeals(area) {
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await response.json();
        displayMeals(data.meals.slice(0, 20));
    } catch (error) {
        console.error("Error fetching area meals:", error);
    } finally {
        $(".spinner").fadeOut(300);
    }
}

async function getCategories() {
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        const data = await response.json();

        console.log(data.categories);
        displayCategories(data.categories.slice(0, 20));
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        mealsContainer.innerHTML = `<p class="text-white text-center">⚠️ Failed to load categories. Please try again later.</p>`;
    } finally {
        $(".spinner").fadeOut(300);
    }
}

function displayCategories(arr)
{
  let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3 col-sm-6 mb-4">
        <div class="meal-container position-relative overflow-hidden rounded " onclick="getCategoryMeals('${arr[i].strCategory}')">
          <img src="${arr[i].strCategoryThumb}" class="img-fluid w-100 rounded" alt="${arr[i].strCategory}" />
          <div class="meal-layer position-absolute text-center text-black p-2 d-flex justify-content-center align-items-center flex-column  h-100">
            <h3>${arr[i].strCategory}</h3>
            <p style="font-size:13px">${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
          </div>
        </div>
      </div>
    `;
    }

    mealsContainer.innerHTML = cartoona
}

async function getCategoryMeals(category) {
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();

        if (data.meals) {
            displayCategoryMeals(data.meals.slice(0, 20));
        } else {
            mealsContainer.innerHTML = `<p class="text-white text-center">❌ No meals found for category "${category}".</p>`;
        }
    } catch (error) {
        console.error("Error fetching category meals:", error);
        mealsContainer.innerHTML = `<p class="text-white text-center">⚠️ Failed to load meals. Please try again later.</p>`;
    } finally {
        $(".spinner").fadeOut(300);
    }
}

function displayCategoryMeals(meals) {
  mealsContainer.innerHTML = ''; 

  meals.forEach(meal => {
    const mealHTML = `
      <div class="col-md-3 col-sm-6 mb-4">
        <div class="meal-container position-relative overflow-hidden rounded cursor-pointer" onclick="getMealDetails('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" class="img-fluid w-100 rounded" alt="${meal.strMeal}" />
          <div class="meal-layer position-absolute w-100 h-100 d-flex align-items-center justify-content-center text-black p-2" style="background: rgba(255,255,255,0.7);">
            <h3 class="fw-bold fs-5">${meal.strMeal}</h3>
          </div>
        </div>
      </div>
    `;
    mealsContainer.innerHTML += mealHTML;
  });
}

function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    mealsContainer.innerHTML = ""
}
async function searchByName(name) {
    closeSideNav();
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        const data = await response.json();

        if (data.meals) {
            displayMeals(data.meals);
        } else {
            displayMeals([]);
        }
    } catch (error) {
        console.error("Error searching by name:", error);
        mealsContainer.innerHTML = `<p class="text-white text-center">⚠️ Failed to search. Please try again later.</p>`;
    } finally {
        $(".spinner").fadeOut(300);
    }
}


async function searchByFLetter(letter) {
    closeSideNav();
    mealsContainer.innerHTML = "";
    $(".spinner").fadeIn(300);

    try {
        const searchLetter = letter.trim() === "" ? "a" : letter.trim();
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchLetter}`);
        const data = await response.json();

        displayMeals(data.meals || []);
    } catch (error) {
        console.error("Error searching by first letter:", error);
        mealsContainer.innerHTML = `<p class="text-white text-center">⚠️ Failed to search meals. Please try again later.</p>`;
    } finally {
        $(".spinner").fadeOut(300);
    }
}


function showContacts() {
  mealsContainer.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container w-75 text-center">
        <div class="row g-4">

          <div class="col-md-6">
            <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name" onkeyup="inputsValidation()">
            <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed</div>
          </div>

          <div class="col-md-6">
            <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email" onkeyup="inputsValidation()">
            <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">Email not valid *exemple@yyy.zzz</div>
          </div>

          <div class="col-md-6">
            <input id="phoneInput" type="text" class="form-control" placeholder="Enter Your Phone" onkeyup="inputsValidation()">
            <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</div>
          </div>

          <div class="col-md-6">
            <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age" onkeyup="inputsValidation()">
            <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid age</div>
          </div>

          <div class="col-md-6">
            <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password" onkeyup="inputsValidation()">
            <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
          </div>

          <div class="col-md-6">
            <input id="repasswordInput" type="password" class="form-control" placeholder="Repassword" onkeyup="inputsValidation()">
            <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid repassword</div>
          </div>

        </div>

        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
      </div>
    </div>
  `;

  // 
  submitBtn = document.getElementById("submitBtn");

  // 
  nameInputTouched = emailInputTouched = phoneInputTouched = ageInputTouched = passwordInputTouched = repasswordInputTouched = false;

  document.getElementById("nameInput").addEventListener("focus", () => nameInputTouched = true);
  document.getElementById("emailInput").addEventListener("focus", () => emailInputTouched = true);
  document.getElementById("phoneInput").addEventListener("focus", () => phoneInputTouched = true);
  document.getElementById("ageInput").addEventListener("focus", () => ageInputTouched = true);
  document.getElementById("passwordInput").addEventListener("focus", () => passwordInputTouched = true);
  document.getElementById("repasswordInput").addEventListener("focus", () => repasswordInputTouched = true);
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;
let submitBtn;
function inputsValidation() {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;
  const phone = document.getElementById("phoneInput").value;
  const age = document.getElementById("ageInput").value;
  const password = document.getElementById("passwordInput").value;
  const repassword = document.getElementById("repasswordInput").value;

  // Regular Expressions
  const nameRegex = /^[a-zA-Z ]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^01[0125][0-9]{8}$/;
  const ageRegex = /^(1[89]|[2-9][0-9])$/; // Age from 18 to 99
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Validation Checks
  let isNameValid = nameRegex.test(name);
  let isEmailValid = emailRegex.test(email);
  let isPhoneValid = phoneRegex.test(phone);
  let isAgeValid = ageRegex.test(age);
  let isPasswordValid = passwordRegex.test(password);
  let isRepasswordValid = (password === repassword);

  // Show/Hide alerts
  document.getElementById("nameAlert").classList.toggle("d-none", isNameValid || !nameInputTouched);
  document.getElementById("emailAlert").classList.toggle("d-none", isEmailValid || !emailInputTouched);
  document.getElementById("phoneAlert").classList.toggle("d-none", isPhoneValid || !phoneInputTouched);
  document.getElementById("ageAlert").classList.toggle("d-none", isAgeValid || !ageInputTouched);
  document.getElementById("passwordAlert").classList.toggle("d-none", isPasswordValid || !passwordInputTouched);
  document.getElementById("repasswordAlert").classList.toggle("d-none", isRepasswordValid || !repasswordInputTouched);

  // Enable/Disable submit button
  if (isNameValid && isEmailValid && isPhoneValid && isAgeValid && isPasswordValid && isRepasswordValid) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", "true");
  }
}
