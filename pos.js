let sidebarButtons = document.querySelectorAll(".sidebar-button")
let dynamicContent = document.querySelector(".dynamic-content")
let list = document.querySelector(".list-body");
let totalPrice = document.querySelector("#total-price")
let totalText = document.getElementById("total-text");
let subTotal = document.querySelector(".subtotal.price")
let subTotalText = document.querySelector(".subtotal")
let products = []
let orderInProgress = true;
let productIndex = 0;
let meatQuantityDiv = document.querySelector(".meat-quantity-options"); 
let menuBtnsDiv = document.querySelector(".menu-buttons");
let condiments_div = document.querySelector(".condiments-selection-menu")
let mixins_div = document.querySelector(".mixins-container");
let sides_div = document.querySelector(".sides-container");
let drinks_div = document.querySelector(".drinks-container")
let soups_div = document.querySelector(".soups-container");
let floats_div = document.querySelector(".floats-container")
let errorUI = document.querySelector(".error-ui");
let errorUIMsg = document.getElementById("error-message");
let closeErrorUI = document.getElementById("close-error-ui");
let closeDestinationtn = document.querySelector(".menu-close-btn.destination-btn");
let condimentsContainer = document.querySelector(".condiments-div")
let saucesMenu = document.querySelector(".sauces-menu")
let seafoodMenu = document.querySelector(".seafood-menu")
let specialInstMenu = document.querySelector(".special-instructions-menu")
let saladsContainer = document.querySelector(".salads-container")
let scrollUpArrow = document.getElementById("quantity-up");
let SODMenu = document.querySelector(".side-of-display-menu.submenu");
let tenderOrderBtn = document.querySelector(".tender-order");
let destLookUpBtn = document.getElementsByClassName("destination-lookup-option");
let destination = document.getElementById("destination")
let cancelItemBtn = document.getElementById("cancel-item-btn")
let selectedProduct;
let lastSelectedProduct = 0;
let addedNewProduct = false;
let inValueBasketScope = false;
let selectedItem = 0;
let destinationDiv = document.getElementsByClassName("destination-options")[0];
condiments_div.classList.add("active")
menuBtnsDiv.classList.add("active")
let dishConeWaffContainer = document.querySelector(".dish-cone-waff-container");
let destinationHolder = ""
let destinationBtn = document.getElementsByClassName("destination-lookup-btn")[0];
let destinationSelected = false;

let guestNumberDiv = document.getElementsByClassName("gn-content")[0];
let guestNumberOutput = document.getElementsByClassName("gn-output")[0]
let guestNumberBtns = guestNumberDiv.getElementsByTagName("button");

let drinkCondimentsContainer = document.querySelector(".drink-condiments-container")
let desertCondContainer = document.querySelector(".desert-cond-container");

let discountScreen = document.querySelector(".discount-options");
let openDiscountBtn = document.getElementById("discount-lookup-btn");

let paymentBtn = document.getElementsByClassName("payment-button")
let paymentGridBtns = document.querySelector(".payment-buttons-section-left").getElementsByTagName("button");
let paymentGoBackBtn = document.querySelector("#payment-go-back");
let subSection = document.getElementById("sub-section");
let totalSection = document.getElementById("total-section");

let productsList = document.querySelector(".product-list");

let guestNumberDisplayText = document.getElementById("guest-number")
let guestNumberScreen = document.getElementById("guest-number-screen");

let quantityScreen = document.getElementsByClassName("quantity-screen")[0];
let quantitySelectionBtn = document.getElementsByClassName("quantity-selection-btn");
let openQuantityMenuBtn = document.getElementById("quantity-select");
let quantityKeypadBtns = document.querySelectorAll(".quantity-buttons button");
let quantityOutput = document.getElementsByClassName("quantity-output")[0].getElementsByTagName("span")[0];
let quantityClear = document.getElementById("quantity-keypad-clear").addEventListener("click", () => quantityOutput.innerText = "")
let quantityGoBack = document.getElementById("quantity-go-back");

let customTax = document.getElementById("custom-tax");

let allergyScreen = document.querySelector(".allergy-container");

let defaultRate = 0.065;

let taxRate = localStorage.getItem("custom_tax_rate") || defaultRate;
let setTaxRate = document.getElementById("set-tax-rate");

setTaxRate.addEventListener("click", updateTaxRate);

function updateTaxRate() {
    if(!isNaN(customTax.value)) {

        if(customTax.value.length < 1) {
            customTax.value = defaultRate;
        } 

        localStorage.setItem("custom_tax_rate", customTax.value)
        taxRate = customTax.value;
        customTax.placeholder = `Current rate: ${customTax.value}`
    }
}
customTax.placeholder = `Current rate: ${localStorage.getItem("custom_tax_rate") || defaultRate}`

let discountOption = document.getElementsByClassName("discount-lookup-option")

let upchargeOptionsContainer = document.querySelector(".upcharge-options-menu.submenu");
let kidsOptionsContainer = document.querySelector(".kids-container.submenu")

let sidebarButtonsContainer = document.querySelector(".sidebar-buttons");

let guestNumber = "";

let confirmGN = document.getElementById("gn-confirm");
let dismissGN = document.getElementById("gn-go-back");

let otherContainer = document.querySelector(".other-container")
let paymentScreen = document.querySelector(".payment-screen");

let beginPOSBtn = document.getElementById("other-btn").addEventListener("click", () => {
    loadMenuBtns(menuBtnsDiv, "./menu-btns.json", displayMenuBtns);
    opensSubMenu(menuBtnsDiv)
    sidebarButtons[0].classList.add("active"), sidebarButtons[sidebarButtons.length - 1].classList.remove("active")
    localStorage.setItem("hasInteracted", true)
})

let paymentOutput = document.querySelector(".payment-output");
let hasAttemptedCheckout = false;

let meatOptionsMenu = document.querySelector(".meat-options-menu");

let mixinUpchrg = 0.35;
let expandedCondiments = false;
let paymentOutputStr = ""

let mixerSizing = []
let shakeSizing = []
let maltSizing = []
let floatSizing = []

let discountHolder = ""

let tenderSizing = []

let subitemIdentifier = -1;

let isSubItemSelected = false;
let isSubitemSubProduct = false;


if(localStorage.getItem("hasInteracted") == null) {
    setTimeout(() => {
        menuBtnsDiv.innerHTML = ""
        opensSubMenu(otherContainer)
        productsList.style.display = "none"
    }, 1)
} 

// For when a user immediatly changes a side size to a large, before selecting any other side
let startUpFryUpcharge = 0.50;
let startUpSlawUpcharge = 0.50;

closeDestinationtn.addEventListener("click", () => {
    destinationDiv.style.display = "none"
})

cancelItemBtn.addEventListener("click", cancelSelectedItem)
closeErrorUI.addEventListener("click", () => errorUI.style.display = "none")
confirmGN.addEventListener("click", confirmGuestNumber);
dismissGN.addEventListener("click", () => {
    guestNumberScreen.style.display = "none"

    guestNumber = ""
})

openDiscountBtn.addEventListener("click", discountOptions);

function discountOptions() {
    discountScreen.style.display = "block"

    let confirmDiscountBtn = document.getElementById("confirm-discount")
    let cancelDiscountBtn = document.getElementById("close-discount-controls");

    confirmDiscountBtn.addEventListener("click", applyDiscount)
    cancelDiscountBtn.addEventListener("click", () => discountScreen.style.display = "none")

    for(let i = 0; i < discountOption.length; i++) {
        discountOption[i].addEventListener("click", toggleDiscount)
    }
}

function toggleDiscount() {
    for(let i = 0; i < discountOption.length; i++) {
        if(discountOption[i].classList.contains("selected") && discountOption[i] != this) {
            discountOption[i].classList.remove("selected")
        }
    }


    discountHolder = `{"title": "${this.innerText}", "discount": "${this.dataset.amount}"}`
    this.classList.add("selected")
}

function bindAllergyBtn(classToCheck, container) {
    let btn = document.querySelector(`.${classToCheck}`);
    btn.addEventListener('click', () => {
        container.style.display = "none";

        loadMenuBtns(allergyScreen, "./allergen-btns.json", displayAllergenBtns, null, "return-button floats-return", "SELECT ALLERGY", true)
        opensSubMenu(allergyScreen)
    })

}

function displayAllergenBtns() {
    bindSubitemListeners("subitem-btn")
    returnBtnListener("allergyRtrn", allergyScreen)
}

function applyDiscount() {
    if(!orderInProgress)  {
        displayErrorUI("Order not in progress")
        return
    }
    if(discountHolder != "") {
        let discount = JSON.parse(discountHolder);
        let discountPercentage = discount["discount"];

        addPaymentOrDiscount(discount["title"], discountPercentage, true)
    }
}


openQuantityMenuBtn.addEventListener("click", openQuantityModal);
quantityGoBack.addEventListener("click", () => displayMainMenu(quantityScreen))
paymentGoBackBtn.addEventListener("click", () => displayMainMenu(paymentScreen))
function openQuantityModal() {
    for(let i = 0; i < quantitySelectionBtn.length; i++) {
        quantitySelectionBtn[i].addEventListener("click", selectQuantity)
    }

    for(let o = 0; o < quantityKeypadBtns.length; o++) {
        quantityKeypadBtns[o].addEventListener("click", appendQuantityNumber);
    }

    opensSubMenu(quantityScreen)

    let quantityEnter = document.getElementById("quantity-enter");

    quantityEnter.addEventListener("click", () => {
        selectQuantity(+quantityOutput.innerText)
    })
}

function appendQuantityNumber() {
    if(!isNaN(this.innerText)) {
        quantityOutput.innerText += this.innerText;
    }
}

function selectQuantity(value) {
    let selectedProduct = getSelectedProduct()

    if(isNaN(value)) {
        value = this.innerText;

        if(+value < 1) {
            return displayErrorUI("Value must be at least one")
        }
    }

    if(+value < 1) {
        return displayErrorUI("Value must be at least one")
    }

    if(selectedProduct) {
        products[selectedProduct]["quantity"] = value;
        updateList()
    }

    displayMainMenu(quantityScreen)
    setTimeout(() => {
        clearQuantity()
    }, 500)
}

function clearQuantity() {
    quantityOutput.innerText = ""
}

function getSelectedItem() {
    if(getSelectedProduct()) {
        return document.getElementsByClassName("product")[getSelectedProduct()]
    }

    if(getSelectedSubProduct()) {
        isSubItemSelected = true
        return document.getElementsByClassName("subitem")[getSelectedSubProduct()]
    }

    if(getSelectedSubProductSubItem()) {
        return document.getElementsByClassName("subitemAddition")[0]
    }
}

function cancelSelectedItem() {

    if(!orderInProgress) {
        return displayErrorUI("Order not in progress")
    }

    let product = document.getElementsByClassName("product")
    let selected = document.querySelector(".product.selected");
    let subitemSubPrd = getSelectedSubProductSubItem()
    if(subitemSubPrd != undefined) {
        cancelSelectedSubItemSubProduct()
        return
    }


    if(selected == undefined) {
        cancelSelectedSubItem()
        return
    }
    if(selected.classList.contains("product")) {
        selected.remove()
        let formula = products.splice(selected.dataset.id, 1)
        refreshIDs(product, "data-id")
        if(formula.length == 0) {
            products.splice(selected.dataset.id - 1, 1)
        }

        if(product.length > 0) {
            product[product.length - 1].classList.add("selected")
        } 

        updatePrice(calculateTotal())
        return
    }

}

function cancelSelectedSubItemSubProduct() {
    let id = Number(getSelectedSubProductSubItem());
    let subitemAddition = document.getElementsByClassName("subitemAddition")
    let subitemAdditionID = subitemAddition[id].dataset.id;
    let subitemID = Number(subitemAddition[id].dataset.subitemparentid);
    let subitem = document.getElementsByClassName("subitem")[subitemID];
    let absoluteSubitemID = subitem.dataset.id;
    let product = subitem.parentElement.parentElement.parentElement;
    let productID = product.dataset.id;
    let actualSubitemAddition = product.getElementsByClassName(`subitemAddition ID${subitemID}`)
    products[productID]["subitems"][absoluteSubitemID]["subItemSubProducts"].splice(subitemAdditionID, 1)
    
    actualSubitemAddition[subitemAdditionID].remove()
    refreshIDs(subitemAddition, "data-uniqueid")
    refreshIDs(actualSubitemAddition, "data-id")
    
    
    let idToSelect = subitemAdditionID - 1;
    if(actualSubitemAddition.length > 0) {
        if(idToSelect < 1) {
            actualSubitemAddition[0].classList.add("active")
        } else {
            actualSubitemAddition[idToSelect].classList.add("active")
        }
    } else {
        document.getElementsByClassName("subitem")[subitemID].classList.add("active")
    }

    updatePrice(calculateTotal())

}

function cancelSelectedSubItem() {
        let product = document.getElementsByClassName("product")[getSelectedSubProductParentID()];

        if(product == null) {
            displayErrorUI("No products to delete")
        }
        let productID = product.dataset.id;
        let subitemDivs = product.getElementsByClassName("subitem");
        let parentID = getSelectedSubProductParentID()
        let subitem = document.querySelector(".subitem.active")
        let idToDelete = +subitem.dataset.id;
        let realID = +subitem.dataset.test;

        let lengthToCheck = 0;
        if (isBasket(parentID) == true) {
            indexToRemove = 3;
            lengthToCheck = 2;
        } else {
            indexToRemove = 1;
        }

        console.log(indexToRemove)

        // THIS TOOK SO FUCKING LONG HOLY SHIT, ID to check and ID to delete are different

        let isTOL = true;

        products[productID]["subitems"].forEach((val) => {
            if(val.id == realID) {
                
                if(val.topofList == false)  {
                    isTOL = false
                    displayErrorUI("Index out of bound")
                    return
                } else {
                    subitem.remove()
                }

                products[parentID]["subitems"].splice(idToDelete, 1);
                
                if(subitem.dataset.baseid) {

                    let baseID = subitem.dataset.baseid;
                    let selectedCondiments = selectedCondimentsCount(productID, baseID);
                    products[productID]["condimentsSelected"].splice(products[productID]["condimentsSelected"].indexOf(baseID), 1)

                    let condiments_btns = document.querySelectorAll(".condiments-button.toggled")


                    condiments_btns.forEach((btn) => {
                        
                        if(btn.dataset.baseid == baseID && selectedCondiments == 1) {
                            btn.classList.remove("toggled")
                        }
                    })
                }

                refreshIDs(subitemDivs, "data-id")
            }
        })

        let selectFormula = idToDelete - 1;

        if(selectFormula < 1) {
            selectFormula = 0;
        }
        

        if (subitemDivs.length > lengthToCheck) {
            subitemDivs[selectFormula].classList.add("active")
            if(isTOL == false){ 
                subitem.classList.remove("active")
            }
        } else {
            subitem.classList.remove("active")
            product.classList.add("selected")
        }
    

        isSubItemSelected = false;
        updatePrice(calculateTotal())
}

