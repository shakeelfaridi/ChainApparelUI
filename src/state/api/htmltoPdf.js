import { JSONAPI } from './jsonapi';

export async function htmlToPdf() {
  const requestPromise = fetch(`${process.env.REACT_APP_JSONAPI}/api-proxy/api2pdf?_api_proxy_uri=/wkhtml/pdf/html`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.clientInstance.tokenInformation.access_token}`
    },
    body: JSON.stringify({
      html: '<html><body>Hallo!</body></html>',
      inlinePdf: true,
      fileName: 'test.pdf'
    })
  });
  const res = await (await new JSONAPI().catchUnauthorizedReqeust(requestPromise)).json();
  window.open(res.FileUrl, '_self');
}