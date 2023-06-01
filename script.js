"use strict";

const studentURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodURL = "https://petlatkea.dk/2021/hogwarts/families.json";
let allStudents = [];
let searchStudentsList = [];
let expelledStudents = [];
let theOneStudent = [];
let expelledStudentsCounter = -1;
let hackedArray = [];
let grawpList;
let bloodList;
let id = -1;

let gryfNum, huffNum, raveNum, slytNum;

const settings = {
  filterBy: "all",
  filterType: "all",
  sortBy: "name",
  sortDir: "",
};

let hackedStudent = {
  id: "",
  firstname: "Hacker",
  lastname: "Bob-John",
  middlename: "Man",
  gender: "boy",
  nickname: "HackerMan3117",
  searchname: "hacker bob-john man",
  image: "hackerman.jpg",
  blood: "muggle",
  house: "Gryffindor",
  perfect: false,
  inquisitorial: false,
  expelled: false,
  status: "hacker",
};

window.addEventListener("DOMContentLoaded", loadPage);

function loadPage() {
  console.log("Page loaded");
  addWindowListeners();
  addDocumentListeners();
  getStudents(studentURL, bloodURL);
}

async function getStudents(url1, url2) {
  const studentListURL = await fetch(url1);
  const bloodListURL = await fetch(url2);
  grawpList = await studentListURL.json();
  bloodList = await bloodListURL.json();
  cleanGrawpList();
}

function addDocumentListeners() {
  document.querySelector("#filter__container option").addEventListener("click", selectFilter);
  document.querySelectorAll("#filter__container optgroup option").forEach((option) => {
    option.addEventListener("click", selectFilter);
  });
  document.querySelectorAll('[data-action="sort"]').forEach((option) => {
    option.addEventListener("click", selectSorting);
  });
  document.querySelector(".button--expelled").addEventListener("click", showExpelledStudents);
  document.querySelector("#search-btn").addEventListener("click", searchStudents);
  document.querySelector("#clear-search-input").addEventListener("click", clearSearchInput);
  document.querySelector("#clear-search-btn").addEventListener("click", resetSearchList);

  document.addEventListener("keydown", hackTheSystem);
}

function addWindowListeners() {
  window.addEventListener("resize", mobileOrDesktop);
  mobileOrDesktop();
}
function mobileOrDesktop() {
  if (window.innerWidth > 768) {
    document.querySelector(".collapsible").classList.add("hidden");
  } else {
    document.querySelector(".collapsible").classList.remove("hidden");
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        document.querySelector(".collapseSpan").classList.toggle("open");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  }
}

function cleanGrawpList() {
  grawpList.forEach((grawp) => {
    const Student = {
      id: "",
      firstname: "",
      lastname: "",
      middlename: "none",
      gender: "",
      nickname: "none",
      searchname: "",
      image: "none",
      blood: "",
      house: "",
      perfect: false,
      inquisitorial: false,
      expelled: false,
      status: "",
    };

    id++;

    const student = Object.create(Student);

    //Trim fullname
    const nameTrim = grawp.fullname.trim().split(" ");

    student.id = id;
    student.firstname = getFirstName(nameTrim);
    student.middlename = getMiddleName(nameTrim);
    student.nickname = getNickName(nameTrim);
    student.lastname = getLastName(nameTrim);
    student.gender = getGender(grawp);
    student.image = getStudentImage(nameTrim);
    student.house = getStudentHouse(grawp);
    student.blood = getStudentBlood(student.lastname);
    allStudents.push(student);
    student.searchname = getSearchName(student.firstname, student.middlename, student.lastname);
  });

  displayCleanStudentList(allStudents);
  checkStudentNumbers(allStudents);
}

