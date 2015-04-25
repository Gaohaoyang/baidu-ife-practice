/**
 * Gaohaoyang
 */
// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return typeof arr === "object" && Object.prototype.toString.call(arr) === "[object Array]";
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    return typeof fn === "function";
}

/**
 * test
 */
function a() {}
var b = "abc";
var c = [];
console.log("isFunction----->" + isFunction(a));
console.log("isArray-------->" + isArray(c));

Array.isArray([]);
Array.isArray({});

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
    // your implement
    var resultObj = {};
    for(var i in src){  //遍历这个对象

    }
}

// 测试用例：
var srcObj = {
    a: 1,
    b: {
        b1: ["hello", "hi"],
        b2: "JavaScript"
    },
    c: function() {
        console.log("function");
    }
};
var abObj = srcObj;
var tarObj = cloneObject(srcObj);

srcObj.a = 2;
srcObj.b.b1[0] = "Hello";

console.log(abObj.a);
console.log(abObj.b.b1[0]);

// console.log(tarObj.a);      // 1
// console.log(tarObj.b.b1[0]);    // "hello"

console.log(srcObj.b);

function showProps(obj, objName) {
    var result = "";
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            result += objName + "." + i + " = " + obj[i] + "\n";
        }
    }
    return result;
}

function showPropsWithoutFun(obj, objName) {
    var result = "";
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {       //跳过继承属性
            continue;
        }
        if (typeof obj[i] === "function") { //跳过这个对象的方法
            continue;
        }
        result += objName + "." + i + "=" + obj[i] + "\n";
    }
    return result;
}

console.log(showProps(srcObj, 'srcObj'));
console.log(showPropsWithoutFun(srcObj, 'srcObj'));
// console.log('prototype'+srcObj.prototype.toString.call(Object));    