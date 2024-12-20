import axios from "axios";
import conf from "../conf/conf";

export default async function getProductsWithCategory(options = {}) {
    try {
        const response = await axios.get(`${conf.baseUrl}/products/categories`, options)
        return response.data;

    } catch (error) {
        return error
    }

}