package pl.edu.agh.to.bgg.boardgame.external.geek;

import pl.edu.agh.to.bgg.boardgame.external.geek.dto.GeekBoardGameDetailsDTO;
import pl.edu.agh.to.bgg.boardgame.external.geek.dto.GeekBoardGameEntryDTO;

import java.util.List;
import java.util.Optional;

public interface ApiClient {
    List<GeekBoardGameEntryDTO> searchFor(String query);

    Optional<GeekBoardGameDetailsDTO> getById(int id);

    byte[] getImage(String url);
}
