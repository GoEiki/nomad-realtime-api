(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"));
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-resizable"] = factory(require("vue"));
	else
		root["vue-resizable"] = factory(root["Vue"]);
})((typeof self !== 'undefined' ? self : this), function(__WEBPACK_EXTERNAL_MODULE__203__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 322:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".resizable-component[data-v-3de5149f]{position:relative}.resizable-component>.resizable-r[data-v-3de5149f]{z-index:90;cursor:e-resize;top:0;height:100%}.resizable-component>.resizable-r[data-v-3de5149f],.resizable-component>.resizable-rb[data-v-3de5149f]{display:block;position:absolute;touch-action:none;user-select:none;-moz-user-select:none;-webkit-user-select:none;width:12px;right:-6px}.resizable-component>.resizable-rb[data-v-3de5149f]{cursor:se-resize;height:12px;bottom:-6px;z-index:91}.resizable-component>.resizable-b[data-v-3de5149f]{z-index:90;cursor:s-resize;width:100%;left:0}.resizable-component>.resizable-b[data-v-3de5149f],.resizable-component>.resizable-lb[data-v-3de5149f]{display:block;position:absolute;touch-action:none;user-select:none;-moz-user-select:none;-webkit-user-select:none;height:12px;bottom:-6px}.resizable-component>.resizable-lb[data-v-3de5149f]{cursor:sw-resize;width:12px;left:-6px;z-index:91}.resizable-component>.resizable-l[data-v-3de5149f]{z-index:90;cursor:w-resize;height:100%;top:0}.resizable-component>.resizable-l[data-v-3de5149f],.resizable-component>.resizable-lt[data-v-3de5149f]{display:block;position:absolute;touch-action:none;user-select:none;-moz-user-select:none;-webkit-user-select:none;width:12px;left:-6px}.resizable-component>.resizable-lt[data-v-3de5149f]{cursor:nw-resize;height:12px;top:-6px;z-index:91}.resizable-component>.resizable-t[data-v-3de5149f]{z-index:90;cursor:n-resize;width:100%;left:0}.resizable-component>.resizable-rt[data-v-3de5149f],.resizable-component>.resizable-t[data-v-3de5149f]{display:block;position:absolute;touch-action:none;user-select:none;-moz-user-select:none;-webkit-user-select:none;height:12px;top:-6px}.resizable-component>.resizable-rt[data-v-3de5149f]{cursor:ne-resize;width:12px;right:-6px;z-index:91}", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ (function(module) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 81:
/***/ (function(module) {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 620:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;


__webpack_unused_export__ = ({
  value: true
}); // runtime helper for setting properties on components
// in a tree-shakable way

exports.Z = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;

  for (const [key, val] of props) {
    target[key] = val;
  }

  return target;
};

/***/ }),

/***/ 29:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(322);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.id, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = (__webpack_require__(208)/* ["default"] */ .Z)
var update = add("0c86e32a", content, true, {"sourceMap":false,"shadowMode":false});

/***/ }),

/***/ 208:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ addStylesClient; }
});

;// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles(parentId, list) {
  var styles = [];
  var newStyles = {};

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    };

    if (!newStyles[id]) {
      styles.push(newStyles[id] = {
        id: id,
        parts: [part]
      });
    } else {
      newStyles[id].parts.push(part);
    }
  }

  return styles;
}
;// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 203:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__203__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "";
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ entry_lib; }
});

