import axios from "axios";
import conf from "../conf/conf";


export default async function getProductsOnSearch({ queries }) {
    try {
        const response = await axios.get(`${conf.baseUrl}/products/search`, { params: queries })
        return response.data;

    } catch (error) {
        return error
    }

}