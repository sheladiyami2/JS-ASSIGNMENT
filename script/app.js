
const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#message");
const taskdate = document.querySelector('#date')
const clearButton = document.querySelector("#clearBtn");
const filters = document.querySelectorAll(".nav-item");


// create empty item list
let todoItems = [];
let todoitemid, e_id;
const showAlert = function (message, msgClass) {
  console.log("msg");
  messageDiv.innerHTML = message;
  messageDiv.classList.add(msgClass, "show");
  messageDiv.classList.remove("hide");
  setTimeout(() => {
    messageDiv.classList.remove("show", msgClass);
    messageDiv.classList.add("hide");
  }, 3000);
  return;
};
// filter tab items
const getItemsFilter = function (type) {
  let filterItems = [];
  let currDate = todayDate(new Date());
  // alert(currDate);
  let limitDate = addDaysToDate(3);
  console.log(type);
  switch (type) {
    case "todo":
      filterItems = todoItems.filter((item) => !item.isDone);
      break;
    case "done":
      filterItems = todoItems.filter((item) => item.isDone);
      break;
    case "today":
      filterItems = todoItems.filter((item) => item.date == currDate);
      break;
    case "upcoming":
      filterItems = todoItems.filter((item) => item.date > currDate && item.date < limitDate);
      break;
    default:
      filterItems = todoItems;
  }
  getList(filterItems);
};
const todayDate = function (setdate) {
  const dt = setdate;
  let m = dt.getMonth() + 1;
  let d = dt.getDate();
  let y = dt.getFullYear();
  if (m < 10) {
    m = "0" + m;
  }
  if (d < 10) {
    d = "0" + d;
  }
  var newDate = y + "-" + m + "-" + d;
  return newDate;
};

const addDaysToDate = function (days) {
  var res = new Date();
  res.setDate(res.getDate() + days);
  res = todayDate(res);
  return res;
};


// update item
const updateItem = function (itemIndex, newValue, newDate) {

  todoItems[itemIndex].name = newValue;
  todoItems[itemIndex].date = newDate;
  setLocalStorage(todoItems);
};
const editsubItem = function (subitemIndex, newItemValue) {
  todoItems[todoitemid].subitem[subitemIndex].name = newItemValue;
  todoitemid = "";
  setLocalStorage(todoItems);
};
const addsubItem = function (itemIndex, subItemName) {
  const subitemObj = {
    name: subItemName,
    isDone: false,
    addedAt: new Date().getTime()
  };
  itemInput.value = "";
  todoItems[itemIndex].subitem.push(subitemObj);
  todoItems[itemIndex].isDone = false;
  const item = document.querySelectorAll(".list-group-item1");
  const done = item[e_id].querySelector("[data-done]");
  if (done.classList.contains("bi-check-circle-fill")) {
    done.classList.replace("bi-check-circle-fill", "bi-check-circle")
  }
  e_id = "";
  setLocalStorage(todoItems);
};

// remove/delete item
const removeItem = function (removeIndex) {
  todoItems.splice(removeIndex, 1);
};

//bi-check-circle-fill  // bi-check-circle
// handle item
const handleItem = function (elem_id, todoli_id) {
  const item = document.querySelectorAll(".list-group-item1");

  // done
  const currentItem = todoItems[todoli_id];
  item[elem_id].querySelector("[data-done]").addEventListener("click", function (e) {
    e.preventDefault();
    if (currentItem.subitem.length == 0) {
      const currentClass = currentItem.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      currentItem.isDone = currentItem.isDone ? false : true;
      todoItems.splice(todoli_id, 1, currentItem);
      setLocalStorage(todoItems);
      //console.log(todoItems[itemIndex]);
      const iconClass = currentItem.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";

      this.firstElementChild.classList.replace(currentClass, iconClass);
      const filterType = document.querySelector("#filterType").value;
      getItemsFilter(filterType);
    }
  });
  // edit
  item[elem_id].querySelector("[data-edit]").addEventListener("click", function (e) {
    e.preventDefault();
    itemInput.value = currentItem.name;
    taskdate.value = currentItem.date;
    document.querySelector("#citem").value = todoli_id;
    document.querySelector("#sitem").value = "";
    document.querySelector("#sedit").value = "";
    return todoItems;
  });

  // add subitem
  item[elem_id].querySelector("[data-addSub]").addEventListener("click", function (e) {
    e.preventDefault();
    itemInput.value = "";
    taskdate.value = "";
    itemInput.focus();
    e_id = elem_id;
    document.querySelector("#sitem").value = todoli_id;
    document.querySelector("#citem").value = "";
    document.querySelector("#sedit").value = "";
    return todoItems;

  });

  //delete
  item[elem_id]
    .querySelector("[data-delete]")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Are you sure want to delete?")) {
        itemList.removeChild(item[elem_id]);

        todoItems.splice(todoli_id, 1);
        setLocalStorage(todoItems);
        const filterType = document.querySelector("#filterType").value;
        getItemsFilter(filterType);
        showAlert("Item has been deleted.", "alert-success");
        itemInput.value = "";
        taskdate.value = "";
        document.querySelector("#citem").value = "";
        document.querySelector("#sitem").value = "";
        document.querySelector("#sedit").value = "";

      }
    });
};

