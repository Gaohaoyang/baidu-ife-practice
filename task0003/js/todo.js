//全局变量
var currentCateId = -1; //当前分类id
var currentCateTable = "AllCate"; //当前分类表
var currentTaskId = -1; //当前任务 id

initAll();

function initAll() {
    // localStorage.clear();
    initDataBase(); //初始化数据表
    initCates(); //初始化分类
    initModal(); //初始化模态框
    $("#task-list").innerHTML = createTaskList(queryAllTasks()); //初始化任务列表
    cateTaskStatusController(); //任务状态分类
    generateTaskById(-1); //初始化任务详细
    addClass($("[taskid]"), "active"); //将第一个有 taskid 属性的元素高亮
    // clickSaveOrCancel(); //保存或放弃保存任务
    listAllStorage();
}

//*******数据库设计************

/**
 *
 * 使用数据库的思想，构建3张表。
 * cateJson 分类
 * childCateJson 子分类
 * taskJson 任务
 *
 * 分类表 cate
 * ----------------------
 * id* | name | child(fk)
 * ----------------------
 *
 * 子分类表 childCate
 * ----------------------------
 * id* | pid | name | child(fk)
 * ----------------------------
 *
 * 任务表 task
 * ------------------------------------------
 * id* | pid | finish | name | date | content
 * ------------------------------------------
 */
function initDataBase() {
    if (!localStorage.cate || !localStorage.childCate || !localStorage.task) {

        var cateJson = [{
                "id": 0,
                "name": "默认分类",
                "child": [0]
            }
            /*, {
            "id": 1,
            "name": "工作",
            "child": [1, 2]
        }, {
            "id": 2,
            "name": "生活",
            "child": [3]
        }*/
        ];

        var childCateJson = [{
                "id": 0,
                "pid": 0,
                "name": "默认子分类",
                "child": [-1],
            }
            /*, {
            "id": 1,
            "pid": 1,
            "name": "前端",
            "child": [0, 1, 2],
        }, {
            "id": 2,
            "pid": 1,
            "name": "服务端",
            "child": [3],
        }, {
            "id": 3,
            "pid": 2,
            "name": "吃饭",
            "child": [],
        }*/
        ];

        var taskJson = [{
                "id": -1,
                "pid": 0,
                "finish": true,
                "name": "使用说明",
                "date": "2015-06-05",
                "content": "本应用为离线应用，数据将存储在本地硬盘<br><br>左侧为分类列表<br>中间为当前分类下的任务列表<br>右侧为任务详情<br><br>可以添加删除分类，添加任务，修改任务，以及给任务标记是否完成等功能<br><br>by <a target='_blank' href='http://gaohaoyang.github.io'>Gaohaoyang</a>",
            }
            /*, {
            "id": 0,
            "pid": 1,
            "finish": true,
            "name": "task1",
            "date": "2015-05-10",
            "content": "百度ife任务1",
        }, {
            "id": 1,
            "pid": 1,
            "finish": false,
            "name": "Sass",
            "date": "2015-05-31",
            "content": "学习慕课网的视频Sass",
        }, {
            "id": 2,
            "pid": 1,
            "finish": false,
            "name": "AMD",
            "date": "2015-05-31",
            "content": "学习AMD",
        }, {
            "id": 3,
            "pid": 2,
            "finish": false,
            "name": "drools",
            "date": "2015-06-31",
            "content": "研究drools推理引擎",
        }*/
        ];

        // DataBase init
        localStorage.cate = JSON.stringify(cateJson);
        localStorage.childCate = JSON.stringify(childCateJson);
        localStorage.task = JSON.stringify(taskJson);
    }
}

// *********query*************
/**
 * 查询所有分类
 * @return {Array} 对象数组
 */
function queryCates() {
    return JSON.parse(localStorage.cate);
}

/**
 * 通过id查询分类  暂时没用到
 * @param  {number} id
 * @return {Object}    一个分类对象
 */
function queryCateById(id) {
    var cate = JSON.parse(localStorage.cate);
    for (var i = 0; i < cate.length; i++) {
        if (cate[i].id == id) {
            return cate[i];
        }
    }
}

/**
 * 根据主分类 id 查询任务个数
 * @param  {number} id 主分类 id
 * @return {number}    任务个数
 */
function queryTasksLengthByCateId(id) {
    var cate = queryCateById(id);
    var result = 0;
    if (cate.child.length !== 0) {
        for (var i = 0; i < cate.child.length; i++) {
            var childCate = queryChildCatesById(cate.child[i]);
            result += childCate.child.length;
        }
    }
    return result;
}

/**
 * 根据主分类查询任务个数
 * @param  {Object} cateObject 主分类对象
 * @return {number}            任务个数
 */