function checkStudentNumbers(students) {
  gryfNum = 0;
  huffNum = 0;
  raveNum = 0;
  slytNum = 0;

  for (let i = 0; i < students.length; i++) {
    let student = students[i];

    if (student.expelled === false && student.house === "Gryffindor") {
      gryfNum++;
      // console.log(`G=${gryfNum}`);
    } else if (student.expelled === false && student.house === "Hufflepuff") {
      huffNum++;
      // console.log(`H=${huffNum}`);
    } else if (student.expelled === false && student.house === "Ravenclaw") {
      raveNum++;
      // console.log(`R=${raveNum}`);
    } else if (student.expelled === false && student.house === "Slytherin") {
      slytNum++;
      // console.log(`S=${slytNum}`);
    }
  }

  if (expelledStudents.length > 0) {
    document.querySelector(".student-number__header.second").classList.remove("hidden");
  } else {
    document.querySelector(".student-number__header.second").classList.add("hidden");
  }
  insertStudentNumbers();
}
function insertStudentNumbers() {
  // console.log(`G=${gryfNum}, H=${huffNum}, R=${raveNum}, S=${slytNum}`);
  document.querySelector(".student-number__header--number").textContent = gryfNum + huffNum + raveNum + slytNum;
  document.querySelector(".student-house__container.gryffindor .student-house__number").textContent = gryfNum;
  document.querySelector(".student-house__container.hufflepuff .student-house__number").textContent = huffNum;
  document.querySelector(".student-house__container.ravenclaw .student-house__number").textContent = raveNum;
  document.querySelector(".student-house__container.slytherin .student-house__number").textContent = slytNum;
  document.querySelector(".student-expelled-number__header--number").textContent = expelledStudents.length;
}

// FUNCRTIONS FOR NAMES, IMAGES, HOUSE, GENDER
function getFirstName(name) {
  return `${name[0].charAt(0).toUpperCase()}${name[0].slice(1).toLowerCase()}`;
}

function getMiddleName(name) {
  if (name.length <= 2) {
    return `N/A`;
  } else {
    if (name[1].includes(`"`) === true) {
      return `N/A`;
    } else {
      return `${name[1].charAt(0).toUpperCase()}${name[1].slice(1).toLowerCase()}`;
    }
  }
}

function getNickName(name) {
  if (name.length === 1) {
    return `N/A`;
  } else if (name.length > 1) {
    if (name[1].includes(`"`) !== true) {
      return `N/A`;
    } else {
      return `${name[1].substring(1, 2).toUpperCase()}${name[1].substring(2, name[1].lastIndexOf('"')).toLowerCase()}`;
    }
  }
}

function getLastName(name) {
  if (name.length === 1) {
    return `N/A`;
  } else {
    if (name[1].includes("-")) {
      let sepLastName = name[1].split("-");
      return `${sepLastName[0].charAt(0).toUpperCase()}${sepLastName[0].slice(1).toLowerCase()}-${sepLastName[1].charAt(0).toUpperCase()}${sepLastName[1].slice(1).toLowerCase()}`;
    } else {
      const trimName = name[name.length - 1];
      return `${trimName.charAt(0).toUpperCase()}${trimName.slice(1).toLowerCase()}`;
    }
  }
}

function getSearchName(first, middle, last) {
  if (middle === "N/A" && last === "N/A") {
    return `${first.toLowerCase()}`;
  } else if (middle === "N/A" && last !== "N/A") {
    return `${first.toLowerCase()} ${last.toLowerCase()}`;
  } else {
    return `${first.toLowerCase()} ${middle.toLowerCase()} ${last.toLowerCase()}`;
  }
}

function getGender(person) {
  return `${person.gender.charAt(0).toUpperCase()}${person.gender.slice(1).toLowerCase()}`;
}

function getStudentImage(name) {
  let trimName = name[name.length - 1];
  if (name.length === 1) {
    return `N/A`;
  } else if (name[1] === "Patil") {
    return `${trimName.toLowerCase()}_${name[0].toLowerCase()}.png`;
  } else {
    if (name[1].includes("-")) {
      let sepName = trimName.split("-");
      return `${sepName[sepName.length - 1].toLowerCase()}_${name[0].charAt(0).toLowerCase()}.png`;
    } else {
      //Last name fix
      return `${trimName.toLowerCase()}_${name[0].charAt(0).toLowerCase()}.png`;
    }
  }
}

function getStudentHouse(person) {
  const houseTrim = person.house.trim();
  return `${houseTrim.charAt(0).toUpperCase()}${houseTrim.slice(1).toLowerCase()}`;
}

function getStudentBlood(person) {
  let bloodStat = runBloodTest(person);

  function runBloodTest(lastname) {
    if (bloodList.half.includes(lastname) && bloodList.pure.includes(lastname)) {
      return `Half`;
    } else if (bloodList.half.includes(lastname)) {
      return `Half`;
    } else if (bloodList.pure.includes(lastname)) {
      return `Pure`;
    } else {
      return `Muggle`;
    }
  }
  return bloodStat;
}

