/**
 * * THE REVEALING MODULE PATTERN
 */

/**
 * * ADVANTAGES OVER ORIGINAL MODULE PATTERN
 * 
 * ?1 All the members are defined within the private scope allowing easy access to one from another.
 * ?2 Only the refernces and not the actual implementations are included on the public API.
 * ?3 Definition of all members in a single place provides for a Consistent syntax.
 * ?4 Modules are more redable with all the exported functionality refernced at the end.
 * 
 * ! DISADVANTAGES OVER ORIGINAL MODULE PATTERN
 * 
 * ?1 Fixing privates by overriding publics accessing them doesn't make much sense as we'll be only 
 * ?  over-riding the references and not the implementation.
 * 
 * ?2 Modules are rather fragile as compared to the original module pattern.
 */
const shoppingBasket = (function () {
  
  //private members
  const basket = [];

  function getBasketItemList() {
    const basketItemList = basket.map((item) => item.name);
    return basketItemList;
  }

  //public members
  function addItem(item) {
    if (item && item.name && item.price) {
      basket.push(item);
    }
  }

  function getBasketValue() {
    let basketValue = 0;
    basket.forEach((item) => (basketValue += item.price));
    return basketValue;
  }

  function showBasket() {
    return getBasketItemList();
  }

  function getItemCount(){
    return basket.length; 
  }

  //public API: Exposing public references to private implementations
  return {
    addItem,
    showBasket,
    getItemCount,
    getBasketValue
  };
})();