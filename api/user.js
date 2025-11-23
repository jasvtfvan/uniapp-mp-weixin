import request from '@/common/request';

// 获取用户信息
export function getUserInfo(data) {
  return new Promise(resolve => {
    resolve({
      data: {
        nickName: '西湖糖醋鱼',
        gender: '1',
        userStatus: 4,
      },
      message: "查询成功",
      status: 200,
    })
  });
  // return request.get({
  //   url: '/api/Common/GetLoginUserInfo',
  //   params: data,
  //   authorization: true,
  // });
}

// 退出登录
export function logout(){
  return new Promise(resolve => {
    resolve({
      data: {},
      message: "退出成功",
      status: 200,
    })
  });
}
