package pl.edu.agh.to.bgg.session;

public record VoteChangeDTO(
        int voteId,
        boolean userWantsGame,
        boolean userKnowsGame
) {
}
