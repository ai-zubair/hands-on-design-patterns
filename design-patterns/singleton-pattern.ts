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

/* Use the singleton when needed with lazy initialization */
const someDummySingleton = Singleton.getInstance();
someDummySingleton.greet();
someDummySingleton.greetMessage;