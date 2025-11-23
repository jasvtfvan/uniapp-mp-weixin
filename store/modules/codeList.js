import { getCodeList } from '@/api/common';
import cacheStorage from '@/common/cacheStorage';

const initState = () => ({
  codeKindList: cacheStorage.get('codeKindList'),
});
const state = initState();

const codeList = {
  namespaced: true,
  state,
  mutations: {
    RESET_STATE(state) {
      cacheStorage.remove('codeKindList');
      Object.assign(state, initState());
    },
    SET_CODE_KIND_LIST: (state, codeKindList) => {
      cacheStorage.set('codeKindList', codeKindList);
      state.codeKindList = codeKindList;
    },
  },

  actions: {
    // 获取全部codeList并拼装成codeKindList
    GetCodeKindList({ state, commit }, force = false) {
      if (!force && state.codeKindList && Object.keys(state.codeKindList).length > 0) {
        return new Promise(resolve => {
          resolve(state.codeKindList);
        });
      } else { // 强制或者不存在
        return getCodeList().then(res => {
          let sourceCodeKindList = (res && res.data && res.data.list) || [];
          let codeKindList = _getCodeKinkList(sourceCodeKindList);
          commit('SET_CODE_KIND_LIST', codeKindList);
          return codeKindList;
        });
      }
    },
    // 根据codeKindArray获取codeKindList，但这里不缓存，因为没有合适的时机重置
    // ['gender','age'] => {'sex':[{codeValue:'1',codeName:'男士'},{codeValue:'2',codeName:‘女士’}], ... ...}
    GetCodeKindListByCodeKind({ }, codeKindArray) {
      if (!codeKindArray) {
        return Promise.resolve(null);
      }
      if (typeof codeKindArray === 'string') {
        codeKindArray = [codeKindArray];
      }
      if (!codeKindArray instanceof Array || codeKindArray.length < 0) {
        return Promise.resolve(null);
      }
      return getCodeList(codeKindArray.join(",")).then(res => {
        let sourceCodeKindList = (res && res.data && res.data.list) || [];
        let codeKindList = _getCodeKinkList(sourceCodeKindList);
        return codeKindList;
      });
    },
    // 根据codeList中kind获取数组
    GetCodeListByKind({ state }, codeKind) {
      return new Promise(resolve => {
        if (!state.codeKindList || !codeKind) {
          resolve(null);
        } else {
          resolve(state.codeKindList[codeKind]);
        }
      });
    },
    //根据 codeList 或者 主数据，codeValue数组，获取codeName数组
    // codeValue数组中的数据，第一个代表第一级，第二个代表第二级，以此类推
    GetCodeNameArray({ }, { codeList, codeValueArray }) {
      console.log('store', codeList, codeValueArray)
      return Promise.resolve(_getCodeNameArray(codeList, codeValueArray));
    },
    // 根据 codeList, codeValue，获取 codeName
    GetCodeName({ }, { codeList, codeValue }) {
      return new Promise(resolve => {
        const codeName = _getCodeName(codeList, codeValue);
        resolve(codeName);
      });
    },
    // 根据 codeList, codeValueString, 获取codeName字符串
    // codeValueString 可以单独的value，可以是value逗号分割的字符串
    // codeValueString 逗号分割时，第一个逗号前是第一级，第二个是第二级别，以此类推
    GetCodeNameMergedString(
      { },
      { codeList,
        codeValueString,
        sourceSeparator = ",",
        targetSeparator = ",",
      }
    ) {
      if (
        !codeList ||
        codeList.length <= 0 ||
        codeValueString == null ||
        codeValueString === ""
      ) {
        return "";
      }
      if (codeValueString.includes(sourceSeparator)) {
        //'11,11-5'
        let sourceArray = [];
        sourceArray = codeValueString.split(sourceSeparator);
        let targetArray = _getCodeNameArray(codeList, sourceArray);
        return targetArray.join(targetSeparator);
      } else {
        let targetName = _getCodeName(codeList, codeValueString);
        if (targetName == null) {
          targetName = "";
        }
        return targetName;
      }
    }
  },
  getters: {
    codeKindList: state => state.codeKindList
  }

};

export default codeList;

/**
 * 私有方法区
 */

