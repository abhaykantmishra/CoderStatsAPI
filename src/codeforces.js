import axios from "axios"
import { json } from "express"

export async function codeforcesData (req,res){
    const username = req.params.username

    try {
      const userInfo = await getCodeforcesUserInfo(username)
  
      const userdata= {...userInfo, contests:null}
  
      return res.json({
          msg:"welcome to codeforces page",
          username:username,
          userInfo:userdata,
          userContestsInfo:userInfo?.contests,
      })
    } catch (error) {
      // console.error("ERROR:",error.data)
      return res.status(error.status).json({
        msg:"error fetching data from codeforces api",
        error:error.response.data || error.response || error
      })
    }
}


async function getCodeforcesUserInfo(username) {
  
  
  try {
    const [userInfoResponse,userRatingResponse,userStatusResponse] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${username}`),
      axios.get(`https://codeforces.com/api/user.rating?handle=${username}`),
      axios.get(`https://codeforces.com/api/user.status?handle=${username}`),
    ])
  
    const userInfo = userInfoResponse.data.result[0];
    const userRatings = userRatingResponse.data.result;
    const userSubmissions = userStatusResponse.data.result;

    const solvedProblems = new Set();
    userSubmissions.forEach(submission => {
      if (submission.verdict === 'OK') {
        solvedProblems.add(submission.problem.contestId + submission.problem.index);
      }
    });

    const contests = userRatings?.map(contest => ({
        contestId: contest.contestId,
        contestName: contest.contestName,
        rank: contest.rank,
        ratingChange: contest.newRating - contest.oldRating,
        oldRating: contest.oldRating,
        rating: contest.newRating,
        date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0],  // Convert timestamp to date
    }));
    
    const userData = {
        handle: userInfo.handle,
        rank: userInfo.rank,
        rating: userInfo.rating,
        maxRank: userInfo.maxRank,
        maxRating: userInfo.maxRating,
        solvedProblems: solvedProblems.size,
        contests: contests,
        contestsParticipated: userRatings.length,
        bestContestRank: Math.min(...userRatings.map(rating => rating.rank)),
        worstContestRank: Math.max(...userRatings.map(rating => rating.rank)),
        submissions: userSubmissions
      };
  
    return userData;
  } catch (error) {
    // console.log("Err in codeforces func:", error.response.data.comment)
    throw error
  }
}