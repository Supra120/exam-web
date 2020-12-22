//vars and different vars
let endpointHost = 'http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1',
    responseHost = [],
    selAdmArea = [],
    newselAdmArea = [],
    selDistrict = [],
    newselDistrict = [],
    selTypeObject = [],
    newselTypeObject = [],
    selSocialPrivileges = [],
    newselSocialPrivileges = [],
    selectAdmArea = document.getElementById('select-admArea'),
    selectDistict = document.getElementById('select-dist'),
    selectTypeObject = document.getElementById('select-typeobject'),
    selectSocPriv = document.getElementById('select-socpriv'),
    btnSearchTable = document.getElementById('btn-search-table'),
    btnOrderConfirm = document.getElementById('btn_accept_order'),
    btnCreateOrder = document.getElementById('btn_create_order'),
    modalWindow = document.getElementById('exampleModalScrollable'),
    btnPlus = document.querySelectorAll('.btn-number-plus'),
    btnMinus = document.querySelectorAll('.btn-number-minus'),
    btnPosMenuCount = document.querySelectorAll('.count-position-menu'),
    btnRejectOrder = document.getElementById('btn_reject_order'),
    btnCloseModel = document.getElementById('close-modal'),
    hot = document.getElementById('checkbox-hot'),
    contactless = document.getElementById('checkbox-contactless'),
    tableUl = document.getElementById('pagination-ul'),
    jsonDataMenu = {},
    allLen = 0,
    paginationObj = {
        contentPage: 10,
        slicedData: [],
        countOfPages: 0,
        currentPage: 1,
        allLen: 0,
        maxBtnShow: 5
    },
    searchResult = [],
    menuObj = {
        acceptedRest: []
    },
    getSets = {
        set_1: 0,
        set_2: 0,
        set_3: 0,
        set_4: 0,
        set_5: 0,
        set_6: 0,
        set_7: 0,
        set_8: 0,
        set_9: 0,
        set_10: 0
    },
    menuCatch = {
        set_1: 0,
        set_2: 0,
        set_3: 0,
        set_4: 0,
        set_5: 0,
        set_6: 0,
        set_7: 0,
        set_8: 0,
        set_9: 0,
        set_10: 0,
    },
    jsonTitleArray = [],
    jsonDescArray = [],
    jsonImageArray = [],
    boolHot = false,
    boolContactless = false,
    resultPrice = 0,
    delieveryPrice = 350,
    resultModalPrice = 0;

