/**
 * 异步加载qq地图，解决初始化加载地图报错问题
 * @file     qqMap
 * @author   王明东
 * @date     2018/1/9
 *
 *
 * @copyright @Navinfo, all rights reserved.
 */
export function qqMap (key) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq);  // 注意这里
    };
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=' + key;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