;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
/* eslint-disable no-var */
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (false) { var getCurrentScript; }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: external {"commonjs":"vue","commonjs2":"vue","root":"Vue"}
var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__(203);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/vue-resizable.vue?vue&type=template&id=3de5149f&scoped=true

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", {
    ref: "parent",
    class: "resizable-component",
    style: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeStyle)($options.style)
  }, [(0,external_commonjs_vue_commonjs2_vue_root_Vue_.renderSlot)(_ctx.$slots, "default", {}, undefined, true), ((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(true), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)(external_commonjs_vue_commonjs2_vue_root_Vue_.Fragment, null, (0,external_commonjs_vue_commonjs2_vue_root_Vue_.renderList)($props.active, el => {
    return (0,external_commonjs_vue_commonjs2_vue_root_Vue_.withDirectives)(((0,external_commonjs_vue_commonjs2_vue_root_Vue_.openBlock)(), (0,external_commonjs_vue_commonjs2_vue_root_Vue_.createElementBlock)("div", {
      key: el,
      class: (0,external_commonjs_vue_commonjs2_vue_root_Vue_.normalizeClass)('resizable-' + el)
    }, null, 2)), [[external_commonjs_vue_commonjs2_vue_root_Vue_.vShow, !$props.maximize]]);
  }), 128))], 4);
}
;// CONCATENATED MODULE: ./src/components/vue-resizable.vue?vue&type=template&id=3de5149f&scoped=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-82.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/vue-resizable.vue?vue&type=script&lang=js
const ELEMENT_MASK = {
  "resizable-r": {
    bit: 0b0001,
    cursor: "e-resize"
  },
  "resizable-rb": {
    bit: 0b0011,
    cursor: "se-resize"
  },
  "resizable-b": {
    bit: 0b0010,
    cursor: "s-resize"
  },
  "resizable-lb": {
    bit: 0b0110,
    cursor: "sw-resize"
  },
  "resizable-l": {
    bit: 0b0100,
    cursor: "w-resize"
  },
  "resizable-lt": {
    bit: 0b1100,
    cursor: "nw-resize"
  },
  "resizable-t": {
    bit: 0b1000,
    cursor: "n-resize"
  },
  "resizable-rt": {
    bit: 0b1001,
    cursor: "ne-resize"
  },
  "drag-el": {
    bit: 0b1111,
    cursor: "pointer"
  }
};
const CALC_MASK = {
  l: 0b0001,
  t: 0b0010,
  w: 0b0100,
  h: 0b1000
};
/* harmony default export */ var vue_resizablevue_type_script_lang_js = ({
  name: "VResizable",
  props: {
    width: {
      default: undefined,
      type: [Number, String]
    },
    minWidth: {
      default: 0,
      type: Number
    },
    maxWidth: {
      default: undefined,
      type: Number
    },
    height: {
      default: undefined,
      type: [Number, String]
    },
    minHeight: {
      default: 0,
      type: Number
    },
    maxHeight: {
      default: undefined,
      type: Number
    },
    left: {
      default: 0,
      type: [Number, String]
    },
    top: {
      default: 0,
      type: [Number, String]
    },
    active: {
      default: () => ["r", "rb", "b", "lb", "l", "lt", "t", "rt"],
      validator: val => ["r", "rb", "b", "lb", "l", "lt", "t", "rt"].filter(value => val.indexOf(value) !== -1).length === val.length,
      type: Array
    },
    fitParent: {
      default: false,
      type: Boolean
    },
    dragSelector: {
      default: undefined,
      type: String
    },
    maximize: {
      default: false,
      type: Boolean
    },
    disableAttributes: {
      default: () => [],
      validator: val => ["l", "t", "w", "h"].filter(value => val.indexOf(value) !== -1).length === val.length,
      type: Array
    }
  },
  emits: ["mount", "destroy", "resize:start", "resize:move", "resize:end", "drag:start", "drag:move", "drag:end", "maximize"],

  data() {
    return {
      w: this.width,
      h: this.height,
      minW: this.minWidth,
      minH: this.minHeight,
      maxW: this.maxWidth,
      maxH: this.maxHeight,
      l: this.left,
      t: this.top,
      mouseX: 0,
      mouseY: 0,
      offsetX: 0,
      offsetY: 0,
      parent: {
        width: 0,
        height: 0
      },
      resizeState: 0,
      dragElements: [],
      dragState: false,
      calcMap: 0b1111
    };
  },

  computed: {
    style() {
      return { ...(this.calcMap & CALC_MASK.w && {
          width: typeof this.w === "number" ? this.w + "px" : this.w
        }),
        ...(this.calcMap & CALC_MASK.h && {
          height: typeof this.h === "number" ? this.h + "px" : this.h
        }),
        ...(this.calcMap & CALC_MASK.l && {
          left: typeof this.l === "number" ? this.l + "px" : this.l
        }),
        ...(this.calcMap & CALC_MASK.t && {
          top: typeof this.t === "number" ? this.t + "px" : this.t
        })
      };
    }

  },
  watch: {
    maxWidth(value) {
      this.maxW = value;
    },

    maxHeight(value) {
      this.maxH = value;
    },

    minWidth(value) {
      this.minW = value;
    },

    minHeight(value) {
      this.minH = value;
    },

    width(value) {
      typeof value === "number" && (this.w = value);
    },

    height(value) {
      typeof value === "number" && (this.h = value);
    },

    left(value) {
      typeof value === "number" && (this.l = value);
    },

    top(value) {
      typeof value === "number" && (this.t = value);
    },

    dragSelector(selector) {
      this.setupDragElements(selector);
    },

    maximize(value) {
      this.setMaximize(value);
      this.emitEvent("maximize", {
        state: value
      });
    }

  },

  mounted() {
    if (!this.width) {
      this.w = this.$el.parentElement.clientWidth;
    } else if (this.width !== "auto") {
      typeof this.width !== "number" && (this.w = this.$el.clientWidth);
    }

    if (!this.height) {
      this.h = this.$el.parentElement.clientHeight;
    } else if (this.height !== "auto") {
      typeof this.height !== "number" && (this.h = this.$el.clientHeight);
    }

    typeof this.left !== "number" && (this.l = this.$el.offsetLeft - this.$el.parentElement.offsetLeft);
    typeof this.top !== "number" && (this.t = this.$el.offsetTop - this.$el.parentElement.offsetTop);
    this.minW && this.w < this.minW && (this.w = this.minW);
    this.minH && this.h < this.minH && (this.h = this.minH);
    this.maxW && this.w > this.maxW && (this.w = this.maxW);
    this.maxH && this.h > this.maxH && (this.h = this.maxH);
    this.setMaximize(this.maximize);
    this.setupDragElements(this.dragSelector);
    this.disableAttributes.forEach(attr => {
      switch (attr) {
        case "l":
          this.calcMap &= ~CALC_MASK.l;
          break;

        case "t":
          this.calcMap &= ~CALC_MASK.t;
          break;

        case "w":
          this.calcMap &= ~CALC_MASK.w;
          break;

        case "h":
          this.calcMap &= ~CALC_MASK.h;
      }
    });
    document.documentElement.addEventListener("mousemove", this.handleMove, true);
    document.documentElement.addEventListener("mousedown", this.handleDown, true);
    document.documentElement.addEventListener("mouseup", this.handleUp, true);
    document.documentElement.addEventListener("touchmove", this.handleMove, true);
    document.documentElement.addEventListener("touchstart", this.handleDown, true);
    document.documentElement.addEventListener("touchend", this.handleUp, true);
    this.emitEvent("mount");
  },

  beforeUnmount() {
    document.documentElement.removeEventListener("mousemove", this.handleMove, true);
    document.documentElement.removeEventListener("mousedown", this.handleDown, true);
    document.documentElement.removeEventListener("mouseup", this.handleUp, true);
    document.documentElement.removeEventListener("touchmove", this.handleMove, true);
    document.documentElement.removeEventListener("touchstart", this.handleDown, true);
    document.documentElement.removeEventListener("touchend", this.handleUp, true);
    this.emitEvent("destroy");
  },

  methods: {
    setMaximize(value) {
      const parentEl = this.$el.parentElement;

      if (value) {
        this.prevState = {
          w: this.w,
          h: this.h,
          l: this.l,
          t: this.t
        };
        this.t = this.l = 0;
        this.w = parentEl.clientWidth;
        this.h = parentEl.clientHeight;
      } else {
        this.restoreSize();
      }
    },

    restoreSize() {
      if (this.prevState) {
        this.l = this.prevState.l;
        this.t = this.prevState.t;
        this.h = this.prevState.h;
        this.w = this.prevState.w;
      }
    },

    setupDragElements(selector) {
      const oldList = this.$el.querySelectorAll(".drag-el");
      oldList.forEach(el => {
        el.classList.remove("drag-el");
      });
      const nodeList = this.$el.querySelectorAll(selector);
      nodeList.forEach(el => {
        el.classList.add("drag-el");
      });
      this.dragElements = Array.prototype.slice.call(nodeList);
    },

    emitEvent(eventName, additionalOptions) {
      this.$emit(eventName, {
        eventName,
        left: this.l,
        top: this.t,
        width: this.w,
        height: this.h,
        cmp: this,
        ...additionalOptions
      });
    },

    handleMove(event) {
      if (this.resizeState !== 0) {
        if (!this.dragState) {
          if (isNaN(this.w)) {
            this.w = this.$el.clientWidth;
          }

          if (isNaN(this.h)) {
            this.h = this.$el.clientHeight;
          }
        }

        let eventY, eventX;

        if (event.touches && event.touches.length >= 0) {
          eventY = event.touches[0].clientY;
          eventX = event.touches[0].clientX;
        } else {
          eventY = event.clientY;
          eventX = event.clientX;
        }

        if (this.maximize && this.prevState) {
          const parentWidth = this.parent.width;
          const parentHeight = this.parent.height;
          this.restoreSize();
          this.prevState = undefined;
          this.t = eventY > parentHeight / 2 ? parentHeight - this.h : 0;
          this.l = eventX > parentWidth / 2 ? parentWidth - this.w : 0;
          this.emitEvent("maximize", {
            state: false
          });
        }

        let diffX = eventX - this.mouseX + this.offsetX,
            diffY = eventY - this.mouseY + this.offsetY;

        if (this.$el.getBoundingClientRect) {
          const rect = this.$el.getBoundingClientRect();
          const scaleX = rect.width / this.$el.offsetWidth || 1;
          const scaleY = rect.height / this.$el.offsetHeight || 1;
          diffX /= scaleX;
          diffY /= scaleY;
        }

        this.offsetX = this.offsetY = 0;

        if (this.resizeState & ELEMENT_MASK["resizable-r"].bit) {
          if (!this.dragState && this.w + diffX < this.minW) this.offsetX = diffX - (diffX = this.minW - this.w);else if (!this.dragState && this.maxW && this.w + diffX > this.maxW && (!this.fitParent || this.w + this.l < this.parent.width)) this.offsetX = diffX - (diffX = this.maxW - this.w);else if (this.fitParent && this.l + this.w + diffX > this.parent.width) this.offsetX = diffX - (diffX = this.parent.width - this.l - this.w);
          this.calcMap & CALC_MASK.w && (this.w += this.dragState ? 0 : diffX);
        }

        if (this.resizeState & ELEMENT_MASK["resizable-b"].bit) {
          if (!this.dragState && this.h + diffY < this.minH) this.offsetY = diffY - (diffY = this.minH - this.h);else if (!this.dragState && this.maxH && this.h + diffY > this.maxH && (!this.fitParent || this.h + this.t < this.parent.height)) this.offsetY = diffY - (diffY = this.maxH - this.h);else if (this.fitParent && this.t + this.h + diffY > this.parent.height) this.offsetY = diffY - (diffY = this.parent.height - this.t - this.h);
          this.calcMap & CALC_MASK.h && (this.h += this.dragState ? 0 : diffY);
        }

        if (this.resizeState & ELEMENT_MASK["resizable-l"].bit) {
          if (!this.dragState && this.w - diffX < this.minW) this.offsetX = diffX - (diffX = this.w - this.minW);else if (!this.dragState && this.maxW && this.w - diffX > this.maxW && this.l >= 0) this.offsetX = diffX - (diffX = this.w - this.maxW);else if (this.fitParent && this.l + diffX < 0) this.offsetX = diffX - (diffX = -this.l);
          this.calcMap & CALC_MASK.l && (this.l += diffX);
          this.calcMap & CALC_MASK.w && (this.w -= this.dragState ? 0 : diffX);
        }

        if (this.resizeState & ELEMENT_MASK["resizable-t"].bit) {
          if (!this.dragState && this.h - diffY < this.minH) this.offsetY = diffY - (diffY = this.h - this.minH);else if (!this.dragState && this.maxH && this.h - diffY > this.maxH && this.t >= 0) this.offsetY = diffY - (diffY = this.h - this.maxH);else if (this.fitParent && this.t + diffY < 0) this.offsetY = diffY - (diffY = -this.t);
          this.calcMap & CALC_MASK.t && (this.t += diffY);
          this.calcMap & CALC_MASK.h && (this.h -= this.dragState ? 0 : diffY);
        }

        this.mouseX = eventX;
        this.mouseY = eventY;
        const eventName = !this.dragState ? "resize:move" : "drag:move";
        this.emitEvent(eventName);
      }
    },

    handleDown(event) {
      if (event.target.closest && event.target.closest(".resizable-component") !== this.$refs["parent"]) return;

      for (let elClass in ELEMENT_MASK) {
        if (this.$el.contains(event.target) && (event.target.closest && event.target.closest(`.${elClass}`) || event.target.classList.contains(elClass))) {
          elClass === "drag-el" && (this.dragState = true);
          document.body.style.cursor = ELEMENT_MASK[elClass].cursor;

          if (event.touches && event.touches.length >= 1) {
            this.mouseX = event.touches[0].clientX;
            this.mouseY = event.touches[0].clientY;
          } else {
            event.preventDefault && event.preventDefault();
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
          }

          this.offsetX = this.offsetY = 0;
          this.resizeState = ELEMENT_MASK[elClass].bit;
          this.parent.height = this.$el.parentElement.clientHeight;
          this.parent.width = this.$el.parentElement.clientWidth;
          const eventName = !this.dragState ? "resize:start" : "drag:start";
          this.emitEvent(eventName);
          break;
        }
      }
    },

    handleUp() {
      if (this.resizeState !== 0) {
        this.resizeState = 0;
        document.body.style.cursor = "";
        const eventName = !this.dragState ? "resize:end" : "drag:end";
        this.emitEvent(eventName);
        this.dragState = false;
      }
    }

  }
});
;// CONCATENATED MODULE: ./src/components/vue-resizable.vue?vue&type=script&lang=js
 
// EXTERNAL MODULE: ./node_modules/vue-style-loader/index.js??clonedRuleSet-54.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-54.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[2]!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-54.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/vue-resizable.vue?vue&type=style&index=0&id=3de5149f&scoped=true&lang=css
var vue_resizablevue_type_style_index_0_id_3de5149f_scoped_true_lang_css = __webpack_require__(29);
;// CONCATENATED MODULE: ./src/components/vue-resizable.vue?vue&type=style&index=0&id=3de5149f&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(620);
;// CONCATENATED MODULE: ./src/components/vue-resizable.vue




;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.Z)(vue_resizablevue_type_script_lang_js, [['render',render],['__scopeId',"data-v-3de5149f"]])

/* harmony default export */ var vue_resizable = (__exports__);
;// CONCATENATED MODULE: ./src/main.js

/* harmony default export */ var main = (vue_resizable);
;// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = (main);


}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=vue-resizable.umd.js.map