function queryTasksLengthByCate(cateObject) {
    var result = 0;
    if (cateObject.child.length !== 0) {
        for (var i = 0; i < cateObject.child.length; i++) {
            var childCate = queryChildCatesById(cateObject.child[i]);
            result += childCate.child.length;
        }
    }
    return result;
}
// console.log(queryTasksLengthByCateId(0));
// console.log(queryTasksLengthByCateId(1));
// console.log(queryTasksLengthByCateId(2));
// console.log(queryCateById(1));

/**
 * 查询所有子分类
 * @return {Array} 子分类对象数组
 */
function queryAllChildCates() {
    return JSON.parse(localStorage.childCate);
}
/**
 * 根据 id 查找子分类
 * @param  {number} id
 * @return {Object}    一个子分类对象
 */
function queryChildCatesById(id) {
    var childCate = JSON.parse(localStorage.childCate);
    for (var i = 0; i < childCate.length; i++) {
        if (childCate[i].id == id) {
            return childCate[i];
        }
    }
}
console.log(queryChildCatesById(0));
// console.log("queryChildCatesById----->" + queryChildCatesById(0));
// console.log(queryChildCatesById(0));

// console.log("queryChildCatesByIdArray---->" + queryChildCatesByIdArray([0, 1]));
// console.log(queryChildCatesByIdArray([0, 1]));
/**
 * 根据一个 id 数组查询子分类
 * @param  {Array} idArr id 数组
 * @return {Array}       子分类对象数组
 */
function queryChildCatesByIdArray(idArr) {
    if (isArray(idArr)) {
        var cateArr = [];
        for (var i = 0; i < idArr.length; i++) {
            cateArr.push(queryChildCatesById(idArr[i]));
        }
        return cateArr;
    }
}

/**
 * 查询所有任务
 * @param {boolean} status 任务完成状态
 * @return {Array} 任务对象数组
 */
function queryAllTasks(status) {
    var tasksArr = JSON.parse(localStorage.task);
    var resultArr = [];
    if (status !== undefined) {
        for (var i = 0; i < tasksArr.length; i++) {
            if (status) {
                if (tasksArr[i].finish === true) {
                    resultArr.push(tasksArr[i]);
                }
            } else {
                if (tasksArr[i].finish === false) {
                    resultArr.push(tasksArr[i]);
                }
            }
        }
        return resultArr;
    } else {
        return tasksArr;
    }
}
// console.log(queryAllTasks(true));

/**
 * 根据日期在指定任务列表中查询任务
 * @param  {String} date 日期字符串
 * @param  {Array} taskArr 指定任务对象列表
 * @return {Array}      任务对象数组
 */
function queryTasksByDateInTaskArr(date, taskArr) {
    var tasks = [];
    // var allTasks = queryAllTasks();
    for (var i = 0; i < taskArr.length; i++) {
        if (taskArr[i].date == date) {
            tasks.push(taskArr[i]);
        }
    }
    return tasks;
}

/**
 * 根据 id 查询任务
 * @param  {number} id 任务 id
 * @return {Object}    一个任务对象
 */
function queryTaskById(id) {
    var allTasks = queryAllTasks();
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id == id) {
            return allTasks[i];
        }
    }
}
// console.log("queryTaskById(3)");
// console.log(queryTaskById(3));

/**
 * 根据子分类 id 查询任务
 * @param  {number} id 子分类 id
 * @param  {String} status 任务完成状态
 * @return {Array}    任务对象数组
 */
function queryTasksByChildCateId(id, status) {
    var resultArr = [];
    var tempArr = queryChildCatesById(id).child;
    console.log("子分类对象 child 字段内容---->" + tempArr);
    for (var i = 0; i < tempArr.length; i++) {
        var task = queryTaskById(tempArr[i]);
        if (status !== undefined) {
            console.log(status);
            if (status) {
                if (task.finish === true) {
                    resultArr.push(task);
                }
            } else {
                if (task.finish === false) {
                    resultArr.push(task);
                }
            }
        } else {
            resultArr.push(task);
        }
    }
    console.log(resultArr + "----------success");
    return resultArr;

}
// console.log("单独测试");
// console.log(queryTasksByChildCateId(0, false));

/**
 * 根据主分类 id 查询任务
 * @param  {number} id 主分类 id
 * @param  {String} status 任务完成状态
 * @return {Array}    任务对象数组
 */
