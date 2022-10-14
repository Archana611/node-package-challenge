import path from 'path';
import { Packer } from './com/mobiquity/packer/Packer';

Packer.pack(path.resolve(path.join(__dirname, 'resources/example'))).then(
    (res)=>{
        console.log(res);
    }).catch((error)=>{
        console.log(error);
    })

export default Packer;