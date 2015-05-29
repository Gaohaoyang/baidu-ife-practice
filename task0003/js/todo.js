initAll();

function initAll() {
    // localStorage.clear();
    initDataBase(); //初始化数据表
    initCates(); //初始化分类
    initModal(); //初始化模态框
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
            "child": []
        }, {
            "id": 1,
            "name": "工作",
            "child": [0, 1]
        }];

        var childCateJson = [{
            "id": 0,
            "pid": 1,
            "name": "前端",
            "child": [0, 1],
        }, {
            "id": 1,
            "pid": 1,
            "name": "服务端",
            "child": [],
        }];

        var taskJson = [{
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
        }];

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
 * 根据主分类 id 查询任务个数 暂时无用
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
 * @return {Array} 任务对象数组
 */
function queryAllTasks() {
    return JSON.parse(localStorage.task);
}

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
       
        if ( childCate[i].id == id) {

        }
    };
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

    for (var i = 0; i < cate.length; i++) {
        var liStr = "";
        if (cate[i].child.length === 0) {
            if (i === 0) {
                liStr = '<li><h2 onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (' + queryTasksLengthByCate(cate[i]) + ')</h2></li>';
            } else {
                liStr = '<li><h2 onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (' + queryTasksLengthByCate(cate[i]) + ')<i class="fa fa-trash-o" onclick="del(event,this)"></i></h2></li>';
            }
        } else {
            liStr = '<li><h2 onclick="clickCate(this)"><i class="fa fa-folder-open"></i><span>' + cate[i].name + '</span> (' + queryTasksLengthByCate(cate[i]) + ')<i class="fa fa-trash-o" onclick="del(event,this)"></i></h2><ul>';
            var childCateArr = queryChildCatesByIdArray(cate[i].child);
            for (var j = 0; j < childCateArr.length; j++) {
                var innerLiStr = "";
                innerLiStr = '<li><h3 onclick="clickCate(this)"><i class="fa fa-file-o"></i><span>' + childCateArr[j].name + '</span> (' + childCateArr[j].child.length + ')<i class="fa fa-trash-o" onclick="del(event,this)"></i></h3></li>';
                liStr += innerLiStr;
            }
            liStr += '</ul></li>';
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
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function del(e, element) {
    //这里要阻止事件冒泡
    window.event ? window.event.cancelBubble = true : e.stopPropagation();
    console.log("=====del======");
    console.log(element);
    console.log("element.parentNode");
    console.log(element.parentNode);
}

/**
 * 点击分类
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function clickCate(element) {
    console.log("=======clickCate=======");
    console.log(element);
}

/**
 * 添加分类
 */
function clickAddCate() {
    console.log("=========clickAddCate===========");
    var cover = $(".cover");
    cover.style.display = "block";
    // addClickEvent(cover, function() {
    //     cover.style.display = "none";
    // });

}

function initModal() {
    var cate = queryCates();
    var selectContent = '<option value="-1">新增主分类</option>';
    for (var i = 1; i < cate.length; i++) {
        selectContent += '<option value="' + cate[i].id + '">' + cate[i].name + '</option>';
    }
    $("#modal-select").innerHTML = selectContent;
    $("#newCateName").value = "";
}

function cancel() {
    $(".cover").style.display = "none";
}

function ok() {
    console.log("----click ok----");
    console.log($("#modal-select").value);
    var selectValue = $("#modal-select").value;
    var newCateName = $("#newCateName").value;
    if (newCateName==="") {
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