function queryTasksByCateId(id, status) {
    var resultArr = [];
    var cateChild = queryCateById(id).child;
    for (var i = 0; i < cateChild.length; i++) {
        if (status !== undefined) {
            console.log(status);
            resultArr = resultArr.concat(queryTasksByChildCateId(cateChild[i], status));
        } else {
            resultArr = resultArr.concat(queryTasksByChildCateId(cateChild[i]));
        }
    }
    return resultArr;
}
// console.log(queryTasksByCateId(1, true));
console.log(queryTasksByCateId(0));


//**********************ADD**************************
/**
 * 添加分类
 * @param {String} name 分类名称
 */
function addCate(name) {
    if (!name) {
        console.log("name is undefined");
    } else {
        var cateJsonTemp = JSON.parse(localStorage.cate);
        var newCate = {};
        newCate.id = cateJsonTemp[cateJsonTemp.length - 1].id + 1;
        newCate.name = name;
        newCate.child = [];
        cateJsonTemp.push(newCate);
        localStorage.cate = JSON.stringify(cateJsonTemp);
        console.log(cateJsonTemp);
        console.log(newCate);
    }
}

/**
 * 添加子分类
 * @param {number} pid  父节点 id
 * @param {String} name 子分类名称
 */
function addChildCate(pid, name) {
    if (!pid || !name) {
        console.log("pid or name is undefined");
    } else {
        var childCateJsonTemp = JSON.parse(localStorage.childCate);
        var newChildCate = {};
        newChildCate.id = childCateJsonTemp[childCateJsonTemp.length - 1].id + 1;
        newChildCate.pid = pid;
        newChildCate.name = name;
        newChildCate.child = [];

        childCateJsonTemp.push(newChildCate);
        localStorage.childCate = JSON.stringify(childCateJsonTemp);

        //同时将父分类中的 child 添加数字
        updateCateChildByAdd(pid, newChildCate.id);

    }
}

/**
 * 添加一个任务
 * @param {Object} taskObject 任务对象，但是不包含 id 属性
 */
function addTask(taskObject) {
    var taskArr = queryAllTasks();
    taskObject.id = taskArr[taskArr.length - 1].id + 1; //id 生成
    taskArr.push(taskObject);
    console.log(taskObject);
    console.log(taskArr);

    updateChildCateChildByAdd(taskObject.pid, taskObject.id); //更新子分类的 child 字段
    localStorage.task = JSON.stringify(taskArr);

    return taskObject.id; //将当前任务 id 返回，方便调用
}
// console.log(queryAllTasks()[queryAllTasks().length-1].id+1);
// {
//            "id": 4,
//            "pid": 2,
//            "finish": false,
//            "name": "运维",
//            "date": "2015-05-31",
//            "content": "数据库备份",
//        }
//*****************UPDATE*******************
/**
 * 更新分类的 child 字段
 * 添加一个 childId 到 这个 id 的分类对象里
 * @param  {number} id      要更新的分类的 id
 * @param  {number} childId 要添加的 childId
 * @return {[type]}         [description]
 */
function updateCateChildByAdd(id, childId) {

    var cate = JSON.parse(localStorage.cate);
    for (var i = 0; i < cate.length; i++) {
        if (cate[i].id == id) {
            cate[i].child.push(childId);
        }
    }
    localStorage.cate = JSON.stringify(cate);
}
/**
 * 更新分类的 child 字段
 * 删除一个 childId 在这个 id 的分类对象里
 * @param  {number} id      要更新的分类的 id
 * @param  {number} childId 要删除的 childId
 * @return {[type]}         [description]
 */
function updateCateChildByDelete(id, childId) {
    var cate = JSON.parse(localStorage.cate);
    for (var i = 0; i < cate.length; i++) {
        if (cate[i].id == id) {
            for (var j = 0; j < cate[i].child.length; j++) {
                if (cate[i].child[j] == childId) {
                    cate[i].child = deleteInArray(cate[i].child, j);
                }
            }
        }
    }
    localStorage.cate = JSON.stringify(cate);
}
// updateCateChildByAdd(1,3);
// listAllStorage();
// console.log("updateCateChildByDelete");
// updateCateChildByDelete(1, 0);
// listAllStorage();

/**
 * 更新子分类的 child 字段
 * 添加一个 childId 在这个 id 的子分类对象里
 * 添加一个 task 时使用
 * @param  {number} id      子分类 id
 * @param  {number} childId 要添加的 childId
 * @return {[type]}         [description]
 */
function updateChildCateChildByAdd(id, childId) {
    var childCate = queryAllChildCates();
    for (var i = 0; i < childCate.length; i++) {

        if (childCate[i].id == id) {
            childCate[i].child.push(childId);
        }
    }
    localStorage.childCate = JSON.stringify(childCate);
}
// updateChildCateChildByAdd(0,1000);
// listAllStorage();

/**
 * 根据任务 id 更新任务状态
 * @param  {number} taskId 任务 id
 * @return {[type]}        [description]
 */
