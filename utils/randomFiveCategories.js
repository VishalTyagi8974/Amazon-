import axios from "axios"
import conf from "../conf/conf";

export default async function randomFiveCategories() {
    const response = await axios.get(`${conf.baseUrl}/products/randomcategories`);
    return response.data;
}