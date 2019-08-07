import axios from 'axios'
import serverInfo from './server-info'
var axiosInstance = axios.create({
    baseURL: `${serverInfo.HTTP_METHOD}://${serverInfo.BASE_URL}:${serverInfo.PORT}`
})
export default axiosInstance