// DISPLAY STUDENTS FUNCTIONS
function displayCleanStudentList(students) {
  // clear the list
  document.querySelector("#student-display__container").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  // const clone = document.querySelector("template#student").content.cloneNode(true);
  const clone = document.querySelector("template#student").content.cloneNode(true);

  if (student.firstname === "Leanne") {
    clone.querySelector(".student__card__name").textContent = student.firstname;
  } else if (student.middlename === `N/A` && student.nickname === `N/A`) {
    clone.querySelector(".student__card__name").textContent = `${student.firstname} ${student.lastname}`;
  } else if (student.middlename === `N/A` && student.nickname !== `N/A`) {
    clone.querySelector(".student__card__name").textContent = `${student.firstname} "${student.nickname}" ${student.lastname}`;
  } else {
    clone.querySelector(".student__card__name").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
  }

  if (student.firstname === "Leanne") {
    clone.querySelector(".student__card__img").alt = `Student Photo N/A`;
  } else {
    clone.querySelector(".student__card__img").src = `images/${student.image}`;
  }

  //STUDENT INFO
  clone.querySelector(".student__card__info .blood").textContent = `${student.blood}`;

  if (student.perfect === true) {
    clone.querySelector(".student__card__info .perfect").textContent = `Is perfect for ${student.house}.`;
  } else {
    clone.querySelector(".student__card__info .perfect").textContent = `Not perfect`;
  }

  if (student.house === "Slytherin" && student.inquisitorial === true) {
    clone.querySelector(".student__card__info .inquisitorial").textContent = `Is inquisitorial`;
  } else if (student.house === "Slytherin" && student.inquisitorial === false) {
    clone.querySelector(".student__card__info .inquisitorial").textContent = `Not inquisitorial`;
  } else {
    clone.querySelector(".student__card__info p:last-child").classList.add("hidden");
  }

  clone.querySelector("#student__card").classList.add(`${student.house.toLowerCase()}`);

  // clone.querySelector(".student-id").textContent = student.id;

  //Add EventListener for showing specific student
  clone.querySelector("#student__card").addEventListener("click", () => showDetails(student));

  document.querySelector("#student-display__container").appendChild(clone);
}

// FILTER FUNCTIONS
function selectFilter(event) {
  let filter = document.querySelector("#filter__container").value;
  let filterType = event.target.dataset.type;
  // console.log(`Filter is set to: ${filter} and type ${filterType}`);

  setFilter(filter, filterType);
}

function setFilter(filter, filterType) {
  settings.filterBy = filter;
  settings.filterType = filterType;
  // console.log(`SetFilter: ${settings.filterBy} = filterBy and ${settings.filterType} = filterType`);

  // Build new student list
  buildNewList();
}

function filterList() {
  // if the studentType is AllS tudents, of the above then just return allStudents as is
  // console.log(allStudents.filter(filterStudents));
  if (settings.filterType === "all") {
    return allStudents;
  } else {
    // console.log(allStudents.filter(filterStudents));
    return allStudents.filter(filterStudents);
  }
}

function filterStudents(student) {
  // Return students which house matches the filterBY value
  // console.log(student[`${settings.filterType}`] === settings.filterBy);
  return student[`${settings.filterType}`] === settings.filterBy;
}

//SORT FUNCTIONS

function selectSorting(event) {
  if (settings.sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else if (settings.sortDir === "desc") {
    event.target.dataset.sortDirection = "asc";
  }

  // sets sortBy and sortDir
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // calls the setSort function with sortBy and sortDir as parameters
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;

  // console.log(settings);

  buildNewList();
}

function sortList(sortedList) {
  let direction = 1;

  // controls which way list is sorted
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }


  // gives sotedList the value of sortedList, after it has been through the sort function.
  sortedList = sortedList.sort(sortCurrentList);

  function sortCurrentList(elementA, elementB) {
    // console.log(elementA[settings.sortBy] + "," + elementB[settings.sortBy]);
    if (elementA[settings.sortBy] < elementB[settings.sortBy]) {
      return -1 * direction;
    } else if (elementA[settings.sortBy] > elementB[settings.sortBy]) {
      return 1 * direction;
    } else {
      return 0;
    }
  }

  // returns the sotedList
  return sortedList;
}

