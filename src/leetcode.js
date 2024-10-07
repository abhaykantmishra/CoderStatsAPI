export async function leetcodeData(req,res){
    const username = req.params.username
    
    const problemsData = await fetchUserProblemsSolved(username)
    .then((res) => {return res})
    .catch((err) => {return err})
    

    const rank = await fetchUserRanking(username)
    .then((res) => {return res;})
    .catch((err) => {return err;})

    const topicwiseData = await fetchUserSkillStats(username)
    .then((res) => {return res;})
    .catch((err) => {return err;})

    const userCalender = await fetchUserProfileCalendar(username,2024)
    .then((res) => {return res;})
    .catch((err) => {return err;})

    const contestHistory = await getLeetCodeContestHistory(username)
    .then((res)=> {return res})
    .catch((err) => {return err;})

    return res.json({
        msg:"welcome to leetcode page",
        username:username,
        problemsData:problemsData,
        rank:rank,
        topicwiseData:topicwiseData,
        userCalender:userCalender,
        contestHistory:contestHistory,
    })
}


async function fetchUserProblemsSolved(username) {
    const query = `
      query userProblemsSolved($username: String!) {
        matchedUser(username: $username) {
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;
  
    const variables = { username: username };
  
    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
  
      const result = await response.json();
  
      // Log the full response to inspect its structure
    //   console.log('Full API Response:', result);
  
      if (result.data) {
        const { allQuestionsCount, matchedUser } = result.data;
        return {
          allQuestionsCount,
          problemsSolvedBeatsStats: matchedUser.problemsSolvedBeatsStats,
          submitStatsGlobal: matchedUser.submitStatsGlobal.acSubmissionNum,
        };
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
    //   console.error('Error fetching user problems solved data:', error);
      return null;
    }
  }

  async function fetchUserRanking(username) {
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          profile {
            ranking
          }
        }
      }
    `;
  
    const variables = { username };
  
    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
  
      const result = await response.json();
  
      // Log the full response to inspect its structure
    //   console.log('Full API Response:', result);
  
      if (result.data && result.data.matchedUser && result.data.matchedUser.profile) {
        const ranking = result.data.matchedUser.profile.ranking;
        return ranking;
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
    //   console.error('Error fetching user ranking:', error);
      return null;
    }
  }

  async function fetchUserSkillStats(username) {
    const query = `
      query skillStats($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
        }
      }
    `;
  
    const variables = { username: username };
  
    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
  
      const result = await response.json();
  
      // Log the full response to inspect its structure
    //   console.log('Full API Response:', result);
  
      if (result.data && result.data.matchedUser && result.data.matchedUser.tagProblemCounts) {
        const skillStats = result.data.matchedUser.tagProblemCounts;
        const allProblems = [
            ...skillStats.advanced,
            ...skillStats.intermediate,
            ...skillStats.fundamental,
          ];
        
          // Sort the flattened array by the problemsSolved count in descending order
          const sortedProblems = allProblems.sort((a, b) => b.problemsSolved - a.problemsSolved);
         return sortedProblems;
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
    //   console.error('Error fetching skill stats:', error);
      return null;
    }
  }

  async function fetchUserProfileCalendar(username, year) {
    const query = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            dccBadges {
              timestamp
              badge {
                name
                icon
              }
            }
            submissionCalendar
          }
        }
      }
    `;
  
    const variables = { username, year };
  
    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
  
      const result = await response.json();
  
      // Log the full response to inspect its structure
    //   console.log('Full API Response:', result);
  
      if (result.data && result.data.matchedUser && result.data.matchedUser.userCalendar) {
        const { activeYears, streak, totalActiveDays, submissionCalendar } = result.data.matchedUser.userCalendar;
        return {
          activeYears,
          streak,
          totalActiveDays,
          submissionCalendar,
        };
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Error fetching user profile calendar:', error);
      return null;
    }
  }
  
  async function getLeetCodeContestHistory(username) {
    const url = "https://leetcode.com/graphql";

    const query = `
    query getUserContestHistory($username: String!) {
        userContestHistory(username: $username) {
            contests {
                title
                startTime
                endTime
                rank
                score
                problems {
                    title
                    status
                }
            }
        }
    }
    `;

    const variables = {
        username: username
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
        throw new Error(`Query failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
}