package pl.edu.agh.to.bgg.session;

public record GameSessionFilter(
        String username,
        String boardGameName,
        Integer maxMinutesPlaytime,
        Integer minNumberOfPlayers,
        Integer maxNumberOfPlayers
) {
}
