import axios from 'axios'
import globalURL from '../globalURL';

export default axios.create({
    baseURL: `http://${globalURL()}:5000/api`
});