package pl.edu.agh.to.bgg.boardgame.external.geek.dto;

public record GeekBoardGameDetailsDTO(
        int objectId,
        int yearPublished,
        int minPlayers,
        int maxPlayers,
        int playingTime,
        int age,
        String name,
        String description,
        String thumbnail,
        String image
) {
}
