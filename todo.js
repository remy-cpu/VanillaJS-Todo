window.addEventListener('load', function () {
  //读取本地数据
  function getData() {
    var data = localStorage.getItem("storeUsers");
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }
  //保存本地存储数据
  function saveData(data) {
    localStorage.setItem("storeUsers", JSON.stringify(data));
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


  //登陆注册
  RegAndLog();
  function RegAndLog() {
    var register = document.querySelector('.a_register');//注册框
    var login = document.querySelector('.a_login');//登陆框
    var fade = document.querySelectorAll('.fade');//隐藏功能框
    var back = register.querySelector('#back');//返回登陆
    var toRegister = login.querySelector('.to_register');//去注册
    var registerBtn = register.querySelector('.btn');//注册按钮
    var loginBtn = login.querySelector('.btn');//登录按钮
    var nameInput1 = register.querySelector('.name');//注册昵称
    var nameInput2 = login.querySelector('.name');//登陆昵称
    var pwdInput1 = register.querySelector('.pwd');//注册密码
    var pwdInput2 = login.querySelector('.pwd');//登陆密码
    var autoCheck = login.querySelector('.auto_check');//自动登陆
    var cur_name = document.querySelector('.cur_name');//头部用户名
    var person = document.querySelector(".person");
    var withdraw = document.querySelector(".withdraw");
    var personal = document.querySelector(".personal");
    var users = getData();
    var dels = getDeleted();
    var online = false;//标记在线状态；
    localStorage.removeItem("onlineUser");

    function Match(arr) {
      var onlineUser = JSON.parse(window.localStorage.getItem('onlineUser'));
      for (let i = 0, len = arr.length; i < len; i++) {
        if (onlineUser == arr[i].name) {
          return i;
        }
      }
    }

    var cnt = Match(users);
    var num = Match(dels);

    addItem();
    function addItem() {
      //创建新的li
      var input = document.querySelector('.input');
      input.onkeyup = function (e) {
        if (input.value == '') {
          return false;
        }
        if (e.keyCode == 13) {
          if (!online) {
            showTips("请先登录 ！");
            input.value = '';
            return false;
          }
          var users = getData();
          cnt = Match(users);
          var index;
          for (var i = 0; i < users[cnt].todos.length; i++) {
            if (users[cnt].todos[i].priority == 0) {
              index = i;
              break;
            }
          }
          var obj = {
            title: this.value,
            completed: false,
            priority: 0
          };
          users[cnt].todos.splice(index, 0, obj);
          saveData(users);
          load();
          var flag = true;
          var selects = document.querySelectorAll(".list_li .select");
          var selectAll = document.querySelector("#selectAll");
          if (selects.length == 0) {
            return false;
          }
          for (let i = 0, len = selects.length; i < len; i++) {
            if (!selects[i].checked) {
              flag = false;
              selectAll.checked = false;
            }
          }
          if (flag == true) {
            selectAll.checked = true;
          } else {
            selectAll.checked = false;
          }
          //每次都先把新的li添加到本地存储，再连同之前的小li一起渲染到页面上
          input.value = '';
        }
      }
    }

    function load() {
      var list = document.querySelector('.list');
      //读取本地数据
      var users = getData();
      cnt = Match(users);
      //遍历之前先要清空ul里的元素内容
      list.innerHTML = "";
      var todoCount = users[cnt].todos.length;
      var selectAll = document.querySelector("#selectAll");
      //遍历数据 i是索引,n是元素
      for (let i = 0, len = users[cnt].todos.length; i < len; i++) {
        var li = document.createElement('li');
        var lihtml = ''
          + ' <input type="checkbox" class="select"></input>'
          + ' <span class="mark"> </span>'
          + ' <div class="words">' + users[cnt].todos[i].title + '</div>'
          + ' <span class="delete" id=' + i + '>x</span>'
          + ' <div class="funct">'
          + '   <span class="ellipsis">···</span>'
          + '   <ul class="sort">'
          + '     <li>优先级</li>'
          + '     <li class="senior">!!!</li>'
          + '     <li class="junior">!!</+li>'
          + '     <li class="common">!</li>'
          + '   </ul>'
          + ' </div>';
        li.innerHTML = lihtml;
        li.classList.add("list_li");
        list.appendChild(li);
        var words = li.querySelector(".words");
        var mark = li.querySelector(".mark");
        var select = li.querySelector(".select");
        var senior = li.querySelector(".senior");
        var junior = li.querySelector(".junior");
        if (users[cnt].todos[i].completed == true) {
          words.classList.add("strickout");
          words.style.color = 'rgb(163, 162, 162,0.4)';
          todoCount--;
          select.checked = true;
        }
        if (users[cnt].todos[i].completed == false) {
          words.classList.remove("strickout");
          words.style.color = '#737373';
          select.checked = false;

        }
        if (users[cnt].todos[i].priority == 2) {
          mark.innerText = senior.innerText;
          mark.classList.add("senior");
        } else if (users[cnt].todos[i].priority == 1) {
          mark.innerText = junior.innerText;
          mark.classList.add("junior");
        }
      }
      if (users[cnt].todos.length == 0) {
        selectAll.checked = false;
      }
      saveData(users);
      showBox();
      editItem();
      showCount(todoCount);
      showItem();
      showdels();
    }

    sortItem();
    function sortItem() {
      var list = document.querySelector(".list");
      list.addEventListener("click", function (e) {
        var target = e.target;
        var item = target.parentElement;
        var parentli = target.parentElement.parentElement.parentElement;
        var del = parentli.querySelector(".delete");
        var index = del.getAttribute("id");
        var users = getData();
        cnt = Match(users);
        if (target.classList.contains("ellipsis")) {
          var sort = item.querySelector(".sort");
          sort.style.display = "block";
        } else if (target.classList.contains("senior")) {
          users[cnt].todos[index].priority = 2;
          enqueue(users[cnt].todos[index]);
          load();
        } else if (target.classList.contains("junior")) {
          users[cnt].todos[index].priority = 1;
          enqueue(users[cnt].todos[index]);
          load();
        } else if (target.classList.contains("common")) {
          users[cnt].todos[index].priority = 0;
          enqueue(users[cnt].todos[index]);
          load();
        }
      })
    }

    function enqueue(element) {
      var users = getData();
      cnt = Match(users);
      var item = users[cnt].todos;
      var len = item.length;
      if (len == 0) {
        users[cnt].todos.push(element);
      } else {
        var index;
        for (var i = 0; i < len; i++) {
          if (element.title == item[i].title) {
            index = i;
            break;
          }
        }
        item.splice(index, 1);
        for (var i = 0; i < len; i++) {
          if (element.priority > item[i].priority || element.priority == item[i].priority) {
            item.splice(i, 0, element);
            break;
          }
        }
      }
      saveData(users);
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

    //放三个按钮的那一栏
    function showBox() {
      var footer = document.querySelector(".footer");
      var users = getData();
      cnt = Match(users);
      if (users[cnt].todos.length == 0) {
        footer.style.display = "none";
      } else {
        footer.style.display = "block";
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
          var users = getData();
          var deletedArr = getDeleted();
          index = target.getAttribute("id");
          //调用splice会改变原数组
          var deletedItem = users[cnt].todos.splice(index, 1);
          num = Match(dels);
          deletedArr[num].done.push(deletedItem[0]);
          saveDeleted(deletedArr);
          saveData(users);
          load();
          //全部都为true，则让全选按钮为true
          var flag = true;
          var selects = document.querySelectorAll(".list_li .select");
          var selectAll = document.querySelector("#selectAll");
          if (selects.length == 0) {
            return false;
          }
          for (let i = 0, len = selects.length; i < len; i++) {
            if (!selects[i].checked) {
              flag = false;
              selectAll.checked = false;
            }
          }
          if (flag == true) {
            selectAll.checked = true;
          } else {
            selectAll.checked = false;
          }
        } else if (target.classList.contains("select")) {
          var users = getData();
          var del = item.querySelector(".delete");
          index = del.getAttribute("id");
          users[cnt].todos[index].completed = !users[cnt].todos[index].completed;
          saveData(users);
          load();
          //全部都为true，则让全选按钮为true
          var flag = true;
          var selects = document.querySelectorAll(".list_li .select");
          var selectAll = document.querySelector("#selectAll");
          if (selects.length == 0) {
            return false;
          }
          for (let i = 0, len = selects.length; i < len; i++) {
            if (!selects[i].checked) {
              flag = false;
              selectAll.checked = false;
            }
          }
          if (flag == true) {
            selectAll.checked = true;
          } else {
            selectAll.checked = false;
          }

        }
      })
    }

    //问题：如果selectall是选中状态，退出登陆后仍为选中状态；
    //因为之前设置selectall状态都是根据页面上的select和数组里的completed；
    //退出登陆后这些数据还在

    //clear_completed的功能
    clearItem();
    function clearItem() {
      var clearCompleted = document.querySelector(".clear_completed");
      var labelAll = document.querySelector("#labelAll");
      var selectAll = document.querySelector("#selectAll");
      labelAll.addEventListener("click", function () {
        onlineUser = JSON.parse(window.localStorage.getItem('onlineUser'));
        if (onlineUser == null) {
          return false;
        }
        var users = getData();
        cnt = Match(users);
        for (var i = 0, len = users[cnt].todos.length; i < len; i++) {
          //全选按钮选中时变亮，而字体变暗
          users[cnt].todos[i].completed = selectAll.checked ? false : true;
        }
        saveData(users);
        load();
      })

      clearCompleted.addEventListener("click", function () {
        var users = getData();
        var dels = getDeleted();
        cnt = Match(users);
        num = Match(dels);
        if (selectAll.checked) {
          dels[num].done = dels[num].done.concat(users[cnt].todos);
          saveDeleted(dels);
          users[cnt].todos = [];
          saveData(users);
          load();
        } else {
          //remove放着completed = true的元素
          var remove = users[cnt].todos.filter(function (item) {
            return item.completed == true;
          });
          dels[num].done = dels[num].done.concat(remove);
          saveDeleted(dels);
          users[cnt].todos = users[cnt].todos.filter(function (item) {
            return item.completed != true;
          });
          //还差删除的元素放到deleted
          saveData(users);
          load();
        }
      })
    }

    //编辑item
    editItem();
    function editItem() {
      var list = document.querySelector('.list');
      list.addEventListener("dblclick", function (e) {
        var target = e.target;
        var item = target.parentElement;
        var users = getData();
        if (target.classList.contains("words")) {
          var del = item.querySelector(".delete");
          index = del.getAttribute("id");
          var oldhtml = target.innerHTML;
          if (oldhtml.indexOf('type="text"') > 0) {
            return;
          }
          var newobj = document.createElement("input");
          newobj.type = 'text';
          newobj.value = oldhtml;
          newobj.onblur = function () {
            //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值 
            if (this.value && this.value.trim() !== "") {
              target.innerHTML = this.value == oldhtml ? oldhtml : this.value;
              users[cnt].todos[index].title = this.value;
            } else {
              target.innerHTML = oldhtml;
            }
            saveData(users);
          }
          target.innerHTML = '';
          target.appendChild(newobj);
          //设置选择文本的内容或设置光标位置
          //（两个参数：start,end；start为开始位置，end为结束位置；
          //如果开始位置和结束位置相同则就是光标位置）
          newobj.setSelectionRange(0, oldhtml.length);
          newobj.focus();
        }
      })
    }

    //显示和隐藏所有/未完成/已完成/删除的li
    function showItem() {
      var list = document.querySelector('.list');
      var btnsBox = document.querySelector(".btns_box");
      btnsBox.addEventListener("click", function (e) {
        var target = e.target;
        var btns = btnsBox.querySelectorAll("li");
        if (target.classList.contains("all")) {
          var users = getData();
          var lis = list.querySelectorAll(".list_li");
          for (var i = 0, len = users[cnt].todos.length; i < len; i++) {
            lis[i].style.display = 'block';
          }
          saveData(users);
          for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('selected');
          }
          target.classList.add('selected');
        } else if (target.classList.contains("active")) {
          users = getData();
          var lis = list.querySelectorAll(".list_li");
          for (var i = 0, len = users[cnt].todos.length; i < len; i++) {
            if (users[cnt].todos[i].completed == true) {
              lis[i].style.display = 'none';
            }
            if (users[cnt].todos[i].completed == false) {
              lis[i].style.display = 'block';
            }
          }
          saveData(users);
          for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('selected');
          }
          target.classList.add('selected');
        } else if (target.classList.contains("completed")) {
          users = getData();
          var lis = list.querySelectorAll(".list_li");
          for (var i = 0, len = users[cnt].todos.length; i < len; i++) {
            //如果都是未完成
            if (users[cnt].todos[i].completed == true) {
              lis[i].style.display = 'block';
            }
            if (users[cnt].todos[i].completed == false) {
              lis[i].style.display = 'none';
            }
          }
          saveData(users);
          for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('selected');
          }
          target.classList.add('selected');
        }
      })
    }

    recycler();
    function recycler() {
      var lis = document.querySelectorAll("nav>ul>li");
      var recycle = document.querySelector(".recycle");
      var list2 = document.querySelector(".list2");
      onlineUser = JSON.parse(window.localStorage.getItem('onlineUser'));
      lis[0].onmouseenter = function () {
        if (onlineUser == null) {
          return false;
        }
        recycle.style.display = "block";
      }
      lis[0].onmouseleave = function () {
        recycle.style.display = "none";
      }
      var empty = document.querySelector(".empty");

      empty.onclick = function () {
        var dels = getDeleted();
        num = Match(dels);
        dels[num].done = [];
        saveDeleted(dels);
        showdels();
      }

      list2.addEventListener("click", function (e) {
        var dels = getDeleted();
        var users = getData();
        cnt = Match(users);
        num = Match(dels);
        var target = e.target;
        var item = target.parentElement;
        var log = item.querySelector(".log");
        //index查找要还原的li的序号
        var index;
        if (target.classList.contains("restore")) {
          var txt = log.innerText;
          for (let i = 0, len = dels[num].done.length; i < len; i++) {
            if (txt == dels[num].done[i].title) {
              dels[num].done[i].priority = 0;
              index = i;
              break;
            }
          }
          //temp查找同为0级的li，好插到他前面去
          var temp;
          for (var i = 0; i < users[cnt].todos.length; i++) {
            if (users[cnt].todos[i].priority == 0) {
              temp = i;
              break;
            }
          }
          var which = dels[num].done.splice(index, 1);
          users[cnt].todos.splice(temp, 0, which[0]);
          //users[cnt].todos = users[cnt].todos.concat(which);

          saveData(users);
          load();
          var flag = true;
          var selects = document.querySelectorAll(".list_li .select");
          var selectAll = document.querySelector("#selectAll");
          if (selects.length == 0) {
            return false;
          }
          for (let i = 0, len = selects.length; i < len; i++) {
            if (!selects[i].checked) {
              flag = false;
              selectAll.checked = false;
            }
          }
          if (flag == true) {
            selectAll.checked = true;
          } else {
            selectAll.checked = false;
          }
          saveDeleted(dels);
          showdels();
        }
      })
    }

    function showdels() {
      var dels = getDeleted();
      num = Match(dels);
      var list2 = document.querySelector(".list2");
      var empty = document.querySelector(".empty");
      if (dels[num].done.length == 0) {
        var zone = "<p>The recycle bin is empty.</p>"
        list2.innerHTML = zone;
        empty.style.display = "none";
      } else {
        list2.innerHTML = "";
        empty.style.display = "block";
        //遍历数据 i是索引,n是元素
        for (var i = 0, len = dels[num].done.length; i < len; i++) {
          var li = document.createElement('li');
          var lihtml = ''
            + ' <div class="log">' + dels[num].done[i].title + '</div>'
            + ' <span class="restore">restore</span>';
          li.innerHTML = lihtml;
          list2.appendChild(li);
        }
      }
    }

    //每次关闭都要清空
    function clearbox() {
      nameInput1.value = '';
      nameInput2.value = '';
      pwdInput1.value = '';
      pwdInput2.value = '';
    }

    //显示提示
    function showTips(tips) {
      var tipBox = document.querySelector('.tip_box');
      tipBox.style.display = 'block';
      tipBox.innerText = tips;
      var timer = setTimeout(function () {
        tipBox.style.display = 'none';
        clearTimeout(timer);
      }, 1000);
    }

    cur_name.onclick = function () {
      if (!online) {
        login.style.display = 'block';
      }
    }
    cur_name.onmousemove = function () {
      if (online) {
        personal.style.display = "block";
        var users = getData();
        var len = users[cnt].todos.length;
        var total = document.querySelector(".total_count");
        total.innerText = len;
      }
    }
    cur_name.onmouseleave = function () {
      personal.style.display = "none";
    }
    withdraw.onclick = function (e) {
      online = false;
      localStorage.removeItem('onlineUser');
      recycler();
      var footer = document.querySelector(".footer");
      footer.style.display = "none";
      personal.style.display = "none";
      person.innerText = "未登录";
      var list = document.querySelector('.list');
      list.innerHTML = '';
      var selectAll = document.querySelector("#selectAll");
      if (list.innerHTML == '') {
        selectAll.checked = false;
      }
      e.stopPropagation();
    }
    back.onclick = function () {
      register.style.display = 'none';
      login.style.display = 'block';
      clearbox();
    }
    toRegister.onclick = function () {
      register.style.display = 'block';
      login.style.display = 'none';
      clearbox();
    }
    for (var i = 0; i < fade.length; i++) {
      fade[i].onclick = function () {
        login.style.display = 'none';
        register.style.display = 'none';
        clearbox();
      }
    }

    var name, password;
    registerBtn.onclick = function () {
      var Reg1 = /^[\w\W]{1,15}$/;
      for (var i = 0, len = users.length; i < len; i++) {
        if (nameInput1.value == users[i].name) {
          showTips("该账号已存在 !");
          return false;//如果存在，会直接跳出nameinput.onkeyup
        }
      }
      if (Reg1.test(nameInput1.value)) {
        name = nameInput1.value;
      }
      var Reg2 = /^[\w!@#$%^&*(),.?]{6,18}$/;
      if (Reg2.test(pwdInput1.value)) {
        password = pwdInput1.value;
      } else {
        showTips('密码格式不对 !');
        return false;
      }
      var obj = {
        name: name,
        password: password,
        todos: []
      }
      var bin = {
        name: name,
        done: []
      }
      users.push(obj);
      dels.push(bin);
      saveData(users);
      saveDeleted(dels);
      showTips('注册成功 !');
      login.style.display = 'block';
    }

    //登陆按钮，以及后续的验证
    loginBtn.onclick = function () {
      //flag标记该用户是否已经注册
      var flag = false;
      var index = 0;
      name = nameInput2.value;
      password = pwdInput2.value;

      for (var i = 0; i < users.length; i++) {
        if (name == users[i].name) {
          flag = true;
          index = i;
        }
      }
      if (flag) {
        if (password == users[index].password) {
          //登陆后，将属于该用户的信息放入数组中；
          window.localStorage.setItem("onlineUser", JSON.stringify(name));
          onlineUser = JSON.parse(window.localStorage.getItem('onlineUser'));
          online = true;
          if (onlineUser) {
            //头部用户名显示
            person.innerHTML = onlineUser + ",欢迎回来~";
          }
          login.style.display = 'none';
          register.style.display = 'none';
          clearbox();
          load();
          var num = 0;
          var selects = document.querySelectorAll(".select");
          for (var i = 0; i < selects.length; i++) {
            if (selects[i].checked == true) {
              num++;
            }
          }
          if (num == selects.length && num != 0) {
            selectAll.checked = true;
          }
        } else {
          showTips('密码错误 !');
        }
      } else {
        showTips('账号不存在或输入错误 !');
        return false;
      }
    }
  }
})