//BUILD NEW LIST AFTER FILTER AND/OR SORT
function buildNewList() {
  // Creates a variable "currentList" and give it the filtered value of allStudents
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  // displays currentList
  // console.log(currentList);
  displayCleanStudentList(currentList);
}

//Show Students details

function showDetails(student) {
  // console.log(`Show details for: ${allStudents[student.id].firstname}`);
  theOneStudent = allStudents[student.id];
  //Toggle hidden from pop up
  document.querySelector("#popUp").classList.toggle("hidden");

  document.querySelector("#popUp .close").addEventListener("click", closePop);

  //Add images
  document.querySelector(".pop-image-student").src = `images/${allStudents[student.id].image}`;
  document.querySelector(".pop-image-housecrest").src = `images/${allStudents[student.id].house.toLowerCase()}_crest.svg`;

  //Add text to stuff
  //Fullname
  if (allStudents[student.id].firstname === "Leanne") {
    document.querySelector(".pop-fullname").textContent = allStudents[student.id].firstname;
  } else if (allStudents[student.id].middlename === `N/A` && allStudents[student.id].nickname === `N/A`) {
    document.querySelector(".pop-fullname").textContent = `${allStudents[student.id].firstname} ${allStudents[student.id].lastname}`;
  } else if (allStudents[student.id].middlename === `N/A` && allStudents[student.id].nickname !== `N/A`) {
    document.querySelector(".pop-fullname").textContent = `${allStudents[student.id].firstname} "${allStudents[student.id].nickname}" ${allStudents[student.id].lastname}`;
  } else {
    document.querySelector(".pop-fullname").textContent = `${allStudents[student.id].firstname} ${allStudents[student.id].middlename} ${allStudents[student.id].lastname}`;
  }
  //Name + Blood
  document.querySelector(".pop-firstname").textContent = allStudents[student.id].firstname;
  document.querySelector(".pop-middlename").textContent = allStudents[student.id].middlename;
  document.querySelector(".pop-lastname").textContent = allStudents[student.id].lastname;
  document.querySelector(".pop-nickname").textContent = allStudents[student.id].nickname;
  document.querySelector(".pop-blood").textContent = allStudents[student.id].blood;
  document.querySelector(".pop-gender").textContent = allStudents[student.id].gender;

  if (allStudents[student.id].perfect === true) {
    document.querySelector(".button-container--perfect").classList.add("active");
  }

  if (allStudents[student.id].house === "Slytherin" && allStudents[student.id].blood === "Pure") {
    document.querySelector(".pop-inquisitorial__container").classList.remove("hidden");
    if (allStudents[student.id].inquisitorial === true) {
      document.querySelector(".pop-inquisitorial").textContent = `Student is a part of inquisitorial squad`;
      document.querySelector(".button-container--inq").classList.add("active");
    } else {
      document.querySelector(".pop-inquisitorial").textContent = `Student is not a part of inquisitorial squad`;
      document.querySelector(".button-container--inq").classList.remove("active");
    }
  } else {
    document.querySelector(".pop-inquisitorial__container").classList.add("hidden");
  }

  // this is to expelling students
  document.querySelector(".button--pop-expelled").addEventListener("click", expellChosenStudent);
  document.querySelector(".button--perfect").addEventListener("click", perfectChosenStudent);
  document.querySelector(".button--pop-inq").addEventListener("click", inqChosenStudent);
}

function expellChosenStudent() {
  //If checked to false --> it is set to CHECKED now, so check for other perfects
  let container = document.querySelector("#popUp .top-button-container");
  // console.log(`Èxpell the following student: ${theOneStudent.firstname}?`);
  if (theOneStudent.status === "hacker") {
    cantExpellMe();
  } else if (theOneStudent.status === "" && container.classList.contains("active") === false) {
    container.classList.add("active");
    expellStudentClick(theOneStudent);
  }
}

function perfectChosenStudent() {
  let container = document.querySelector(".button-container--perfect");
  let tempId = theOneStudent.id;
  console.log(`Perfect on student: ${theOneStudent.firstname}`);

  if (container.classList.contains("active") === true) {
    container.classList.remove("active");
    allStudents[tempId].perfect = false;
    document.querySelector(".pop-perfect").textContent = `Student is not perfect for ${theOneStudent.house}.`;
    buildNewList();
  } else if (container.classList.contains("active") === false) {
    checkPerfect();
  }
}