// 根据sourceCodeKindList拼接codeKindList
function _getCodeKinkList(sourceCodeKindList = []) {
  const codeKindList = {};
  const list = __transferSourceCodeList(sourceCodeKindList);
  list.forEach((item) => {
    const {
      codeKind, // codeType类型
      codeValue, // code值
      codeName, // code名
      codeValueFilter, // 父code值
      extraValue, // 是否有扩展
      children, // 子数据
    } = item;

    if (!codeKindList[codeKind] || codeKindList[codeKind].length < 0) {
      codeKindList[codeKind] = [];
    }

    const arr = codeKindList[codeKind];
    const hasCode = arr.some((item1) => item1.codeValue === codeValue);
    if (!hasCode) {
      arr.push({
        codeValue,
        codeName,
        codeValueFilter,
        extraValue,
        children,
      });
    }
  });
  return codeKindList;
}

// 转换codeList，将具有父类的放到父类children下
function __transferSourceCodeList(
  list = [],
  valueKey = 'codeValue',
  valueKeyFilter = 'codeValueFilter', // parentCodeValue
  childrenKey = 'children'
) {
  if (!list) {
    list = [];
  }
  const retArray = [];
  const map = {};
  for (let i = 0; i < list.length; i++) {
    const obj = list[i]; // {'codeValue':'2','codeName':'你好',...}
    if (obj && obj[valueKey] != null && obj[valueKey] !== '') {
      map[obj[valueKey]] = obj; // {'2':{'codeValue':'2',codeName:'你好',...}}
    }
  }
  for (let j = 0; j < list.length; j++) {
    const item = list[j]; // {'codeValue':'21',codeName:'world',codeValueFilter:'2',...}
    if (!item || item[valueKey] == null || item[valueKey] === '') {
      continue;
    }
    const filter = item[valueKeyFilter]; // 2
    if (filter != null && map.hasOwnProperty(filter)) {
      if (!map[filter][childrenKey]) {
        map[filter][childrenKey] = [item];
      } else {
        map[filter][childrenKey].push(item);
      }
    } else {
      retArray.push(item);
    }
  }
  return retArray;
}

// 根据codeValue获取codeName
function _getCodeName(codeList, codeValue) {
  if (!codeList || codeList.length <= 0 || codeValue == null) {
    return null;
  }
  const result = __findByTree(codeList, 'codeValue', codeValue);
  return result ? result.codeName : null;
}

// 树搜索，使用广度优先的递归算法
function __findByTree(list, key, value) {
  if (!key || !value || !list || list.length <= 0) {
    return null;
  }
  const result = list.find((item) => `${item[key]}` === `${value}`);
  if (result) {
    return result;
  }
  const childrenList = list.filter((item) => item.children);
  const recurArr = childrenList.reduce((arr, cur) => [...arr, ...cur.children], []);
  return __findByTree(recurArr, key, value);
}

/**
 * @description: 根据codeValue数组 获取 字符串数组
 * @param
 * [{codeValue:'1',codeName:'hello'},{codeValue:'2',codeName:'world'}]
 * [ "1", "2" ]
 * @return
 * ['hello','world']
 */
function _getCodeNameArray(codeList, codeValueArr) {
  if (
    !codeList
    || !codeValueArr
    || codeList.length <= 0
    || codeValueArr.length <= 0
  ) {
    return [];
  }
  const codeNameArr = []; // codeName数组

  let i = 0; // 循环 codeValueArr 的索引
  // 找到 codeValue中 第一个元素，作为根元素
  const rootCodeNode = __findByTree(codeList, 'codeValue', codeValueArr[i]);
  if (!rootCodeNode) {
    return [];
  }
  codeNameArr.push(rootCodeNode.codeName);
  i++;

  let tmpCodeTree = rootCodeNode.children || []; // codeList中某一层list数组
  // codeList中匹配到的某一层节点
  let tmpCodeNode = tmpCodeTree.find(
    (item) => `${item.codeValue}` === `${codeValueArr[i]}`
  );
  while (i < codeValueArr.length && tmpCodeNode) {
    codeNameArr.push(tmpCodeNode.codeName);
    i++;
    tmpCodeTree = tmpCodeNode.children || [];
    tmpCodeNode = tmpCodeTree.find(
      (item) => `${item.codeValue}` === `${codeValueArr[i]}`
    );
  }

  return codeNameArr;
}