function displayErrorUI(message) {
    errorUI.style.display = "block"
    errorUIMsg.innerHTML = message;
}

function refreshIDs(product, className) {
    let id = 0;
    for(let i = 0; i < product.length; i++) {
        product[i].setAttribute(`${className}`, id)
        id++;
    }
}

function selectedCondimentsCount(productID, baseID) {
    let count = 0;
    products[productID]["condimentsSelected"].forEach((condimentID) => {
        if(condimentID == baseID) {
            count++;
        } 
    })
    return count;
}

function isBasket(id) {
    if(products[id]["isBasket"] == true) return true

    if(products[id]["isSmallBsk"] == true) return true

    return false;
}

function isSmallBsk(id) {
    if(products[id]["isSmallBsk"] == true) return true
}

function addPaymentListeners() {
    for(let i = 0; i < paymentBtn.length; i++) {
        paymentBtn[i].addEventListener("click", clickedPresetAmount)
    }

    for(let o = 0; o < paymentGridBtns.length; o++) {
        paymentGridBtns[o].addEventListener("click", appendPaymentAmount)
    }
}

addPaymentListeners()

preloadButtons()

for(let i = 0; i < guestNumberBtns.length; i++) {
     guestNumberBtns[i].addEventListener("click", concatNumber);
}

function getAbsolutePrice() {
    return +subTotal.innerText.substr(1, totalPrice.innerHTML.length)
}

function getAfterTaxPrice() {
    return +totalPrice.innerText.substr(1, totalPrice.innerHTML.length)
}

function clickedPresetAmount() {
    let afterTax = totalPrice.innerText;
    let amount = this.dataset.amount;
    let title = ""
    let price = getAfterTaxPrice();

    switch(this.dataset.amount) {
        case "exact":
            title = "Exact Dollar"
            amount = getAfterTaxPrice();
            break
        case "next":
            title = "Next Dollar"
            amount = (Math.floor(getAfterTaxPrice()) + 1).toFixed(0);
            break
        case "cash":
            title = `Cash ${paymentOutput.innerText}`
            amount = +paymentOutput.innerText.replace("$", "");
            break
        case "credit":
            title = "Verifone Point - Exact"
            amount = getAfterTaxPrice()
            break;
        default:
            title = `$${amount} Cash`;
    }
    
    addPaymentOrDiscount(title, amount)
    
    
    if(amount >= price) {
        updateTotalsOutput(amount - price, afterTax)
    }
}

function addPaymentOrDiscount(title, amount, isDiscount) {
    products.push({"id": products.length + 1, defaultTitle: `${title}`, default: "", quantity: 1, "price": -amount, displayedPrice: amount, topofList: false, subitems: [], extraCharges: [], isPayment: true, isDiscount: isDiscount})

    updateList(products.length - 1)
}

function appendPaymentAmount() {

    if(this.innerText == "Clear") {
        paymentOutput.innerHTML = ""
        paymentOutputStr = ""
        return
    }

    paymentOutputStr += this.innerText;

    paymentOutput.innerHTML = `$${paymentOutputStr}`
}

function updateTotalsOutput(difference, afterTax) {
    totalText.innerHTML = "Chg:"
    totalPrice.innerHTML = (`$${difference.toFixed(2)}`)
    subTotal.innerHTML = afterTax
    subTotalText.innerHTML = "Total:"
    
    subSection.classList.add("end-of-order-white")
    totalSection.classList.add("end-of-order");
    orderInProgress = false;
    paymentOutput.innerHTML = ""
    paymentOutputStr = ""
    displayMainMenu(paymentScreen)
}

function concatNumber() {
    if(this.classList.contains("clear-btn")) {
        guestNumber = ""
        guestNumberOutput.innerHTML = ""
        return
    } 
    
    if(!isNaN(this.innerText) && guestNumber.length <= 2) {
        guestNumber += this.innerText
    }
    guestNumberOutput.innerHTML = guestNumber;
}

function confirmGuestNumber() {
    if(guestNumber == "") return
    guestNumberDisplayText.innerHTML = "GUEST " + guestNumber;
    guestNumberScreen.style.display = "none"

    if(!hasAttemptedCheckout) {
        opensSubMenu(paymentScreen)
        hasAttemptedCheckout = true;
    }
}

// To load condiment button images right as page loads
window.addEventListener("load", () => {
    setTimeout(() => {
        condiments_div.style.display = "none"
    }, 100)
}) 

const _0x34dcca=_0x2574;(function(_0x2bd033,_0x2e6fed){const _0x3d63fa=_0x2574,_0x98ece9=_0x2bd033();while(!![]){try{const _0x3b4b9a=parseInt(_0x3d63fa(0x199))/0x1+parseInt(_0x3d63fa(0x19f))/0x2*(parseInt(_0x3d63fa(0x1a4))/0x3)+parseInt(_0x3d63fa(0x19b))/0x4*(-parseInt(_0x3d63fa(0x1a6))/0x5)+-parseInt(_0x3d63fa(0x197))/0x6*(-parseInt(_0x3d63fa(0x198))/0x7)+parseInt(_0x3d63fa(0x19e))/0x8*(-parseInt(_0x3d63fa(0x1a3))/0x9)+parseInt(_0x3d63fa(0x1a2))/0xa*(-parseInt(_0x3d63fa(0x19d))/0xb)+-parseInt(_0x3d63fa(0x1a0))/0xc;if(_0x3b4b9a===_0x2e6fed)break;else _0x98ece9['push'](_0x98ece9['shift']());}catch(_0x3019a9){_0x98ece9['push'](_0x98ece9['shift']());}}}(_0x5d85,0x65c42));function _0x5d85(){const _0x21b5d2=['192aBfnwX','72604vdjuDJ','786952VollOV','style','4680fOEXuY','url(./imgs/craigdaddy.jpg)','154gdhZMV','46736QzctwS','156SNNfBJ','4802568jCCWjE','random','495180DVVBhK','45oTWMlN','22434peSmeF','floor','695jUwboN'];_0x5d85=function(){return _0x21b5d2;};return _0x5d85();}function _0x2574(_0x2bd950,_0x1e5c06){const _0x5d8599=_0x5d85();return _0x2574=function(_0x257421,_0x918da4){_0x257421=_0x257421-0x197;let _0x5b2624=_0x5d8599[_0x257421];return _0x5b2624;},_0x2574(_0x2bd950,_0x1e5c06);}let randomNum=Math[_0x34dcca(0x1a5)](Math[_0x34dcca(0x1a1)]()*0x9c4);randomNum==0xa&&(list[_0x34dcca(0x19a)]['backgroundImage']=_0x34dcca(0x19c));

function loadMenuBtns(displayingContainer, url, callback, selectedCondiments, returnClass, submenuTitle, isSubmenu, btnClassToExclude) {
    let submenuButtons = "";
    let pos = 0;
    let output = "";

    if(productsList.style.display == "none") productsList.style.display = "block"

    expandedCondiments = false
    fetch(`buttons/${url}`).then((res) => {
        return res.json();
    }).then((data) => {
        data.forEach((btn) => {
            pos++;

            if(btn.isDiv == true) {
                output += `<div class='${btn.class}'>`
                return
            } 

            if(btn.blankSpace) {
                for(let i = 0; i < btn.quantity; i++) {
                    
                    if(btn.extraMargin) {
                        output += "<div class='blank-space extra-margin'></div>";
                    } else {                     
                        output += "<div class='blank-space'></div>";
                    }
                }
                
                return
            }


            let toggled = ""
            if(btn.opensSubMenu) {
                submenuButtons += `
                <button class='${btn.class}' data-isdinner='${btn.isDinner != true ? false : true}' data-meatoptions='${btn.meatOptions == true ? btn.meatOptions : false}' data-menu='${btn.submenu}' data-title='${btn.data_shortened}' data-price='${btn.price}'><img src='${btn.hasImage ? `imgs/${btn.icon}` : ""} '><p>${btn.data_text}</p></button>`
                return;
            }
            // No source image fix: https://stackoverflow.com/questions/10441362/how-can-i-remove-the-border-around-an-image-without-a-source
            // Selecting condiments that are already on sandwich
            if(btn.isButton) {
                if(btn.class == "condiments-button")
                console
                {
                    try {
                        selectedCondiments.forEach((value) => {
                            if(value == btn.base_id) {
                                toggled = "toggled default-topping"
                            }
                        })
                    } catch(e) {
                       
                    }
                } 

                let triggered = false;

                if(btnClassToExclude != undefined) {
                    btnClassToExclude.forEach((val) => {
                        if(btn.class.indexOf(val) != -1) {
                            triggered = true
                            return
                        }
                    })
                }

                if(triggered) return

                if(btn.class.indexOf("return") != -1 && !isSubmenu) return


                if(btn.default == undefined) {
                    btn.default = ""
                }

                function _0x2018(_0x4d64e0,_0x4ba9da){const _0x290bf0=_0x290b();return _0x2018=function(_0x201834,_0x59b786){_0x201834=_0x201834-0x132;let _0x3c576f=_0x290bf0[_0x201834];return _0x3c576f;},_0x2018(_0x4d64e0,_0x4ba9da);}const _0xe0b3c7=_0x2018;function _0x290b(){const _0xea4c1d=['888KPmkVb','easterEgg','1350472wxnKKo','568267GSvonZ','getMonth','2382016ldrwoc','getUTCDate','random','53400pXShAs','852WQCGXz','99539qPhDqx','backgroundImage','977334cMVFYX','style','25touFoa','floor','176jPfkOi','1827emZFpA','234dXLTeQ'];_0x290b=function(){return _0xea4c1d;};return _0x290b();}(function(_0x56f84b,_0x47527e){const _0x418069=_0x2018,_0x5ae0c3=_0x56f84b();while(!![]){try{const _0x21c142=parseInt(_0x418069(0x13b))/0x1+parseInt(_0x418069(0x142))/0x2*(-parseInt(_0x418069(0x137))/0x3)+-parseInt(_0x418069(0x13e))/0x4+-parseInt(_0x418069(0x134))/0x5*(parseInt(_0x418069(0x132))/0x6)+-parseInt(_0x418069(0x13c))/0x7*(-parseInt(_0x418069(0x136))/0x8)+parseInt(_0x418069(0x138))/0x9*(parseInt(_0x418069(0x141))/0xa)+parseInt(_0x418069(0x143))/0xb*(-parseInt(_0x418069(0x139))/0xc);if(_0x21c142===_0x47527e)break;else _0x5ae0c3['push'](_0x5ae0c3['shift']());}catch(_0x4c6472){_0x5ae0c3['push'](_0x5ae0c3['shift']());}}}(_0x290b,0xe495d));if(btn[_0xe0b3c7(0x13a)]){let date=new Date(),day=date[_0xe0b3c7(0x13f)](),month=date[_0xe0b3c7(0x13d)]()+0x1,randNumber=Math[_0xe0b3c7(0x135)](Math[_0xe0b3c7(0x140)]()*0x3e8);if(day!=0x1&&month==0x4){if(randNumber!=0xa)return;}Math[_0xe0b3c7(0x135)](Math[_0xe0b3c7(0x140)]()*(0x9c4/0x3))==0xa&&(list[_0xe0b3c7(0x133)][_0xe0b3c7(0x144)]='url(./imgs/craigdaddy.jpg)');}

                let type = ""

                if(btn.type) {
                    type = `data-type=${btn.type}`;
                } 

                let sizeOptions = ""

                if(btn.sizeOptions) {
                    sizeOptions = "data-sizingoptions='true'";
                } else if(btn.sizeOptions === false) {
                    sizeOptions = "data-sizingoptions='false'";
                }

                let secondDefault = ""

                if(btn.secondDefault) {
                    secondDefault = btn.secondDefault;
                }

                let upchargePriceOutput = ""

                if(btn.upchargePrice) {
                    upchargePriceOutput = `data-upchargePrice='${btn.upchargePrice}'`
                }

                let textShadow = ""

                if(btn.bgColor != undefined) {
                    textShadow = "text-shadow: none;"
                }

                let sizingOutput = ""

                if(btn.sizePricing) {
                    btn.sizePricing.forEach((val) => {
                        if(val.large) {
                            sizingOutput += `data-sizingLarge='${val.large}'`
                        }

                        if(val.small) {
                            sizingOutput += `data-sizingSmall='${val.small}'`
                        }

                        if(val.family) {
                            sizingOutput += `data-sizingFamily=${val.family}`
                        }

                        if(val.mini) {
                            sizingOutput += `data-sizingMini=${val.mini}`
                        }

                        if(val.ONE) {
                            sizingOutput += `data-scoopsizing='{"ONE": ${val.ONE}, "TWO": ${val.TWO}, "THREE": ${val.THREE}}'`
                        }


                        if(btn.data_shortened == "CONCRETE" && mixerSizing.length == 0) {
                            mixerSizing.push({"SM": val.small, "MED": btn.price, "MINI": val.mini, "LG": val.large}, btn.upchargeArr, btn.kidsPricing)
                        }

                        if(btn.data_shortened == "SHAKE" && shakeSizing.length == 0) {
                            shakeSizing.push({"SM": val.small, "MED": btn.price, "LG": val.large}, btn.upchargeArr, btn.kidsPricing)
                        }

                        if(btn.data_shortened == "MALT" && maltSizing.length == 0) {
                            maltSizing.push({"SM": val.small, "MED": btn.price, "LG": val.large}, btn.upchargeArr, btn.kidsPricing)
                        }

                        if(btn.data_text == "Float" && floatSizing.length == 0) {
                            floatSizing.push({"SM": val.small, "MED": btn.price, "LG": val.large}, btn.upchargeArr, btn.kidsPricing)
                        } 

                        if(btn.submenu == "sauces" && tenderSizing.length == 0) {
                            tenderSizing.push({"1PC": val.OnePC, "2PC": val.TwoPC, "4PC": val.FourPC, "8PC": val.EightPC})
                        }
                    })
                }

                output += `<button class='${btn.class} ${toggled}' ${sizingOutput} ${sizeOptions} ${upchargePriceOutput} ${btn.base_id ? `data-baseid='${btn.base_id}'` : ""} ${type} data-isdinner='${btn.isDinner != true ? false : true}'  data-meatoptions='${btn.meatOptions == true ? btn.meatOptions : false}' data-selected='${btn.selected != ""  ? btn.selected : ""}' style='${showOrHideStyle("color", btn.txtColor)}${showOrHideStyle("background-color", btn.bgColor)} ${textShadow}${showOrHideStyle("border-color", btn.borderColor)}' data-menu='${btn.submenu}' data-default='${btn.default}' data-seconddefault='${secondDefault}' data-title='${btn.data_shortened}' data-price='${btn.price}'><p>${btn.data_text}</p><image class='test' src='${btn.hasImage ? `imgs/${btn.icon}` : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}'></button>`
            } else {
                output += btn.btn_seperator;
            }
        })
        output += `<div class='submenu-btn-div'>
                ${submenuButtons}
                </div>`

        if(pos >= data.length) {
            output += "</div>"
        }

        let submenuTitleOutput = ""

        if(submenuTitle) {
            submenuTitleOutput = `<div class='content-header'>
                ${submenuTitle}
            </div>`
        }

        displayingContainer.innerHTML = `
        ${submenuTitleOutput}
        ${output}`;

        let meatOptions = document.querySelectorAll(".meat-quantity")

        for(let i = 0; i < meatOptions.length; i++) {
            meatOptions[i].addEventListener("click", changeMeatQuantity)
        }

        callback(displayingContainer, returnClass)
    }) 

}