function updateTaskStatusById(taskId) {
    var allTasks = queryAllTasks();
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id == taskId) {
            allTasks[i].finish = true;
        }
    }
    localStorage.task = JSON.stringify(allTasks);
}
// updateTaskStatusById(4);
// listAllStorage();

/**
 * 修改任务
 * @param  {number} id      任务id
 * @param  {String} name    任务标题
 * @param  {String} date    任务日期
 * @param  {String} content 任务内容
 * @return {[type]}         [description]
 */
function updateTaskById(id, name, date, content) {
    var allTasks = queryAllTasks();
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id == id) {
            allTasks[i].name = name;
            allTasks[i].date = date;
            allTasks[i].content = content;
        }
    }
    localStorage.task = JSON.stringify(allTasks);
}

//**************DELETE*****************

/**
 * 根据 id 删除分类
 * @param  {number} id 主分类 id
 * @return {[type]}    [description]
 */
function deleteCate(id) {
    var result = [];
    var cateArr = queryCates();
    for (var i = 0; i < cateArr.length; i++) {
        if (cateArr[i].id == id) {
            result = deleteInArray(cateArr, i);
            if (cateArr[i].child.length !== 0) {
                for (var j = 0; j < cateArr[i].child.length; j++) {
                    deleteChildCate(cateArr[i].child[j]);
                }
            }
        }
    }
    localStorage.cate = JSON.stringify(result);
}
// deleteCate(1);
// listAllStorage();
// initCates();
/**
 * 根据 id 删除子分类
 * @param  {number} id 子分类 id
 * @return {[type]}    [description]
 */
function deleteChildCate(id) {
    var result = [];
    var childCateArr = queryAllChildCates();
    for (var i = 0; i < childCateArr.length; i++) {
        if (childCateArr[i].id == id) {
            result = deleteInArray(childCateArr, i);
            //更新父节点中的 childId 字段
            updateCateChildByDelete(childCateArr[i].pid, childCateArr[i].id);
            //查看 child
            if (childCateArr[i].child.length !== 0) {
                for (var j = 0; j < childCateArr[i].child.length; j++) {
                    deleteTaskById(childCateArr[i].child[j]);
                }
            }
        }
    }
    localStorage.childCate = JSON.stringify(result); //save
}
// deleteChildCate(0);
// listAllStorage();
// initCates();

/**
 * 根据 id 删除一条任务
 * @param  {number} id 任务 id
 * @return {[type]}    [description]
 */
function deleteTaskById(id) {
    var result = [];
    var allTasksArr = queryAllTasks();
    for (var i = 0; i < allTasksArr.length; i++) {
        if (allTasksArr[i].id == id) {
            result = deleteInArray(allTasksArr, i);
        }
    }
    localStorage.task = JSON.stringify(result); //save
}
// deleteTaskById(0);
// listAllStorage();
/**
 * 列举所有存储内容 测试时使用
 * @return {[type]} [description]
 */
function listAllStorage() {
    console.log("=============listAllStorage==============");
    for (var i = 0; i < localStorage.length; i++) {
        var name = localStorage.key(i);
        var value = localStorage.getItem(name);
        console.log("name----->" + name);
        console.log("value---->" + value);
        console.log("---------------------");
    }
    console.log("======End=======listAllStorage==============");
}



//**********页面控制**************



//初始化分类
function initCates() {

    var cate = queryCates(); //查出所有分类
    var tempStr = '<ul>';
    var defaultChildCate = queryChildCatesById(0);

    for (var i = 0; i < cate.length; i++) {
        var liStr = "";

        if (cate[i].child.length === 0) {
            // if (i === 0) {
            //     liStr = '<li><h2 cateid=' + cate[i].id + ' onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (' + queryTasksLengthByCate(cate[i]) + ')</h2></li>';
            // } else {
            liStr = '<li><h2 cateid=' + cate[i].id + ' onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (' + queryTasksLengthByCate(cate[i]) + ')<i class="fa fa-trash-o" onclick="del(event,this)"></i></h2></li>';
            // }
        } else {
            if (i === 0) {
                // var childCateDefault = queryChildCatesById(0);
                // liStr = '<li><h2 cateid=' + cate[i].id + ' onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (' + queryTasksLengthByCate(cate[i]) + ')</h2><ul><li><h3 cateid=' + childCateArr[j].id + ' onclick="clickCate(this)"><i class="fa fa-file-o"></i><span>' + childCateDefault.name + '</span> (' + childCateDefault.length + ')</h3></li>';
                liStr = '<li><h2 cateid=0 onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (1)</h2><ul><li><h3 cateid=0 onclick="clickCate(this)"><i class="fa fa-file-o"></i><span>' + defaultChildCate.name + '</span> (' + defaultChildCate.child.length + ')</h3></li>';
            } else {
                liStr = '<li><h2 cateid=' + cate[i].id + ' onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (' + queryTasksLengthByCate(cate[i]) + ')<i class="fa fa-trash-o" onclick="del(event,this)"></i></h2><ul>';
                var childCateArr = queryChildCatesByIdArray(cate[i].child);
                for (var j = 0; j < childCateArr.length; j++) {
                    var innerLiStr = "";
                    innerLiStr = '<li><h3 cateid=' + childCateArr[j].id + ' onclick="clickCate(this)"><i class="fa fa-file-o"></i><span>' + childCateArr[j].name + '</span> (' + childCateArr[j].child.length + ')<i class="fa fa-trash-o" onclick="del(event,this)"></i></h3></li>';
                    liStr += innerLiStr;
                }
                liStr += '</ul></li>';
            }
        }
        tempStr += liStr;
    }
    tempStr += '</ul>';
    //写入列表内容区
    $("#listcontent").innerHTML = tempStr;
    //设置所有任务个数
    $(".list-title span").innerHTML = queryAllTasks().length;
}

