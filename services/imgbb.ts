const { IMGBB_API_KEY, IMGBB_HOST } = process.env
interface ResponseObject {
    data: {
        id: string;
        title: string;
        url_viewer: string;
        url: string;
        display_url: string;
        size: number;
        time: string;
        expiration: string;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        medium?: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        delete_url: string;
    },
    success: boolean
    status: number
}
/**
 * 
 * @param image  base64 only
 * @returns  ResponseObject
 */
export function ImgbbUpload(image: string): Promise<ResponseObject['data']> {
    return new Promise(async (resolve, reject) => {
        try {
            const form_data = new FormData()
            form_data.append("key", IMGBB_API_KEY!)
            form_data.append("image", image)
            const req = await fetch(`${IMGBB_HOST}`, {
                method: 'post',
                body: form_data
            })
            if (req.ok) {
                const res: ResponseObject = await req.json()
                res?.success ? resolve(res.data) : reject("Failed to upload")
            } else {
                throw new Error(`${req.status} ${req.statusText}`)
            }
        } catch (e) {
            reject(e)
        }
    })
}