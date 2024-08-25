import axios from "axios"

export async function codeforcesData (req,res){
    const username = req.params.username

    const userInfo = await getCodeforcesUserInfo(username)
    .then((res) => {return res;})
    .catch((err) => {return err;})

    const userContestsInfo = await getUserContestHistory(username)
    .then((res) => {return res;})
    .catch((err) => {return err;})


    return res.json({
        msg:"welcome to codeforces page",
        username:username,
        userInfo:userInfo,
        userContestsInfo:userContestsInfo,
    })
}


async function getCodeforcesUserInfo(username) {
  try {
    // Fetch user info
    const userInfoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    const userInfo = userInfoResponse.data.result[0];

    // Fetch user ratings (for contests)
    const userRatingResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${username}`);
    const userRatings = userRatingResponse.data.result;

    // Fetch solved problems statistics (status)
    const userStatusResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
    const userSubmissions = userStatusResponse.data.result;

    // Calculate number of solved problems
    const solvedProblems = new Set();
    userSubmissions.forEach(submission => {
      if (submission.verdict === 'OK') {
        solvedProblems.add(submission.problem.contestId + submission.problem.index);
      }
    });

    // Compile user data
    const userData = {
      handle: userInfo.handle,
      rank: userInfo.rank,
      rating: userInfo.rating,
      maxRank: userInfo.maxRank,
      maxRating: userInfo.maxRating,
      solvedProblems: solvedProblems.size,
      contestsParticipated: userRatings.length,
      bestContestRank: Math.min(...userRatings.map(rating => rating.rank)),
      worstContestRank: Math.max(...userRatings.map(rating => rating.rank)),
    };

    // console.log("userData:",userData);
    return userData;
  } catch (error) {
    console.error('Error fetching data from Codeforces API:', error);
  }
}
  
async function getUserContestHistory(username) {
    try {
        // Fetch user ratings (this includes contest history)
        const userRatingResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${username}`);
        // console.log(userRatingResponse);
        const contestHistory = userRatingResponse.data.result;
        // Extract relevant contest details
        const contests = contestHistory.map(contest => ({
            contestId: contest.contestId,
            contestName: contest.contestName,
            rank: contest.rank,
            ratingChange: contest.newRating - contest.oldRating,
            oldRating: contest.oldRating,
            rating: contest.newRating,
            date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0],  // Convert timestamp to date
        }));

        // console.log(contests);
        return contests;
    } catch (error) {
        console.error('Error fetching contest history from Codeforces API:');
    }
}

getUserContestHistory("abhaykantmishra0")