/**
 * 点击垃圾桶图标
 * @param  {Object} e       事件对象
 * @param  {Object} element 元素
 * @return {[type]}         [description]
 */
function del(e, element) {
    //这里要阻止事件冒泡
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    console.log("=====del======");
    var cateClicked = element.parentNode;
    if (cateClicked.tagName.toLowerCase() === "h2") {
        console.log("h2");
        cateClicked.getAttribute("cateid");
        console.log(cateClicked.getAttribute("cateid"));
        var r = confirm("是否确定删除分类？");
        if (r === true) {
            deleteCate(cateClicked.getAttribute("cateid"));
        }
    } else if (cateClicked.tagName.toLowerCase() === "h3") {
        console.log("h3");
        console.log(cateClicked.getAttribute("cateid"));
        var rr = confirm("是否确定删除分类？");
        if (rr === true) {
            deleteChildCate(cateClicked.getAttribute("cateid"));
        }
    }
    initCates();
    $("#task-list").innerHTML = createTaskList(queryAllTasks()); //初始化任务列表
}

/**
 * 添加分类
 */
function clickAddCate() {
    console.log("=========clickAddCate===========");
    var cover = $(".cover");
    cover.style.display = "block";
}

/**
 * 初始化模态框
 *
 */
function initModal() {
    var cate = queryCates();
    var selectContent = '<option value="-1">新增主分类</option>';
    for (var i = 1; i < cate.length; i++) {
        selectContent += '<option value="' + cate[i].id + '">' + cate[i].name + '</option>';
    }
    $("#modal-select").innerHTML = selectContent;
    $("#newCateName").value = "";
}

/**
 * 取消按钮
 */
function cancel() {
    $(".cover").style.display = "none";
}

/**
 * 确认按钮
 */
function ok() {
    console.log("----click ok----");
    console.log($("#modal-select").value);
    var selectValue = $("#modal-select").value;
    var newCateName = $("#newCateName").value;
    if (newCateName === "") {
        alert("请输入分类名称");
    } else {
        if (selectValue == -1) {
            console.log("新增主分类");
            addCate(newCateName);
        } else {
            console.log("增加分类");
            addChildCate(selectValue, newCateName);
        }
        initCates(); //初始化分类
        $(".cover").style.display = "none";
    }
    initModal();
}

/**
 * 点击分类
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function clickCate(element) {
    console.log("=======clickCate=======");
    console.log(element);
    var taskList = $("#task-list");
    setHighLight(element); //设置高亮

    console.log(element.getAttribute("cateid"));
    var cateId = element.getAttribute("cateid");
    if (cateId == -1) { //点击所有分类
        taskList.innerHTML = createTaskList(queryAllTasks());
        currentCateId = -1;
        currentCateTable = "AllCate";
    } else { //点击在主分类或子分类上
        if (element.tagName.toLowerCase() == "h2") {
            console.log("main cate--->" + cateId);
            taskList.innerHTML = createTaskList(queryTasksByCateId(cateId));
            currentCateId = cateId;
            currentCateTable = "cate";
        } else {
            console.log("childCate--->" + cateId);
            //子分类
            console.log(queryTasksByChildCateId(cateId));
            taskList.innerHTML = createTaskList(queryTasksByChildCateId(cateId));
            currentCateId = cateId;
            currentCateTable = "childCate";
        }
    }

    //状态按钮默认跳到所有上面
    cleanAllActiveOnStatusButton();
    addClass($("#all-tasks"), "active");
    addClass($("[taskid]"), "active"); //将第一个有 taskid 属性的元素高亮

    generateTaskById(currentTaskId);
}

/**
 * 设置高亮
 * @param {Object} element 点击的 element 对象
 */
