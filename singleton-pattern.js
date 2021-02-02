/**
 * * THE SINGLETON PATTERN
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


//singleton factory //does it make sense?
function SingletonWrapper(Constructor){
  this.getInstance = () => {
    if(!Constructor.instance){
      Constructor.instance = new Constructor();
    }
    return Constructor.instance;
  }
  
}

const SomeSingletonManager = new SingletonWrapper(function(){this.a = 2;});
const OtherSingletonManager = new SingletonWrapper(function(){this.b = 2;});

SomeSingletonManager.getInstance();
OtherSingletonManager.getInstance();
