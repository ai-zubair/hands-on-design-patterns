/**
 * * THE ORIGINAL MODULE PATTERN.
 */

/**
* *  ADVANTAGES
* ?1 Provides a sense of Encapsulation making the code look lot cleaner.
* ?2 Provides for private and public members by means of function scoping and closures.
*
* !  DISADVANTAGES
* ?1 Changing member visibility is too much of an effort.
* ?2 Private members not available on the later added public members.
* ?3 Privates can be only fixed by over-riding corresponding publics.
* ?4 Privates are not as flexible as it appears at the first go.
*/
const basketModule = (function () {
  //private members

  //module state
  const basket = [];

  //implementation details
  function getBasketItemList() {
    const basketItemList = basket.map((item) => item.name);
    return basketItemList;
  }

  //public members
  return {
    get itemCount() {
      return basket.length;
    },
    addItem(item) {
      if (item && item.name && item.price) {
        basket.push(item);
      }
    },
    //public API methods accessing the module state
    getBasketValue() {
      let basketValue = 0;
      basket.forEach((item) => (basketValue += item.price));
      return basketValue;
    },
    showBasket() {
      //API methods accessing the private functions
      return getBasketItemList();
    },
  };
})();

/**
 * ! VARIATIONS OF THE MODULE PATTERN
 */

/**
 * * #1 EXPORTS PATTERN: A global module that isn't consumed upfront but passed into other modules via #2 Import Mixin Pattern.
 */

const couponModule = (function () {
  //private members

  //module state
  const coupons = [];

  //implementation details

  //initialize the coupons when the module is created
  (function populateCoupons() {
    for (let couponIndex = 0; couponIndex < 10; couponIndex++) {
      coupons.push({
        code: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
        discount: Number(((Math.random() * (50 + 1)) / 100).toFixed(2)),
      });
    }
  })();

  //public members
  return {
    getCoupons() {
      return coupons;
    },
  };
})();

/**
 * * #2 IMPORT MIXIN PATTERN: Allows global modules be passed as arguments into the anonymous function of a module and aliased locally as needed.
 */

const checkoutModule = (function (cart, coupons) {
  //private members

  //module state
  let deliveryAddress = '';

  //implmentation details
  (function getDeliveryAddress() {
    deliveryAddress = 'Some random delivery address fetched over the network';
  })();

  function calculateTax(cartValue) {
    const importDuty = Number((cartValue * 0.05).toFixed(2));
    const serviceTax = Number((cartValue * 0.18).toFixed(2));
    return importDuty + serviceTax;
  }

  function calculateDiscount(cartValue) {
    const isDiscountApplicable = cartValue >= 500;
    if (isDiscountApplicable) {
      const availableCoupons = coupons.getCoupons();
      const randomCoupon =
        availableCoupons[Math.floor(Math.random() * availableCoupons.length)];
      return Number((cartValue * randomCoupon.discount).toFixed(2));
    } else {
      return 0;
    }
  }

  //public members
  return {
    generateBill() {
      const cartValue = cart.getBasketValue();
      const totalTax = calculateTax(cartValue);
      const totalDiscount = calculateDiscount(cartValue);
      return cartValue + totalTax - totalDiscount;
    },
  };
})(basketModule, couponModule);

function main() {
  basketModule.addItem({
    name: 'handwash',
    price: 299,
  });

  basketModule.addItem({
    name: 'perfume',
    price: 320,
  });

  checkoutModule.generateBill();
}

main();
