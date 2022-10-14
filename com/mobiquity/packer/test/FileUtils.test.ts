import { expect } from 'chai';
import path from 'path';
import 'mocha';

import { isFileAccessable } from '../fileUtils';
describe("FileUtils isFileAccessable()", () => {
    it("should return true for a currect file", () => {
        isFileAccessable(path.join(__dirname, 'resources/example_input')).then((res) => {
            expect(res).to.be.true;
        });
    })
    it("should return false when file is not available or accessible", () => {
        isFileAccessable(path.join(__dirname, 'resources/example')).then((res) => {
            expect(res).to.be.false;
        }).catch((err)=>{
            expect(err.message).equal('File is not Accessable.');
        });
    })
    
})