/**
 * * CURRYING OF N-ARITY FUNCTIONS: The Layman's Guide
 * 
 * ? [CURRYING]: Transformation of a function from being normally callable with all the arguments together to callable as a sequence 
 * ? of nested function calls each collecting an argument for the original function to be called with all the collected arguments.
 * 
 * TODO                                      f(a,b,c) -----(c)-----> cf(a)(b)(c)
 * 
 */

/**
  * * [DEMO] CURRYING 2-ARITY FUNCTIONS
  */

function curry2(f: Function): Function{
  return function(a){
    return function(b){
      return f(a,b);
    }
  }
}

function sum2(a: number,b: number){
  return a + b;
}

const curriedSum2 = curry2(sum2);

curriedSum2(1)(2) === sum2(1,2);

/**
 * ! PROBLEM: We can only curry 2-arity functions.
 * ! e.g sum3(1,2,3)  cannot be transformed to curriedSum3(1)(2)(3)
 * ! We could write another currier for 3-arity functions !NOT SCALABLE!
 * * We need a currier for n-arity functions.
 * ? But how ?
 * * Consider the following 3-arity currier
 */

function curry3(f){
  return function (a){
    return function (b){
      return function (c){
        return f(a,b,c);
      }
    }
  }
}

/**
 * ? [DEDUCTION]
 * * The curried function keeps returning nested calls of the SAME TYPE AS ITSELF each collecting an argument
 * * Until we have collected sufficient number of arguments for use with the underlying function being curried.
 * 
 * ? This deduction could be used to flatten out the curried function's LADDER structure with, an if-else block.
 * 
 * ? 1. Since every nested function is the same(as the top level curried function) in the sense each collects 
 * ?    one argument, we could use a single function for collecting arguments via nested calls to the same. 
 * ?    For the ease of understanding, We call this the [ARG-COLLECTOR-FUNCTION][ACF]
 * 
 * ! NOTE: This doesn't imply recursion, cause each call RETURNS another call.
 * 
 * ? 2. We'd keep collecting arguments (returning calls to the ACF) until we've collected sufficient arguments for
 * ?    the underlying function.
 * 
 * ? 3. To make the arguments collected across multiple calls to the ACF available to the subsequent calls to the ACF,
 * ?    we must make use of an ARGUMENT STORE, available via Closure to the CURRIED FUNCTION(===ACF)
 * 
 */

/**
 * * [IMPLEMENTATION]
 */

function curryBasic(f: Function): Function{

  //arguments store
  const collectedArguments = [];

  //argument collector function
  return function collectorFunction(arg){

    //store collected argument
    collectedArguments.push(arg);

    //sufficient arguments collected?
    if(collectedArguments.length === f.length){

      //call the original function with the collected arguments
      f(...collectedArguments);

    }else{

      //collect one more argument and recheck 
      return collectorFunction;              

    }
  }
  
}

/**
 * * This is a fairly working implmentation that can curry n-arity functions.
 * 
 * ! [PROBLEM] 
 * ? The curried function can only be called as cf(a)(b)(c) and not in any other form
 * ? e.g. cf(a,b)(c) or cf(a)(b)(c) or cf(a,b,c) etc. [Each has valid use cases]
 * 
 * ! Why the problem?
 * ? Because the ACF collects only one argument at a time and hence each nested call can specify
 * ? 1 argument only.
 * 
 * * [SOLUTION] 
 * ? Modify the collector function to collect any number of arguments in each call. FUNCTION GATHER
 * ? SYNTAX is the perfect candidate here. Also, we'd need to spread the ARGS[] before pushing into
 * ? the collectedArgs[].
 */

function curryAnyArgCombination(f: Function): Function{

  //arguments store
  const collectedArguments = [];

  //argument collector function
  return function collectorFunction(...args){

    //store collected argument //spread the collected args // collectedArguments = collectedArguments.concat(args)
    collectedArguments.push(...args);

    //sufficient arguments collected?
    if(collectedArguments.length === f.length){

      //call the original function with the collected arguments
      f(...collectedArguments);

    }else{

      //collect more arguments and recheck 
      return collectorFunction;              

    }
  }

}

/**
 * ? Could we get rid of that collectedArgs[]. It's making my code clumsy!
 * 
 * * Of course we can. In that case we need to ensure every time we call the collector function, it gets all the 
 * * arguments we've collected upto that point. Hence, we must: 
 * 
 * * 1. Collect new args. [Could be achieved with a function]
 * * 2. Combine them with the args collected by the previous call the to ACF.
 * * 3. Call the ACF with the combined set of args.
 */

function curryWithoutArgStore(f: Function): Function{

  //argument collector function
  return function collectorFunction(...args){

    //sufficient arguments collected?
    if(args.length === f.length){

      //call the original function with the collected arguments
      f(...args);

    }else{

      //collect arguments, combine and recheck 
      return (moreArgs) => collectorFunction(args.concat(moreArgs));              

    }
  }

}

/**
 * ! [IMPROVEMENTS]
 * * Mostly functions are 'this' aware. Hence, if our curried function gets 'this' value(cause our underlying 
 * * function would need it), we must make sure it gets to the underlying function.
 */
export function curry(f: Function): Function{

  //argument collector function
  return function collectorFunction(...args){

    //sufficient arguments collected?
    if(args.length === f.length){

      //call the original function with the collected arguments
      f.apply(this,...args);

    }else{

      //collect arguments, combine and recheck //collects 'this' from enclosing scope
      return (moreArgs) => collectorFunction.apply(this, args.concat(moreArgs));              

    }
  }

}

/**
 * ? How about uncurrying ?
 */

/**
 * * 2-arity un-currier
 */

function uncurry2(curry2: Function): Function{
  return function uncurried2(a,b){
    return curry2(a)(b);
  }
}

/**
 * * n-arity un-currier
 */

function uncurry(curriedFunction: Function): Function{
  return function uncurriedFuction(...args){
    return args.reduce( (partialFunction, nextArg)=>partialFunction(nextArg), curriedFunction);
  }
}