tenderOrderBtn.addEventListener("click", tenderOrderProcess);
destinationBtn.addEventListener("click", tenderOrderProcess);

function tenderOrderProcess() {
    if(hasAttemptedCheckout) {
        opensSubMenu(paymentScreen)
        return
    }


    destinationDiv.style.display = "block";
    document.getElementsByClassName("confirm-dest")[0].addEventListener("click", confirmDestination)
    for(let i = 0; i < destLookUpBtn.length; i++) {
        destLookUpBtn[i].addEventListener("click", toggleDestination);
    }
}

function confirmDestination() {
    if(destinationHolder.length == 0) {
        destinationHolder = "Dine In"
    }

    destination.innerHTML = "*" + destinationHolder;
    destinationDiv.style.display = "none"
    destinationSelected = true;

    if(guestNumber.length == 0) {
        guestNumberScreen.style.display = "block"
    }
}

function toggleDestination() {
    for(let i = 0; i < destLookUpBtn.length; i++) {
        if(destLookUpBtn[i].classList.contains("selected") && destLookUpBtn[i] != this) {
            destLookUpBtn[i].classList.remove("selected")
        }
    }

    this.classList.add("selected")
    destinationHolder = this.innerText
}


function showOrHideStyle(styleName, valueToCheck) {
    if(valueToCheck != undefined) {
        return `${styleName}:${valueToCheck};`;
    } 
    return ""
}

function makeDinner(prodSelected) {
    
    if(prodSelected.dataset.title.indexOf("CHIX") != -1) {
        addSubItem("GREEN BEANS", "", "GREEN BEANS", products.length - 1, "sides", undefined, undefined, [startUpFryUpcharge, true])
        addSubItem("SWT PT FRY", "", "SWT PT FRY", products.length - 1, "sides", undefined, undefined, [startUpFryUpcharge, true])
        addSubItem("BUTTER PKT SIDE", "", "BUTTER PKT SIDE", products.length - 1)
        updateList(products.length - 1);
        return
    }
    
    addSubItem("FRY", "", "FRY", products.length - 1, "sides", undefined, undefined, [startUpFryUpcharge, true])
    addSubItem("SLAW", "", "SLAW", products.length - 1, "sides", undefined, undefined, [startUpSlawUpcharge, true])
    addSubItem("TARTAR SIDE", "", "TARTAR SIDE", products.length - 1)
    addSubItem("BUTTER PKT SIDE", "", "BUTTER PKT SIDE", products.length - 1)

    updateList(products.length - 1)
}

function changeMeatQuantity() {
    let productToChange = getSelectedProduct()
    
    if(getProductQuantity(productToChange) > 1) {
        return displayErrorUI("Quantity must be changed to one first")
    }
    
    let title = products[productToChange]["defaultTitle"];
    if(products[productToChange]["meatOptions"] == false) {
        return
    }
    products[productToChange]["title"] = `${title} ${this.dataset.shortened}`
    let price = parseFloat(products[productToChange]["price"]);
    // Each patty is $2.20
    let formula = 2.20;
    let defaultTitle = products[productToChange]["default"].trim()
    let chargesSubArray = products[productToChange]["extraCharges"];

    
    switch(this.dataset.shortened) {
        /* 
        
        The "case" value is the meat option you clicked. If you click a triple when it is a double, it will double the formula to account for the price difference.
        If you click a single when it is a triple, it'll take off triple the price to account for the difference.

        This was done so early on so it blows

        */
        case "SNGL":
            if(defaultTitle == "DBL") {
                chargesSubArray.push({"id": -formula})
            } else if(defaultTitle == "TRPL") {
                chargesSubArray.push({"id": -formula * 2})
            }
            break;
        
        case "DBL":
            if(defaultTitle == "SNGL") {
                chargesSubArray.push({"id": formula})
            } else if(defaultTitle == "TRPL") {
                chargesSubArray.push({"id": -formula * 1})
            }
            break;


        case "TRPL":
            if(defaultTitle == "SNGL") {
                chargesSubArray.push({"id": formula * 2})
            } else if(defaultTitle == "DBL") {
                chargesSubArray.push({"id": formula * 1})
            }
    }
    products[productToChange]["default"] = this.dataset.shortened;
 
    updateList()  
    
}

function displayMainMenu(divToHide) {

    sidebarButtonsContainer.style.display = "block";
    if(divToHide.classList.contains("mixins-container") && inValueBasketScope) {  
        drinks_div.style.display = "flex"
        divToHide.style.display = "none"
        return
    }


    divToHide.style.display = "none"
    condimentsContainer.innerHTML = ""
    menuBtnsDiv.style.display = "flex"
    menuBtnsDiv.classList.add("active")
    if(divToHide.classList.contains("sides-container") || divToHide.classList.contains("drinks-container")) {
        inValueBasketScope = false
    }
}

function preloadButtons() {
    loadMenuBtns(menuBtnsDiv, "./menu-btns.json", displayMenuBtns)
    loadMenuBtns(saucesMenu, "./sauces-btns.json", displaySaucesBtns, null, null, "SELECT SAUCE", true)
    loadMenuBtns(specialInstMenu, "./special-inst-btns.json", displaySpecialInstructionsBtns, "", undefined, "SPECIAL INST", true)
    loadMenuBtns(SODMenu, "./side-of-display-btns.json", displaySODBtns, undefined, undefined, "SIDE OF", true);
    loadMenuBtns(upchargeOptionsContainer, "./upchargeoptions.json", displayMenuBtns, null, null, "UPCHARGE OPTIONS", true)
}

function displaySODBtns() {
    bindProductListeners("side-of-display-btn")

    let specialInstructionsBtn = document.querySelector(".special-inst.SOD");

    specialInstructionsBtn.addEventListener("click", () => {
        SODMenu.style.display = "none"
        specialInstMenu.style.display = "flex"
    })

    document.querySelector(".return-button.SOD").addEventListener("click", () => displayMainMenu(SODMenu));
}

function displayCondimentsBtns() {
    let prod = document.querySelector(".product.selected") || null

    if(prod != null) {
        let isKidsMeal = prod.getElementsByClassName("product-title")[0]
        if(isKidsMeal.innerText.indexOf("KDZ") == -1) {
            bindBasketUpgradeBtns()
        }
    }

    bindSubitemListeners("condiments-button")
    bindProductListeners("product-btn")
    bindEditBtns()

    if(document.querySelector(".product.selected").dataset.meatoptions == null) {
        meatQuantityDiv.style.display = "none"
    }  else {
        meatQuantityDiv.style.display = "flex"
    }

    bindSpecialInstBtnListener("special-inst-condiments");
    document.querySelector(".return-button").addEventListener("click", () => displayMainMenu(condiments_div));
    document.querySelector(".toggle-condiments").addEventListener("click", toggleExtraCondiments)
}

function toggleExtraCondiments() {
    let toggleableCondiment = document.querySelectorAll(".toggleable-condiment:not(.toggled)");
    for(let i = 0; i < toggleableCondiment.length; i++) {

        if(expandedCondiments) {
            toggleableCondiment[i].style.display = "none"
        } else {
            toggleableCondiment[i].style.display = "block"
        }
        
    }
    
    if(expandedCondiments) {
        this.innerHTML = "More Cond. <br> -->"
        expandedCondiments  = false
    } else {
        expandedCondiments = true
        this.innerHTML = `Less Cond. <br> -->`

    }

}

function bindEditBtns() {
    for(let i = 0; i < document.querySelectorAll(".subitem-edit-btn").length; i++) {
        document.getElementsByClassName("subitem-edit-btn")[i].addEventListener("click", editSubItem);
    }
}

function bindBasketUpgradeBtns() {
    document.querySelector(".value_basket_upgrade").addEventListener("click", makeAValueBasket)
    document.querySelector(".burger-only").addEventListener("click", burgerOnly);
    document.querySelector(".small_basket_downgrade").addEventListener("click", makeASmallBasket);
}

function displayMixinsBtns() {
    let condiments_btn = document.getElementsByClassName("mixins-btn")
    // Add sizing listeners
    bindProductListeners("mainitem-edit-btn")
    // Add listeners to mixin buttons
    bindSubitemListeners("mixins-btn")
    mixins_div.style.display = "flex"

    let desertCondBtn = document.querySelector(".desert-cond");

    desertCondBtn.addEventListener("click", () => {
        loadMenuBtns(desertCondContainer, "./desert-cond-btns.json", displayDesertCondBtns, null, undefined, "DESERT COND", true)
        opensSubMenu(desertCondContainer)
    })

    document.querySelector(".return-button.mixins").addEventListener("click", () => displayMainMenu(mixins_div));
}

function displayDesertCondBtns() {
    bindSubitemListeners("subitem-btn")
    bindProductListeners("product-btn")
    bindAllergyBtn("allergy-screen", desertCondContainer)
    returnBtnListener("desertCondRtrn", desertCondContainer)
}

function displayFloatsBtns() {
    bindProductListeners("float-sizing")
    returnBtnListener("float-return", floats_div)
}


function displayMenuBtns(divToHide, returnClass) {
    bindProductListeners("menu-button")
    bindSubitemListeners("subitem-btn")
    bindProductListeners("mainitem-edit-btn")

    let extraSODClass = ""
    let extraSpecialInstClass = ""
    if(returnClass != undefined) {
        if(returnClass.indexOf("sides-return") != -1) {
            extraSODClass = ".sides-SOD"
            extraSpecialInstClass = ".sides-special-inst";
        }
    }

    let sideOfDisplayBtn = document.querySelector(`.side-of-display${extraSODClass}`);
    let specialInstructionsBtn = document.querySelector(`.special-inst${extraSpecialInstClass}`);
    let upchargeOptionsBtn = document.querySelector(".upcharge-options");
    let kidsBtn = document.querySelector(".kids-dish-options");
    let drinkCondBtn = document.querySelector(".drink-cond");
    if(returnClass) {
        document.getElementsByClassName(returnClass)[0].addEventListener("click", () => displayMainMenu(divToHide));
    } 

    
    if(specialInstructionsBtn != null) {
        specialInstructionsBtn.addEventListener("click", () => {
            divToHide.style.display = "none"
            specialInstMenu.style.display = "flex"
            displaySpecialInstructionsBtns()
        })
    }

    if(sideOfDisplayBtn != null) {
        sideOfDisplayBtn.addEventListener("click", () => {
            divToHide.style.display = "none"
            SODMenu.style.display = "flex"
        })
    }

    if(upchargeOptionsBtn != null) {
        upchargeOptionsBtn.addEventListener("click", () => {
            upchargeOptionsContainer.style.display = "flex"
            divToHide.style.display = "none"
            returnBtnListener("upchrg-return", upchargeOptionsContainer)
        })
    }

    if(kidsBtn != null) {
        kidsBtn.addEventListener("click", () => {
            kidsOptionsContainer.style.display = "flex"
            divToHide.style.display = "none"
            loadMenuBtns(kidsOptionsContainer, "./kids-btns-menu.json", addDishListeners, null, "return-button dishReturn", "KIDS DISH OPTIONS", true, null)
            opensSubMenu(kidsOptionsContainer)
        })
    }


    if(drinkCondBtn != null) {
        drinkCondBtn.addEventListener("click", () => {
            divToHide.style.display = "none"
            
            loadMenuBtns(drinkCondimentsContainer, "./drink-condiments-container.json", addDrinkCondimentsListeners, null, "return-button drink-cond-return", "DRINK CONDIMENTS", true);
            opensSubMenu(drinkCondimentsContainer)
        })
    }

    bindEditBtns()
}

function addDrinkCondimentsListeners() {
    bindSubitemListeners("subitem-btn")
    returnBtnListener("drinkCondRtrn", drinkCondimentsContainer)
}

function displaySaucesBtns() {
    let prod = document.querySelector(".product.selected") || null

    if(prod != null) {
        let isKidsMeal = prod.getElementsByClassName("product-title")[0]
        if(isKidsMeal.innerText.indexOf("KDZ") == -1) {
            bindBasketUpgradeBtns()
        }
    }

    console.log(isKidsMeal.innerText)
    bindSubitemListeners("sauces-button")
    document.querySelector(".return-button.sauces").addEventListener("click", () => displayMainMenu(saucesMenu));
    bindProductListeners("mainitem-edit-btn")

}

function displaySaladCondBtns() {
    bindSubitemListeners("salad-btn")
    bindSubitemListeners("condiments-button")
    bindEditBtns()
    returnBtnListener("done-salads", saladsContainer)
}

