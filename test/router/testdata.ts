export var request = {
    resource: '/{proxy+}',
    path: '/',
    httpMethod: 'GET',
    headers: {
        Host: 'api.m4rk.xyz',
        "X-Forwarded-Proto": 'https'
    },
    multiValueHeaders: {
        Host: ['api.m4rk.xyz'],
    },
    queryStringParameters: { "test": 1 },
    multiValueQueryStringParameters: null,
    pathParameters: { proxy: 'v2' },
    stageVariables: null,
    body: null,
    isBase64Encoded: false
}