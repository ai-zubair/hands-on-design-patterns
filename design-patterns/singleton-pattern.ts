import { PubSub, PUB_SUB_SINGELTON_SERVICE_KEY } from './pub-sub-pattern';
/**
 * * SINGLETON PATTERN
 */

class Singleton{

  /* store the singleton instance reference */
  /* allow lazy initialization */
  private static instance: Singleton = null;

  /* make the constructor private to avoid explicit instantiation */
  private constructor(){

  }

  /* expose a public method for making the singleton instance available */
  public static getInstance(): Singleton{
    if(!this.instance){
      this.instance = new Singleton();
    }
    return this.instance;
  }

  /* add methods to define the singleton's behaviour */
  public greetMessage = 'Hey there! Good Evening';;
  public greet(){
    return this.greetMessage;
  }
}

/**
 * * Classes shouldn't be singletons on their own. Instead the application must induce that behaviour.
 * 
 * ? SINGLETON WRAPPER?
 * 
 * ! Doesn't make much sense.
 * 
 * * Typically, an application should maintain a SINGLETON MAP(as a singleton itself) where all the services 
 * * that are meant to be singletons are stored with keys evaluating to their respective Singleton Instances.
 */

 /**
  * * Here is what I mean:
  */

  /* The corresponding map is generic about the service instances it'll store */
 class GlobalSingletonMap<T = any>{

  private static instance: GlobalSingletonMap | null = null;

  private singletonMap: Map<string, T> | null = null;

  private constructor(){

  }

  public addServiceSingleton(serviceKey: string, serviceInstance: T): void{
    this.singletonMap.set(serviceKey, serviceInstance);
  }

  public getServiceSingleton(serviceKey: string): T | undefined{
    return this.singletonMap.get(serviceKey);
  }

  public static getInstance(){
    if(!this.instance){
      this.instance = new GlobalSingletonMap();
    }
    return this.instance;
  }

 }

 /**
  * ! PROBLEM !
  * * How do we get the type information into the Singleton Map about the services it is to store?
  * * CAUSE STATIC MEMBERS CANNOT ACCESS CLASS TYPES.
  */
 const DUMMY_SINGLETON_SERVICE_KEY = 'DUMMY';
 class Dummy{
   
}

 const ANOTHER_DUMMY_SINGLETON_SERVICE_KEY = 'DUMMY';
 class AnotherDummy{

 }

/* create a global singleton map and use it everywhere*/
 const singletonMap = GlobalSingletonMap.getInstance();

 /* add services to it which are meant to be singletons */
 singletonMap.addServiceSingleton(PUB_SUB_SINGELTON_SERVICE_KEY, new PubSub());
 singletonMap.addServiceSingleton(DUMMY_SINGLETON_SERVICE_KEY, new PubSub());
 singletonMap.addServiceSingleton(ANOTHER_DUMMY_SINGLETON_SERVICE_KEY, new PubSub());

 /* get services wherever needed */
 const pubsub = singletonMap.getServiceSingleton(PUB_SUB_SINGELTON_SERVICE_KEY) as PubSub;
 const dummyService = singletonMap.getServiceSingleton(DUMMY_SINGLETON_SERVICE_KEY) as PubSub;
 const anotherDummyService = singletonMap.getServiceSingleton(ANOTHER_DUMMY_SINGLETON_SERVICE_KEY) as PubSub;