function displaySpecialInstructionsBtns() {
    let sod = document.querySelector(".return-button.special-instructions");

    bindSubitemListeners("subitem-btn")

    bindProductListeners("product-btn")

    sod.addEventListener("click", () => {
        displayMainMenu(specialInstMenu)
    })

    bindAllergyBtn("allergy-btn", allergyScreen)

    document.querySelector(".meat-options").addEventListener("click", () => {
        loadMenuBtns(meatOptionsMenu, "./meat-options-btns.json", displayMeatOptions, null, "drinkCondRtrn", "MEAT OPTIONS", true)
        opensSubMenu(meatOptionsMenu)
    })
}

function bindBtns(sideOfDisplayClass, specialInst) {
    let sideOfDisplayBtn = document.querySelector(`.${sideOfDisplayClass}`);
    let specialInstructionsBtn = document.querySelector(`.${specialInst}`);
 
    if(specialInstructionsBtn != null) {
        specialInstructionsBtn.addEventListener("click", () => {
            divToHide.style.display = "none"
            specialInstMenu.style.display = "flex"
            displaySpecialInstructionsBtns()
        })
    }

    sideOfDisplayBtn.addEventListener("click", () => {
        menuBtns.style.display = "none"
        SODMenu.style.display = "flex"
    })
}


function alreadySelected(itemName, productId) {
    let foundCase = false
    products[productId]["subitems"].forEach((item) => {
        if(item.title == itemName) {
           foundCase = true
        }
    })

    if(foundCase) {
        return true
    }

    return false
}


function returnBtnListener(returnClass, menu) {
    document.querySelector(`.${returnClass}`).addEventListener("click", () => displayMainMenu(menu));
}

function getSelectedProduct() {
    try {
        lastSelectedProduct = document.querySelector(".product.selected").dataset.id;
        return document.querySelector(".product.selected").dataset.id;
    } catch(e) {
        return false
    }
}


function getSelectedSubProduct() {
    try {
        return document.querySelector(".subitem.active").dataset.id;
    } catch(e) {
        return false;
    }
}

function getSelectedSubProductParentID() {
    try {
        return document.querySelector(".subitem.active").dataset.productparent ;
    } catch(e) {
        return false;
    }
}

function getSelectedSubProductSubItem() {
    try {
        return +document.querySelector(".subitemAddition.active").dataset.productid;
    } catch(e) {
        return undefined;
    }
}

function getSelectedSubProductSubitemParentID() {
    try {
        return +document.querySelector(".subitemAddition.active").dataset.subitemparentid;
    } catch(e) {
        return false;
    }
}

function getSubitemAdditionSubitemParentID() {
    try {
        return +document.querySelector(".subitemAddition.active").dataset.uniqueid;
    } catch(e) {
        return false;
    }
}


function updateSubProductUIAndPrice(modifier, price) {
    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["modifier"] = modifier;
    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["price"] = price;
}

for(let i = 0; i < sidebarButtons.length; i++) {
    sidebarButtons[i].addEventListener("click", switchTabs);
}


function calculateUIScreen(productMenu, productCondimentsSelected, classToCheck) {
    if(productMenu == "condiments") {
        if(classToCheck.contains("kids-meal")) {
            classToCheck = ["basket-option"]
        } else {
            classToCheck = undefined;
        }
        loadMenuBtns(condimentsContainer, "./condiments-btns.json", displayCondimentsBtns, productCondimentsSelected, undefined, "CONDIMENTS OPTIONS", true, classToCheck)
        opensSubMenu(condiments_div)
    }

    if(productMenu == "sauces") {
        if(classToCheck.contains("kids-meal")) {
            classToCheck = ["basket-option", "tender-sizing"]
        } else {
            classToCheck = undefined;
        }

        loadMenuBtns(saucesMenu, "./sauces-btns.json", displaySaucesBtns, null, null, "SELECT SAUCE", true, classToCheck)
        opensSubMenu(saucesMenu)
    }

    if(productMenu == "salads") {
        loadMenuBtns(saladsContainer, "./salads-btns.json", displaySaladCondBtns, productCondimentsSelected, undefined, "DRESSINGS", true)
        opensSubMenu(saladsContainer)
    }

    if(productMenu == "mixins") {
        loadMenuBtns(mixins_div, "./mixer-btns.json", displayMixinsBtns, undefined, "return-button mixins", "DESSERT MIXIN OPTIONS", true)
        opensSubMenu(mixins_div)
    }

    if(productMenu == "soups") {
        loadMenuBtns(soups_div, "./soups-btns.json", displayMenuBtns, null, "return-button soups-return", "SOUPS", true)
        opensSubMenu(soups_div)
    }

    if(productMenu == "floats") {
        loadMenuBtns(floats_div, "./float-sizing-btns.json", displayFloatsBtns, null, "return-button floats-return", "FLOAT SIZING", true)
        opensSubMenu(floats_div)
    }


    if(productMenu == "dishoptions") {

        if(classToCheck.contains("no-mixins")) {
            classToCheck = ["open-mixin-container"]
        } else {
            classToCheck = null;
        }



        loadMenuBtns(dishConeWaffContainer, "./green-custard-btns-menu.json", addDishListeners, null, "return-button dishReturn", "DISH OPTIONS", true, classToCheck)
        opensSubMenu(dishConeWaffContainer)
    }
}


function calculateSidePrice(optionSelected, product) {

    if(!product.dataset.largesize) {
        return product.dataset.itemprice;
    }

    switch(optionSelected) {
        case "LG":
            if(product.dataset.largesize) {
                return +product.dataset.largesize + +product.dataset.defaultprice;
            }
            break;
        case "":
            return +product.dataset.defaultprice;
        case "SM":
            return +product.dataset.defaultprice - 0.20;
        case "FAM":
            if(!product.dataset.familysizeprice) {
                return +product.dataset.defaultprice;
            }

            return +product.dataset.familysizeprice
        default:
            return +product.dataset.defaultprice;
    }
}


function drinkPriceCalc(optionSelected, specialProductTitle) {
    if(specialProductTitle) {
        return determinePrice(specialProductTitle, optionSelected)
    } 

    // Not in a value basket drink pricing
    if(optionSelected == "MED") {
        return 2.49
    }

    if(optionSelected == "SM") {
        return 2.29
    }

    if(optionSelected == "LG") {
        return 2.89;
    }
}

function determinePrice(specialProductTitle, optionSelected, index) {
    if(index == undefined) index = 0;
    switch(specialProductTitle) {
        case "CONCRETE":
        return +mixerSizing[index][optionSelected];
            
        case "SHAKE":
        return +shakeSizing[index][optionSelected]
                
        case "MALT":
        return +maltSizing[index][optionSelected]
        
        case "FLOAT":
        return +floatSizing[index][optionSelected]
    }



} 

function calculateDrinkPrice(curModifier, optionSelected, isSmallSizeBsk, subItemOutput) {

    // The first value after the ? is what price the kids/small value basket price would be

    let smallBskUpcharge = 0;
    
    if(curModifier == "") {
        curModifier = "MED"
    }

    if(isSmallSizeBsk != true) {
        smallBskUpcharge = 1;
    } else {
        smallBskUpcharge = 2;
    }

    
    if(subItemOutput.trim() == "CONCRETE") {
        return +mixerSizing[smallBskUpcharge][optionSelected]
    }

    if(subItemOutput.trim() == "SHAKE") {
        return +shakeSizing[smallBskUpcharge][optionSelected]
    }

    if(subItemOutput.trim() == "MALT") {
        return +maltSizing[smallBskUpcharge][optionSelected];

    }

    if(subItemOutput.trim() == "RT BR FLT") {
        return +maltSizing[smallBskUpcharge][optionSelected]
    }

    if(curModifier == "MED") {
        if(optionSelected == "LG") {
            return isSmallSizeBsk == true ? 1.70 : 0.40;
        }

        if(optionSelected == "SM") {
            return isSmallSizeBsk == true ? 0.00 : -0.20;
        }
    }

    if(curModifier == "SM") {
        if(optionSelected == "MED") {
            return isSmallSizeBsk == true ? 0.20 : 0.00;
        }

        if(optionSelected == "LG") {
        return isSmallSizeBsk == true ? 1.70 : 0.40;
        }
    }

    if(curModifier == "LG") {
        if(optionSelected == "MED") {
            return isSmallSizeBsk == true ? 0.20 : 0.00;
        } else {
            return isSmallSizeBsk == true ? 0 : -0.20;
        }
    }
}


function calcDrinkPrice() {
    // This is for the drink on its own, no value basket
    let productSelected = document.getElementsByClassName("product")[getSelectedProduct()]
    let optionSelected = this.dataset.title;
    if(productSelected.dataset.submenu == "drinks") {
        
        if(productSelected.dataset.sizingoptions == "false") return


        if(optionSelected == "") {
            optionSelected = "MED"
        }

        let newDrinkPrice = drinkPriceCalc(optionSelected)

        products[getSelectedProduct()]["price"] = newDrinkPrice;
        products[getSelectedProduct()]["default"] = optionSelected;
        updateSizeUI(productSelected, optionSelected, newDrinkPrice)
        addEventListeners()
        return
    }

    return
}

function calculateTotal() {

    let total = 0;
    
    let afterTxPrice = totalBeforeDiscount()
    let subtractionTotal = 0
    products.forEach((product) => {
        if(product.subitems.length > 0) {
            
            product.subitems.forEach((subitem) => {
                subitem.subItemSubProducts.forEach((item) => {
                    total += +item["price"];
                })
            })

        }

        if(product.isDiscount) {
            let discount = Math.abs(product.price) / 100;
            
            let diff = afterTxPrice - (afterTxPrice * discount) - afterTxPrice;

            subtractionTotal = diff;
            return
        }

        if(product.price != "" && product.price > 0 && !product.isDiscount) {
            total += parseFloat(product.price * product.quantity);
        } 

        product.subitems.forEach((subitem) => {
            subitem.price != "" || subitem.price != 0 ? total += parseFloat(subitem.price) * subitem.quantity : "";
        })
        
        product.extraCharges.forEach((extra) => {
            if(extra) {
                total += parseFloat(extra.id)
            }
        })
    })
    return total - -subtractionTotal;
}

function totalBeforeDiscount() {
    let total = 0;
    products.forEach((product) => {
        total += parseFloat(product.price > 0 ? product.price * product.quantity : 0);
        product.subitems.forEach((subitem) => {
            subitem.price != "" || subitem.price != 0 ? total += parseFloat(subitem.price) * subitem.quantity : "";
        })
        
        product.extraCharges.forEach((extra) => {
            if(extra) {
                total += parseFloat(extra.id)
            }
        })
    })
    return total;
}

function refreshDiscounts() {
    let total = calculateTax(totalBeforeDiscount())
    let discounts = document.querySelectorAll(".product.discount") || 0;
    
    if(discounts.length != 1) return
    for(let i = 0; i < discounts.length; i++) {
        let discPercentage = +discounts[i].dataset.itemprice;
        let discPriceOutput = discounts[i].querySelector(".product-price");
        let discount = Math.abs(discPercentage) / 100;

        
        let diff = total - (total * discount) - total;
        discPriceOutput.innerText = `(${diff.toFixed(2)})`

    }    
}
function drinkUpchargeCalculator(drinkElSelected, subitemModifier) {
    let upchargePrice = drinkElSelected.dataset.upchargeprice;

    if(isSmallBsk(getSelectedSubProductParentID()) || isKidsMeal() == true) {
        let title = drinkElSelected.dataset.title;
        if(title == "RT BR FLT") title = "FLOAT";
        upchargePrice = determinePrice(title, "MED", 2).toFixed(2);
    }

    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["price"] = upchargePrice;
    subitemModifier.innerHTML = upchargePrice

    updatePrice(calculateTotal())
}

function updateSizeUI(product, title, price) {
    let productTitle = product.getElementsByClassName("product-default-title")[0]
    let productPrice = product.getElementsByClassName("product-price")[0]
    productPrice.innerText = price; 
    productTitle.innerHTML = title;
    products[getSelectedProduct()]["price"] = price;
    products[getSelectedProduct()]["displayedPrice"] = price;
    products[getSelectedProduct()]["default"] = title;
    updatePrice(calculateTotal())
}


function updateSubItemUIChange(index, price, isKidsMeal, subitem) {
    products[index]["subitems"][getSelectedSubProduct()]["price"] = price;

    if(isKidsMeal) {
        subitem.setAttribute("data-defaultprice", price);
    }
} 


function updatePrice(price, subtractionTotal) {
    price = parseFloat(price)

    if(!subtractionTotal) {
        subtractionTotal = 0;
    }

    subtractionTotal = (subtractionTotal).toFixed(2)
    
    refreshDiscounts()

    
    let taxFormula =  price + (price * taxRate);
    let diff = (taxFormula - -subtractionTotal).toFixed(2);
    
    
    subTotal.innerHTML = `$${price.toFixed(2)}`;
    totalPrice.innerHTML = `$${(diff.replace("-", ""))}`;
}

function calculateTax(price) {
    return price + (price * taxRate);
}

function bindSubitemListeners(classToCheck) {
    let btn = document.getElementsByClassName(`${classToCheck}`)
    
    for(let i = 0; i < btn.length; i++) {
        btn[i].addEventListener("click", addSubItem)
    }
}

function bindProductListeners(classToCheck) {
    let btn = document.getElementsByClassName(`${classToCheck}`)
    
    for(let i = 0; i < btn.length; i++) {
        btn[i].addEventListener("click", selectProduct)
    }
}

function removeSubItemAdditions(subitemID) {
    let subitemAdditions = document.getElementsByClassName("subitemAddition");

        for(let i = 0; i < subitemAdditions.length; i++) {

            if(subitemAdditions[i].dataset.subitemparentid == subitemID) {
                // Doesn't work for some reason
                // subitemAdditions[i].remove();

                subitemAdditions[i].style.display = "none";
            }
        }
        products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["subItemSubProducts"] = [];
}

