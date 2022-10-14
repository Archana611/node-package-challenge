import { expect } from 'chai';
import path from 'path';
import 'mocha';
import { Packer } from '../Packer';

describe("Packer Pack()", () => {
    it("should return string answer as '4\\n-\\n2,7\\n8,9'", async () => {
        const filePath = path.join(process.cwd(), 'resources/example_input');
        const result = await Packer.pack(filePath);
        expect(result).equal('4\n-\n2,7\n8,9\n');
    })

    it("should throw error with message 'maximum cost of item can not be more then 100' when cost of item is more then 100.", async () => {
        try {
            const filePath = path.join(process.cwd(), 'resources/example_input_cost_110');
            await Packer.pack(filePath);
        }catch(err){
            expect(err.message).equal('maximum cost of item can not be more then 100');
        }
    })

    it("should throw error with message 'maximum weight of item can not be more then 100' when weight of item is more then 100.", async () => {
        try {
            const filePath = path.join(process.cwd(), 'resources/example_input_weight_110');
            await Packer.pack(filePath);
        }catch(err){
            console.log(err.msg)
            expect(err.message).equal('maximum weight of item can not be more then 100');
        }
    })

    it("should throw error with message 'Maximum weight can not be more then 100' when maxWeight is more than 100.", async () => {
        try {
            const filePath = path.join(process.cwd(), 'resources/example_input_max_weight_110');
            await Packer.pack(filePath);
        }catch(err){
            console.log(err.msg)
            expect(err.message).equal('Maximum weight can not be more then 100');
        }
    })

    it("should throw error with message 'Items per package can not be more then 15' when items are more than 15.", async () => {
        try {
            const filePath = path.join(process.cwd(), 'resources/example_input_items_16');
            await Packer.pack(filePath);
        }catch(err){
            console.log(err.msg)
            expect(err.message).equal('Items per package can not be more then 15');
        }
    })  
    
    it("should throw error with message 'Check file content is matching constrains.' for empty file.", async () => {
        try {
            const filePath = path.join(process.cwd(), 'resources/example_input_empty');
            await Packer.pack(filePath);
        }catch(err){
            console.log(err.msg)
            expect(err.message).equal('Check file content is matching constrains.');
        }
    })  

    it("should throw error with message 'Check file content is matching constrains.' for wrong content file.", async () => {
        try {
            const filePath = path.join(process.cwd(), 'resources/example_input_invalid_content');
            await Packer.pack(filePath);
        }catch(err){
            console.log(err.msg)
            expect(err.message).equal('Check file content is matching constrains.');
        }
    })  
    
})