function setHighLight(element) {
    cleanAllActive();
    addClass(element, "active");
}

/**
 * 清除所有高亮
 * @return {[type]} [description]
 */
function cleanAllActive() {
    removeClass($("#allTasks"), "active");
    var h2Elements = $("#listcontent").getElementsByTagName('h2');
    for (var i = 0; i < h2Elements.length; i++) {
        removeClass(h2Elements[i], "active");
    }
    var h3Elements = $("#listcontent").getElementsByTagName('h3');
    for (var j = 0; j < h3Elements.length; j++) {
        removeClass(h3Elements[j], "active");
    }
}

/**
 * 创建任务列表
 * @param  {Array} taskArr 任务对象数组
 * @return {String}        字符串形式的html代码
 */
function createTaskList(taskArr) {
    var tempStr = "";
    console.log("dateTasksArr------->");
    console.log(taskArr);
    if (taskArr.length === 0) {
        tempStr = "";
    } else {

        var dateTasksArr = createDateData(taskArr);
        console.log("dateTasksArr------->" + dateTasksArr);
        for (var i = 0; i < dateTasksArr.length; i++) {
            var innerLiStr = "<div>" + dateTasksArr[i].date + "</div><ul>";
            for (var j = 0; j < dateTasksArr[i].tasks.length; j++) {
                var finishOrNotStr = "";
                if (dateTasksArr[i].tasks[j].finish) {
                    finishOrNotStr = '<li class="task-done" taskid="' + dateTasksArr[i].tasks[j].id + '" onclick="clickTask(this)"><i class="fa fa-check"></i> ' + dateTasksArr[i].tasks[j].name + '</li>';
                } else {
                    finishOrNotStr = '<li taskid="' + dateTasksArr[i].tasks[j].id + '" onclick="clickTask(this)">' + dateTasksArr[i].tasks[j].name + '</li>';
                }

                // innerLiStr += '<li taskid="' + dateTasksArr[i].tasks[j].id + '" onclick="clickTask(this)">' + dateTasksArr[i].tasks[j].name + '</li>';
                innerLiStr += finishOrNotStr;
            }
            innerLiStr += "</ul>";
            tempStr += innerLiStr;
        }
    }
    // console.log(tempStr);
    return tempStr;
}
// console.log(createTaskList(queryAllTasks()));

/**
 * 创建日期数据格式
 * @param  {Array} taskArr 任务数组
 * @return {Array}         日期任务对象数组
 */
function createDateData(taskArr) {
    var dateArr = []; //日期数组
    var newDateTasks = []; //日期数据格式数组
    //想让任务根据日期归档
    //1.先把出现的所有日期提取出来
    //2.对日期排序
    //3.根据日期查询出任务对象数组
    //4.组合日期和任务对象数组

    //取出所有时间
    for (var i = 0; i < taskArr.length; i++) {
        if (dateArr.indexOf(taskArr[i].date) == -1) {
            dateArr.push(taskArr[i].date);
        }
    }
    console.log(dateArr);
    console.log(taskArr);

    //对日期排序
    dateArr = dateArr.sort();

    //根据时间查找任务对象
    for (var j = 0; j < dateArr.length; j++) {
        var tempObject = {};
        tempObject.date = dateArr[j];
        tempObject.tasks = queryTasksByDateInTaskArr(dateArr[j], taskArr);
        newDateTasks.push(tempObject);
    }
    currentTaskId = newDateTasks[0].tasks[0].id;
    return newDateTasks;
}

/**
 * 分类任务状态控制按钮
 * @return {[type]} [description]
 */
function cateTaskStatusController() {
    addClickEvent($("#all-tasks"), function() {
        console.log("click all tasks");
        cateTaskStatusControllerHelper(this);
    });
    addClickEvent($("#unfinish-tasks"), function() {
        console.log("click unfinish tasks");
        cateTaskStatusControllerHelper(this, false);
    });
    addClickEvent($("#finished-tasks"), function() {
        console.log("click finished-tasks");
        cateTaskStatusControllerHelper(this, true);
    });
}

/**
 * 任务列表状态切换辅助
 * 根据状态不同，修改不同的html代码
 *
 * @param  {boolean} finish 完成状态
 */