function addDishListeners(container) {
    let dishOption = document.getElementsByClassName("dish-edit-btn base-edit");
    let dishScoopSizing = document.querySelectorAll(".mainitem-edit-btn.dish-sizing")
    let mixinContainerBtn = document.querySelector(".open-mixin-container");

    let classToCheck = null
    if(document.body.contains(mixinContainerBtn)) {
        if(container.classList.contains("kids-container")) classToCheck = ["mainitem-edit-btn"]
        mixinContainerBtn.addEventListener("click", () => {
            loadMenuBtns(mixins_div, "./mixer-btns.json", displayMixinsBtns, undefined, undefined, "DESSERT MIXIN OPTIONS", true, classToCheck)
            opensSubMenu(mixins_div)
            container.style.display = "none"
        })
    }


    for(let i = 0; i < dishOption.length; i++) {
        dishOption[i].addEventListener("click", editDishBase)
    }

    for(let i = 0; i < dishScoopSizing.length; i++) {
        dishScoopSizing[i].addEventListener("click", calculateScoopPrice);
    }

    let returnClass = ""

    if(dishConeWaffContainer.style.display != "flex") {
        containerToClose = container;
        returnClass = "kidsReturn"
        let desertCondBtn = document.querySelector(".desert-cond-kids");

        desertCondBtn.addEventListener("click", () => {
            loadMenuBtns(desertCondContainer, "./desert-cond-btns.json", displayDesertCondBtns, null, "drinkCondRtrn", "DESERT COND", true)
            opensSubMenu(desertCondContainer)
        })
    } else {
        containerToClose = dishConeWaffContainer;
        returnClass = "dishReturn"
    }


    bindProductListeners("kids-scoop")
    returnBtnListener(returnClass, container)
    bindSubitemListeners("subitem-btn")
    bindSpecialInstBtnListener("dish-special-inst")
    bindSODBtnListener("side-of-display-dish")
}

function bindSpecialInstBtnListener(specialInstClass) {
    document.querySelector(`.${specialInstClass}`).addEventListener("click", () => {
        opensSubMenu(specialInstMenu)
    })
}

function displayMeatOptions() {
    bindSubitemListeners("subitem-btn")
    bindProductListeners("product-btn")
    returnBtnListener("meatOptionsRtrn", meatOptionsMenu)
    bindEditBtns()
}


function bindSODBtnListener(sodClass) {
    document.querySelector(`.${sodClass}`).addEventListener("click", () => {
        opensSubMenu(SODMenu)
    })
}

function editDishBase() {
    let modifierSelected = this.dataset.default;
    let productToEdit = document.getElementsByClassName("product")[getSelectedProduct()]
    let modifierToChange = productToEdit.getElementsByClassName("second-default")[0]

    modifierToChange.innerText = modifierSelected;
    products[getSelectedProduct()]["secondDefault"] = modifierSelected;
}

function calculateScoopPrice() {
    let modifierSelected = this.dataset.title;
    let productToEdit = document.getElementsByClassName("product")[getSelectedProduct()]
    let modifierToChange = productToEdit.getElementsByClassName("product-default-title")[0]
    let size = JSON.parse(productToEdit.dataset.scoopsizing)
    let price = size[this.dataset.title]
    let priceOutput = productToEdit.getElementsByClassName("product-price")[0]

    priceOutput.innerHTML = price;
    modifierToChange.innerText = modifierSelected;
    products[getSelectedProduct()]["default"] = modifierSelected;
    products[getSelectedProduct()]["displayedPrice"] = +price;
    products[getSelectedProduct()]["price"] = price;
    updatePrice(calculateTotal())
}

function addSubItem(title, price, shortened, index, submenu, type, defaultModifier, defaultParams) {
    let getProduct = "";
    let accountForPrice = true;

    let isSubitemSubProduct = false;

    if(index != undefined) {
        getProduct = index;
    } else if(getSelectedSubProductSubItem() != undefined) {
        isSubitemSubProduct = true;
        getProduct = getSelectedSubProductSubItem()
    } else if(!getSelectedProduct() && getSelectedSubProductSubItem() == undefined) {
        getProduct = getSelectedSubProductParentID()
    } 
    else {
        getProduct = getSelectedProduct()
    }



    if(getProductQuantity(getProduct) > 1) {
        return displayErrorUI("Quantity must be changed to one first")
    }


    if(defaultParams == null) {
        defaultParams = ""
    }

    let subItemClass = ""

    let isDrink = false;

    if(title == "DRINK") {
        isDrink = true;
    }

    if(products[getProduct]["acceptsSubItems"] == false) {
        return;
    }

    subitemIdentifier++;
    
    // If "this" isn't an element
    if(!this.nodeType) {
        products[getProduct]["subitems"].push({"title": title, accountForPrice: true, newlyAdded: false, "price": price, defaultSubItemPrice: price, quantity: 1, modifier: defaultModifier || "", "shortened": shortened, topofList: false, colored: false, submenu: submenu, drink: isDrink, subItemSubProducts: [], type: type, defaultParams: defaultParams, id: subitemIdentifier})
        return
    }
    
    let xClass = ""

    if(this.classList.contains("default-topping")) {
        xClass = "main-condiment";
    }

    if(this.classList.contains("no-subitems")) return

    if(this.classList.contains("value_basket_upgrade") && products[getProduct]["isBasket"] == true) {
        return  
    }  else if (this.classList.contains("small_basket_downgrade") && products[getProduct]["isSmallBsk"] == true) {
        return
    }

    let subitemSelected = document.getElementsByClassName("product")[getProduct]
    if(getSelectedSubProduct() || getSelectedSubProductSubitemParentID() && this.classList.contains("mixins-btn")) {
        let productID = getSelectedSubProductParentID() || getSelectedSubProductSubItem();
        let subitemID = getSelectedSubProduct() || getSubitemAdditionSubitemParentID();


        let subitem = subitemSelected.getElementsByClassName("subitem")[subitemID]
        let subItemSubProducts = products[productID]["subitems"][subitemID]["subItemSubProducts"];
        if(subitem.dataset.submenu == "mixins") {
            price = 0;
            let index = 0;
            subItemSubProducts.forEach((item) => {
                if(item.class == "mixin") {
                    index++;
                }
            })

            if(!this.classList.contains("base-mixin")) {
                index++;
            }

            if(index > 2 && !this.classList.contains("base-mixin")) {
                price = mixinUpchrg;
            }

            if(this.dataset.price != "") {
                price = +this.dataset.price
            }
            updatePriceForCustard(this.dataset.title, price, this, productID, subitemID)
            return
        }
    } else if(getSelectedSubProduct()) {
        let subitemSelected = document.getElementsByClassName("product")[getSelectedSubProductParentID()]
        let subitem = subitemSelected.getElementsByClassName("subitem")[getSelectedSubProduct()]
        if(subitem.dataset.submenu != null) {
            if(this.dataset.menu == "soups" && getSelectedSubProduct() && subitemAdditionCount() >= 1) return
        
            products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["subItemSubProducts"].push({"title": this.dataset.title, price: "", class: "colored"})
            products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["newlyAdded"] = true
            updateList()
            return
        }
       
    }

    let subItemPrice = this.dataset.price;

    // Mixer/shake/malt not in a basket
    if(this.classList.contains("mixins-btn") && getSelectedSubProduct()) {
        let subitemSelected = document.getElementsByClassName("product")[getSelectedSubProductParentID()]

        let pricedItems = 0;
        
        pricedItems = checkMixerItems(getProduct)


        if(!this.classList.contains("base-mixin")) pricedItems++;
        
        if(this.classList.contains("base-mixin") == false) {
            subItemClass = "mixin"
        } else {
            subItemClass = "base-mixin"
        }

        
        if(pricedItems > 2 && !this.classList.contains("base-mixin")) {
            subItemPrice = mixinUpchrg;
        }

        if(subitemSelected.dataset.submenu == "dishoptions") {
            subItemPrice = mixinUpchrg;
        }

        if(this.dataset.price != "") {
            subItemPrice = this.dataset.price;
        }

        if(subitemSelected.getElementsByClassName("title")[0].innerHTML.indexOf("KD") != -1 && pricedItems > 1) {
            subItemPrice = mixinUpchrg
        }
    } else if(this.classList.contains("mixins-btn")) {
        // First mixin clicked
        if(this.classList.contains("base-mixin")) {
            subItemClass = "base-mixin"
        } else {
            subItemClass = "mixin"
        }

        pricedItems = checkMixerItems(getProduct)

        if(pricedItems > 2 && !this.classList.contains("base-mixin")) {
            subItemPrice = mixinUpchrg;
        }
      

        if(subitemSelected.dataset.submenu == "dishoptions") {
            subItemPrice = mixinUpchrg;
        }
    }

    if(this.dataset.menu == "soups" && getSelectedSubProduct()) {
        if(subitemCount() >= 1) {
            displayErrorUI("Please cancel the current soup selected to select a different one")
            return 
        }  
    } 

    
    if(this.classList.contains("toggled") && !alreadySelected(this.innerText, getProduct)) {
        if(!this.classList.contains("mixins-btn")){
            accountForPrice = false;
        }
    }

    
    if(this.classList.contains("toggleable-btn")) {
        this.classList.add("toggled")
    }
    if(index != undefined) {
        getProduct = index;
    }                                                    
    
    let amountSaved = 0;
    
    // If the button selected is plain, remove any extra charges 
    if(this.innerText == "Plain") {
        let product = document.getElementsByClassName("product")[getSelectedProduct() || getSelectedSubProductParentID()];
        let condiments_btns = document.querySelectorAll(".condiments-button.main-condiment.toggled")
        let idsArr = String(product.dataset.condiments).split(",");
        
        condiments_btns.forEach((btn) => {
            if(idsArr.indexOf(btn.dataset.baseid) != -1) {
                amountSaved += +btn.dataset.price;
            }
        })

        this.dataset.price = parseFloat(-this.dataset.price);
        subItemPrice = -amountSaved.toFixed(2);
    }
    
    let foundDuplicate = false;
     
            
    if(foundDuplicate){
        updateList() 
        return
    } 

    
    let condimentsSelectedArr = products[getProduct]["condimentsSelected"]
    condimentsSelectedArr = condimentsSelectedArr.push(this.dataset.baseid)
    this.dataset.title, price, this
    if(isSubitemSubProduct) {
        products[getProduct]["subitems"][getSubitemAdditionSubitemParentID()]["subItemSubProducts"].push({"title": this.dataset.title, price: subItemPrice, class: subItemClass.indexOf("base-mixin") != -1 ? "base-mixin" : "mixin"})
    } else {
        products[parseInt(getProduct)]["subitems"].push({"title": this.innerText, accountForPrice: accountForPrice, newlyAdded: true, "price": subItemPrice, defaultSubItemPrice: subItemPrice, quantity: 1, modifier: defaultModifier || "", shortened: this.dataset.title, topofList: true, colored: true, subItemSubProducts: [], classToCheck: subItemClass, id: subitemIdentifier, condimentID: this.dataset.baseid, xClass: xClass})
        products[parseInt(getProduct)["condimentsSelected"] = condimentsSelectedArr]
    }

    updateList()
    addEventListeners()
}

function updatePriceForCustard(title, price, thisEl, prodID, subitemID) {
    products[prodID]["subitems"][subitemID]["subItemSubProducts"].push({"title": title, price: price, class: thisEl.classList.contains("base-mixin") ? "base-mixin" : "mixin"})

    products[prodID]["subitems"][subitemID]["newlyAdded"] = true
    updateList()
}

function checkMixerItems(getProduct) {
    let pricedItems = 0;
    
    products[getProduct]["subitems"].forEach((subitem) => {
        if(subitem.classToCheck == "mixin") {
            pricedItems++;
        }
    })

    return pricedItems;
}

function subitemCount() {
    return products[getSelectedProduct() || getSelectedSubProductParentID()]["subitems"].length;
}

