import axios from "axios";
import { load } from "cheerio";

const apiurl = "https://codechef-api.vercel.app/handle";

export async function codechefData(req,res){
    const username = req.params.username
    // console.log(username);

    try {
        let userData = await getAllUserInfoFromCodechef(username);

        const userInfo = {...userData,other:null}

        return  res.json({
            msg:"welcome to codechef page",
            username:username,
            userInfo:userInfo,
            additionalInfo:userData?.other
        })
    } catch (error) {
        console.log(error)
        return res.status(error.status).json({
            msg:"error fetching data from codechef api",
            error:error.response.data || error.response || error
        })
    }

    // const userInfo = await usrInfo(username)
    // .then((res) => {return res;})
    // .catch((err) => {return err;})

    // const additionalInfo = await additionalInf(username)
    // .then((res) => {return res;})
    // .catch((err) => {return err;})

    // return res.json({
    //     msg:"welcome to codechef page",
    //     username:username,
    //     userInfo:userInfo,
    //     additionalInfo:additionalInfo
    // })
}

async function usrInfo(username){
    const user = await axios.get(`${apiurl}/${username}`)
    .then((res) => {
        // console.log(res.data)
        return res.data
    })
    .catch((err) => {
        console.log(err);
        throw err 
    })

    let ratingGraph = user.ratingData;
    let graph = []
    ratingGraph.map((ele) => {
        // console.log(ele);
        const name = ele.name;
        const rating = ele.rating;
        const rank = ele.rank;
        const date = ele.end_date;
        let x = date.split(" ")[0];
        x = x.trim();
        const element = {contestName:name,rank:rank,rating:rating,date:x};
        graph = [...graph,element];
    })
    // console.log("graph:",graph);

    const userData = {
        handle: user.name,
        title: user.stars,
        globalRank:user.globalRank,
        rating: user.currentRating,
        maxRank: user.maxRank,
        maxRating: user.higestRating,
        contestsParticipated: user.ratingData.length,
        ratingGraph:graph,
        heatmap:user.heatMap,
    }
    return userData;
}


async function getHtml(username){
    const url = `https://www.codechef.com/users/${username}`;

    const {data : html} = await axios.get(url);
    return html;
}

async function additionalInf(username){
   const data = await getHtml(username)
    .then((res) => {
        let d = {};
        const $ = load(res)

        $('.rating-data-section>h3').each((i,ele) => {
            const x = $(ele).text()
            if(x.includes("Problems Solved:")){
                const totalSolved = Number(x.substring(23))
                d = {...d , totalSolved:totalSolved}
            }
        })

        $('.rating-header>small').each((i,ele) => {
            const x = $(ele).text()
            const higestRating = Number(x.substring(16,20))
            d = {...d, higestRating:higestRating}
        })

        return d;
    })
    .catch((err) => {
        console.log("additionalInfo ERR:" , err);
        throw err
    })
    // console.log(data);
    return data;
}

async function getAllUserInfoFromCodechef(username){
    try {

        const [html, userdata] = await Promise.all([
            axios.get(`https://www.codechef.com/users/${username}`),
            axios.get(`${apiurl}/${username}`),
        ])

        // first html data extraction

        let d = {};
        const $ = load(html)

        $('.rating-data-section>h3').each((i,ele) => {
            const x = $(ele).text()
            if(x.includes("Problems Solved:")){
                const totalSolved = Number(x.substring(23))
                d = {...d , totalSolved:totalSolved}
            }
        })

        $('.rating-header>small').each((i,ele) => {
            const x = $(ele).text()
            const higestRating = Number(x.substring(16,20))
            d = {...d, higestRating:higestRating}
        })

        // data from api
        let ratingGraph = userData?.ratingData;
        let graph = []
        ratingGraph.map((ele) => {
            // console.log(ele);
            const name = ele.name;
            const rating = ele.rating;
            const rank = ele.rank;
            const date = ele.end_date;
            let x = date.split(" ")[0];
            x = x.trim();
            const element = {contestName:name,rank:rank,rating:rating,date:x};
            graph = [...graph,element];
        })

        const userData = {
            handle: user.name,
            title: user.stars,
            globalRank:user.globalRank,
            rating: user.currentRating,
            maxRank: user.maxRank,
            maxRating: user.higestRating,
            contestsParticipated: user.ratingData.length,
            ratingGraph:graph,
            heatmap:user.heatMap,
            other:d,
        }

        return userData;

    } catch (error) {
        console.log(error)
        throw error
    }
}