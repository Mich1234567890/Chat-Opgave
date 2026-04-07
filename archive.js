import fs from "fs/promises"

class Archive {

        // write-queue beskyttelse - sikre at folk ikke korruptere rummet ved at sende beskeder samtidig. Tag den Mikkel. 
    static #writeQueue = Promise.resolve();

    static async writeFile(file, content) {
        Archive.#writeQueue = Archive.#writeQueue.then(async()=> {
            try {
                await fs.writeFile(file, content);
            } catch (error) {
                console.error(error);
            }
        });
        return Archive.#writeQueue;
    }


    static async readFile(file) {
        const exists = await Archive.fileExists(file)
        if (exists) {
            try {
                return await fs.readFile(file, { encoding: 'utf8' })
            } catch (error) {
                console.error(error)
            }
        }
    }

    static async fileExists(file) {
        try {
            await fs.access(file)
            return true
        } catch {
            return false
        }
    }

}

export default Archive