function cateTaskStatusControllerHelper(element, finish) {
    cleanAllActiveOnStatusButton(); //清除状态按钮高亮
    addClass(element, "active");

    var taskList = $("#task-list");

    if (currentCateId == -1) {
        taskList.innerHTML = createTaskList(queryAllTasks(finish));
    } else {
        if (currentCateTable == "cate") {
            taskList.innerHTML = createTaskList(queryTasksByCateId(currentCateId, finish));
        } else {
            console.log("**************************");
            console.log(currentCateId);
            taskList.innerHTML = createTaskList(queryTasksByChildCateId(currentCateId, finish));
            console.log("*********** END **********");
        }
    }
}

/**
 * 清除状态按钮高亮
 */
function cleanAllActiveOnStatusButton() {
    removeClass($("#all-tasks"), "active");
    removeClass($("#unfinish-tasks"), "active");
    removeClass($("#finished-tasks"), "active");
}

/**
 * 点击任务
 * @param  {Object} element 点击的 li 对象
 * @return {[type]}         [description]
 */
function clickTask(element) {

    var taskId = element.getAttribute("taskid");

    currentTaskId = taskId;

    generateTaskById(taskId);

    cleanTasksHighLight();
    addClass(element, "active");
}

/**
 * 根据任务 id 生成右边的具体内容
 * @param  {number} taskId 任务id
 * @return {[type]}        [description]
 */
function generateTaskById(taskId) {
    var task = queryTaskById(taskId);

    $(".todo-name").innerHTML = task.name;
    $(".task-date span").innerHTML = task.date;
    $(".content").innerHTML = task.content;

    $(".button-area").style.display = "none";

    var manipulate = $(".manipulate");
    if (task.finish) { //若已完成
        manipulate.innerHTML = "";
    } else { //未完成
        manipulate.innerHTML = '<a onclick="checkTaskDone()"><i class="fa fa-check-square-o"></i></a><a onclick="changeTask()"><i class="fa fa-pencil-square-o"></i></a>';
    }
}

/**
 * 清除任务列表的高亮
 */
function cleanTasksHighLight() {
    var aLi = $("#task-list").getElementsByTagName('li');
    for (var i = 0; i < aLi.length; i++) {
        removeClass(aLi[i], "active");
    }
}

/**
 * 点击增加任务按钮
 * @return {[type]} [description]
 */
function clickAddTask() {
    console.log("clickAddTask");
    // $(".right").innerHTML = '';

    // 如果当前的主分类没有子分类，提示先建立子分类
    // if (currentCateId != -1) {

    // }
    // var cateChild = queryCateById(currentCateId).child;
    if (currentCateId != -1 && currentCateTable == "cate" && queryCateById(currentCateId).child.length === 0) {
        alert("请先建立子分类");
    } else {
        $(".todo-name").innerHTML = '<input type="text" class="input-title" placeholder="请输入标题">';
        $(".manipulate").innerHTML = "";
        $(".task-date span").innerHTML = '<input type="date" class="input-date">';
        $(".content").innerHTML = '<textarea class="textarea-content" placeholder="请输入任务内容"></textarea>';
        $(".button-area").innerHTML = '<span class="info"></span>                    <button class="save">保存</button>                    <button class="cancel-save">放弃</button>';
        $(".button-area").style.display = "block";
        clickSaveOrCancel();
    }
}

/**
 * 点击保存任务或放弃保存
 * @return {[type]} [description]
 */
function clickSaveOrCancel() {
    addClickEvent($(".save"), function() {
        console.log("save");
        console.log(currentCateId);
        console.log(currentCateTable);

        var title = $(".input-title");
        var content = $(".textarea-content");
        var date = $(".input-date");
        var info = $(".info");

        if (title.value === "") {
            info.innerHTML = "标题不能为空";
        } else if (date.value === "") {
            info.innerHTML = "日期不能为空";
        } else if (content.value === "") {
            info.innerHTML = "内容不能为空";
        } else {
            var taskObject = {};
            taskObject.finish = false;
            taskObject.name = title.value;
            taskObject.content = content.value;
            taskObject.date = date.value;

            //对 pid 的处理
            if (currentCateTable === "AllCate") { //如果焦点在所有分类上
                taskObject.pid = 0;
            } else if (currentCateTable === "cate") {
                taskObject.pid = queryCateById(currentCateId).child[0];
            } else {
                taskObject.pid = currentCateId;
            }
            console.log(taskObject);

            var curTaskId = addTask(taskObject);

            initCates(); //初始化分类

            //更新任务列表
            var taskList = $("#task-list");
            if (currentCateTable === "AllCate") { //如果焦点在所有分类上
                taskList.innerHTML = createTaskList(queryAllTasks());
            } else if (currentCateTable === "cate") {
                taskList.innerHTML = createTaskList(queryTasksByCateId(currentCateId));
            } else {
                taskList.innerHTML = createTaskList(queryTasksByChildCateId(currentCateId));
            }
            //更新详细内容区
            currentTaskId = curTaskId;
            generateTaskById(curTaskId); //初始化任务详细
        }
    });
    addClickEvent($(".cancel-save"), function() {
        console.log("cancel save");
        generateTaskById(currentTaskId);
    });
}

