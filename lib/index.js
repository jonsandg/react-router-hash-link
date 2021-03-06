'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.HashLink = HashLink;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hashFragment = '';
var observer = null;
var asyncTimerId = null;

function HashLink(props) {
  function reset() {
    hashFragment = '';
    if (observer !== null) observer.disconnect();
    if (asyncTimerId !== null) {
      window.clearTimeout(asyncTimerId);
      asyncTimerId = null;
    }
  }

  function getElAndScroll() {
    var element = document.getElementById(hashFragment);
    if (element !== null) {
      element.scrollIntoView();
      if (props.offset) {
        window.scrollBy(0, props.offset);
      }
      reset();
      return true;
    }
    return false;
  }

  function hashLinkScroll() {
    // Push onto callback queue so it runs after the DOM is updated
    window.setTimeout(function () {
      if (getElAndScroll() === false) {
        if (observer === null) {
          observer = new MutationObserver(getElAndScroll);
        }
        observer.observe(document, { attributes: true, childList: true, subtree: true });
        // if the element doesn't show up in 10 seconds, stop checking
        asyncTimerId = window.setTimeout(function () {
          reset();
        }, 10000);
      }
    }, 0);
  }

  function handleClick(e) {
    reset();
    if (props.onClick) props.onClick(e);
    if (typeof props.to === 'string') {
      hashFragment = props.to.split('#').slice(1).join('#');
    } else if (_typeof(props.to) === 'object' && typeof props.to.hash === 'string') {
      hashFragment = props.to.hash.replace('#', '');
    }
    if (hashFragment !== '') hashLinkScroll();
  }
  return _react2.default.createElement(
    _reactRouterDom.Link,
    _extends({}, props, { onClick: handleClick }),
    props.children
  );
}

HashLink.propTypes = {
  onClick: _propTypes2.default.func,
  children: _propTypes2.default.node,
  to: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
  offset: _propTypes2.default.number
};