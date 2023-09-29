(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

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
/******/ 			// no module.id needed
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
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);

const electronHandler = {
    ipcRenderer: {
        on(channel, func) {
            const subscription = (_event, ...args) => func(...args);
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.on(channel, subscription);
            return () => {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
        send(channel, ...args) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send(channel, ...args);
        },
        openUrl(url) {
            return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("open-url", url);
        },
        discordBot: {
            startDiscordService(token) {
                return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("start-discord-service", token);
            },
            stopDiscordService() {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("stop-discord-service");
            },
            getServer() {
                const serverDataResult = async () => {
                    const serverData = await electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("get-server");
                    return serverData;
                };
                return serverDataResult();
            },
            searchMember(serverID, qry) {
                const members = electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("search-member", serverID, qry);
                return members;
            },
            getLatestMessages(deckID, offset) {
                return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("get-latest-messages", deckID, offset);
            },
            getLatestNullChannelMessages(deckID, offset) {
                return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("get-latest-null-channel-messages", deckID, offset);
            },
            deleteMessagesCache(deckID) {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("delete-messages", deckID);
            },
            loadMoreMessages(deckID, offset) {
                return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("load-more-messages", deckID, offset);
            },
            updateNotifications(deckID, enabled) {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send("notifications-update", deckID, enabled);
            },
            sendMessage(deckID, messageContent) {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("sendMessage", deckID, messageContent);
            },
            sendReply(channelID, messageID, messageContent) {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("sendReply", channelID, messageID, messageContent);
            },
            authenticateDiscord() {
                return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("authenticate-discord");
            },
        },
        cache: {
            getLastOffset(deckID) {
                const lastOffset = async () => {
                    const lastOffsetValue = await electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("last-offset-for-deckID", deckID);
                    return lastOffsetValue;
                };
                return lastOffset();
            },
            deleteDeck(deckID) {
                electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("delete-deck", deckID);
            },
            searchMemberName(memberID) {
                return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.invoke("search-member-name", memberID);
            }
        }
    },
    store: {
        get(key) {
            return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.sendSync('electron-store-get', key);
        },
        set(key, val) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('electron-store-set', key, val);
        },
        delete(key) {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('electron-store-delete', key);
        },
        has(key) {
            return electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.sendSync('electron-store-has', key);
        },
        reset() {
            electron__WEBPACK_IMPORTED_MODULE_0__.ipcRenderer.send('electron-store-reset');
        },
    },
};
electron__WEBPACK_IMPORTED_MODULE_0__.contextBridge.exposeInMainWorld('electron', electronHandler);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNiLE9BQU8sMERBQW9CLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELEdBQUcsQ0FBQyxHQUFXLEVBQUUsR0FBUTtZQUN2QixzREFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkQsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFXO1lBQ2hCLHNEQUFnQixDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFDRCxHQUFHLENBQUMsR0FBVztZQUNiLE9BQU8sMERBQW9CLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELEtBQUs7WUFDSCxzREFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzNDLENBQUM7S0FDRjtDQUNGLENBQUM7QUFFRixxRUFBK0IsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vcHJlbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGxvZyB9IGZyb20gJ2NvbnNvbGUnO1xuaW1wb3J0IHsgY29udGV4dEJyaWRnZSwgaXBjUmVuZGVyZXIsIElwY1JlbmRlcmVyRXZlbnQsIGNsaXBib2FyZCB9IGZyb20gJ2VsZWN0cm9uJztcblxuZXhwb3J0IHR5cGUgQ2hhbm5lbHMgPVxuICB8IFwic3RhcnQtZGlzY29yZC1zZXJ2aWNlXCJcbiAgfCBcInN0b3AtZGlzY29yZC1zZXJ2aWNlXCJcbiAgfCBcImdldC1zZXJ2ZXJcIlxuICB8IFwib3Blbi11cmxcIlxuICB8IFwic2VhcmNoLW1lbWJlclwiXG4gIHwgXCJnZXQtbGF0ZXN0LW1lc3NhZ2VzXCJcbiAgfCBcIm1lc3NhZ2UtdXBkYXRlXCJcbiAgfCBcImdldFNlcnZlci1yZXNwb25zZVwiXG4gIHwgXCJzZWFyY2gtbWVtYmVyLW5hbWVcIlxuICB8IFwiZ2V0TGF0ZXN0TWVzc2FnZXMtcmVzcG9uc2VcIlxuICB8IFwibm90aWZpY2F0aW9ucy11cGRhdGVcIlxuICB8IFwic2VuZE1lc3NhZ2VcIlxuICB8IFwiZGVsZXRlLWRlY2tcIlxuICB8IFwic2VuZFJlcGx5XCJcbiAgfCBcImF1dGhlbnRpY2F0ZS1kaXNjb3JkXCJcbiAgfCBcImxvYWQtbW9yZS1tZXNzYWdlc1wiXG4gIHwgXCJhdXRoZW50aWNhdGlvbi1zdWNjZXNzZnVsXCJcbiAgfCBcImdldC1sYXRlc3QtbnVsbC1jaGFubmVsLW1lc3NhZ2VzXCJcbiAgfCBcImxhc3Qtb2Zmc2V0LWZvci1kZWNrSURcIjtcblxuY29uc3QgZWxlY3Ryb25IYW5kbGVyID0ge1xuICBpcGNSZW5kZXJlcjoge1xuICAgIG9uKGNoYW5uZWw6IENoYW5uZWxzLCBmdW5jOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSAoX2V2ZW50OiBJcGNSZW5kZXJlckV2ZW50LCAuLi5hcmdzOiB1bmtub3duW10pID0+XG4gICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICBpcGNSZW5kZXJlci5vbihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBzdWJzY3JpcHRpb24pO1xuICAgICAgfTtcbiAgICB9LFxuICAgIG9uY2UoY2hhbm5lbDogQ2hhbm5lbHMsIGZ1bmM6ICguLi5hcmdzOiB1bmtub3duW10pID0+IHZvaWQpIHtcbiAgICAgIGlwY1JlbmRlcmVyLm9uY2UoY2hhbm5lbCwgKF9ldmVudCwgLi4uYXJncykgPT4gZnVuYyguLi5hcmdzKSk7XG4gICAgfSxcbiAgICBzZW5kKGNoYW5uZWw6IENoYW5uZWxzLCAuLi5hcmdzOiB1bmtub3duW10pIHtcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgfSxcbiAgICBvcGVuVXJsKHVybDogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKFwib3Blbi11cmxcIiwgdXJsKTtcbiAgICB9LFxuICAgIGRpc2NvcmRCb3Q6IHtcbiAgICAgIHN0YXJ0RGlzY29yZFNlcnZpY2UodG9rZW46IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKFwic3RhcnQtZGlzY29yZC1zZXJ2aWNlXCIsIHRva2VuKTtcbiAgICAgIH0sXG4gICAgICBzdG9wRGlzY29yZFNlcnZpY2UoKSB7XG4gICAgICAgIGlwY1JlbmRlcmVyLmludm9rZShcInN0b3AtZGlzY29yZC1zZXJ2aWNlXCIpO1xuICAgICAgfSxcbiAgICAgIGdldFNlcnZlcigpIHtcbiAgICAgICAgY29uc3Qgc2VydmVyRGF0YVJlc3VsdCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBzZXJ2ZXJEYXRhID0gYXdhaXQgaXBjUmVuZGVyZXIuaW52b2tlKFwiZ2V0LXNlcnZlclwiKTtcbiAgICAgICAgICByZXR1cm4gc2VydmVyRGF0YTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VydmVyRGF0YVJlc3VsdCgpO1xuICAgICAgfSxcbiAgICAgIHNlYXJjaE1lbWJlcihzZXJ2ZXJJRDogc3RyaW5nLCBxcnk6IHN0cmluZykge1xuICAgICAgICBjb25zdCBtZW1iZXJzID0gaXBjUmVuZGVyZXIuaW52b2tlKFwic2VhcmNoLW1lbWJlclwiLCBzZXJ2ZXJJRCwgcXJ5KTtcbiAgICAgICAgcmV0dXJuIG1lbWJlcnNcbiAgICAgIH0sXG4gICAgICBnZXRMYXRlc3RNZXNzYWdlcyhkZWNrSUQ6IHN0cmluZywgb2Zmc2V0OiBzdHJpbmcpIHtcbiAgICAgICAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKFwiZ2V0LWxhdGVzdC1tZXNzYWdlc1wiLCBkZWNrSUQsIG9mZnNldCk7XG4gICAgICB9LFxuICAgICAgZ2V0TGF0ZXN0TnVsbENoYW5uZWxNZXNzYWdlcyhkZWNrSUQ6IHN0cmluZywgb2Zmc2V0OiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZShcImdldC1sYXRlc3QtbnVsbC1jaGFubmVsLW1lc3NhZ2VzXCIsIGRlY2tJRCwgb2Zmc2V0KTtcbiAgICAgIH0sXG4gICAgICBkZWxldGVNZXNzYWdlc0NhY2hlKGRlY2tJRDogc3RyaW5nKSB7XG4gICAgICAgIGlwY1JlbmRlcmVyLmludm9rZShcImRlbGV0ZS1tZXNzYWdlc1wiLCBkZWNrSUQpO1xuICAgICAgfSxcbiAgICAgIGxvYWRNb3JlTWVzc2FnZXMoZGVja0lEOiBzdHJpbmcsIG9mZnNldDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBpcGNSZW5kZXJlci5pbnZva2UoXCJsb2FkLW1vcmUtbWVzc2FnZXNcIiwgZGVja0lELCBvZmZzZXQpO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZU5vdGlmaWNhdGlvbnMoZGVja0lEOiBzdHJpbmcsIGVuYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChcIm5vdGlmaWNhdGlvbnMtdXBkYXRlXCIsIGRlY2tJRCwgZW5hYmxlZCk7XG4gICAgICB9LCAgICAgIFxuICAgICAgc2VuZE1lc3NhZ2UoZGVja0lEOiBzdHJpbmcsIG1lc3NhZ2VDb250ZW50OiBzdHJpbmcpIHtcbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKFwic2VuZE1lc3NhZ2VcIiwgZGVja0lELCBtZXNzYWdlQ29udGVudCk7XG4gICAgICB9LFxuICAgICAgc2VuZFJlcGx5KGNoYW5uZWxJRDogc3RyaW5nLCBtZXNzYWdlSUQ6IHN0cmluZywgbWVzc2FnZUNvbnRlbnQ6IHN0cmluZykge1xuICAgICAgICBpcGNSZW5kZXJlci5pbnZva2UoXCJzZW5kUmVwbHlcIiwgY2hhbm5lbElELCBtZXNzYWdlSUQsIG1lc3NhZ2VDb250ZW50KTtcbiAgICAgIH0sXG4gICAgICBhdXRoZW50aWNhdGVEaXNjb3JkKCkge1xuICAgICAgICByZXR1cm4gaXBjUmVuZGVyZXIuaW52b2tlKFwiYXV0aGVudGljYXRlLWRpc2NvcmRcIik7XG4gICAgICB9LFxuICAgIH0sXG4gICAgY2FjaGU6IHtcbiAgICAgIGdldExhc3RPZmZzZXQoZGVja0lEOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgbGFzdE9mZnNldCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zdCBsYXN0T2Zmc2V0VmFsdWUgPSBhd2FpdCBpcGNSZW5kZXJlci5pbnZva2UoXCJsYXN0LW9mZnNldC1mb3ItZGVja0lEXCIsIGRlY2tJRCk7XG4gICAgICAgICAgcmV0dXJuIGxhc3RPZmZzZXRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFzdE9mZnNldCgpO1xuICAgICAgfSxcbiAgICAgIGRlbGV0ZURlY2soZGVja0lEOiBzdHJpbmcpIHtcbiAgICAgICAgaXBjUmVuZGVyZXIuaW52b2tlKFwiZGVsZXRlLWRlY2tcIiwgZGVja0lEKTtcbiAgICAgIH0sXG4gICAgICBzZWFyY2hNZW1iZXJOYW1lKG1lbWJlcklEOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGlwY1JlbmRlcmVyLmludm9rZShcInNlYXJjaC1tZW1iZXItbmFtZVwiLCBtZW1iZXJJRClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHN0b3JlOiB7XG4gICAgZ2V0KGtleTogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gaXBjUmVuZGVyZXIuc2VuZFN5bmMoJ2VsZWN0cm9uLXN0b3JlLWdldCcsIGtleSk7XG4gICAgfSxcbiAgICBzZXQoa2V5OiBzdHJpbmcsIHZhbDogYW55KSB7XG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdlbGVjdHJvbi1zdG9yZS1zZXQnLCBrZXksIHZhbCk7XG4gICAgfSxcbiAgICBkZWxldGUoa2V5OiBzdHJpbmcpIHtcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoJ2VsZWN0cm9uLXN0b3JlLWRlbGV0ZScsIGtleSk7XG4gICAgfSxcbiAgICBoYXMoa2V5OiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiBpcGNSZW5kZXJlci5zZW5kU3luYygnZWxlY3Ryb24tc3RvcmUtaGFzJywga2V5KTtcbiAgICB9LFxuICAgIHJlc2V0KCkge1xuICAgICAgaXBjUmVuZGVyZXIuc2VuZCgnZWxlY3Ryb24tc3RvcmUtcmVzZXQnKTtcbiAgICB9LFxuICB9LFxufTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZWxlY3Ryb24nLCBlbGVjdHJvbkhhbmRsZXIpO1xuXG5leHBvcnQgdHlwZSBFbGVjdHJvbkhhbmRsZXIgPSB0eXBlb2YgZWxlY3Ryb25IYW5kbGVyO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9