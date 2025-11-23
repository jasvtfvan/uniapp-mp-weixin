import request from '@/common/request';

// 微信小程序
export function code2Session(data) {
  // return request.post({
  //   url: '/mock/code2Session',
  //   data,
  //   authorization: true,
  // });
  return new Promise(resolve => {
    resolve({
      data: {
        sessionKey: "code2SessionKeyAbcdefg",
      },
      message: "查询成功",
      status: 200,
    })
  });
}
