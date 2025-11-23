import request from '@/common/request';

// 登录
export function loginBySession(data) {
  // return request.post({
  //   url: '/mock/login',
  //   data,
  //   authorization: true,
  // });
  return new Promise(resolve => {
    resolve({
      data: {
        token: "wxTokenAbcdefg",
      },
      message: "查询成功",
      status: 200,
    })
  });
}
