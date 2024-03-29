// /api/theloais

const axiosClient = require('./axiosClient');


const AdminApi = {
    post: (info) => {
        const url = '/api/admin';
        return axiosClient.post(url, info);
    },
    put: (info) => {
        const url = '/api/admin/' + info.id;
        return axiosClient.put(url, info);
    },
    delete:(id) => {
        const url = '/api/admin/' + id;
        return axiosClient.delete(url);
    }
    // getAllUsers: () => {
    //     const url = "/api/"
    //     return axiosClient.get(url)
    // },
    // logout: (username) => {
    //     const url = "/api/user/logout";
    //     return axiosClient.get(url, { params: username });
    // }
}

module.exports = AdminApi;