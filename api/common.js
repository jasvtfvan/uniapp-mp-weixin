import request from '@/common/request';

// codeList
export function getCodeList(codeKind) {
  // return request.get({
  //   url: '/mock/master/codeList',
  //   params: { codeKind },
  //   force: true, // 强制请求，可以重复提交
  //   authorization: true,
  // });
  return new Promise(resolve => {
    resolve({
      data: {
        list: [
          { codeKind: 'gender', codeValue: '0', codeName: '女士' },
          { codeKind: 'gender', codeValue: '1', codeName: '男士' },
          { codeKind: 'age', codeValue: '0', codeName: '小于18周岁' },
          { codeKind: 'age', codeValue: '1', codeName: '18到25周岁' },
          { codeKind: 'age', codeValue: '2', codeName: '25到35周岁' },
          { codeKind: 'age', codeValue: '3', codeName: '35到45周岁' },
          { codeKind: 'age', codeValue: '4', codeName: '45到55周岁' },
          { codeKind: 'age', codeValue: '5', codeName: '55到65周岁' },
          { codeKind: 'age', codeValue: '6', codeName: '65周岁以上' },
        ],
      },
      message: "查询成功",
      status: 200,
    })
  });
}

// 查询外部链接-当作主数据处理
export function getMasterOuterLink(data) {
  // return request.get({
  //   url: '/mock/master/outerLink',
  //   params: data,
  //   force: true, // 强制请求，可以重复提交
  //   authorization: true,
  // });
  return new Promise(resolve => {
    resolve({
      data: {
        baidu: "https://www.baidu.com/",
        bing: "https://cn.bing.com/",
      },
      message: "查询成功",
      status: 200,
    })
  });
}
