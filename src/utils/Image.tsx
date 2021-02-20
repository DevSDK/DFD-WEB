class ImageUtil {
    static checkTypes(type: string): boolean {
        switch (type) {
            case "image/png":
            case "image/gif":
            case "image/jpeg":
                return true;
            default:
                break
        }
        return false;
    }
    static getBase64(file: Blob): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                reject(error)
            }
        })
    }


}

export default ImageUtil