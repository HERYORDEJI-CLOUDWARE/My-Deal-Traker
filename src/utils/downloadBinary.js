import axios from 'axios';
import {Buffer} from "buffer";

const api = axios.create({
    baseURL: 'https://mydealtracker.staging.cloudware.ng',
})

export const headers = {
    'Content-Type': 'text/html',
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br"
}

export const options = {
    headers,
    responseType: 'arraybuffer',
}

// export const endpoint = '/something/amazing'

export async function grabPdf(data, endpoint) {
    const response = await api.post(endpoint, data, options)
    const buff = Buffer.from(response.data, 'base64')
    return buff.toString('base64')
}