function inqChosenStudent() {
  let container = document.querySelector(".button--pop-inq");
  let tempId = theOneStudent.id;

    if (allStudents[tempId].inquisitorial === false) {
      document.querySelector(".pop-inquisitorial").textContent = `Student is the part of inquisitorial squad`;
      allStudents[tempId].inquisitorial = true;
      container.classList.add("active");
      buildNewList();
    } else if (allStudents[tempId].inquisitorial === true) {
      document.querySelector(".pop-inquisitorial").textContent = `Student is not the part of inquisitorial squad`;
      allStudents[tempId].inquisitorial = false;
      container.classList.add("active");
      buildNewList();
    }
  }

function moveBallAround() {
  document.querySelector(".button-container--inq").classList.add("haveSomeFun");
  document.querySelector(".button-container--inq").addEventListener("animationend", stopMovingBall);
}

function stopMovingBall() {
  document.querySelector(".button-container--inq").classList.remove("haveSomeFun");
  document.querySelector(".button-container--inq").classList.remove("active");
}

function closePop() {
  // console.log(theOneStudent);
  document.querySelector("#popUp .close").removeEventListener("click", closePop);
  document.querySelector(".button-container--perfect").classList.remove("active");
  document.querySelector("#popUp").classList.toggle("hidden");
  buildNewList();
}

function checkPerfect() {
  let container = document.querySelector(".button-container--perfect");
  let tempId = theOneStudent.id;

  //Make three lists: One for all perfects, one for how many in the same house and one for how many of the same gender
  const perfects = allStudents.filter((person) => person.perfect);
  const housePerfects = perfects.filter((person) => person.house === theOneStudent.house);
  const otherGender = housePerfects.filter((person) => person.gender === theOneStudent.gender).shift();

  if (otherGender !== undefined || housePerfects.length >= 2) {
    openRemoveModal();
  } else {
    makeNewPerfect();
  }

  function openRemoveModal() {
    // console.log("OpenRemoveModal");
    document.querySelector("#removeModal").classList.remove("hidden");
    document.querySelector("#removeModal").classList.add(`${allStudents[tempId].house}`);
    document.querySelectorAll(".ext-perf").forEach((text) => {
      text.textContent = otherGender.firstname;
    });
    document.querySelector(".new-perf").textContent = allStudents[tempId].firstname;

    document.querySelector(".remove-new-perf-but").addEventListener("click", removeNewPerfect);
    document.querySelector(".remove-ext-perf-but").addEventListener("click", removeExistingPerfect);
  }

  function removeNewPerfect() {
    allStudents[tempId].perfect = false;
    document.querySelector(".pop-perfect").textContent = `Student is not perfect for the ${theOneStudent.house}.`;
    newPerfect2();
  }

  function removeExistingPerfect() {
    allStudents[tempId].perfect = true;
    container.classList.add("active");
    document.querySelector(".pop-perfect").textContent = `Student is perfect for the ${allStudents[tempId].house}.`;
    otherGender.perfect = false;
    closeRemoveModal();
    buildNewList();
  }

  function makeNewPerfect() {
    allStudents[tempId].perfect = true;
    document.querySelector(".button-container--perfect").classList.add("active");
    document.querySelector(".pop-perfect").textContent = `Student is perfect for the ${theOneStudent.house}.`;
    buildNewList();
  }

  function closeRemoveModal() {
    document.querySelector("#removeModal").className = "";
    document.querySelectorAll(".ext-perf").forEach((text) => {
      text.textContent = "";
    });
    document.querySelector(".new-perf").textContent = "";
    document.querySelector("#removeModal").classList.add("hidden");
  }

  function newPerfect2() {
    closeRemoveModal();
    closePop();
  }
}

function expellStudentClick() {
  // console.log(theOneStudent);
  document.querySelector("#expell").classList.remove("hidden");
  document.querySelectorAll(".expell-name").forEach((name) => {
    name.textContent = theOneStudent.firstname;
  });
  document.querySelector(".unexpell-button").addEventListener("click", unexpellThis);
  document.querySelector(".expell-student-btn").addEventListener("click", reallyExpellStudent);
}