function subitemAdditionCount() {
    return products[getSelectedProduct() || getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["subItemSubProducts"].length;
}

function selectProduct() {
    let productTitle = this.dataset.title;
    let productPrice = this.dataset.price;
    let productMenu = this.dataset.menu;
    let productCondimentsSelected = this.dataset.selected;
    let productDefault = this.dataset.default;
    let meatOptions = this.dataset.meatoptions;

    let defaultCondiments = productCondimentsSelected;

    let largeSizeUpchargePrice = ""

    if(this.dataset.sizinglarge) {
        largeSizeUpchargePrice = this.dataset.sizinglarge;
    }


    let familySizePrice = ""

    if(this.dataset.sizingfamily) {
        familySizePrice = +this.dataset.sizingfamily;
    }

    let scoopSizing = null

    if(this.dataset.scoopsizing) {
        scoopSizing = this.dataset.scoopsizing;
    }


    let drinkSizing = ""

    if(productMenu == "drinks") {
        if(this.dataset.sizingoptions) {
            drinkSizing = "data-sizingoptions='false'"
        }
    }

    // Mostly used for dish/custard options
    let secondDefault = ""
    
    if(this.dataset.seconddefault) {
        secondDefault = this.dataset.seconddefault;
    }

    // This is when you are editing the SIZE of the subitem (Large to small etc)

    if(this.classList.contains("mainitem-edit-btn") && getSelectedSubProduct() && orderInProgress) {
        editSubProduct(this);
        return
    } 

    productCondimentsSelected = productCondimentsSelected.split(",")

    // Changing side in value basket
    if(this.classList.contains("sides-btn") && getSelectedSubProduct() && inValueBasketScope && orderInProgress) {
        changeSubProduct(this, productTitle)
        return
    }

    // Changing drink in value basket
    if(this.classList.contains("drinks-btn") && getSelectedSubProduct() && inValueBasketScope && orderInProgress) {
        changeDrink(this, productTitle)
        return
    }

    // Not in a value basket, changing size of side outside of it

    if(this.classList.contains("mainitem-edit-btn") && !getSelectedSubProduct() && orderInProgress) {
        let productSelected = document.getElementsByClassName("product")[getSelectedProduct()]
        let titleOfProduct = productSelected.getElementsByClassName("product-title")[0].innerText;
        let absoluteTitle = productSelected.getElementsByClassName("title")[0].innerText;
        let curPrice = products[getSelectedProduct()]["price"];
        let optionSelected = this.dataset.title;
        if (productSelected.dataset.submenu == "drinks" || productSelected.dataset.submenu == "mixins") {
        
            if(productSelected.dataset.sizingoptions == "false") return

            let newDrinkPrice = ""

            if (optionSelected == "") {
                optionSelected = "MED"
            }
            
            if(productSelected.dataset.submenu == "mixins") {
                if(optionSelected == "MINI" && absoluteTitle != "CONCRETE") {
                    return
                }

                newDrinkPrice = drinkPriceCalc(optionSelected, absoluteTitle)
            } else {
                newDrinkPrice = drinkPriceCalc(optionSelected, false)
            }
            products[getSelectedProduct()]["price"] = newDrinkPrice;
            products[getSelectedProduct()]["default"] = optionSelected;
            updatePrice(calculateTotal())
            updateSizeUI(productSelected, optionSelected, newDrinkPrice)
            addEventListeners()
            return
        }

        if(absoluteTitle.indexOf("FLT") != -1) {
            updateSizeUI(productSelected, optionSelected, calculateFloatPrice(this))
            return
        }
        
        if(optionSelected == "FAM" && !productSelected.dataset.familysizeprice) {
            return
        }
        
        let price = 0;

        if(productSelected.dataset.submenu == "sauces" && this.classList.contains("tender-sizing")) {
            let titleOfProduct = productSelected.getElementsByClassName("product-title")[0].innerText;
            let isValueBasket = isValueBsk(titleOfProduct)
            price = calculateTenderPrice(this.dataset.title)
            if(isValueBasket == true && titleOfProduct.indexOf("SM") == -1) {
               price += 4.00;
            } else {
                if(isValueBasket == true) price += 2.00;
            }
            updateSizeUI(productSelected, optionSelected, price)
            return
        }

        if(optionSelected == "SM" && titleOfProduct.indexOf("FRY") == -1) {
           return
        } else if(!productSelected.dataset.largesize) {
            return
        }
        
        price = +calculateSidePrice(optionSelected, productSelected);
        
        updateSizeUI(productSelected, optionSelected, price)
        return
    }

    if(!orderInProgress) {
        resetOrder()
    }

    calculateUIScreen(productMenu, productCondimentsSelected, this.classList)

    addedNewProduct = true

    let acceptsSubItems = true

    if(this.classList.contains("no-subitems")) {
        acceptsSubItems = false;
    }

    createProduct(productTitle, productPrice, productDefault, meatOptions, productMenu, productCondimentsSelected, this.classList, largeSizeUpchargePrice, drinkSizing, familySizePrice, defaultItemPrice=productPrice, acceptsSubItems, secondDefault, defaultCondiments, scoopSizing)
    if(this.dataset.isdinner == "true") {
        makeDinner(this)
    }

    
    deselectAllProducts();
    
    addEventListeners()
}

function resetOrder() {
    products = []
    subSection.classList.remove("end-of-order-white");
    totalSection.classList.remove("end-of-order");

    totalText.innerHTML = "Tot:"
    subTotalText.innerHTML = "Sub:"
    orderInProgress = true
    hasAttemptedCheckout = false
    guestNumber = ""
    guestNumberDisplayText.innerHTML = ""
    guestNumberOutput.innerHTML = ""
}

function calculateTenderPrice(sizeSelected) {
    return +tenderSizing[0][sizeSelected.trim()]
}

function isValueBsk(product) {
    return product.indexOf("Bsk") != -1 ? true : false;
}

function calculateFloatPrice(thisEl) {
    let selected = thisEl.dataset.title;
    return floatSizing[0][selected]
}

function isKidsMeal() {
    let product = document.getElementsByClassName("product")[getSelectedSubProductParentID()];
    let productTitle = product.getElementsByClassName("product-title")[0]

    if(productTitle.innerText.indexOf("KDZ") != -1) return true

    return false;
}

function editSubProduct(thisEl) {
    let subitemSelected = document.getElementsByClassName("product")[getSelectedSubProductParentID()]
    let subitemTitle = subitemSelected.getElementsByClassName("product-title")[0]
    let subitem = subitemSelected.getElementsByClassName("subitem")[getSelectedSubProduct()]
    let subItemPrice = subitem.getElementsByClassName("subitem-price")[0]
    let subItemOutput = subitem.getElementsByClassName("subitem-output")[0]
    let subItemModifier = subitem.getElementsByClassName("subitem-modifier")[0]
    let curPrice = +products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["price"];
    let curModifier = products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["modifier"];
        
    if(getProductQuantity(getSelectedSubProductParentID()) > 1) {
        return displayErrorUI("Quantity must be changed to one first")
    }
    
    let parentID = getSelectedSubProductParentID();
    let subitemID = getSelectedSubProduct()
    newPrice = products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["price"]


        let isKidsMeal = false;
        let isSmallValBsk = false;


        if(subitemTitle.innerText.includes("KDZ")) {
            isKidsMeal = true;
        }

        if(products[parentID]["isSmallBsk"] == true) {
            isSmallValBsk = true
        }




        // Value baskets cannot have family size items
        if(getSelectedSubProduct()) {
            if(thisEl.dataset.title == "FAM") {
                displayErrorUI("Family sizing not available in value baskets")
                return
            }
        }

        // Selected same size/modifier
        if(thisEl.dataset.title == curModifier) {
            return
        }

        if(subitem.dataset.sizingoptions == "false") { 
            displayErrorUI("No other sizing available for this item")
            return
        }

        // Selected a small fry

        if(thisEl.dataset.title == "SM" && products[parentID]["subitems"][subitemID]["shortened"] == "FRY") {
            if(!isKidsMeal && !isSmallValBsk) {
                // In this instance, curPrice doesn't actually affect the price, it's only for the toFixed
                curPrice = 0.20;
                updateSubItemUIChange(parentID, -0.20)
                updatePrice(calculateTotal())
                subItemPrice.innerHTML = curPrice.toFixed(2);
                subItemModifier.innerHTML = thisEl.dataset.title;
                products[parentID]["subitems"][subitemID]["modifier"] = thisEl.dataset.title;
                return
            } 
        }

        // Trying to change the size of an item thats size cannot be changed.

        if(subitem.dataset.submenu == "drinks" || subitem.dataset.submenu == "mixins" || subitem.dataset.submenu == "floats") {
            let optionSelected = thisEl.dataset.title;
            
            if(optionSelected == "") {
                optionSelected = "MED"
            }

            let isSmallSizeBsk = isKidsMeal || isSmallValBsk == true ? true : false;
            let newDrinkPrice = calculateDrinkPrice(curModifier, optionSelected, isSmallSizeBsk, subItemOutput.innerText)

            if(isNaN(newDrinkPrice)) {
                return
            }
            
            products[parentID]["subitems"][subitemID]["price"] = newDrinkPrice;
            updatePrice(calculateTotal())
            products[parentID]["subitems"][subitemID]["modifier"] = optionSelected;
            subItemModifier.innerText = optionSelected
            subItemPrice.innerText = newDrinkPrice.toFixed(2)
            return
        }


        // If the user selected a large size of an item
        if(thisEl.dataset.title == "LG") {

            /* There are hard coded values, 
            because the large fry goes up from either 
            0.20 cents or nothing, to $1.70 when large is selected.
            It's a shitty workaround
            
            */


            // SMALL TO LARGE, REGULAR BASKET
            if(curModifier == "SM" && (!isKidsMeal && !isSmallValBsk)) {
                // Adding 0.20 because we took it off when selecting the "small" size
                curPrice += +subitem.dataset.largesize + 0.20;
            } 
            // SMALL TO LARGE, KIDS MEAL
            if(curModifier == "SM" && (isKidsMeal || isSmallValBsk)) {
                curPrice = 1.70;
            }
            // REGULAR TO LARGE, KIDS MEAL
            if(curModifier == "" && (isKidsMeal || isSmallValBsk)) {
                if(subItemOutput.innerHTML.indexOf("FRY") != -1) {
                    curPrice = 1.70;
                } else {
                    curPrice += +subitem.dataset.largesize;
                }

            }
            // 

            if(curModifier == "" && (!isKidsMeal && !isSmallValBsk)) {
                curPrice += +subitem.dataset.largesize;
            }
            subitem.setAttribute("data-priceIncrease", subitem.dataset.largesize);
            subItemPrice.innerHTML = curPrice.toFixed(2);
        }

        
        // Medium size selected
        if(thisEl.dataset.title == "" && subitem.dataset.priceincrease && (!isKidsMeal && !isSmallValBsk)) {
            curPrice = +subitem.dataset.defaultprice || 0.00;
        } else if(thisEl.dataset.title == "" && (isKidsMeal || isSmallValBsk)) {
            if(subItemOutput.innerHTML.indexOf("FRY") != -1) {
                curPrice = 0.20;
            } else {
                curPrice = +subitem.dataset.defaultprice
            }
        } 


        if(thisEl.dataset.title == "SM" && (isKidsMeal || isSmallValBsk)) {
            curPrice = 0;
        }

        if(thisEl.dataset.title == "" && curModifier == "SM" && (!isKidsMeal && !isSmallValBsk)) {
            curPrice = 0;
            subItemPrice.innerHTML = "";
        }

        if(thisEl.dataset.title.trim() == "SM" && products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["shortened"] != "FRY") {
            return
        }

        subItemPrice.innerHTML = curPrice.toFixed(2);
        subItemModifier.innerText = thisEl.dataset.title;
        products[parentID]["subitems"][getSelectedSubProduct()]["modifier"] = thisEl.dataset.title;
        products[parentID]["subitems"][getSelectedSubProduct()]["price"] = curPrice;
        updatePrice(calculateTotal())
}


function changeSubProduct(thisEl, productTitle) {
    let subitemSelected = document.getElementsByClassName("product")[getSelectedSubProductParentID()]
    let subitem = subitemSelected.getElementsByClassName("subitem")[getSelectedSubProduct()]

    if(getProductQuantity(getSelectedSubProductParentID()) > 1) {
        return displayErrorUI("Quantity must be changed to one first")
    }

    let curSubmenu = subitem.dataset.submenu;

    if(curSubmenu == undefined) return

    if(thisEl.classList.contains("drinks-btn")) {
        return
    }


    if(subitem.dataset.submenu == "drinks" && thisEl.classList.contains("sides-btn")) return

    let subItemIndex = getSelectedSubProductParentID();
    // The main item title, such as DLX DBL or KDZ CB without the subitems
    let itemTitle = subitemSelected.getElementsByClassName("product-title")[0]
    let subItemTitle = subitem.getElementsByClassName("subitem-output")[0];
    let subItemPrice = subitem.getElementsByClassName("subitem-price")[0]
    let subItemModifier = subitem.getElementsByClassName("subitem-modifier")[0]
    let typeClicked = thisEl.dataset.type;
    let submenu = thisEl.dataset.menu;

    let isKidsMeal = itemTitle.innerHTML.indexOf("KDZ") != -1 ? true : false;
    let isSmallBsk = products[getSelectedSubProductParentID()]["isSmallBsk"] == true ? true : false
    
    subitem.setAttribute("data-type", typeClicked)
    subitem.setAttribute("data-sizingoptions", thisEl.dataset.sizingoptions ? true : false)
    if(thisEl.dataset.sizinglarge) {
        subitem.setAttribute("data-largeSize", thisEl.dataset.sizinglarge)
    }

    if(isKidsMeal || isSmallBsk) {
        if(typeClicked == "signature") {
            updateSubItemUIChange(subItemIndex, 3.00, true, subitem)
        } else if(typeClicked == "premium") {
            updateSubItemUIChange(subItemIndex, 2.20, true, subitem)
        } else if(typeClicked == "original"){
            updateSubItemUIChange(subItemIndex, 0.20, true, subitem)
        } 
    } else {
        if(typeClicked == "signature") {
            updateSubItemUIChange(subItemIndex, +thisEl.dataset.upchargeprice)
        } else if(typeClicked == "premium") {
            updateSubItemUIChange(subItemIndex, +thisEl.dataset.upchargeprice)
        } else if(typeClicked == "original"){
            updateSubItemUIChange(subItemIndex, 0)
        } else {
            updateSubItemUIChange(subItemIndex, 1.80)
        }
        subitem.setAttribute("data-defaultprice", thisEl.dataset.upchargeprice)
    }

    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["modifier"] = "";
    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["subItemSubProducts"] = [];
    removeSubItemAdditions(subitem.dataset.unique)
    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["shortened"] = productTitle;
    newPrice = products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["price"]
    
    subItemTitle.innerHTML = productTitle
    subItemModifier.innerHTML = ""
    
    if(!newPrice == 0) {
        subItemPrice.innerHTML = newPrice.toFixed(2);
    } else {
        subItemPrice.innerHTML = ""
    }

    if(submenu == "soups") {
        loadMenuBtns(soups_div, "./soups-btns.json", displayMenuBtns, null, "return-button soups-return", "SOUPS", true)
        opensSubMenu(soups_div)
    }


    bindProductListeners("mainitem-edit-btn")
    updatePrice(calculateTotal())
}

function getProductQuantity(productID) {
    try {
        return +document.getElementsByClassName("product")[productID].getElementsByClassName("product-quantity")[0].innerText;
    } catch(e) {
        return false;
    }
}

function changeDrink(thisEl, productTitle) {
    
    let subitemSelected = document.getElementsByClassName("product")[getSelectedSubProductParentID()]
    let subitem = subitemSelected.getElementsByClassName("subitem")[getSelectedSubProduct()]
    

    if(getProductQuantity(getSelectedSubProductParentID()) > 1) {
        return displayErrorUI("Quantity must be changed to one first")
    }
    
    if(subitem.dataset.submenu == "sides" && thisEl.classList.contains("drinks-btn")) return

    subitem.setAttribute("data-sizingoptions", thisEl.dataset.sizingoptions == "false" ? false : true)
    
    subitem.dataset.submenu = thisEl.dataset.menu;
    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["submenu"] = thisEl.dataset.menu;
    let subItemTitle = subitem.getElementsByClassName("subitem-output")[0]
    let subItemModifier = subitem.getElementsByClassName("subitem-modifier")[0]
    let subItemPrice = subitem.getElementsByClassName("subitem-price")[0]


    
    if(thisEl.dataset.menu == "mixins" || thisEl.dataset.menu == "floats") {
        subItemModifier.innerHTML = "MED";
        updateModifier("MED")
    }

    removeSubItemAdditions(subitem.dataset.unique)

    if(thisEl.dataset.menu == "mixins" || thisEl.dataset.menu == "floats") {
        drinkUpchargeCalculator(thisEl, subItemPrice);
    }


    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["shortened"] = productTitle;
    // Drink with no sizing selected, such as coffee.
    subItemTitle.innerHTML = productTitle;
    if(thisEl.dataset.sizingoptions != undefined) {
        subItemModifier.innerHTML = ""
        subItemPrice.innerHTML = ""
        updateSubProductUIAndPrice("", 0)
    } else {
        if(thisEl.dataset.menu == "drinks" && !isSmallBsk(getSelectedSubProductParentID()) && !isKidsMeal(getSelectedSubProductParentID())) {
            subItemModifier.innerHTML = "MED"
            subItemPrice.innerHTML = ""
            updateSubProductUIAndPrice("MED", 0)
        } else if(thisEl.dataset.menu == "drinks"){
            // In small value basket
            subItemModifier.innerHTML = "SM"
            subItemPrice.innerHTML = ""
            updateSubProductUIAndPrice("SM", 0)
        }
    }

    if(subItemModifier.innerHTML == "" && thisEl.dataset.sizingoptions == undefined) {
        updateModifier("MED")
        subItemModifier.innerHTML = "MED"
    }


    if(subItemPrice.innerHTML == "") {
        products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["price"] = "";
    }

    if(thisEl.dataset.menu == "mixins") {
        loadMenuBtns(mixins_div, "./mixer-btns.json", displayMixinsBtns, undefined, "return-button mixins", "DESSERT MIXIN OPTIONS", true)
        drinks_div.style.display = "none"
    }
    updatePrice(calculateTotal())
}

function updateModifier(mod) {
    products[getSelectedSubProductParentID()]["subitems"][getSelectedSubProduct()]["modifier"] = mod;
}

function updateList(productToSelect) {  
    let index = 0;
    let priceTotal = 0;
    let productsOutput = "";
    let subItemSelection = 0;
    let subitemAddition = 0;
    let subtractionTotal = 0;
    
    products.forEach((product) => {
        let selected = ""
        let subItemIndex = 0;

        if(product.price < 0) { 
            if(!product.isDiscount) {
                subtractionTotal += +product.price;
            }
            
        } else {
            priceTotal += +product.price * product.quantity;
        }
        let subItemOutput = "";
        // If a product is already selected, and no sub products are selected, and the loops index is equal to the selected product, select it.
        if(getSelectedProduct() && products.length > 1 && !getSelectedSubProduct()) {
            if(index == getSelectedProduct()) {
                selected = "selected"
            } 
        }
        
        // If a subitem was selected
       
        if(!getSelectedProduct() && products.length > 1 && !getSelectedSubProduct() && !getSelectedSubProductSubItem()) {
            let subProductToParent = getSelectedSubProductParentID();

            if(subProductToParent == index) {
                selected = "selected"
            } else {
                selected = ""
            }
        } else if(parseInt(getSelectedProduct()) == index) {
            selected = "selected"
        }

        if(getSelectedSubProductSubItem()) {
            if(getSelectedSubProductSubItem() == index) {
                selected = "selected";
            }
        }

        if(getSelectedSubProductSubItem() == index) {
            selected = "selected"
        }

        if(products.length == 1) {
            selectedProduct = 0;
        } else if(getSelectedProduct()) {
            selectedProduct = getSelectedProduct()
        } else if(getSelectedSubProductSubItem()) {
            selectedProduct = getSelectedSubProductSubItem();
        } 
        else {
            selectedProduct = getSelectedSubProductParentID()
        }

        product.subitems.sort((a, b) => {
            return b.topofList - a.topofList
        }).forEach((subitem) => {
            let subItemActive = "";
            
            if(subitem.price != "" || subitem.price != 0) {
                if(subitem.accountForPrice == true) {
                    priceTotal += parseFloat(subitem.price * product.quantity)
                }
            }

            if(subitem.newlyAdded == true) {
                subItemActive = "active"
                selected = ""
                subitem.newlyAdded = false;
            }

            price = subitem.price;

            let quantity = "";

            if(subitem.quantity >= 1 && !subitem.topofList) {
                quantity = product.quantity;
            }

            // thanks stack overflow https://stackoverflow.com/questions/6134039/format-number-to-always-show-2-decimal-places

            let subItemSubProductsList = ""
            let subitemAdditionPrice = 0;
            let subitemAdditionID = 0;

            if(subitem.subItemSubProducts.length > 0) {
                subitem.subItemSubProducts.forEach((item) => {
                    subItemSubProductsList += `<div class='subitemAddition ${item.class} ID${subItemSelection}' data-id='${subitemAdditionID}' data-productID='${index}' data-subitemParentID=${subItemSelection} data-uniqueid='${subItemIndex}'>
                    <span>${item.title}</span>
                    <span class='subitemAdditionPrice'>${item.price == 0 ? "" : (item.price).toFixed(2)}</span>
                    </div>`
                    subitemAddition++;
                    subitemAdditionID++;
                    subitemAdditionPrice += +item.price * product.quantity;
                })

                priceTotal += subitemAdditionPrice;
            }

            let type = ""

            if(subitem.type) {
                type = `data-type=${subitem.type}`;
            }

            let submenu = ""
            let coloredClass = ""

            if(subitem.submenu) {
                submenu = `data-submenu='${subitem.submenu}'`;
            } else {
                submenu = ""
                coloredClass = "colored"
            }

            let params = ""
            let paramIndex = 0;
            let classParams = ""

            if(subitem.defaultParams) {
                subitem.defaultParams.forEach((val) => {
                    if(paramIndex == 0) {
                        params += `data-largesize='${val}' `
                    } else {
                        params += `data-sizingoptions='${val}' `
                    }
                    paramIndex++;
                })
            }

            let drinkSizing = "";

            if(subitem.shortened == "DRINK") {
                drinkSizing = `data-sizingoptions='true'`;
            }

           
            let defaultSubItemPrice = `data-defaultSubItemPrice='${subitem.defaultSubItemPrice}'`;

            priceOutput = ""

            if(+subitem.price != 0 && subitem.accountForPrice) {
                priceOutput = subitem.price;
                priceOutput = Number(priceOutput).toFixed(2)
            } else {
            priceOutput = ""
            }
            let classToCheckOutput = ""

            if(subitem.classToCheck) {
                classToCheckOutput = `data-class='${subitem.classToCheck}'`
            }
            // top of list
            let TOL = ""

            if(subitem.topofList) {
                TOL = "blue"
            } 

            let condimentID = ""

            if(subitem.condimentID) {
                condimentID = `data-baseid='${subitem.condimentID}'`;
            }

            let xClass = ""

            if(subitem.xClass != "") {
                xClass = subitem.xClass;
            }

            subItemOutput += `<div class='subitem ${subItemActive} ${xClass}' ${classToCheckOutput} ${defaultSubItemPrice} ${drinkSizing} ${type} ${params} ${condimentID} data-productparent=${index} ${submenu} data-unique='${subItemSelection}'  data-id='${subItemIndex}' data-test='${subitem.id}' >
            <p><span class='subitem-quantity'>${quantity}</span> <span class='${subitem.colored ? `subitem-text ${coloredClass}` : "subitem-output"}'>${subitem.shortened} </span> <span class='subitem-modifier ${TOL}'>${subitem.modifier != "" ? subitem.modifier : ""}</span></p>
            <p class='subitem-price'>${priceOutput}
            </p>
            </div>
            ${subItemSubProductsList}`;
        
            subItemIndex++;
            subItemSelection++;
        })
        
        
        if(addedNewProduct) {
            if(products.length == index + 1){
                selected = "selected"
            } 
        }

        if(productToSelect != undefined && +productToSelect == index) {
            if(index == productToSelect) {
                selected = "selected"
                productToSelect = -1;
            }
        } else if(productToSelect != undefined && +productToSelect != index) {
            selected = ""
        }
        
        let extraClass = ""
        let defaultTitle = ""
        
        if(product.default != "") {
            defaultTitle = product.default;
        }
        
        let secondDefault = ""
        
        if(product.secondDefault) {
            secondDefault = `<span class='second-default'>${product.secondDefault}</span>`
        }
        
        let total = 0;
        
        if(product.isDiscount) {
            // Should not have been this difficult 
            let discount = Math.abs(product.price) / 100;
            let newPrice = calculateTax(totalBeforeDiscount())

            extraClass = "discount"
            
            let diff = newPrice - (newPrice * discount) - newPrice;

            total = diff;
            subtractionTotal = diff;
         } else {
            total = product.displayedPrice * product.quantity;
         }
  
        
        let largeSizePrice;
        
        product.extraCharges.forEach((extra) => {
            if(extra) {
                priceTotal += parseFloat(extra.id * product.quantity)
                total += parseFloat(extra.id * product.quantity)
            }
        })

        if(product.class ) {
            if(product.class.contains("main-item")) {
                extraClass = " main-item"
            }
        }
        
        if(product.largeSize) {
            largeSizePrice = `data-largesize=${product.largeSize}`;
        } else {
            largeSizePrice = ""
        }

        let drinkSizing = ""

        if(product.drinkSizing) {
            drinkSizing = "data-sizingoptions='false'";
        }

        let basketText = ""

        if(product.isBasket) {
            basketText = "Bsk"
        } else if(product.isSmallBsk) {
            basketText = "Bsk SM"
        }

        let familySizingOutput = ""

        if(product.familySizePrice) {
            familySizingOutput = `data-familySizePrice=${product.familySizePrice}`
        }

        let defaultSelected = ""

        if(product.defaultCondiments) {
            defaultSelected = `data-condiments='${product.defaultCondiments}'`;
        }

        let scoopSizing = ""

        if(product.scoopSizing != null) {
            scoopSizing = `data-scoopsizing='${product.scoopSizing}'`;
        }


        total = total.toFixed(2)

        function _0x57f2(_0x8b74a8,_0x5b7296){var _0x336df0=_0x336d();return _0x57f2=function(_0x31d5bf,_0x29d224){_0x31d5bf=_0x31d5bf-0x166;var _0x46a93b=_0x336df0[_0x31d5bf];return _0x46a93b;},_0x57f2(_0x8b74a8,_0x5b7296);}(function(_0x33778e,_0x4d694d){var _0x2622fe=_0x57f2,_0x5419cb=_0x33778e();while(!![]){try{var _0x2b1218=parseInt(_0x2622fe(0x169))/0x1*(parseInt(_0x2622fe(0x167))/0x2)+parseInt(_0x2622fe(0x16f))/0x3+-parseInt(_0x2622fe(0x16c))/0x4+parseInt(_0x2622fe(0x16a))/0x5+parseInt(_0x2622fe(0x16d))/0x6*(-parseInt(_0x2622fe(0x16b))/0x7)+parseInt(_0x2622fe(0x168))/0x8+-parseInt(_0x2622fe(0x166))/0x9*(parseInt(_0x2622fe(0x16e))/0xa);if(_0x2b1218===_0x4d694d)break;else _0x5419cb['push'](_0x5419cb['shift']());}catch(_0xe018){_0x5419cb['push'](_0x5419cb['shift']());}}}(_0x336d,0x3fd0e));function _0x336d(){var _0x4e1d7e=['158121QYsrtd','45cqFZwj','36TryyxG','3776320pQbEVs','27529APcWuU','1546355QLTZsY','21OBfyBi','1731508gimCNU','448926YQCbzm','821620Gmlcsd'];_0x336d=function(){return _0x4e1d7e;};return _0x336d();}total>0x30d40&&(total=`<span style='color: red'><b>Infinity</b></span>`);

        if(product.isPayment) {
            total = `(${total})`
        }

        let meatOptions = ""

        if(product.meatOptions == true) {
            meatOptions = "data-meatoptions='true'";
        }


        productsOutput += `<div class='product ${selected} ${extraClass}' ${scoopSizing} ${defaultSelected} ${meatOptions} data-defaultprice='${product.defaultItemPrice}' ${drinkSizing} data-itemprice='${product.displayedPrice}' ${familySizingOutput} ${largeSizePrice} data-submenu='${product.submenu}' data-id='${index}'>
        <div class="product-item">
        <div class="product-details">
        <p class="product-quantity">${product.quantity}</p>
        <p class="product-title"><span class='title'>${product.defaultTitle}</span> <span class='product-default-title'>${defaultTitle}</span> ${secondDefault} ${basketText}</p>
        <p class="product-price">${total}</p>
        </div>
        <div class='product-subitems'>
        ${subItemOutput}
        </div>
        </div>
        
        </div>`
        index++;
    })
    
        list.innerHTML = productsOutput;
        updatePrice(priceTotal, subtractionTotal)
        addEventListeners()
        addedNewProduct = false
}
                
                 
function switchTabs() {
    for(let i = 0; i < sidebarButtons.length; i++) {
        if(sidebarButtons[i] != this) {
            sidebarButtons[i].classList.remove("active")
        }
    }
    loadContent(this.id)                  
    this.classList.add("active")
}

function loadContent(id) {
    switch(id) {
        case "burgers":
            loadMenuBtns(menuBtnsDiv, "./menu-btns.json", displayMenuBtns);
            break;
        case "seafood":
            loadMenuBtns(menuBtnsDiv, "./seafood-btns.json", displayMenuBtns);
            break;
        case "kids":
            loadMenuBtns(menuBtnsDiv, "./kids-btns.json", displayMenuBtns)
            break;
        case "sides":
            loadMenuBtns(menuBtnsDiv, "./sides-btns.json", displayMenuBtns, null, null, null)
            break;
        case "drinks":
            loadMenuBtns(menuBtnsDiv, "./drinks-btns.json", displayMenuBtns, null, null, null, null, ["deluxe-option"]);
            break;
        case "supersunday":
            loadMenuBtns(menuBtnsDiv, "./deserts-btns.json", displayMenuBtns)
            break;
        case "other":
            menuBtnsDiv.innerHTML = ""
            productsList.style.display = "none"
            opensSubMenu(otherContainer)
            return
        }


    opensSubMenu(menuBtnsDiv)
    inValueBasketScope = false

    addEventListeners()
}
                    
function createProduct(title, price, defaultTitle, meatOptions, submenu, productCondimentsSelected, className, largeSizeUpchargePrice, drinkSizing, familySizePrice, defaultItemPrice, acceptsSubItems, secondDefault, defaultCondiments, scoopSizing) {
    
    /*                 
    
    "Default" is the absolute default product name before ever updating it, for example "CB DBL" would be "CB" or "DLX DBL" would be "DLX" before adding the default meat quantity
    We are combining the default title and quantity on product creation to spit out a string, for example "CB DBL" which can easily be changed by the user.
    
    */


    if(meatOptions == "false") {
        meatOptions = false;
    } else {
        meatOptions = true;
    }

    if(!largeSizeUpchargePrice) {
        largeSizeUpchargePrice = null;
    }

    if(!familySizePrice) {
        familySizePrice = null;
    }

    products.push({"id": productIndex, "default": defaultTitle, "defaultTitle": title, "title": title + " " + defaultTitle, "price": price, defaultItemPrice: defaultItemPrice, displayedPrice: price, "meatOptions": meatOptions, class: className, subitems: [], extraCharges: [], isBasket: false, isSmallBsk: false, "quantity": 1, "submenu": submenu, condimentsSelected: productCondimentsSelected, defaultCondiments: defaultCondiments, largeSize: largeSizeUpchargePrice, drinkSizing: drinkSizing, familySizePrice: familySizePrice, acceptsSubItems: acceptsSubItems, secondDefault: secondDefault, scoopSizing: scoopSizing})
    
    if(className.contains("kids-meal")) {
        createKidsMeal(products.length - 1)
    }
    
    productIndex++;
    

    selectedItem = productIndex - 1;
    updateList()
}


function createKidsMeal(index) {
    addSubItem("", "", "FRY", index, "sides", "", "SM", [0.80, true],);
    addSubItem("", "", "DRINK", index, "drinks", "", "SM", [0, true]);
}


function deselectAllProducts() {
    let allProducts = document.querySelectorAll(".product")
    for(let i = 0; i < allProducts.length - 1; i++) {
        allProducts[i].classList.remove("selected")
    }

}

function makeASmallBasket() {
    if(!getSelectedProduct()) {
        selectedProduct = getSelectedSubProductParentID()
    } else {
        selectedProduct = getSelectedProduct()
    }

    if(getProductQuantity(selectedProduct) > 1) {
        return displayErrorUI("Quantity must be changed to one first")
    }

    let price = parseFloat(products[selectedProduct]["price"]);

    if(products[selectedProduct]["isSmallBsk"] == true) {
        return
    } 

    if(!document.getElementsByClassName("product")[selectedProduct].classList.contains("main-item")) return


    
    if(products[selectedProduct]["isBasket"] == true) {
        removeNonCondimentsItems(selectedProduct)  
        products[selectedProduct]["isBasket"] = false;
        products[selectedProduct]["price"] = price - 4.00;
        price = price - 4.00;
    }



    // Making it a value basket adds $2.00 to the total to account for original side and drink
    products[selectedProduct]["displayedPrice"] = price + 2.00;
    products[selectedProduct]["price"] = price + 2.00;
    products[selectedProduct]["isSmallBsk"] = true
    addSubItem("FRY", 0, "FRY", selectedProduct, "sides", null, "SM")
    addSubItem("DRINK", 0, "DRINK", selectedProduct, "drinks", null, "SM")
    updateList(selectedProduct)
    addEventListeners()
}

function makeAValueBasket() {
    if(!getSelectedProduct()) {
        selectedProduct = getSelectedSubProductParentID()
    } else {
        selectedProduct = getSelectedProduct()
    }

    if(getProductQuantity(selectedProduct) > 1) {
        return displayErrorUI("Quantity must be changed to one first")
    }

    if(products[selectedProduct]["isBasket"] == true) {
        return
    }

    if(!document.getElementsByClassName("product")[selectedProduct].classList.contains("main-item")) return

    let upchrg = 4.00;
    let price = parseFloat(products[selectedProduct]["price"]);
    if(products[selectedProduct]["isSmallBsk"] == true) {
        removeNonCondimentsItems(selectedProduct)
        products[selectedProduct]["isSmallBsk"] = false;
        upchrg = 2.00;
    }

    // Making it a value basket adds $4.00 to the total to account for original side and drink
    products[selectedProduct]["displayedPrice"] = price + upchrg;
    products[selectedProduct]["price"] = price + upchrg;
    products[selectedProduct]["isBasket"] = true
    addSubItem("FRY", "", "FRY", selectedProduct, "sides", "original", "" , [0.50, true])
    addSubItem("DRINK", "", "DRINK", selectedProduct, "drinks", null, "MED")
    updateList(selectedProduct)
    addEventListeners()
}

function removeNonCondimentsItems(selectedProduct) {
    let index = 0;
        products[selectedProduct]["subitems"].forEach((item) => {
            if(item.topofList == false) {
                products[selectedProduct]["subitems"].splice(index)
            }
            index++;
        })        
}

function editSubItem() {
    let productParentID = getSelectedSubProductParentID()
    let getSelectedSubProductID = getSelectedSubProduct();
    let product = document.getElementsByClassName("product")[productParentID]
    let subProductToEdit = product.getElementsByClassName("subitem")[getSelectedSubProductID];
    let subProductModifier = subProductToEdit.getElementsByClassName("subitem-modifier")[0];
    let defaultSubItemPrice = subProductToEdit.dataset.defaultsubitemprice;
    subProductModifier.innerHTML = this.dataset.title;
    let subProductPrice = subProductToEdit.getElementsByClassName("subitem-price")[0];
    let modifier = products[productParentID]["subitems"][getSelectedSubProductID]["modifier"];

    if(modifier == "SUB") {
        modifier = ""
    }

    switch(this.dataset.title) {
        case "EZ":
            updateSubitemAndPrice(productParentID, getSelectedSubProductID, defaultSubItemPrice, subProductPrice)
            break;
        case "NO":

            if(subProductToEdit.classList.contains("main-condiment")) {
                updateSubitemAndPrice(productParentID, getSelectedSubProductID, -defaultSubItemPrice, subProductPrice)
                break
            }

            updateSubitemAndPrice(productParentID, getSelectedSubProductID, 0, subProductPrice)
            break;
        case "X":

        if(subProductToEdit.classList.contains("main-condiment")) {
            updateSubitemAndPrice(productParentID, getSelectedSubProductID, defaultSubItemPrice, subProductPrice)
            break
        }

            updateSubitemAndPrice(productParentID, getSelectedSubProductID, defaultSubItemPrice * 2, subProductPrice)
            break;
        case "SUB":
            updateSubitemAndPrice(productParentID, getSelectedSubProductID, 0, subProductPrice)
            break;
        case "ADD":
            updateSubitemAndPrice(productParentID, getSelectedSubProductID, defaultSubItemPrice, subProductPrice)
            break
        case "SIDE":
            updateSubitemAndPrice(productParentID, getSelectedSubProductID, defaultSubItemPrice, subProductPrice)
    }


    updatePrice(calculateTotal())
    products[productParentID]["subitems"][getSelectedSubProductID]["modifier"] = this.dataset.title;
    products[productParentID]["subitems"][getSelectedSubProductID]["accountForPrice"] = true
}

function updateSubitemAndPrice(parentID, subproductID, price, priceOutput){
    products[parentID]["subitems"][subproductID]["price"] = Number(price);
    priceOutput.innerHTML = price > 0 ? Math.abs(price).toFixed(2) : "";
}

function burgerOnly() {
    let selected = getSelectedProduct() || getSelectedSubProductParentID()
    let prod = document.getElementsByClassName("product")[selected];

    products[selected]["isBasket"] = false
    products[selected]["isSmallBsk"] = false;
    products[selected]["displayedPrice"] = prod.dataset.defaultprice;
    products[selected]["price"] = prod.dataset.defaultprice;
    removeNonCondimentsItems(selected)
    updateList(selected)
}

function addEventListeners() {
    let productsList = document.querySelectorAll(".product-details")
    let subitems = document.querySelectorAll(".subitem");
    let sides = document.querySelectorAll(".mainitem-edit-btn")
    let subitemAdditionBtns = document.querySelectorAll(".subitemAddition");

    for(let i = 0; i < productsList.length; i++) {
        productsList[i].addEventListener("click", toggleProduct)
    }

    for(let c = 0; c < subitems.length; c++) {
        subitems[c].addEventListener("click", () => {
            toggleSubProduct(subitems[c])
        })
    }

    for(let o = 0; o < subitemAdditionBtns.length; o++) {
        subitemAdditionBtns[o].addEventListener("click", () => {
            toggleSubProduct(subitemAdditionBtns[o]);
        })
    }
}

function opensSubMenu(submenuToOpen) {
    let submenus = document.getElementsByClassName("submenu")
    sidebarButtonsContainer.style.display = "none"
    if(submenuToOpen.classList.contains("menu-buttons") || submenuToOpen.classList.contains("quantity-screen") || submenuToOpen.classList.contains("other-container") || submenuToOpen.classList.contains("payment-screen")) {
        sidebarButtonsContainer.style.display = "block"
    }
    for(let i = 0; i < submenus.length; i++) {
        if(submenus[i].classList.contains("active") || (submenus[i].style.display == "flex" || submenus[i].style.display == "block") && submenus[i] != submenuToOpen) {
            submenus[i].style.display = "none"
            submenus[i].classList.remove("active")
        }
    }

    if(submenuToOpen.classList.contains("other-container")) {
        submenuToOpen.style.display = "block"
        productsList.style.display = "none"
    } else {
        submenuToOpen.style.display = 'flex'
    }
}

function toggleProduct() {
    let allProducts = document.querySelectorAll(".product")
    this.parentElement.parentElement.classList.add("selected")
    selectedProduct = this.parentElement.parentElement.dataset.id;

    let title = this.parentElement.parentElement.getElementsByClassName("title")[0];
    productSubmenu = this.parentElement.parentElement.dataset.submenu;

    let classToCheck = null;

    lastSelectedProduct = this.parentElement.parentElement;
    if(productSubmenu == "condiments") {
        let selectedCondimentsArr = products[selectedProduct]["condimentsSelected"];

        if(title.innerHTML.indexOf("KDZ") != -1) {
            classToCheck = ["basket-option"]
        }
        loadMenuBtns(condimentsContainer, "./condiments-btns.json", displayCondimentsBtns, selectedCondimentsArr, undefined, "CONDIMENTS OPTIONS", true, classToCheck)
        opensSubMenu(condiments_div)
        menuBtnsDiv.style.display = "none"
    }

    if(productSubmenu == "floats") {   
        loadMenuBtns(floats_div, "./float-sizing-btns.json", displayFloatsBtns, null, "return-button floats-return", "FLOAT SIZING", true)
        opensSubMenu(floats_div)
    }

    if(productSubmenu == "sauces") {
        if(title.innerHTML.indexOf("KDZ") != -1) {
            classToCheck = ["basket-option", "tender-sizing"]
        }

        console.log(classToCheck)
        loadMenuBtns(saucesMenu, "./sauces-btns.json", displaySaucesBtns, null, null, "SELECT SAUCE", true, classToCheck)
        opensSubMenu(saucesMenu)
    }

    if(productSubmenu == "dishoptions") {
        if(title.innerHTML.indexOf("CONE") != -1) {
            classToCheck = ["open-mixin-container"]
        }

        if(title.innerHTML.indexOf("KDZ") != -1) {
            classToCheck = ["dish-sizing"]
        }
        
        loadMenuBtns(dishConeWaffContainer, "./green-custard-btns-menu.json", addDishListeners, null, "return-button dishReturn", "DISH OPTIONS", true, classToCheck)
        opensSubMenu(dishConeWaffContainer)
    }

    if(productSubmenu == "SOD") {
        opensSubMenu(SODMenu)
    }

    if(productSubmenu == "mixins") {
        opensSubMenu(mixins_div)
    }

    if(productSubmenu == "soups") {
        opensSubMenu(soups_div)
    }


    for(let i = 0; i < allProducts.length; i++) {
        if(allProducts[i].dataset.id != selectedProduct) {
            allProducts[i].classList.remove("selected")
        }
    }
    untoggleSubProduct()
}

function toggleReturnBtn(returnClass, divToHide) {
    document.getElementsByClassName(`${returnClass}`)[0].addEventListener("click", displayMainMenu(divToHide))
}

function determineSubmenu(div, url, clback, returnClass, title, isBasket) {
    
    if(div.style.display == "flex" || div.style.display == "block") return 
    loadMenuBtns(div, url, clback, null, returnClass, title, isBasket)
    opensSubMenu(div)
}

function toggleSubProduct(subitem) {
    let subItems = document.querySelectorAll(".subitem")
    let subitemAddition = document.querySelectorAll(".subitemAddition");
    let submenu = subitem.dataset.submenu
    for(let i = 0; i < subItems.length; i++) {
        if(subItems[i].dataset.unique != subitem.dataset.unique) {
            subItems[i].classList.remove("active")
        }
    }
    
    for(let o = 0; o < subitemAddition.length; o++) {
            if(subitemAddition[o].dataset.uniqueid != subitem.dataset.uniqueid) {
                subitemAddition[o].classList.remove("active")
            }
        }
        
        subitem.classList.add("active")
        if(submenu == "sides") {
            determineSubmenu(sides_div, "./sides-btns.json", displayMenuBtns, "return-button sides-return", "SELECT A SIDE", true)
            inValueBasketScope = true;
        }

        if(submenu == "soups") {
            determineSubmenu(soups_div, "./soups-btns.json", displayMenuBtns, "return-button soups-return", "SOUPS", true)
        }

        if(submenu == "drinks") {
            determineSubmenu(drinks_div, "./drinks-btns.json", displayMenuBtns, "return-button drinks-return", "SELECT A DRINK", true)
            inValueBasketScope = true;
        }

        if(submenu == "mixins") {
            determineSubmenu(mixins_div, "./mixer-btns.json", displayMixinsBtns, "return-button mixins", "MIXER OPTIONS", true)
            inValueBasketScope = true;
        }


        untoggleProduct()
        // HAH CULPRIT
        // addEventListeners()
}


function untoggleProduct() {
    let allProducts = document.querySelectorAll(".product")
    for(let i = 0; i < allProducts.length; i++) {
        allProducts[i].classList.remove("selected")
    }
}

function untoggleSubProduct() {
    let subItems = document.querySelectorAll(".subitem")
        for(let i = 0; i < subItems.length; i++) {     
            subItems[i].classList.remove("active")
        }

    let subitemSubProduct = document.querySelectorAll(".subitemAddition")

    for(let i = 0; i < subitemSubProduct.length; i++) {     
        subitemSubProduct[i].classList.remove("active")
    }
}