const handleSubItemdone = function (elem_id, todoli_id, sub_id) {

  //alert("handling subitem done");
  document.querySelector("#citem").value = "";
  document.querySelector("#sitem").value = "";
  document.querySelector("#sedit").value = "";
  itemInput.value = "";
  let all = true;
  let subdone = document.querySelector("#sub" + elem_id + sub_id).querySelector("[data-strike]");
  subdone.classList.toggle("checkedtrue");
  subdone.classList.toggle("checkedfalse");
  if (subdone.classList.contains("checkedtrue")) {
    todoItems[todoli_id].subitem[sub_id].isDone = true;
  }
  else {
    todoItems[todoli_id].subitem[sub_id].isDone = false;
  }

  todoItems[todoli_id].subitem.forEach((s_item) => {
    if (!s_item.isDone) {
      all = false;
    }
  });
  if (all) {
    todoItems[todoli_id].isDone = true;
  }
  else {
    todoItems[todoli_id].isDone = false;

  }
  setLocalStorage(todoItems);
  const filterType = document.querySelector("#filterType").value;
  getItemsFilter(filterType);
  //
}

const handleSubItemedit = function (event, todoli_id, sub_id) {
  event.stopPropagation();
  itemInput.value = todoItems[todoli_id].subitem[sub_id].name;
  document.querySelector("#sedit").value = sub_id;
  document.querySelector("#sitem").value = "";
  document.querySelector("#citem").value = "";
  taskdate.value = "";
  todoitemid = todoli_id;
  event.stopPropagation();
  return todoItems;
}
const handleSubItemdel = function (elem_id, todoli_id, sub_id) {

  // e.preventDefault();
  if (confirm("Are you sure want to delete?")) {
    document.querySelector('#subitemul' + elem_id).removeChild(document.querySelector('#sub' + elem_id + sub_id));
    todoItems[todoli_id].subitem.splice(sub_id, 1);
    setLocalStorage(todoItems);
    document.querySelector("#citem").value = "";
    document.querySelector("#sitem").value = "";
    document.querySelector("#sedit").value = "";
    itemInput.value = "";
    taskdate.value = "";
    const filterType = document.querySelector("#filterType").value;
    getItemsFilter(filterType);
    showAlert("Sub Item has been deleted.", "alert-success");
    // return todoItems.filter((_item) => _item != currentItem);
  }

}

// get list items
const getList = function (_todoItems) {
  itemList.innerHTML = "";
  let elem_indx, todoItem_indx, subitem_indx;
  if (_todoItems.length > 0) {
    _todoItems.forEach((item) => {
      elem_indx = _todoItems.indexOf(item);
      todoItem_indx = todoItems.indexOf(item);

      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group-item  list-group-item1 justify-content-between align-items-center">
        <span  class="d-flex justify-content-between align-items-center">
          <span class="title" data-time="${item.addedAt}">${item.name}</span> 
          <span class="title" data-time="${item.addedAt}">${item.date}</span> 
          <span>
          <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
          <a href="#" data-addSub><i class="bi bi-plus-circle-fill"></i></a>
          <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
          <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
          </span>
          </span>
          <ul class="list-group list-group-flush" id="subitemul${elem_indx}">
          ${item.subitem.map((item1) => {
          // handleSubItem();
          subitem_indx = item.subitem.indexOf(item1);
          const iconClass1 = item1.isDone
            ? "bi-check-circle-fill"
            : "bi-check-circle";
          return (
            `<li class="list-group-item list-group-item2 d-flex justify-content-between align-items-center" id="sub${elem_indx}${subitem_indx}" onclick="handleSubItemdone(${elem_indx},${todoItem_indx},${subitem_indx})">
               <span class="checked${item1.isDone}"  data-strike><p> ${item1.name}</p></span> 
                
                 <span>
                 
                 <a href="#" data-subedit onclick="handleSubItemedit(event,${todoItem_indx},${subitem_indx})"><i class="bi bi-pencil-square blue"></i></a>
                     <a href="#" data-subdelete onclick="handleSubItemdel(${elem_indx},${todoItem_indx},${subitem_indx})"><i class="bi bi-x-circle red"></i></a>
                 </span>
               </li>    
           `
          );
        }).join('')
        }
  
            </ul>
        </li>`
      );

      handleItem(elem_indx, todoItem_indx);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        No record found.
      </li>`
    );
  }
};

// get localstorage from the page
const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
    //console.log("items", todoItems);
  }
  getList(todoItems);
};
// set list in local storage
const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = itemInput.value.trim();

    const _Date = taskdate.value;

    if (itemName.length === 0) {
      showAlert("Please enter name", "alert-danger");
      return;
    } else {
      // update existing Item
      const currenItemIndex = document.querySelector("#citem").value;
      const subItemIndex = document.querySelector("#sitem").value;
      const subEditItemIndex = document.querySelector("#sedit").value;
      if (currenItemIndex) {
        updateItem(currenItemIndex, itemName, _Date);
        document.querySelector("#citem").value = "";
        showAlert("Item has been updated.", "alert-success");
      }
      else if (subItemIndex) {
        addsubItem(subItemIndex, itemName);
        document.querySelector("#sitem").value = "";
        showAlert("Sub Item has been Added.", "alert-success");
      }
      else if (subEditItemIndex) {
        editsubItem(subEditItemIndex, itemName);
        document.querySelector("#sedit").value = "";
        showAlert("Sub Item has been Updated.", "alert-success");
      }
      else {

        if (_Date == '') {
          showAlert("Please enter date", "alert-danger");
          return;
        }
        // Add new Item
        const itemObj = {
          name: itemName,
          isDone: false,
          date: _Date,
          addedAt: new Date().getTime(),
          subitem: []
        };
        todoItems.push(itemObj);
        // set local storage
        setLocalStorage(todoItems);
        showAlert("New item has been added.", "alert-success");
      }
      const _filterType = document.querySelector("#filterType").value;
      getItemsFilter(_filterType);

    }
    console.log(todoItems);
    itemInput.value = "";
    taskdate.value = '';
  });

  // filters
  filters.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      _tabType = tabType;
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      document.querySelector("#filterType").value = tabType;
      getItemsFilter(tabType);
    });
  });

  // load items
  getLocalStorage();
});
// search
function myFunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("itemList");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}