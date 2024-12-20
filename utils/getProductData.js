import axios from "axios";
import conf from "../conf/conf";

export default async function getProductData(id) {
    const response = await axios.get(`${conf.baseUrl}/products/${id}`)
    return response.data
}