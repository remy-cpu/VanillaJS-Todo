window.addEventListener('load', function () {
  //读取本地数据
  function getData() {
    var data = localStorage.getItem("todos");
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  //保存本地存储数据
  function saveData(data) {
    localStorage.setItem("todos", JSON.stringify(data));
  }

  //获取删除的数据
  function getDeleted() {
    var data = localStorage.getItem("dels");
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }

  //保存删除的数据
  function saveDeleted(data) {
    localStorage.setItem("dels", JSON.stringify(data));
  }

  //放三个按钮的那一栏
  function showBox() {
    var footer = document.querySelector(".footer");
    var data = getData();
    if (data.length == 0) {
      footer.style.display = "none";
    } else {
      footer.style.display = "block";
    }
  }

  //初始化页面
  load();
  //渲染加载数据
  function load() {
    showBox();
    //selectAll();
    var list = document.querySelector('.list');
    //读取本地数据
    var data = getData();
    //遍历之前先要清空ul里的元素内容
    list.innerHTML = "";
    var todoCount = data.length;
    //遍历数据 i是索引,n是元素
    for (var i = 0, len = data.length; i < len; i++) {
      var li = document.createElement('li');
      var lihtml = ''
        + ' <input type="checkbox" class="select"></input>'
        + ' <div class="words">' + data[i].title + '</div>'
        + ' <span class="delete" id=' + i + '>x</span>';
      li.innerHTML = lihtml;
      li.classList.add("list_li");
      list.appendChild(li);
      var words = li.querySelector(".words");
      if (data[i].completed == true) {
        words.classList.add("strickout");
        words.style.color = 'rgb(163, 162, 162,0.4)';
        todoCount--;
      }
      if (data[i].completed == false) {
        words.classList.remove("strickout");
        words.style.color = '#737373';
      }
    }
    saveData(data);
    showCount(todoCount);
    showItem();
  }

  //显示未完成数
  function showCount(count) {
    var activeCount = document.querySelector(".active_count");
    if (count > 0) {
      activeCount.innerText = count + " items left";
    } else {
      activeCount.innerText = "0 item left";
    }
  }

  //创建新的li
  var input = document.querySelector('.input');
  input.onkeyup = function (e) {
    if (input.value == '') {
      alert("输入内容不能为空");
      return false;
    }
    if (e.keyCode == 13) {
      var data = getData();
      var len = data.length;
      data.push({ title: this.value, id: len, completed: false });
      saveData(data);
      //每次都先把新的li添加到本地存储，再连同之前的小li一起渲染到页面上
      load();
      input.value = '';
    }
  }

  //删除和使li变为完成状态
  dealItem();
  function dealItem() {
    var list = document.querySelector('.list');
    list.addEventListener("click", function (e) {
      var target = e.target;
      var item = target.parentElement;
      var index;
      if (target.classList.contains("delete")) {
        var data = getData();
        var deletedArr = getDeleted();
        index = target.getAttribute("id");
        //调用splice会改变原数组
        var deletedItem = data.splice(index, 1);
        deletedArr.push(deletedItem[0]);
        for (var i = 0, len = data.length; i < len; i++) {
          data[i].id = i;
        }
        for (var i = 0, len = deletedArr.length; i < len; i++) {
          deletedArr[i].id = i;
        }
        saveDeleted(deletedArr);
        saveData(data);
        load();
      } else if (target.classList.contains("select")) {
        var data = getData();
        var del = item.querySelector(".delete");
        index = del.getAttribute("id");
        data[index].completed = !data[index].completed;
        saveData(data);
        load();
      }
    })
  }

  //显示和隐藏所有/未完成/已完成/删除的li
  function showItem() {
    var list = document.querySelector('.list');
    var list2 = document.querySelector(".list2");
    var btnsBox = document.querySelector(".btns_box");
    btnsBox.addEventListener("click", function (e) {
      var target = e.target;
      var btns = btnsBox.querySelectorAll("li");
      var data = getData();
      var len = data.length;
      if (target.classList.contains("all")) {
        list.style.display = "block";
        list2.style.display = "none";
        var lis = list.querySelectorAll("li");
        for (var i = 0; i < len; i++) {
          lis[i].style.display = 'block';
        }
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.remove('selected');
        }
        target.classList.add('selected');
      } else if (target.classList.contains("active")) {
        list.style.display = "block";
        list2.style.display = "none";
        var lis = list.querySelectorAll("li");
        for (var i = 0; i < len; i++) {
          if (data[i].completed == true) {
            lis[i].style.display = 'none';
          } else {
            lis[i].style.display = 'block';
          }
        }
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.remove('selected');
        }
        target.classList.add('selected');
      } else if (target.classList.contains("completed")) {
        list.style.display = "block";
        list2.style.display = "none";
        var lis = list.querySelectorAll("li");
        for (var i = 0; i < len; i++) {
          //如果都是未完成
          if (data[i].completed == true) {
            lis[i].style.display = 'block';
          } else {
            lis[i].style.display = 'none';
          }
        }
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.remove('selected');
        }
        target.classList.add('selected');
      } else if (target.classList.contains("deleted")) {
        list2.style.display = "block";
        list.style.display = "none";
        var deletedArr = getDeleted();
        var deletedHtml = '';
        for (var i = 0, len = deletedArr.length; i < len; i++) {
          deletedHtml += ''
            + '<li class="list_li">'
            + ' <input type="checkbox" class="select"></input>'
            + ' <div class="words">' + deletedArr[i].title + '</div>'
            + ' <span class="delete" id=' + i + '>x</span>'
            + '</li>';
        }
        list2.innerHTML = deletedHtml;
        for (var i = 0; i < btns.length; i++) {
          btns[i].classList.remove('selected');
        }
        target.classList.add('selected');
      }
    })
  }

  //clear_completed的功能
  clearItem();
  function clearItem() {
    var clearCompleted = document.querySelector(".clear_completed");
    var labelAll = document.querySelector("#labelAll");
    var selectAll = document.querySelector("#selectAll");
    labelAll.onclick = function () {
      var data = getData();
      for (var i = 0, len = data.length; i < len; i++) {
        //全选按钮选中时变亮，而字体变暗
        data[i].completed = selectAll.checked ? false : true;
      }
      saveData(data);
      load();
    }

  }

})


