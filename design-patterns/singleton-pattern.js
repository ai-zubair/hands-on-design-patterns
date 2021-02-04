/**
 * * THE SINGLETON PATTERN
 * 
 * ! Lazy initialisation of the singleton instance is the key factor that differentiates it from the static instances.
 * 
 * * Applicability of a singleton instance:
 * ?1 When a single instance with a global access point is need acroos multiple clients.
 * ?2 When an instance is to be extensible and extended instance must be used by clients without changing the client code(Modify the singleton manager method to behave like a factory).
 */

const serverContext = (function(){

  //singleton instance store
  let instance = null;

  //singleton instance definition
  function contextGenerator(){
    
    //private members
    const context = {};

    //public API
    return {
      add(key, value){
        if(typeof key === "string" && typeof value !== undefined){
          return context[key] = value,context;
        }
        return context;
      },
      get(key){
        return context[key];
      },
      remove(key){
        return context[key] = undefined; 
      }
    };
  }

  // singleton manager === singleton
  return {
    getInstance(){
      if(!instance){
        instance = contextGenerator()
      }
      return instance;
    }
  };

})()

const context = serverContext.getInstance();
context.add("admin", "Jhon Doe");
context.get("admin");


/**
 * ? SINGLETON FACTORY
 * 
 * ! Supplier Classes don't have to be Singletons by themselves. 
 * ! Let the application be the singleton, cause the singleton behaviour is the application's need.
 * ! This allows Supplier classes to be separately instantiable.
 * ! Now we could create mock instances for use with unit testing.
 * ! The application needs a singleton manager.
 * ! We could build a HOF that wraps a constructor into a Singleton(Manager)
 * 
 * ?Does it make sense?
 * 
 * 
 */

/**
 * * A singleton manager for a given constructor
 */
function SingletonWrapperF(Constructor){
  //store the instance reference on Consrtuctor to avoid exposing it
  this.getInstance = () => {
    //reference is available via closure of getInstance() over Constructor
    if(!Constructor.instance){
      Constructor.instance = new Constructor();
    }
    return Constructor.instance;
  } 
}

/**
 * * A demo constructor
 */
function Car(){
  this.make = "Honda";
  this.year = 2020;
}

/**
 * * Singleton manager for Car constructor
 * * Pass around into the clients.
 */
const CarSingletonManager = new SingletonWrapperF(Car);

/**
 * * Car is still instantiable.
 */
const mockCar = new Car();

CarSingletonManager.getInstance();