//place for functions
function recordPath() {
    return `/api/data1/${id}`;

}
//function sendRequest
function sendRequest(method, url, onloadHandler) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';
    xhr.onload = onloadHandler;
    xhr.send();
}
//generate alert
function showAlert(msg, category = 'success') {
    let alertsContainer = document.querySelector('.alerts');
    let newAlert = document.querySelector('.alert-template').cloneNode(true);
    newAlert.querySelector('.msg').innerHTML = msg;
    newAlert.classList.remove('d-none');
    alertsContainer.append(newAlert);
}
// btn show alert
function actionOnBtnConfirmOrder(event) {
    let alertMsg;
    alertMsg = `Заказ успешно сформирован на сумму ${resultPrice} рублей. Ожидайте!`;
    showAlert(alertMsg, 'success');
}
// for rating sort
function compare(a, b) {
    return b.rate - a.rate;
}
// delete duplicates
function createSortedArr(array, newArray) {
    let len = array.length;
    for (let i = 0; i < len; i++) {
        if (newArray.indexOf(array[i]) === -1) {
            if (array[i] != null || array[i] != undefined) {
                newArray.push(array[i]);
            }
        }
    }
    return newArray;
}
//automatically fills search options
function renderSearchOpt(newSortedArr, selector) {
    for (key in newSortedArr) {
        let tmp = newSortedArr[key];
        let element = document.createElement('option');
        element.textContent = tmp;
        element.value = tmp;
        selector.append(element);
    }
    return 0;
}
//automatically fills search options for socpriv
function renderSearchSocialPriv(newSortedArr, selector) {
    for (key in newSortedArr) {
        let tmp = newSortedArr[key];
        let element = document.createElement('option');
        if (tmp == 1) {
            element.textContent = 'есть';
            element.value = '1';
        } else if (tmp == 'любой') {
            element.textContent = 'любой';
            element.value = 'любой';
        } else {
            element.textContent = 'нет';
            element.value = '0';
        }
        selector.append(element);
    }
    return 0;
}
//function working
function workingWithResponse(response) {
    for (resp of response) {
        responseHost.push(resp);
        let admAr = resp.admArea;
        let distr = resp.district;
        let sTypeObj = resp.typeObject;
        let socialPriv = resp.socialPrivileges;
        //create 4 arrays for different options
        selAdmArea.push(admAr);
        selDistrict.push(distr);
        selTypeObject.push(sTypeObj);
        selSocialPrivileges.push(socialPriv);
    }
    //deleting duplicates and create new array with it
    newselAdmArea.unshift('любой');
    newselDistrict.unshift('любой');
    newselTypeObject.unshift('любой');
    newselSocialPrivileges.unshift('любой');
    newselAdmArea = createSortedArr(selAdmArea, newselAdmArea);
    newselDistrict = createSortedArr(selDistrict, newselDistrict);
    newselTypeObject = createSortedArr(selTypeObject, newselTypeObject);
    newselSocialPrivileges = createSortedArr(selSocialPrivileges, newselSocialPrivileges);
    //sorting by rating tmp array
    result = responseHost.sort(compare);
    responseHost = responseHost.sort(compare); //TODO: sort another array for different func
    //rendering our new options
    renderSearchOpt(newselAdmArea, selectAdmArea);
    renderSearchOpt(newselDistrict, selectDistict);
    renderSearchOpt(newselTypeObject, selectTypeObject);
    renderSearchSocialPriv(newselSocialPrivileges, selectSocPriv);
    //rendering table cells by clicking page btn
    //get length of responce and fill it in object allLen
    paginationObj.allLen = getLengthOfResp(response);
    prepareBtnOptions(result, paginationObj.allLen, paginationObj.currentPage, paginationObj.contentPage);
    prepareTableButtons(paginationObj.countOfPages);
    renderTable();
    let tableUl = document.getElementById('pagination-ul');
    let getTableLi = document.querySelectorAll('.pagination li a');
    renderTableAndButton(result, tableUl);
}
//dicrement btn
function minusInput(value,name){
    let idInput = name.slice(16,20);
    let myInput = document.getElementById(idInput);
    let myInputVal = +myInput.value;
    let newVal = myInputVal - 1;
    if (newVal < 0){
        myInput.value = 0;
    }else{
        myInput.value = newVal;
        switch(+idInput){
            case 0:
                menuCatch.set_1 = newVal;
                break;
            case 1:
                menuCatch.set_2 = newVal;
                break;
            case 2:
                menuCatch.set_3 = newVal;
                break;
            case 3:
                menuCatch.set_4 = newVal;
                break;
            case 4:
                menuCatch.set_5 = newVal;
                break;
            case 5:
                menuCatch.set_6 = newVal;
                break;
            case 6:
                menuCatch.set_7 = newVal;
                break;
            case 7:
                menuCatch.set_8 = newVal;
                break;
            case 8:
                menuCatch.set_9 = newVal;
                break;
            case 9:
                menuCatch.set_10 = newVal;
                break;
        }
    }
    console.log('m1',menuCatch.set_1);
    console.log('m2',menuCatch.set_2);
    console.log('m3',menuCatch.set_3);
    console.log('m4',menuCatch.set_4);
    console.log('m5',menuCatch.set_5);
    console.log('m6',menuCatch.set_6);
    console.log('m7',menuCatch.set_7);
    console.log('m8',menuCatch.set_8);
    console.log('m9',menuCatch.set_9);
    console.log('m10',menuCatch.set_10);
    countAll();
}
//increment btn
function plusInput(value,name) {
    let idInput = name.slice(15,20);
    let myInput = document.getElementById(idInput);
    let myInputVal = +myInput.value;
    let newVal = myInputVal + 1;
    if(newVal > 20){
        myInput.value = 20;
    }else{
        myInput.value = newVal;
        switch(+idInput){
            case 0:
                menuCatch.set_1 = newVal;
                break;
            case 1:
                menuCatch.set_2 = newVal;
                break;
            case 2:
                menuCatch.set_3 = newVal;
                break;
            case 3:
                menuCatch.set_4 = newVal;
                break;
            case 4:
                menuCatch.set_5 = newVal;
                break;
            case 5:
                menuCatch.set_6 = newVal;
                break;
            case 6:
                menuCatch.set_7 = newVal;
                break;
            case 7:
                menuCatch.set_8 = newVal;
                break;
            case 8:
                menuCatch.set_9 = newVal;
                break;
            case 9:
                menuCatch.set_10 = newVal;
                break;
        }
    }

    console.log('m1',menuCatch.set_1);
    console.log('m2',menuCatch.set_2);
    console.log('m3',menuCatch.set_3);
    console.log('m4',menuCatch.set_4);
    console.log('m5',menuCatch.set_5);
    console.log('m6',menuCatch.set_6);
    console.log('m7',menuCatch.set_7);
    console.log('m8',menuCatch.set_8);
    console.log('m9',menuCatch.set_9);
    console.log('m10',menuCatch.set_10);
    countAll();
}
//function get json dataMenu
function getJsonData() {
    fetch('/js/dataMenu.json')
        .then(responce => responce.json())
        .then(data => {
            jsonDataMenu = data;
        });
}
// render menu postions of restaurant
function renderMenuPosition(getSet, id, title, description, image, menuSet) {
    htmlMenu = `<div class="col-lg-3 pb-4">
                    <div class="menu-class shadow mb-5 rounded">
                        <img class="d-block h-auto w-100 img-responsive img-menu" name="img-menu${id}" src=${image} alt="">
                        <h3 class="py-3 text-center title-menu" name="title-menu${id}">${title}</h3>
                        <p class="text-center desc-menu" name="description-menu${id}">${description}</p>
                        <h4 class="text-center price-place" name="price-menu${id}">${getSet}<i class="fa fa-rub" aria-hidden="true"></i></h4>
                        <div class="form-row pb-3">
                            <div class="col text-right">
                                <button class="btn btn-default" name="btn-number-minus${id}" value="-1" onclick="minusInput(this.value, this.name)">
                                    <i class="fa fa-minus-square-o btn-minus" aria-hidden="true"></i>
                                </button>
                            </div>
                            <div class="col">
                                <input type="text" class="form-control count-position-menu-plus" id=${id} placeholder="0" value=${menuSet} min="0" max="20" onchange="inputChanged(this.id, this.value)" disabled>
                            </div>
                            <div class="col text-left">
                                <button class="btn btn-default" name="btn-number-plus${id}" value="1" onclick="plusInput(this.value, this.name)">
                                    <i class="fa fa-plus-square-o btn-plus" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div> 
                </div>`
    let rowMenu = document.getElementById('menu-position');
    rowMenu.insertAdjacentHTML("beforeend", htmlMenu);
}
//function which, render all in one
function renderTableAndButton(result, tableUl) {
    document.querySelectorAll(".page-link").forEach(item => {
        item.addEventListener('click', event => {
            tableUl.innerHTML = '';
            let pageNumber = +item.innerHTML;
            console.log('pageNumber=', pageNumber);
            paginationObj.currentPage = pageNumber;
            prepareBtnOptions(result, paginationObj.allLen, paginationObj.currentPage, paginationObj.contentPage);
            prepareTableButtons(paginationObj.countOfPages);
            //renderTable(); //TODO: be carefull
        })
    })
}
//function get length of responce
function getLengthOfResp(array) {
    return array.length;
}
//render buttons pagination
function prepareBtnOptions(array, len, page, contentOnPage) {
    let startPoint = (page - 1) * contentOnPage;
    let endPoint = startPoint + contentOnPage;
    let slicedData = array.slice(startPoint, endPoint);
    let countOfPages = Math.ceil(len / contentOnPage);
    paginationObj.slicedData = slicedData;
    paginationObj.countOfPages = countOfPages;
}
//prepare pagination buttons
function prepareTableButtons(howManyPages) {
    let tableUl = document.getElementById('pagination-ul');
    tableUl.innerHTML = ''; //maybe .remove()
    let left = (paginationObj.currentPage - Math.floor(paginationObj.maxBtnShow / 2));
    let right = (paginationObj.currentPage + Math.floor(paginationObj.maxBtnShow / 2));
    if (left < 1) {
        left = 1;
        right = paginationObj.maxBtnShow;
    } // not under zero value of btn
    if (right > paginationObj.countOfPages) {
        left = paginationObj.countOfPages - (paginationObj.maxBtnShow - 1);
        right = paginationObj.countOfPages;
        if (left < 1) {
            left = 1;
        }
    }
    //TODO: next, prev not working Probablly need to use buttons instead of <a>
    for (let p = left; p <= right; p++) {
        tableUl.innerHTML += `<li class="page-item"><a class="page-link" value=${p}>${p}</a></li>`;
    }
    if (paginationObj.currentPage != 1) {
        tableUl.innerHTML = `<li class="page-item"><a class="page-link" value=${paginationObj.currentPage}>1</a></li>` + tableUl.innerHTML;
    }
    if (paginationObj.currentPage != paginationObj.countOfPages) {
        tableUl.innerHTML += `<li class="page-item"><a class="page-link" value=${paginationObj.countOfPages}>${paginationObj.countOfPages}</a></li>`;
    }
    document.querySelectorAll(".page-link").forEach(item => {
        item.addEventListener('click', event => {
            tableUl.innerHTML = '';
            let pageNumber = +item.innerHTML; //сразу к числу
            console.log('pageNumber=', pageNumber);
            paginationObj.currentPage = pageNumber;
            prepareBtnOptions(result, paginationObj.allLen, paginationObj.currentPage, paginationObj.contentPage);
            prepareTableButtons(paginationObj.countOfPages);
            renderTable();
        })
    })
}
//render table without slice, just sorted by rating, render onload
function renderTable() {
    let tmp = document.getElementById('table-show-restaurant').querySelector('tbody');
    let row;
    let td;
    tmp.innerHTML = '';
    let data = paginationObj.slicedData;
    let data_page = paginationObj.currentPage;
    let data_contentPage = paginationObj.contentPage;
    console.log(data);
    console.log(data_page);
    console.log(data_contentPage);
    // render table;
    let btnId = 0;
    for (let d of data) {
        row = document.createElement('tr');
        td = document.createElement('td');
        td.style.cssText = "font-size: 14px; vertical-align: middle;";
        td.innerHTML = d.name;
        row.append(td);
        td = document.createElement('td');
        td.className = '';
        td.style.cssText = "font-size: 14px; vertical-align: middle;";
        td.innerHTML = d.typeObject;
        row.append(td);
        td = document.createElement('td');
        td.style.cssText = "font-size: 14px; vertical-align: middle;";
        td.className = '';
        td.innerHTML = d.address;
        row.append(td);
        td = document.createElement('td');
        btn_table_action = document.createElement('button');
        btn_table_action.className = "btn btn-secondary btn-sm btn-choose-menu";
        btn_table_action.value = btnId;
        td.className = 'btn-choose-rest';
        btn_table_action.innerHTML = "Выбрать";
        td.append(btn_table_action);
        row.append(td);
        btnId += 1;
        tmp.append(row);
    }
    //get restaurant data, which we choosen
    document.querySelectorAll(".btn-choose-menu").forEach(item => {
        item.addEventListener('click', event => {
            let cleanMenu = document.getElementById('menu-position');
            cleanMenu.innerHTML = '';
            item.style.background = 'green';
            menuObj.acceptedRest = paginationObj.slicedData[item.value];
            getSets.set_1 = menuObj.acceptedRest.set_1;
            getSets.set_2 = menuObj.acceptedRest.set_2;
            getSets.set_3 = menuObj.acceptedRest.set_3;
            getSets.set_4 = menuObj.acceptedRest.set_4;
            getSets.set_5 = menuObj.acceptedRest.set_5;
            getSets.set_6 = menuObj.acceptedRest.set_6;
            getSets.set_7 = menuObj.acceptedRest.set_7;
            getSets.set_8 = menuObj.acceptedRest.set_8;
            getSets.set_9 = menuObj.acceptedRest.set_9;
            getSets.set_10 = menuObj.acceptedRest.set_10;
            let idMenuPos = 0;
            let titleHtml = document.querySelectorAll('.title-menu');
            let descriptionHtml = document.querySelectorAll('.desc-menu');
            let imageHtml = document.querySelectorAll('img-menu');
            for (let i of titleHtml) {
                console.log(i.value);
            }
            console.log('thtml', titleHtml);
            console.log('deshtml', descriptionHtml);
            //create array of usefull data for menu cards
            for (let i in jsonDataMenu) {
                for (let k of jsonDataMenu[i]) {
                    jsonTitleArray.push(k.title);
                    jsonDescArray.push(k.description);
                    jsonImageArray.push(k.image);
                }
            }
            titleHtml.set_1 = jsonTitleArray[0];
            titleHtml.set_2 = jsonTitleArray[1];
            titleHtml.set_3 = jsonTitleArray[2];
            titleHtml.set_4 = jsonTitleArray[3];
            titleHtml.set_5 = jsonTitleArray[4];
            titleHtml.set_6 = jsonTitleArray[5];
            titleHtml.set_7 = jsonTitleArray[6];
            titleHtml.set_8 = jsonTitleArray[7];
            titleHtml.set_9 = jsonTitleArray[8];
            titleHtml.set_10 = jsonTitleArray[9];
            descriptionHtml.set_1 = jsonDescArray[0];
            descriptionHtml.set_2 = jsonDescArray[1];
            descriptionHtml.set_3 = jsonDescArray[2];
            descriptionHtml.set_4 = jsonDescArray[3];
            descriptionHtml.set_5 = jsonDescArray[4];
            descriptionHtml.set_6 = jsonDescArray[5];
            descriptionHtml.set_7 = jsonDescArray[6];
            descriptionHtml.set_8 = jsonDescArray[7];
            descriptionHtml.set_9 = jsonDescArray[8];
            descriptionHtml.set_10 = jsonDescArray[9];
            imageHtml.set_1 = jsonImageArray[0];
            imageHtml.set_2 = jsonImageArray[1];
            imageHtml.set_3 = jsonImageArray[2];
            imageHtml.set_4 = jsonImageArray[3];
            imageHtml.set_5 = jsonImageArray[4];
            imageHtml.set_6 = jsonImageArray[5];
            imageHtml.set_7 = jsonImageArray[6];
            imageHtml.set_8 = jsonImageArray[7];
            imageHtml.set_9 = jsonImageArray[8];
            imageHtml.set_10 = jsonImageArray[9];
            for (let s in getSets) {
                renderMenuPosition(getSets[s], idMenuPos, titleHtml[s], descriptionHtml[s], imageHtml[s], menuCatch[s]);
                idMenuPos++;
            }
        })
    })
}
//function for random set add
function getRandomNumber(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
//render modal window content
function renderModalWinContent() {
    let hot, contactless;
    if (boolHot == false) {
        hot = 'Не выбрана';
        descHot = '';
    } if (boolContactless == false) {
        contactless = 'Не выбрана';
        descContactless = '';
    } if (boolHot == true) {
        hot = 'Выбрана (-30%)';
        descHot = 'Если ваш заказ будет холодным, его цена составит:';
    } if (boolContactless == true) {
        contactless = 'Выбрана';
        descContactless = 'У вас выбрана бесконтактная доставка!'
    }
    htmlModalWin = `
    <div class="modal-body" id="modal-body">
                    <div class="text-left" id="header-pos-menu">
                        <h3 class="pb-1 mx-1">Позиции заказа</h3>
                    </div>
                    <!--render menu position-->
                    <div class="text-left">
                        <h3 class="py-1 mx-1">Дополнительные опции</h3>
                    </div>
                        <div class="row mx-1 py-2">
                            <div class="col-lg-6 col-md-6 col-sm-6  col-6 pl-0"><h5 class="text-left">Только горячим</h5></div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                <h5 class="text-right pr-2">${hot}</h5>
                            </div>
                        </div>
                        <div class="row mx-1 py-2">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Бесконтактная доставка</h5></div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                <h5 class="text-right pr-2">${contactless}</h5>
                            </div>
                        </div>
                        <div class="text-left">
                            <h3 class="py-1 mx-1">Информация о предприятии</h3>
                        </div>
                    <div class="row mx-1 py-2">
                        <div class="col-lg-6 col-md-6 col-sm-6  col-6 pl-0"><h5 class="text-left">Название</h5></div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                <h5 class="text-left">${menuObj.acceptedRest.name}</h5>
                        </div>
                    </div>
                    <div class="row mx-1 py-2">
                        <div class="col-lg-6 col-md-6 col-sm-6  col-6 pl-0"><h5 class="text-left">Административный округ</h5></div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                <h5 class="text-left">${menuObj.acceptedRest.admArea}</h5>
                        </div>
                    </div>
                    <div class="row mx-1 py-2">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Район</h5></div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                <h5 class="text-left">${menuObj.acceptedRest.district}</h5>
                        </div>
                    </div>
                    <div class="row mx-1 py-2">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Адрес</h5></div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                <p class="text-left">${menuObj.acceptedRest.address}</p>
                        </div>
                    </div>
                    <div class="row mx-1 py-2">
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Рейтинг</h5></div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                <h5 class="text-left">${menuObj.acceptedRest.rate}</h5>
                        </div>
                    </div>
                <div class="text-left">
                    <h3 class="py-1 mx-1">Доставка</h3>
                </div>
                <div class="row mx-1 py-2">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Зона доставки:</h5></div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                            <select class="form-control w-50" id="exampleFormControlSelect1">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                    </div>
                </div>
                <div class="row mx-1 py-2">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Адрес доставки:</h5></div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                            <textarea class="form-control w-100" id="area_address_del" rows="2" placeholder="Укажите адрес доставки"></textarea>
                    </div>
                </div>
                <div class="row mx-1 py-2">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Стоимость доставки:</h5></div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                            <h5 class="text-left">${delieveryPrice}<i class="fa fa-rub" aria-hidden="true"></i></h5>
                    </div>
                </div>
                <div class="row mx-1 py-2">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">ФИО получателя:</h5></div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                            <input class="form-control w-100" type="text" placeholder="Фамилия Имя Отчество">
                    </div>
                </div>
                <div class="row mx-1 py-2">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">${descContactless}</h5></div>
                </div>
                <div class="row mx-1 py-2 price-class">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">Итого:</h5></div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                            <h5 class="text-left" name="resultPriceMod">${delieveryPrice + resultModalPrice}<i class="fa fa-rub" aria-hidden="true"></i></h5>
                        </div>
                    </div>
                <div class="row mx-1 py-2 discount-class">
                    <div class="col-lg-6 col-md-6 col-sm-6 col-6 pl-0"><h5 class="text-left">${descHot}</h5></div>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                            <h5 class="text-left" name="resultDiscount">${0}</h5>
                    </div>
                </div>
                </div>` //resultPrice
    let bodyModal = document.getElementById('modal-header');
    bodyModal.insertAdjacentHTML("afterend", htmlModalWin);
    let menuAll = document.querySelectorAll('#menu-position > div > div > div > div > input');
    console.log('menuAll',menuAll);
    let i=0;
    for (inp of menuAll){
        let priceMenu = document.querySelector(`#menu-position > div > div > h4[name='price-menu${i}']`);
        let titleMenu = document.querySelector(`#menu-position > div > div > h3[name='title-menu${i}']`);
        let imgMenu = document.querySelector(`#menu-position > div > div > img[name='img-menu${i}']`);
        if(+inp.value != 0){
            htmlMenuChoosenPos = `
            <div class="row border border-dark justi align-items-center my-3 mx-1 menu-pos-desc">
                <div class="col-lg-2 col-md-2 col-sm-2 col-2">
                    <img class="d-block h-auto w-100 img-responsive my-2" src="${imgMenu.src}" alt="">
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-4">
                    <h4 class="text-left">${titleMenu.textContent}</h4>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                    <p class="mb-0">${(+inp.value)}х${priceMenu.textContent}<i class="fa fa-rub" aria-hidden="true"></i></p>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-3 col-3">
                    <h4 class="text-right">${(+priceMenu.textContent) * ((+inp.value))}<i class="fa fa-rub" aria-hidden="true"></i></h4>
                </div>
            </div>`
            let modalAfterPos = document.getElementById('header-pos-menu');
            modalAfterPos.insertAdjacentHTML("afterend", htmlMenuChoosenPos);
        }
        i++;
        resultModalPrice += ((+priceMenu.textContent) * ((+inp.value)));
    }
    console.log('res mod price',resultModalPrice);
    let updateModalPrice = document.querySelector('.price-class > div > h5[name="resultPriceMod"]');
    updateModalPrice.textContent = ((+resultModalPrice) + 350);
    tmpPrice = ((+resultModalPrice) + 350);
    let updateDiscountPrice = document.querySelector('.discount-class > div > h5[name="resultDiscount"]');
    updateDiscountPrice.textContent = (tmpPrice) - ((tmpPrice * 30)/100);
    temp = (tmpPrice) - ((tmpPrice * 30)/100);
    console.log('tmpPrice',temp);
    let upDown = document.querySelector('.discount-class > div > h5[name="resultDiscount"]');
    if (boolHot == false) {
        upDown.hidden = true;
    }
}
//place for btn function
//close modal window, clean modal-body, show alert
btnOrderConfirm.onclick = function () {
    actionOnBtnConfirmOrder();
    let cleanBody = document.getElementById('modal-body');
    cleanBody.innerHTML = '';
    cleanBody.remove();
}
//close modal window, clean modal-body
btnRejectOrder.onclick = function () {
    let cleanBody = document.getElementById('modal-body');
    cleanBody.innerHTML = '';
    cleanBody.remove();
}
//close modal window, clean modal-body
btnCloseModel.onclick = function () {
    let cleanBody = document.getElementById('modal-body');
    cleanBody.innerHTML = '';
    cleanBody.remove();
}
function checkHot() {
    if (this.checked) {
        boolHot = true;
    } else {
        boolHot = false;
    }
    console.log('check', boolHot);
}
function checkContactless() {
    if (this.checked) {
        boolContactless = true;
    } else {
        boolContactless = false;
    }
    console.log('check', boolContactless);
    countAll()
}
function countAll() {
    let result = 0;
    price1 = +document.querySelector('h4[name="price-menu0"]').textContent;
    price2 = +document.querySelector('h4[name="price-menu1"]').textContent;
    price3 = +document.querySelector('h4[name="price-menu2"]').textContent;
    price4 = +document.querySelector('h4[name="price-menu3"]').textContent;
    price5 = +document.querySelector('h4[name="price-menu4"]').textContent;
    price6 = +document.querySelector('h4[name="price-menu5"]').textContent;
    price7 = +document.querySelector('h4[name="price-menu6"]').textContent;
    price8 = +document.querySelector('h4[name="price-menu7"]').textContent;
    price9 = +document.querySelector('h4[name="price-menu8"]').textContent;
    price10 = +document.querySelector('h4[name="price-menu9"]').textContent;
    if (boolContactless == true) {
        result = (price1 * menuCatch.set_1) + (price2 * menuCatch.set_2) + (price3 * menuCatch.set_3) + (price4 * menuCatch.set_4) + (price5 * menuCatch.set_5) + (price6 * menuCatch.set_6) + (price7 * menuCatch.set_7) + (price8 * menuCatch.set_8) + (price9 * menuCatch.set_9) + (price10 * menuCatch.set_10);
    } else {
        result = (price1 * menuCatch.set_1) + (price2 * menuCatch.set_2) + (price3 * menuCatch.set_3) + (price4 * menuCatch.set_4) + (price5 * menuCatch.set_5) + (price6 * menuCatch.set_6) + (price7 * menuCatch.set_7) + (price8 * menuCatch.set_8) + (price9 * menuCatch.set_9) + (price10 * menuCatch.set_10);
    }
    resultPrice = result;
    console.log('resultPrice=', resultPrice);
    updatePriceResult();
}
function updatePriceResult() {
    let resultPriceLabel = document.getElementById('main-sum');
    let resultPriceDiv = document.getElementById('result-price');
    resultPriceLabel.remove();
    htmlResultPrice = `<h4 class="pb-0 px-2 pt-4" id="main-sum">Итого: ${resultPrice} руб.</h4>`
    resultPriceDiv.insertAdjacentHTML("afterbegin", htmlResultPrice);
}
//place for onload functions
window.onload = function () {
    sendRequest('GET', endpointHost, function () {
        workingWithResponse(this.response);
        console.log('this.responce =', this.response);
    });
    //get json data from local file
    getJsonData()
    //btn to create order and show modal window
    btnCreateOrder.addEventListener('click', renderModalWinContent);
    hot.addEventListener('change', checkHot);
    contactless.addEventListener('change', checkContactless);

    btnSearchTable.onclick = function () {
        searchResult = [];
        let getAdm = selectAdmArea.value;
        let getDist = selectDistict.value;
        let getType = selectTypeObject.value;
        let getPriv = selectSocPriv.value;
        console.log(getAdm);
        console.log(getDist);
        console.log(getType);
        console.log(getPriv);
        console.log('responseHost in btn search = ', responseHost);
        for (let res of responseHost) {
            if ((res.admArea == getAdm || getAdm == 'любой') && (res.disctrict == getDist || getDist == 'любой') &&
            (res.typeObject == getType || getType == 'любой') && (res.socialPrivileges == getPriv || getPriv == 'любой')) {
                searchResult.push(res);
            }
        }
        prepareBtnOptions(searchResult, searchResult.length, 1, paginationObj.contentPage);
        prepareTableButtons((searchResult.length)/paginationObj.contentPage);
        renderTable();
        console.log('search result', searchResult);
    }
}