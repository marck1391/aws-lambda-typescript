"use strict";
//TODO: Arrow function
/*function fn({res:{req:{headers,params,body,query}}}, {headers:{content=a()}}=(()=>{}), a=new class{}){
    return users;
}*/
Object.defineProperty(exports, "__esModule", { value: true });
//Remove all comments /*...*/
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
///^function(\s+([A-z0-9_$]+)(\s+)?)?[(]([^)]*.*?)\)(\s+)?\{/ $4 params, with spaces
var FUNCTION_PARAMS = /^(([A-z0-9_$]+)(\s+)?)?[(]([^)]*.*?)\)\{.*$/;
//obj, obj=(()=>{}),a=new class{} => $1 obj,obj,a | $2 =(()=>{}),=new class{}
var PARAM_NAMES_VALUES = /([^,=]+)(=[^,]+)?/g;
//a,b,c,d...
var PARAM_NAMES = /([^\s,]+)/g;
//{a:{b,c,d}} = {b,c,d}
var DESTRUCTURING_OBJECT = /{[^{}]+}/g;
function reduceArgs(strFn) {
    //Reduce destructure objects
    //{res:{req:{headers}}},{headers:{content=a()}}=(()=>{}),a=newclass{}
    //obj,obj=(()=>{}),a=newclass{}
    if (strFn.match(DESTRUCTURING_OBJECT)) {
        strFn = strFn.replace(DESTRUCTURING_OBJECT, 'obj');
        return reduceArgs(strFn);
    }
    else {
        return strFn;
    }
}
function getParamNames(fn) {
    var fnStr = typeof fn == 'function' ? fn.toString() : fn;
    fnStr = fnStr.replace(/^function/, '');
    fnStr = fnStr.replace(/\s/g, '');
    fnStr = fnStr.replace(STRIP_COMMENTS, '');
    fnStr = fnStr.replace(FUNCTION_PARAMS, '$4');
    fnStr = reduceArgs(fnStr);
    fnStr = fnStr.replace(PARAM_NAMES_VALUES, '$1');
    return fnStr.split(',');
}
exports.default = getParamNames;
//# sourceMappingURL=GetParamNames.js.map