//   let container = document.querySelector("#popUp .top-button-container");
// document.querySelector(".button-container--pop-expelled").removeEventListener("click", expellChosenStudent);
//If no --> Go back and macke checkbox be unchcked.
function unexpellThis() {
  // console.log(allStudents[theOneStudent.id]);
  allStudents[theOneStudent.id].expell = false;
  document.querySelector("#popUp .top-button-container").classList.remove("active");
  document.querySelector("#expell").classList.add("hidden");
  document.querySelectorAll(".expell-name").forEach((name) => {
    name.textContent = "";
  });
  document.querySelector(".expell-student-btn").removeEventListener("click", reallyExpellStudent);
  document.querySelector(".unexpell-button").removeEventListener("click", unexpellThis);
}

//if yes --> Get student from allStudents, remove and add to new list ++ update allStudents without student.
function reallyExpellStudent() {
  // console.log(allStudents[theOneStudent.firstname]);
  allStudents[theOneStudent.id].expelled = true;
  document.querySelector("#popUp .top-button-container").classList.remove("active");
  removeFromAllStudents();

  for (let i = 0; allStudents.length > i; i++) {
    if (allStudents[i].id > theOneStudent.id) {
      allStudents[i].id -= 1;
    }
  }
  theOneStudent = [];

  // addToExpelledStudents(student);
  checkStudentNumbers(allStudents);
  buildNewList();

  //Remove Expell Alert and reset
  document.querySelector("#expell").classList.add("hidden");
  document.querySelectorAll(".expell-name").forEach((name) => {
    name.textContent = "";
  });
  document.querySelector(".expell-student-btn").removeEventListener("click", reallyExpellStudent);
  document.querySelector(".unexpell-button").removeEventListener("click", unexpellThis);
  closePop();
}

function removeFromAllStudents() {
  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].expelled === true) {
      const removedStudent = allStudents.splice(i, 1);
      // console.log(removedStudent);
      expelledStudents.push(removedStudent);
    }
  }

  // console.log(allStudents);
  // console.log(expelledStudents);
  displayCleanStudentList(allStudents);
  checkStudentNumbers(allStudents);
}

function showExpelledStudents(event) {
  // console.log(event.target);
  let container = document.querySelector(".button-container--expelled");
  document.querySelector(".button--expelled").removeEventListener("click", showExpelledStudents);

  if (container.classList.contains("active") === false) {
    if (expelledStudents.length === 0) {
      alert("No students expelled");
      document.querySelector(".button--expelled").addEventListener("click", showExpelledStudents);
    } else {
      container.classList.add("active");
      // console.log(expelledStudents);
      displayCleanStudentExpelledList(expelledStudents);
      document.querySelector(".button--expelled").addEventListener("click", showExpelledStudents);
    }
  } else if (container.classList.contains("active") === true) {
    container.classList.remove("active");
    displayCleanStudentList(allStudents);
    document.querySelector(".button--expelled").addEventListener("click", showExpelledStudents);
  }
}

function displayCleanStudentExpelledList() {
  // clear the list
  document.querySelector("#student-display__container").innerHTML = "";

  // build a new list
  expelledStudents.forEach(displayExpelledStudents);
}

function displayExpelledStudents(student) {
  // create clone
  // console.log(student[0].firstname);
  const clone = document.querySelector("template#student").content.cloneNode(true);
  if (student[0].firstname === "Leanne") {
    clone.querySelector(".student__card__name").textContent = student[0].firstname;
  } else if (student[0].middlename === `N/A` && student[0].nickname === `N/A`) {
    clone.querySelector(".student__card__name").textContent = `${student[0].firstname} ${student[0].lastname}`;
  } else if (student[0].middlename === `N/A` && student[0].nickname !== `N/A`) {
    clone.querySelector(".student__card__name").textContent = `${student[0].firstname} "${student[0].nickname}" ${student[0].lastname}`;
  } else {
    clone.querySelector(".student__card__name").textContent = `${student[0].firstname} ${student[0].middlename} ${student[0].lastname}`;
  }
  if (student[0].firstname === "Leanne") {
    clone.querySelector(".student__card__img").alt = `Student Photo N/A`;
  } else {
    clone.querySelector(".student__card__img").src = `images/${student[0].image}`;
  }
  //STUDENT INFO
  clone.querySelector(".student__card__info .blood").textContent = `${student[0].blood}`;
  if (student[0].perfect === true) {
    clone.querySelector(".student__card__info .perfect").textContent = `Is perfect for ${student[0].house}.`;
  } else {
    clone.querySelector(".student__card__info .perfect").textContent = `Not perfect`;
  }
  if (student[0].house === "Slytherin" && student[0].inquisitorial === true) {
    clone.querySelector(".student__card__info .inquisitorial").textContent = `Is inquisitorial`;
  } else if (student[0].house === "Slytherin" && student[0].inquisitorial === false) {
    clone.querySelector(".student__card__info .inquisitorial").textContent = `Not inquisitorial`;
  } else {
    clone.querySelector(".student__card__info p:last-child").classList.add("hidden");
  }
  clone.querySelector("#student__card").classList.add(`${student[0].house.toLowerCase()}`);
  //Add EventListener for showing specific student
  clone.querySelector("#student__card").classList.add("expelled");

  document.querySelector("#student-display__container").appendChild(clone);
}