/**
 * 点击完成
 * @return {[type]} [description]
 */
function checkTaskDone() {
    var r = confirm("确定将任务标记为已完成吗？");
    if (r) {

        console.log(currentTaskId);
        updateTaskStatusById(currentTaskId); //更新状态
        listAllStorage();
        console.log(currentTaskId);
        generateTaskById(currentTaskId);
        console.log(currentTaskId);
        var temp = currentTaskId;
        //更新任务列表
        var taskList = $("#task-list");
        if (currentCateTable === "AllCate") { //如果焦点在所有分类上
            taskList.innerHTML = createTaskList(queryAllTasks());
        } else if (currentCateTable === "cate") {
            taskList.innerHTML = createTaskList(queryTasksByCateId(currentCateId));
        } else {
            taskList.innerHTML = createTaskList(queryTasksByChildCateId(currentCateId));
        }

        currentTaskId = temp;
    }
}

/**
 * 点击修改
 * @return {[type]} [description]
 */
function changeTask() {
    var task = queryTaskById(currentTaskId);
    $(".todo-name").innerHTML = '<input type="text" class="input-title" placeholder="请输入标题" value="' + task.name + '">';
    $(".manipulate").innerHTML = "";
    $(".task-date span").innerHTML = '<input type="date" class="input-date" value="' + task.date + '">';
    $(".content").innerHTML = '<textarea class="textarea-content" placeholder="请输入任务内容">' + task.content + '</textarea>';
    $(".button-area").innerHTML = '<span class="info"></span>                    <button class="save">保存修改</button>                    <button class="cancel-save">放弃</button>';
    $(".button-area").style.display = "block";
    changeSaveOrNot();
}

/**
 * 保存修改或不修改
 * @return {[type]} [description]
 */
function changeSaveOrNot() {
    addClickEvent($(".save"), function() {

        var title = $(".input-title");
        var content = $(".textarea-content");
        var date = $(".input-date");
        var info = $(".info");

        if (title.value === "") {
            info.innerHTML = "标题不能为空";
        } else if (date.value === "") {
            info.innerHTML = "日期不能为空";
        } else if (content.value === "") {
            info.innerHTML = "内容不能为空";
        } else {
            /*var taskObject = {};
            taskObject.finish = false;
            taskObject.name = title.value;
            taskObject.content = content.value;
            taskObject.date = date.value;*/
            console.log("before save change, check currentTaskId");
            console.log(currentTaskId);
            updateTaskById(currentTaskId, title.value, date.value, content.value);
            generateTaskById(currentTaskId);
            console.log(currentTaskId);
            var temp = currentTaskId;
            //更新任务列表
            var taskList = $("#task-list");
            if (currentCateTable === "AllCate") { //如果焦点在所有分类上
                taskList.innerHTML = createTaskList(queryAllTasks());
            } else if (currentCateTable === "cate") {
                taskList.innerHTML = createTaskList(queryTasksByCateId(currentCateId));
            } else {
                taskList.innerHTML = createTaskList(queryTasksByChildCateId(currentCateId));
            }

            currentTaskId = temp;
        }
    });

    addClickEvent($(".cancel-save"), function() {
        generateTaskById(currentTaskId);
    });
}

/*[{
    date: "2015-06-05",
    tasks: [{
        "id": 0,
        "pid": 1,
        "finish": true,
        "name": "task1",
        "content":"百度ife任务1",
    }, {
        "id": 1,
        "pid": 1,
        "finish": true,
        "name": "task1",
        "content":"百度ife任务1",
    }]
},{
    date: "2015-06-06",
    tasks: [{
        "id": 2,
        "pid": 1,
        "finish": true,
        "name": "task1",
        "content":"百度ife任务1",
    }, {
        "id": 3,
        "pid": 1,
        "finish": true,
        "name": "task1",
        "content":"百度ife任务1",
    }]
}]*/

/*var taskJson = [{
    "id": 0,
    "pid": 1,
    "finish": true,
    "name": "task1",
    "date": "2015-05-10",
    "content": "百度ife任务1",
}, {
    "id": 1,
    "pid": 1,
    "finish": false,
    "name": "Sass",
    "date": "2015-05-31",
    "content": "学习慕课网的视频Sass",
}, {
    "id": 2,
    "pid": 1,
    "finish": false,
    "name": "AMD",
    "date": "2015-05-31",
    "content": "学习AMD",
}];*/