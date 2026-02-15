const url = 'https://hub.snapshot.org/graphql';
const query = `
query Proposals {
  proposals(
    first: 1,
    skip: 0,
    where: {
      space_in: ["basedpiggy.eth"]
    },
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    scores
    scores_total
    votes
    link
  }
}
`;

async function fetchSample() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const json = await response.json();
        console.log(JSON.stringify(json.data.proposals[0], null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchSample();