function searchStudents() {
  // console.log(document.querySelector("#searchbar").value);
  let input = document.querySelector("#searchbar").value.toLowerCase();

  for (let i = 0; allStudents.length > i; i++) {
    if (allStudents[i].searchname.includes(input) === true) {
      searchStudentsList.push(allStudents[i]);
    }
  }

  // console.log(searchStudentsList);
  displayCleanStudentList(searchStudentsList);
}

function clearSearchInput() {
  document.querySelector("#searchbar").value = "";
}

function resetSearchList() {
  document.querySelector("#searchbar").value = "";
  searchStudentsList = [];
  displayCleanStudentList(allStudents);
}

// INITIATE HACK FUNCTIONS
function hackTheSystem(event) {
  if (hackedArray.length === 0 && event.key === "a") {
    console.log("A...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 1 && hackedArray[0] === "a" && event.key === "l") {
    console.log("L...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 2 && hackedArray[1] === "l" && event.key === "o") {
    console.log("O...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 3 && hackedArray[2] === "o" && event.key === "h") {
    console.log("H...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 4 && hackedArray[3] === "h" && event.key === "o") {
    console.log("O...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 5 && hackedArray[4] === "o" && event.key === "m") {
    console.log("M...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 6 && hackedArray[5] === "m" && event.key === "o") {
    console.log("O...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 7 && hackedArray[6] === "o" && event.key === "r") {
    console.log("R...");
    hackedArray.push(event.key);
    // console.log(hackedArray);
  } else if (hackedArray.length === 8 && hackedArray[7] === "r" && event.key === "a") {
    console.log("A!");
    console.log("ALOHOMORA HAS BEEN CASTED");
    hackedArray.push(event.key);
    xXHACKEDXx();
  } else {
    // console.log("Not pressed correct order :(");
    hackedArray = [];
  }
}

function xXHACKEDXx() {
  console.log("YOU HAVE BEEN HACKED BROOO");
  hackedArray = [];
  document.removeEventListener("keydown", hackTheSystem);

  insertHackerStudent();

  setTimeout(fixBloodStatus, 2 * 1250);
}

function insertHackerStudent() {
  hackedStudent.id = allStudents.length;
  console.log(hackedStudent);
  allStudents.push(hackedStudent);
  checkStudentNumbers(allStudents);
  displayCleanStudentList(allStudents);
}

function cantExpellMe() {
  console.log("Hehehahaha...try me...blehblehbleh!!!");
  document.querySelector("#hackerModal").classList.remove("hidden");
  setTimeout(closeStuff, 2 * 1250);
}

function closeStuff() {
  document.querySelector("#hackerModal").classList.add("hidden");
  closePop();
  window.scrollTo(0, 0);
}

function fixBloodStatus() {
  document.querySelector("body").classList.add("hogwartsIsHacked");
  changeBloodStatus();
}

function changeBloodStatus() {
  for (let i = 0; allStudents.length - 2 >= i; i++) {
    console.log(allStudents[i]);

    if (allStudents[i].status === "Hacker") {
      allStudents[i].blood = "Pure";
    } else if (allStudents[i].blood === "Pure") {
      let randNum = Math.floor(Math.random() * 3) + 1;
      console.log(`${allStudents[i].blood}. Number is ${randNum}`);

      if (randNum === 1) {
        allStudents[i].blood = "Pure";
      } else if (randNum === 2) {
        allStudents[i].blood = "Half";
      } else {
        allStudents[i].blood = "Muggle";
      }
    } else if (allStudents[i].blood !== "Pure") {
      console.log(`${allStudents[i].blood}. Let make it pure!`);
      allStudents[i].blood = "Pure";
    }
  }
  displayCleanStudentList(allStudents);
}
