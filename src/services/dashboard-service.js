import axios from 'axios';

export class DashboardService {
    async fetch(mode, data = null) {
        let url = '/user-stats/dashboard?mode=' + mode
        if (data) {
            if (data.year) {
                url += '&type=1'
                url += '&year=' + data.year
            } else {
                url += '&type=0'
            }

            if (data.from && data.to) {
                url += '&from=' + data.from
                url += '&to=' + data.to
            }
        } else {
            url += '&type=0'
        }
        const res = (await axios.get(url)).data
        console.log(res)
        return res;
    }
}
