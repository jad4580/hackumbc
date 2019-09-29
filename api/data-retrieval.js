import axios from 'axios';

function getMarkets() {
    return axios
        .get('http://localhost:3000/markets')
        .then(response => { return response.data; })
        .catch(error => console.log(error))
}

export { getMarkets }
