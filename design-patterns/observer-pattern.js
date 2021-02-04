//Custom list implementation for use with Subjects
//we could also use arrays but then subject code would be too verbose
function ObserverList(){
  this.observerList = [];
}

ObserverList.prototype.add = function (observer)  {
  return this.observerList.push(observer)
}

ObserverList.prototype.count = function ()  {
  return this.observerList.length;
}

ObserverList.prototype.get = function (index){
  return this.observerList[index];
}

ObserverList.prototype.empty = function ()  {
  this.observerList = [];
}

ObserverList.prototype.getIndexOf = function (observer)  {
  return this.observerList.findIndex( storedObserver =>   storedObserver === observer );
}

ObserverList.prototype.removeAtIndex = function (index)  {
  return this.observerList.splice(index, 1)[0];
}

//Subject implementation //using Constructor Injection of dependency for IoC and reduced coupling
function Subject(ObserverList){
  //store references to observers
  this.observers = ObserverList;
}
//provide for adding observers
Subject.prototype.addObserver = function (observer)  {
  this.observers.add(observer);
}
//provide for removing observers
Subject.prototype.removeObserver = function (observer)  {
  const observerIndex = this.observers.getIndexOf(observer);
  return this.observers.removeAtIndex(observerIndex);
}
//provide for notifying observers
Subject.prototype.notifyObservers = function ( newState )  {
  const totalObservers = this.observers.count();
  for (let index = 0; index < totalObservers; index++) {
    const observer = this.observers.get(index);
    observer.update(newState);
  }
}

//Observable interface
function ObserverF(){
  //must implement an update(...) which the subject would call with updated state once that changes
  this.update = () => {};
}


//Extender utility
function extend(sourceObject, extension){
  for (const key in extension) {
    sourceObject[key] = extension[key];
  }
}

const observer1 = new ObserverF();
//provide a custom implementation of update
observer1.update = ( newSubjectState ) => {
  console.log("Observer1 recieved the updated state", newSubjectState);
}

const observer2 = new ObserverF();
//provide a custom implementation of update
observer2.update = ( newSubjectState ) => {
  console.log("Observer2 recieved the updated state", newSubjectState);
}

const newSubject = new Subject(new ObserverList());
//add observers to the subject
newSubject.addObserver(observer1);
newSubject.addObserver(observer2);

//notify observers when the subject state changes
newSubject.notifyObservers({ state: {
  name: "Zubair"
}})


//DOM illustration
const SubjectCheckbox = document.getElementById('subject');
const ObserverCheckboxCreator = document.getElementById('observer-creator');
const observerContainer = document.getElementById('observer-container');

//enhance the main checkbox to be a subject
extend(SubjectCheckbox, new Subject(new ObserverList()));

//trigger observers when checkbox is clicked
SubjectCheckbox.addEventListener('click',()=>{
  SubjectCheckbox.notifyObservers(SubjectCheckbox.checked);
})

//observer checkbox adder
ObserverCheckboxCreator.addEventListener('click',()=>{
  //create a new checkbox
  const observerCheckbox = document.createElement('input');
  observerCheckbox.type = "checkbox";

  //enhance the checkbox to be an OBSERVER
  extend(observerCheckbox, new ObserverF());

  //provide custom update behaviour for master checkbox state changes
  observerCheckbox.update = function(masterCheckboxState){
    this.checked = masterCheckboxState;
  }

  //add the observer to the master checkbox
  SubjectCheckbox.addObserver(observerCheckbox);

  //append observer checkbox to dom
  observerContainer.appendChild(observerCheckbox);
})
