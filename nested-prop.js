/**
 * ? PROBLEM: Set nested props on an object in a dynamic manner ?
 * ? e.g. For an object "obj", set a nested prop "key1.key2.key3.key4" to some "value" as
 * ? obj['key1']['key2']['key3']['key4'] = value 
 */

 /**
  * ! If we were to do it the hard coded way(of course this is not an actual solution) but in a cleaner manner.
  */

/*
 !   Check obj['key'1]                                                        (set to {})|(use {}) and store ref === obj1
 * --Check obj['key1']['key2']                    ++use ref obj1['key2']      (set to {})|(use {}) and store ref === obj2
 ! --Check obj['key1']['key2']['key3']            ++use ref obj2['key3']      (set to {})|(use {}) and store ref === obj3
 * --Check obj['key1']['key2']['key3']['key4']    ++use ref obj3['key4']      (set to  === value)
 */

 /**
  * * Hence, handle each nested path key separately. 
  * * For each key
  * *     use a condensed reference from previous step (Original object for the first path key)
  * *     (extract an existing {} | create a new {})(key of (reference object)) and store the reference to this {} for next nested path key
  * *     for the last key set the value
  */

  /**
   * ? Ta-Da! This is exactly what the Array.prototype.reduce(...) helps us with! Carry a value from previous interation into current iteration
   */


function defineProp(obj, path, value){

  //handle each nested prop separatley
  const propKeyList = path.split('.');

  //create references and carry them over
  propKeyList.reduce((nestedPathObj, nastedPathKey, currentNestedKeyIndex)=>{

    //last key sets to value
    if(currentNestedKeyIndex === propKeyList.length - 1){
      nestedPathObj[nastedPathKey] = value;
    }

    //don't over write an existing value
    if (typeof nestedPathObj[nastedPathKey] === "object") {
      return nestedPathObj[nastedPathKey];
    
    //create and store condensed refernce for next iteration
    } else {
      return nestedPathObj[nastedPathKey] = {};
    }

    //original object is the condensed reference for the 1st path key
  }, obj);
  
}


// demo
const dummy = {
  name: 'Jhon Doe'
}

defineProp(objVal, 'address.location.cordinates.lat', 12.45);
