/**
 * * THE OBSERVER PATTERN
 */

/**
 * ? [SUBJECT]
 * * An object whose state is of interest to some other objects.
 * 
 * ? [OBSERVER]
 * * Objects interested in the SUBJECT's state.
 * 
 * ? [PROCESS]
 * * OBSERVERS show their interest in a SUBJECT's state by **ATTACHING** themselves to the SUBJECT.
 * * SUBJECT **BROADCASTS** the state changes to the attached OBSERVERS and **INVOKES** their reponses.
 * * OBSERVERS, no more interested in the SUBJECT's state, **DETACH** themsleves from the SUBJECT.
 */

/**
 * ! DISTRIBUTION OF RESPONSIBILITIES
 * 
 * ? [SUBJECT]
 * * Must provide for:
 * * 1. Maintaining a list of observers.
 * * 2. Adding observers.
 * * 3. Removing observers.
 * * 4. Notifying observers.
 * 
 * ? [OBSERVER]
 * * Must provide an update(...) that the SUBJECT can call when it's state changes to invoke custom
 * * response from the observers.
 */

/**
 * * [OBSERVER]: Interface
 * ? Generic around the state of the subject it observes.
 */
interface Observer<T>{
  /* called by the SUBJECT to invoke observer's response */
  update(newSubjectState: T): void;
}

/**
 * * [SUBJECT]: Class
 * ? Generic around its observable state.
 */
class ObservableSubject<K>{

  /* maintain a list of the observers */
  public observers: Observer<K>[] = [];

  /* add observers to the list */
  addObserver(observer: Observer<K>): void{
    this.observers.push(observer);
  }

  /* remove an observer from the list */
  removeObserver(observer: Observer<K>): Observer<K>{
    const observerIndex = this.observers.findIndex( storedObserver => storedObserver === observer );
    return this.observers.splice(observerIndex, 1)[0];
  }

  /* notify all observers of the state change */
  notifyObservers(newSubjectState: K): void{
    this.observers.forEach( storedObserver => storedObserver.update(newSubjectState) );
  }
}

/**
 * ! Why is the Observer an interface and Subject a class?
 * 
 * * Cause every OBSERVER must provide it's own implmenetation of the update(...) that the Subject would call
 * * when it's state changes.
 * 
 * * WHEREAS
 * 
 * * Every SUBJECT shares the same underlying behaviour of storing/pruning observers and notifying them.
 */


/**
 * * Exmaple implementation
 */

interface DummySubjectState {
  id: string;
  counter: number;
}

class DummySubject extends ObservableSubject<DummySubjectState>{

  private state: DummySubjectState = {
    id: '',
    counter: 0
  }

  constructor(id: string, counter: number){
    super();
    this.state = {
      id,
      counter
    }
  }

  changeState(updatedID?: string, updatedCounter?: number): void{
    this.state = {
      id: updatedID || this.state.id,
      counter: updatedCounter || this.state.counter
    }
    this.notifyObservers(this.state);
  }

}

/**
 * * Some observers for the DummySubject
 */
class DummyObserverOne implements Observer<DummySubjectState>{

  constructor(private observerID: string){}

  update(updatedSubjectState: DummySubjectState): void{
    console.log(`[Observer: ${this.observerID}]: `,JSON.stringify(updatedSubjectState, undefined, 2));
  }
}

class DummyObserverTwo implements Observer<DummySubjectState>{

  constructor(private observerID: string){}

  update(updatedSubjectState: DummySubjectState): void{
    console.log(`[Observer: ${this.observerID}]: `,JSON.stringify(updatedSubjectState, undefined, 2));
  }
}

/**
 * * Testing things out
 */


const subjectOne = new DummySubject('2j3h4g',0);


const observerOne = new DummyObserverOne('O:1');
const observerTwo = new DummyObserverTwo('O:2');


subjectOne.addObserver(observerOne);
subjectOne.addObserver(observerTwo);


subjectOne.changeState('some-new-id',1);

