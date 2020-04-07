const Buffer = require('safe-buffer').Buffer;
const KeyGrip = require('keygrip');

const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWU4NTFhMGM4NDIyYzIzZTY0OGJkZGQ1In19';

//!USER ID stored in MONGODB
//!_id: '5e851a0c8422c23e648bddd5'


const unBuffered = Buffer.from(session, 'base64').toString('utf8');
console.log('unBuffered Session Key stored in COOKIE browser storage -> ', unBuffered);


const keygrip = new KeyGrip(['123123123']);
const keyGripCreate = keygrip.sign('session=' + session);
console.log('keyGripCreate -> ', keyGripCreate);
const keyGripVerify = keygrip.verify('session=' + session, keyGripCreate);
console.log(keyGripVerify);

