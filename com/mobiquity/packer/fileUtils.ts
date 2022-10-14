import { access } from "fs/promises";
import { APIException } from "./ApiException";

async function isFileAccessable(filePath: string): Promise<void> {
    try {
        await access(filePath);
    } catch {
        throw new APIException('File is not Accessable.');
    }
}

export {isFileAccessable}