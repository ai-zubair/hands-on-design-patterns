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
  };

  function getBasketValue() {
    let basketValue = 0;
    basket.forEach((item) => (basketValue += item.price));
    return basketValue;
  };

  function showBasket() {
    return getBasketItemList();
  };

  function getItemCount(){
    return basket.length; 
  }

  return {
    addItem,
    showBasket,
    getItemCount,
    getBasketValue
  };
})();